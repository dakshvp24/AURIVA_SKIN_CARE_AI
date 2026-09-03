/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  arrayUnion,
  FieldValue,
  Firestore
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDjD-FxwXnnef9xWoQ0pTd6yr1DYgiVkAU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'auriva-skin-care-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'auriva-skin-care-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'auriva-skin-care-ai.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '936850834996',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:936850834996:web:f60b64e8e67fa27e79ac61'
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your-firebase-api-key' &&
  !firebaseConfig.apiKey.includes('your-firebase')
);

// Initialize Firebase safely
export const firebaseApp = getApps().length > 0 
  ? getApp() 
  : isFirebaseConfigured 
    ? initializeApp(firebaseConfig) 
    : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;

// Validate Email Format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// User-friendly error message translator for Firebase Auth errors
export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  const code = (error.code || '').toLowerCase();
  const msg = (error.message || String(error)).toLowerCase();
  
  if (
    code === 'auth/invalid-credential' || 
    code === 'auth/wrong-password' || 
    code === 'auth/user-not-found' || 
    code === 'auth/invalid-login-credentials' ||
    msg.includes('invalid credential') || 
    msg.includes('wrong-password') || 
    msg.includes('user-not-found')
  ) {
    return 'Invalid email or password.';
  }
  if (code === 'auth/email-already-in-use' || msg.includes('already in use') || msg.includes('already exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code === 'auth/weak-password' || msg.includes('weak-password') || msg.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (code === 'auth/invalid-email' || msg.includes('invalid email') || msg.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/too-many-requests' || msg.includes('too many requests')) {
    return 'Too many attempts. Access is temporarily disabled. Please try again in a few moments.';
  }
  if (code === 'auth/network-request-failed' || msg.includes('network')) {
    return 'Network connection issue. Please check your internet connection.';
  }
  if (code === 'auth/user-disabled') {
    return 'This account has been disabled. Please contact support.';
  }

  return error.message || 'Authentication failed. Please verify your credentials and try again.';
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  arrayUnion
};
export type { FirebaseUser, FieldValue };
