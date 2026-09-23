import { getApp, getApps, initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User,
  type Auth,
} from "firebase/auth";
import appletConfig from "../../../firebase-applet-config.json";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(config);
export const firebaseAuth: Auth = getAuth(firebaseApp);

if (typeof window !== "undefined") {
  void setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {});
}

export {
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  GithubAuthProvider,
};
export type { User };

export function firebaseErrorMessage(error: unknown): string {
  const code = error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code) : "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Invalid email or password.";
  if (code.includes("email-already-in-use")) return "An account already exists for this email.";
  if (code.includes("popup-closed-by-user")) return "Sign-in was cancelled.";
  if (code.includes("operation-not-allowed")) return "This sign-in provider is not enabled in Firebase Authentication.";
  if (code.includes("unauthorized-domain")) return "This app domain is not authorized in Firebase Authentication.";
  return "We could not complete authentication. Please try again.";
}

export type FirebaseUser = User;
export type AuthListener = (user: User | null) => void;
