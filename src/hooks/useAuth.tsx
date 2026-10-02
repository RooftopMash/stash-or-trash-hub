import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as fbSignOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type AuthUser = {
  id: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
  };
};

type AuthContextValue = {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  session: { user: AuthUser } | null;
  loading: boolean;
  signInWithLocalFallback: (params: { email: string; displayName?: string }) => AuthUser;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const LOCAL_FALLBACK_AUTH_KEY = "sot_fallback_auth_user_v1";

function readLocalFallbackUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_FALLBACK_AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeLocalFallbackUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.localStorage.setItem(LOCAL_FALLBACK_AUTH_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(LOCAL_FALLBACK_AUTH_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

function mapFirebaseUser(user: FirebaseUser): AuthUser {
  return {
    id: user.uid,
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    user_metadata: {
      display_name: user.displayName || user.email?.split("@")[0] || "User",
      avatar_url: user.photoURL || undefined,
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(() => readLocalFallbackUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const mapped = mapFirebaseUser(fbUser);
        writeLocalFallbackUser(null);
        setUser(mapped);

        // Sync user profile to Firestore
        try {
          const userRef = doc(db, "users", fbUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const initPayload: Record<string, unknown> = {
              id: fbUser.uid,
              displayName: (fbUser.displayName || fbUser.email?.split("@")[0] || "User").slice(0, 100),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            if (fbUser.email) initPayload.email = fbUser.email;
            if (fbUser.photoURL) initPayload.avatarUrl = fbUser.photoURL.slice(0, 500);
            await setDoc(userRef, initPayload);
          }
        } catch {
          // If firestore rule or network restricts initial profile write, don't block auth state
        }
      } else {
        const localUser = readLocalFallbackUser();
        setUser(localUser);
      }
      setLoading(false);
    });

    const handleProfileUpdated = (event: Event) => {
      const custom = event as CustomEvent<{
        id: string;
        display_name?: string;
        avatar_url?: string | null;
      }>;
      const detail = custom.detail;
      if (!detail?.id) return;
      setUser((prev) => {
        if (!prev || prev.id !== detail.id) return prev;
        const nextName = detail.display_name || prev.displayName;
        const nextPhoto =
          detail.avatar_url !== undefined ? detail.avatar_url : prev.photoURL;
        const updated: AuthUser = {
          ...prev,
          displayName: nextName,
          photoURL: nextPhoto,
          user_metadata: {
            ...prev.user_metadata,
            display_name: nextName || prev.user_metadata.display_name,
            avatar_url: nextPhoto || undefined,
          },
        };
        if (readLocalFallbackUser()?.id === prev.id) {
          writeLocalFallbackUser(updated);
        }
        return updated;
      });
    };

    window.addEventListener("sot-profile-updated", handleProfileUpdated);
    return () => {
      unsubscribe();
      window.removeEventListener("sot-profile-updated", handleProfileUpdated);
    };
  }, []);

  const signInWithLocalFallback = ({
    email,
    displayName,
  }: {
    email: string;
    displayName?: string;
  }): AuthUser => {
    const cleanEmail = email.trim().toLowerCase();
    const safeSlug = cleanEmail.replace(/[^a-z0-9]/g, "_").slice(0, 48) || "member";
    const resolvedName =
      displayName?.trim() || cleanEmail.split("@")[0] || "Verified SOT Member";
    const fallbackUser: AuthUser = {
      id: `sot_user_${safeSlug}`,
      uid: `sot_user_${safeSlug}`,
      email: cleanEmail,
      displayName: resolvedName,
      photoURL: null,
      user_metadata: {
        display_name: resolvedName,
      },
    };
    writeLocalFallbackUser(fallbackUser);
    setUser(fallbackUser);
    return fallbackUser;
  };

  const value: AuthContextValue = {
    user,
    firebaseUser,
    session: user ? { user } : null,
    loading,
    signInWithLocalFallback,
    signOut: async () => {
      writeLocalFallbackUser(null);
      setUser(null);
      await fbSignOut(auth).catch(() => {});
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
