import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
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
} from "firebase/auth";
import { app as firebaseApp, auth as firebaseAuth } from "@/lib/firebase";

export { firebaseApp, firebaseAuth };

export {
  browserLocalPersistence,
  setPersistence,
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
