import { SkinScanRecord } from '../types';
import { db, doc, getDoc, setDoc, serverTimestamp } from '../config/firebase';

const SCANS_STORAGE_PREFIX = 'auriva_scans_';

export const skinScanService = {
  // Get previous skin scans for authenticated user
  async getScanHistory(userId: string): Promise<SkinScanRecord[]> {
    if (!userId) return [];

    // 1. Fetch from Firestore
    if (db) {
      try {
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.scanHistory)) {
            try {
              localStorage.setItem(`${SCANS_STORAGE_PREFIX}${userId}`, JSON.stringify(data.scanHistory));
            } catch (e) {}
            return data.scanHistory;
          }
        }
      } catch (err) {
        console.warn('Firestore getScanHistory notice:', err);
      }
    }

    // 2. Local fallback
    try {
      const stored = localStorage.getItem(`${SCANS_STORAGE_PREFIX}${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}

    return [];
  },

  // Save new skin scan record
  async saveScanRecord(userId: string, record: SkinScanRecord): Promise<SkinScanRecord[]> {
    const existing = await this.getScanHistory(userId);
    const updated = [record, ...existing.filter(s => s.id !== record.id)];

    // Persist to Firestore
    if (userId && db) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          scanHistory: updated,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore saveScanRecord notice:', e);
      }
    }

    try {
      localStorage.setItem(`${SCANS_STORAGE_PREFIX}${userId}`, JSON.stringify(updated));
    } catch (e) {}

    return updated;
  },

  // Delete skin scan record
  async deleteScanRecord(userId: string, scanId: string): Promise<SkinScanRecord[]> {
    const existing = await this.getScanHistory(userId);
    const updated = existing.filter(s => s.id !== scanId);

    if (userId && db) {
      try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          scanHistory: updated,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore deleteScanRecord notice:', e);
      }
    }

    try {
      localStorage.setItem(`${SCANS_STORAGE_PREFIX}${userId}`, JSON.stringify(updated));
    } catch (e) {}

    return updated;
  }
};

