import { AssessmentResult, SkinProfile } from '../types';
import { db, doc, getDoc, setDoc, serverTimestamp, arrayUnion } from '../config/firebase';

const ASSESSMENT_KEY_PREFIX = 'auriva_assessment_';

export const assessmentService = {
  // Get latest assessment for authenticated user
  async getUserAssessment(userId?: string): Promise<AssessmentResult | null> {
    if (!userId) {
      try {
        const globalSaved = localStorage.getItem('auriva_latest_assessment');
        return globalSaved ? JSON.parse(globalSaved) : null;
      } catch {
        return null;
      }
    }

    // 1. Fetch from Firestore
    if (db) {
      try {
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.latestAssessment) {
            try {
              localStorage.setItem(`${ASSESSMENT_KEY_PREFIX}${userId}`, JSON.stringify(data.latestAssessment));
              localStorage.setItem('auriva_latest_assessment', JSON.stringify(data.latestAssessment));
            } catch (e) {}
            return data.latestAssessment as AssessmentResult;
          }
        }
      } catch (err) {
        console.warn('Firestore getUserAssessment fallback to cache:', err);
      }
    }

    // 2. Fallback to local cache
    try {
      const userSaved = localStorage.getItem(`${ASSESSMENT_KEY_PREFIX}${userId}`);
      if (userSaved) {
        return JSON.parse(userSaved);
      }

      const globalSaved = localStorage.getItem('auriva_latest_assessment');
      if (globalSaved) {
        return JSON.parse(globalSaved);
      }
    } catch (e) {}

    return null;
  },

  // Get full assessment history for user
  async getUserAssessmentHistory(userId?: string): Promise<AssessmentResult[]> {
    if (!userId) {
      try {
        const globalSaved = localStorage.getItem('auriva_assessments');
        return globalSaved ? JSON.parse(globalSaved) : [];
      } catch {
        return [];
      }
    }

    // 1. Fetch from Firestore
    if (db) {
      try {
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.assessmentHistory)) {
            try {
              localStorage.setItem(`auriva_assessments_${userId}`, JSON.stringify(data.assessmentHistory));
            } catch (e) {}
            return data.assessmentHistory;
          }
        }
      } catch (err) {
        console.warn('Firestore getUserAssessmentHistory fallback:', err);
      }
    }

    // 2. Cache fallback
    try {
      const userList = localStorage.getItem(`auriva_assessments_${userId}`);
      if (userList) return JSON.parse(userList);

      const globalSaved = localStorage.getItem('auriva_assessments');
      if (globalSaved) return JSON.parse(globalSaved);
    } catch (e) {}

    return [];
  },

  // Save assessment result permanently to Firestore & local cache
  async saveUserAssessment(userId: string | undefined, result: AssessmentResult): Promise<{ success: boolean; result: AssessmentResult }> {
    const completedAt = new Date().toISOString();
    const finalizedResult: AssessmentResult = {
      ...result,
      completedAt
    };

    const skinProfileObj: SkinProfile = {
      skinType: finalizedResult.request.skinType || 'Combination',
      oiliness: 'Moderate',
      dryness: 'Moderate',
      sensitivity: finalizedResult.request.sensitivity || 'Moderate',
      allergies: [],
      mainConcerns: [finalizedResult.possibleConcern || 'General Care'],
      profileCompleted: true,
      updatedAt: completedAt
    };

    // 1. Persist to Firestore
    if (userId && db) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          latestAssessment: finalizedResult,
          assessmentHistory: arrayUnion(finalizedResult),
          skinProfile: skinProfileObj,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore saveUserAssessment error:', err);
      }
    }

    // 2. Persist to Local Storage cache
    try {
      localStorage.setItem('auriva_latest_assessment', JSON.stringify(finalizedResult));
      if (userId) {
        localStorage.setItem(`${ASSESSMENT_KEY_PREFIX}${userId}`, JSON.stringify(finalizedResult));
        
        // Update local history
        const currentHistory = await this.getUserAssessmentHistory(userId);
        const updatedHistory = [finalizedResult, ...currentHistory.filter(h => h.id !== finalizedResult.id)];
        localStorage.setItem(`auriva_assessments_${userId}`, JSON.stringify(updatedHistory));
      }

      localStorage.setItem('auriva_skin_profile', JSON.stringify(skinProfileObj));
      if (userId) {
        localStorage.setItem(`auriva_skin_profile_${userId}`, JSON.stringify(skinProfileObj));
      }
    } catch (e) {}

    return {
      success: true,
      result: finalizedResult
    };
  },

  // Clear user assessment history
  async clearAssessmentHistory(userId?: string): Promise<void> {
    if (userId && db) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          assessmentHistory: [],
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore clearAssessmentHistory error:', err);
      }
    }

    try {
      if (userId) {
        localStorage.removeItem(`auriva_assessments_${userId}`);
      }
      localStorage.removeItem('auriva_assessments');
    } catch (e) {}
  }
};

