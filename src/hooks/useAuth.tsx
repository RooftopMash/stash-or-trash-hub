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
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const mapped = mapFirebaseUser(fbUser);
        setUser(mapped);

        // Sync user profile to Firestore
        try {
          const userRef = doc(db, "users", fbUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              id: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
              avatarUrl: fbUser.photoURL || null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch {
          // If firestore rule or network restricts initial profile write, don't block auth state
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    firebaseUser,
    session: user ? { user } : null,
    loading,
    signOut: async () => {
      await fbSignOut(auth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
