import { SkinProfile, AssessmentResult } from '../types';
import { db, doc, setDoc, serverTimestamp } from '../config/firebase';

export interface RoutineStep {
  id: string;
  name: string;
  category: 'morning' | 'evening';
  completed: boolean;
}

export interface DailyRoutineLog {
  userId: string;
  dateStr: string; // YYYY-MM-DD
  morningSteps: RoutineStep[];
  eveningSteps: RoutineStep[];
  diaryNote?: string;
  loggedProduct?: string;
  updatedAt: string;
}

export interface DayStatus {
  dayLabel: string; // Sun, Mon, etc.
  dateStr: string;
  isToday: boolean;
  isFuture: boolean;
  status: 'completed' | 'partial' | 'none' | 'future';
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export interface UserMetrics {
  hasAnyActivity: boolean;
  todayProgressPercent: number;
  todayCompletedCount: number;
  todayTotalCount: number;
  weeklyConsistencyPercent: number;
  streakDays: number;
  weeklyDays: DayStatus[];
  motivationalMessage: string;
}

// Default Routine Steps Generator based on User's Skin Type & Assessment
export function getDefaultRoutineSteps(skinType?: string, mainConcern?: string): { morning: RoutineStep[]; evening: RoutineStep[] } {
  const st = (skinType || 'combination').toLowerCase();
  const concern = (mainConcern || 'general care').toLowerCase();

  const morning: RoutineStep[] = [
    { id: 'm-cleanser', name: `Gentle Cleanser (${skinType || 'Balanced'})`, category: 'morning', completed: false },
    { id: 'm-treatment', name: `Target Serum (${concern.includes('acne') ? 'Salicylic Acid / Niacinamide' : 'Vitamin C Radiance'})`, category: 'morning', completed: false },
    { id: 'm-moisturizer', name: `Barrier Moisturizer (${st.includes('oily') ? 'Light Gel' : 'Hydrating Cream'})`, category: 'morning', completed: false },
    { id: 'm-sunscreen', name: 'Broad-Spectrum Sunscreen (SPF 50)', category: 'morning', completed: false }
  ];

  const evening: RoutineStep[] = [
    { id: 'e-cleanser', name: 'Deep Evening Cleanser', category: 'evening', completed: false },
    { id: 'e-treatment', name: `Night Treatment (${concern.includes('wrinkle') ? 'Retinoid / Peptide' : 'Soothing Centella'})`, category: 'evening', completed: false },
    { id: 'e-moisturizer', name: 'Nourishing Night Cream', category: 'evening', completed: false }
  ];

  return { morning, evening };
}

// Get ISO Date string (YYYY-MM-DD)
export function getTodayDateStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Local Storage Key Helper
function getStorageKey(userId: string): string {
  return `auriva_routine_logs_${userId || 'guest'}`;
}

// Read all logs for user
export function getAllUserLogs(userId: string): Record<string, DailyRoutineLog> {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return {};
}

// Save all logs for user to local storage and sync to Firestore
export function saveAllUserLogs(userId: string, logs: Record<string, DailyRoutineLog>) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(logs));
  } catch (e) {}

  if (userId && userId !== 'guest' && db) {
    try {
      const userRef = doc(db, 'users', userId);
      setDoc(userRef, {
        routineLogs: logs,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch((err) => {
        console.warn('Firestore routineLogs sync notice:', err);
      });
    } catch (err) {
      console.warn('Firestore routineLogs error:', err);
    }
  }
}

// Hydrate local cache with Firestore logs
export function hydrateUserLogs(userId: string, remoteLogs: Record<string, DailyRoutineLog>) {
  if (!userId || !remoteLogs) return;
  try {
    const local = getAllUserLogs(userId);
    const merged = { ...remoteLogs, ...local };
    localStorage.setItem(getStorageKey(userId), JSON.stringify(merged));
  } catch (e) {}
}

// Get or initialize Log for a specific date
export function getDailyLog(
  userId: string, 
  dateStr: string, 
  skinProfile?: SkinProfile | null, 
  latestAssessment?: AssessmentResult | null
): DailyRoutineLog {
  const logs = getAllUserLogs(userId);
  if (logs[dateStr]) {
    return logs[dateStr];
  }

  const defaultSteps = getDefaultRoutineSteps(
    skinProfile?.skinType || latestAssessment?.request?.skinType,
    skinProfile?.mainConcerns?.[0] || latestAssessment?.possibleConcern
  );

  const newLog: DailyRoutineLog = {
    userId,
    dateStr,
    morningSteps: defaultSteps.morning,
    eveningSteps: defaultSteps.evening,
    updatedAt: new Date().toISOString()
  };

  logs[dateStr] = newLog;
  saveAllUserLogs(userId, logs);
  return newLog;
}

// Toggle a specific step's completion
export function toggleRoutineStep(
  userId: string,
  dateStr: string,
  stepId: string,
  skinProfile?: SkinProfile | null,
  latestAssessment?: AssessmentResult | null
): DailyRoutineLog {
  const logs = getAllUserLogs(userId);
  let log = logs[dateStr];

  if (!log) {
    log = getDailyLog(userId, dateStr, skinProfile, latestAssessment);
  }

  const updateList = (list: RoutineStep[]) => 
    list.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);

  log.morningSteps = updateList(log.morningSteps);
  log.eveningSteps = updateList(log.eveningSteps);
  log.updatedAt = new Date().toISOString();

  logs[dateStr] = log;
  saveAllUserLogs(userId, logs);
  return log;
}

// Save Diary Note and Logged Product
export function saveDailyNote(
  userId: string,
  dateStr: string,
  note: string,
  productName?: string
): DailyRoutineLog {
  const logs = getAllUserLogs(userId);
  const log = logs[dateStr] || getDailyLog(userId, dateStr);

  log.diaryNote = note;
  if (productName) log.loggedProduct = productName;
  log.updatedAt = new Date().toISOString();

  logs[dateStr] = log;
  saveAllUserLogs(userId, logs);
  return log;
}

// Calculate Dynamic User Metrics for Dashboard
export function calculateUserMetrics(
  userId: string,
  skinProfile?: SkinProfile | null,
  latestAssessment?: AssessmentResult | null
): UserMetrics {
  const logs = getAllUserLogs(userId);
  const todayStr = getTodayDateStr();
  const todayLog = getDailyLog(userId, todayStr, skinProfile, latestAssessment);

  const allStepsToday = [...todayLog.morningSteps, ...todayLog.eveningSteps];
  const todayCompletedCount = allStepsToday.filter(s => s.completed).length;
  const todayTotalCount = allStepsToday.length;
  const todayProgressPercent = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;

  // Check if user has ANY activity across all dates
  const logKeys = Object.keys(logs);
  const hasAnyActivity = logKeys.some(k => {
    const l = logs[k];
    const morningDone = l.morningSteps?.some(s => s.completed);
    const eveningDone = l.eveningSteps?.some(s => s.completed);
    return morningDone || eveningDone || Boolean(l.diaryNote);
  });

  // Calculate Current Sunday-to-Saturday Week Days
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - currentDayOfWeek);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyDays: DayStatus[] = [];

  let activeDaysThisWeek = 0;
  let elapsedDaysThisWeek = 0;

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(sunday);
    dayDate.setDate(sunday.getDate() + i);
    const dayStr = dayDate.toISOString().split('T')[0];

    const isToday = dayStr === todayStr;
    const isFuture = dayDate > now && !isToday;

    const dayLog = logs[dayStr];
    let status: 'completed' | 'partial' | 'none' | 'future' = 'none';
    let completedCount = 0;
    let totalCount = 7;
    let progressPercent = 0;

    if (isFuture) {
      status = 'future';
    } else {
      elapsedDaysThisWeek++;
      if (dayLog) {
        const steps = [...(dayLog.morningSteps || []), ...(dayLog.eveningSteps || [])];
        totalCount = steps.length || 7;
        completedCount = steps.filter(s => s.completed).length;
        progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        if (completedCount > 0) {
          if (completedCount === totalCount) {
            status = 'completed';
            activeDaysThisWeek++;
          } else {
            status = 'partial';
            activeDaysThisWeek += 0.5;
          }
        }
      }
    }

    weeklyDays.push({
      dayLabel: dayLabels[i],
      dateStr: dayStr,
      isToday,
      isFuture,
      status,
      completedCount,
      totalCount,
      progressPercent
    });
  }

  // Calculate Weekly Consistency Percentage
  const weeklyConsistencyPercent = elapsedDaysThisWeek > 0 
    ? Math.round((activeDaysThisWeek / elapsedDaysThisWeek) * 100) 
    : 0;

  // Calculate Consecutive Streak (Days with completed or partial routines backwards from today)
  let streakDays = 0;
  const checkDate = new Date(now);
  
  while (true) {
    const dateKey = checkDate.toISOString().split('T')[0];
    const log = logs[dateKey];
    if (log) {
      const steps = [...(log.morningSteps || []), ...(log.eveningSteps || [])];
      const done = steps.filter(s => s.completed).length;
      if (done > 0) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (dateKey === todayStr) {
          // If today has 0 activity yet, check yesterday to preserve ongoing streak
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    } else {
      if (dateKey === todayStr) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Dynamic Activity-Based Motivational Guidance
  let motivationalMessage = "Start your skincare journey today. Complete your morning steps to begin tracking!";

  if (!hasAnyActivity) {
    motivationalMessage = "Your routine journey starts here. Complete today's steps to begin building consistency!";
  } else if (weeklyConsistencyPercent >= 80) {
    motivationalMessage = "Great consistency this week! Your skin barrier is thriving with your active regimen.";
  } else if (weeklyConsistencyPercent >= 50) {
    motivationalMessage = "You're building a solid skincare routine. Stay steady for optimal results!";
  } else if (weeklyConsistencyPercent > 0) {
    motivationalMessage = "Every step counts toward healthier skin. Complete tonight's routine to raise your consistency!";
  }

  return {
    hasAnyActivity,
    todayProgressPercent,
    todayCompletedCount,
    todayTotalCount,
    weeklyConsistencyPercent,
    streakDays,
    weeklyDays,
    motivationalMessage
  };
}
