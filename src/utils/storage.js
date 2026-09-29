const STORAGE_KEYS = {
  PROFILE: "mindbridge_user_profile",
  ASSESSMENT: "mindbridge_assessment_results",
  MOOD_LOGS: "mindbridge_mood_logs",
  CHECK_INS: "mindbridge_daily_checkins",
  COMPLETED_ACTIVITIES: "mindbridge_completed_activities",
};

// Default sample mood logs for 7-day and 30-day charts if user is new
export const MOCK_MOOD_LOGS = [
  { id: "log-1", date: "2026-08-27", moodScore: 4, mood: "Good", icon: "🙂", tag: "Studies/Work", note: "Productive day" },
  { id: "log-2", date: "2026-08-28", moodScore: 3, mood: "Okay", icon: "😐", tag: "Sleep", note: "Slept late" },
  { id: "log-3", date: "2026-08-29", moodScore: 5, mood: "Great", icon: "😄", tag: "Friends", note: "Met friends for coffee" },
  { id: "log-4", date: "2026-08-30", moodScore: 2, mood: "Low", icon: "😔", tag: "Studies/Work", note: "Felt overwhelmed by deadlines" },
  { id: "log-5", date: "2026-08-31", moodScore: 4, mood: "Good", icon: "🙂", tag: "Health", note: "Took a walk outside" },
  { id: "log-6", date: "2026-09-01", moodScore: 5, mood: "Great", icon: "😄", tag: "Personal thoughts", note: "Good meditation session" },
  { id: "log-7", date: "2026-09-02", moodScore: 4, mood: "Good", icon: "🙂", tag: "Studies/Work", note: "Maintained steady focus" },
];

export const MOCK_CHECKINS = [
  { date: "2026-08-27", stress: 2, sleep: 4, energy: 4, relax: 3, social: 4 },
  { date: "2026-08-28", stress: 3, sleep: 3, energy: 3, relax: 2, social: 3 },
  { date: "2026-08-29", stress: 1, sleep: 5, energy: 5, relax: 5, social: 5 },
  { date: "2026-08-30", stress: 4, sleep: 2, energy: 2, relax: 1, social: 2 },
  { date: "2026-08-31", stress: 2, sleep: 4, energy: 4, relax: 4, social: 3 },
  { date: "2026-09-01", stress: 1, sleep: 5, energy: 5, relax: 4, social: 5 },
  { date: "2026-09-02", stress: 2, sleep: 4, energy: 4, relax: 3, social: 4 },
];

export function getStoredProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

export function getStoredAssessment() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredAssessment(results) {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(results));
  } catch (e) {
    console.error("Failed to save assessment", e);
  }
}

export function getStoredMoodLogs() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MOOD_LOGS);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.length > 0) return parsed;
    }
    return MOCK_MOOD_LOGS;
  } catch (e) {
    return MOCK_MOOD_LOGS;
  }
}

export function saveMoodLog(newLog) {
  try {
    const existing = getStoredMoodLogs();
    const updated = [newLog, ...existing];
    localStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save mood log", e);
    return [];
  }
}

export function getStoredCheckIns() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.length > 0) return parsed;
    }
    return MOCK_CHECKINS;
  } catch (e) {
    return MOCK_CHECKINS;
  }
}

export function saveCheckIn(checkIn) {
  try {
    const existing = getStoredCheckIns();
    const updated = [checkIn, ...existing];
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save checkin", e);
    return [];
  }
}

export function getCompletedActivities() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_ACTIVITIES);
    return data ? JSON.parse(data) : { meditationCount: 4, exerciseCount: 3, streak: 5 };
  } catch (e) {
    return { meditationCount: 4, exerciseCount: 3, streak: 5 };
  }
}

export function saveCompletedActivity(type) {
  try {
    const current = getCompletedActivities();
    if (type === "meditation") {
      current.meditationCount = (current.meditationCount || 0) + 1;
    } else if (type === "exercise") {
      current.exerciseCount = (current.exerciseCount || 0) + 1;
    }
    localStorage.setItem(STORAGE_KEYS.COMPLETED_ACTIVITIES, JSON.stringify(current));
    return current;
  } catch (e) {
    return { meditationCount: 1, exerciseCount: 1, streak: 1 };
  }
}

// ----------------------------------------------------
// Registered User Data Isolation & Storage Functions
// ----------------------------------------------------

export function getUserId(userProfile) {
  if (!userProfile) return null;
  return userProfile.id || userProfile.email || (userProfile.name ? userProfile.name.toLowerCase().trim().replace(/\s+/g, '_') : 'user_registered');
}

export function getUserMoodLogs(userId) {
  if (!userId) return [];
  try {
    const data = localStorage.getItem(`mindbridge_user_moods_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveUserMoodLog(userId, log) {
  if (!userId) return [];
  try {
    const existing = getUserMoodLogs(userId);
    const updated = [log, ...existing];
    localStorage.setItem(`mindbridge_user_moods_${userId}`, JSON.stringify(updated));
    updateUserStreak(userId, log.date || new Date().toISOString().split('T')[0]);
    unlockUserAchievement(userId, 'first_checkin');
    return updated;
  } catch (e) {
    return [];
  }
}

export function getUserStreak(userId) {
  if (!userId) return { count: 0, lastActiveDate: null };
  try {
    const data = localStorage.getItem(`mindbridge_user_streak_${userId}`);
    return data ? JSON.parse(data) : { count: 0, lastActiveDate: null };
  } catch (e) {
    return { count: 0, lastActiveDate: null };
  }
}

export function updateUserStreak(userId, activityDate = new Date().toISOString().split('T')[0]) {
  if (!userId) return { count: 0, lastActiveDate: null };
  try {
    const streak = getUserStreak(userId);
    const lastDate = streak.lastActiveDate;

    if (!lastDate) {
      streak.count = 1;
      streak.lastActiveDate = activityDate;
    } else if (lastDate === activityDate) {
      // Already active today, maintain current streak
    } else {
      const last = new Date(lastDate);
      const curr = new Date(activityDate);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak.count += 1;
      } else if (diffDays > 1) {
        streak.count = 1;
      }
      streak.lastActiveDate = activityDate;
    }

    localStorage.setItem(`mindbridge_user_streak_${userId}`, JSON.stringify(streak));
    
    // Check for 7-day streak achievement
    if (streak.count >= 7) {
      unlockUserAchievement(userId, 'seven_day_wellness');
    }

    return streak;
  } catch (e) {
    return { count: 1, lastActiveDate: activityDate };
  }
}

export function getUserAchievements(userId) {
  if (!userId) return {};
  try {
    const data = localStorage.getItem(`mindbridge_user_achievements_${userId}`);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function unlockUserAchievement(userId, achievementId) {
  if (!userId) return {};
  try {
    const current = getUserAchievements(userId);
    if (!current[achievementId]) {
      current[achievementId] = {
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
      localStorage.setItem(`mindbridge_user_achievements_${userId}`, JSON.stringify(current));
    }
    return current;
  } catch (e) {
    return {};
  }
}

export function getUserFocusData(userId) {
  if (!userId) return { completedSessions: 0, totalMinutes: 0 };
  try {
    const data = localStorage.getItem(`mindbridge_user_focus_${userId}`);
    return data ? JSON.parse(data) : { completedSessions: 0, totalMinutes: 0 };
  } catch (e) {
    return { completedSessions: 0, totalMinutes: 0 };
  }
}

export function saveUserFocusSession(userId, durationMinutes = 25) {
  if (!userId) return { completedSessions: 0, totalMinutes: 0 };
  try {
    const current = getUserFocusData(userId);
    const updated = {
      completedSessions: (current.completedSessions || 0) + 1,
      totalMinutes: (current.totalMinutes || 0) + durationMinutes,
      lastSessionAt: new Date().toISOString()
    };
    localStorage.setItem(`mindbridge_user_focus_${userId}`, JSON.stringify(updated));
    
    updateUserStreak(userId);
    unlockUserAchievement(userId, 'focus_starter');
    
    return updated;
  } catch (e) {
    return { completedSessions: 1, totalMinutes: durationMinutes };
  }
}

