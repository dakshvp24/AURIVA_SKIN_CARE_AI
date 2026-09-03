import { UserProfile, SkinProfile, AssessmentResult } from '../types';
import { db, doc, getDoc, setDoc, updateDoc, serverTimestamp } from '../config/firebase';

const PROFILE_KEY_PREFIX = 'auriva_user_profile_';

export interface UserFullData {
  profile: UserProfile;
  skinProfile: SkinProfile | null;
  latestAssessment: AssessmentResult | null;
  assessmentHistory: AssessmentResult[];
  routineLogs: Record<string, any>;
  scanHistory: any[];
}

export const userService = {
  // Initialize or fetch user document in Firestore
  async initializeUserDocument(uid: string, initialData: { email: string; name: string }): Promise<void> {
    if (!db || !uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          id: uid,
          email: initialData.email,
          name: initialData.name,
          firstName: initialData.name.split(' ')[0] || '',
          lastName: initialData.name.split(' ').slice(1).join(' ') || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore initializeUserDocument notice:', err);
    }
  },

  // Get user profile by authenticated user ID
  async getUserProfile(user: UserProfile): Promise<UserProfile> {
    if (!user || !user.id) return user;

    // 1. Try reading from Cloud Firestore
    if (db) {
      try {
        const userRef = doc(db, 'users', user.id);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          const firestoreProfile: UserProfile = {
            id: user.id,
            email: data.email || user.email,
            name: data.name || user.name,
            firstName: data.firstName || user.firstName || (data.name ? data.name.split(' ')[0] : ''),
            lastName: data.lastName || user.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : ''),
            age: data.age !== undefined ? data.age : user.age,
            address: data.address || user.address,
            skinType: data.skinType || user.skinType,
            avatarUrl: data.avatarUrl || user.avatarUrl,
            gender: data.gender || user.gender,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (user.createdAt || new Date().toISOString()),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : user.updatedAt
          };
          try {
            localStorage.setItem(`${PROFILE_KEY_PREFIX}${user.id}`, JSON.stringify(firestoreProfile));
          } catch (e) {}
          return firestoreProfile;
        }
      } catch (err) {
        console.warn('Firestore getUserProfile fallback to cache:', err);
      }
    }

    // 2. Local storage cache fallback
    try {
      const stored = localStorage.getItem(`${PROFILE_KEY_PREFIX}${user.id}`);
      if (stored) {
        return {
          ...user,
          ...JSON.parse(stored)
        };
      }
    } catch (e) {}

    const nameParts = (user.name || '').trim().split(' ');
    const firstName = user.firstName || nameParts[0] || '';
    const lastName = user.lastName || nameParts.slice(1).join(' ') || '';

    return {
      ...user,
      firstName,
      lastName
    };
  },

  // Save user profile changes to Firestore & local cache
  async saveUserProfile(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile; error?: string }> {
    if (!profile || !profile.id) {
      return { success: false, profile, error: 'User is not authenticated.' };
    }

    const updatedAt = new Date().toISOString();
    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.name;

    const updatedProfile: UserProfile = {
      ...profile,
      name: fullName,
      updatedAt
    };

    // 1. Persist to Firestore
    if (db) {
      try {
        const userRef = doc(db, 'users', profile.id);
        await setDoc(userRef, {
          id: profile.id,
          email: profile.email,
          name: fullName,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          age: profile.age !== undefined && profile.age !== null ? Number(profile.age) : null,
          address: profile.address || '',
          skinType: profile.skinType || '',
          avatarUrl: profile.avatarUrl || null,
          gender: profile.gender || '',
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err: any) {
        console.warn('Firestore saveUserProfile notice:', err);
      }
    }

    // 2. Save to local cache
    try {
      localStorage.setItem(`${PROFILE_KEY_PREFIX}${profile.id}`, JSON.stringify(updatedProfile));
      localStorage.setItem('auriva_user', JSON.stringify(updatedProfile));
    } catch (e) {}

    return {
      success: true,
      profile: updatedProfile
    };
  },

  // Save skin profile to Firestore
  async saveSkinProfile(userId: string, skinProfile: SkinProfile): Promise<void> {
    if (!userId) return;
    if (db) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          skinProfile,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore saveSkinProfile notice:', e);
      }
    }
    try {
      localStorage.setItem(`auriva_skin_profile_${userId}`, JSON.stringify(skinProfile));
      localStorage.setItem('auriva_skin_profile', JSON.stringify(skinProfile));
    } catch (e) {}
  },

  // Fetch all user application data from Firestore on login
  async getUserFullData(userId: string): Promise<Partial<UserFullData>> {
    if (!userId || !db) return {};

    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          skinProfile: data.skinProfile || null,
          latestAssessment: data.latestAssessment || null,
          assessmentHistory: data.assessmentHistory || [],
          routineLogs: data.routineLogs || {},
          scanHistory: data.scanHistory || []
        };
      }
    } catch (err) {
      console.warn('Firestore getUserFullData notice:', err);
    }
    return {};
  },

  // Generate clean initials for user avatar fallback
  getUserInitials(user?: UserProfile | null): string {
    if (!user) return 'AU';

    if (user.firstName || user.lastName) {
      const f = (user.firstName || '').trim().charAt(0).toUpperCase();
      const l = (user.lastName || '').trim().charAt(0).toUpperCase();
      if (f && l) return `${f}${l}`;
      if (f) return f;
    }

    const parts = (user.name || '').trim().split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0].charAt(0).toUpperCase()}${parts[1].charAt(0).toUpperCase()}`;
    }
    if (parts[0]) {
      return parts[0].charAt(0).toUpperCase();
    }

    return 'AU';
  }
};

