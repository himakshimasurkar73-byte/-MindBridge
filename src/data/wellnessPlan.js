export const WELLNESS_SUGGESTIONS_POOL = [
  { id: "ws-1", icon: "🧘", text: "Take 5 minutes to relax and breathe deeply", category: "Mindfulness" },
  { id: "ws-2", icon: "💧", text: "Drink enough water throughout the day", category: "Hydration" },
  { id: "ws-3", icon: "🚶", text: "Take a short break or refreshing walk", category: "Movement" },
  { id: "ws-4", icon: "☀️", text: "Get 5-10 minutes of daylight and fresh air", category: "Energy" },
  { id: "ws-5", icon: "🤸", text: "Do a gentle neck and shoulder stretch", category: "Relief" },
  { id: "ws-6", icon: "☕", text: "Sip a warm cup of tea or water mindfully", category: "Calm" },
  { id: "ws-7", icon: "📝", text: "Note down one thing you are grateful for today", category: "Reflection" },
  { id: "ws-8", icon: "🎵", text: "Listen to a calm, uplifting music track", category: "Music" },
  { id: "ws-9", icon: "🌿", text: "Step outside and take 3 slow belly breaths", category: "Nature" },
  { id: "ws-10", icon: "📵", text: "Take a 15-minute digital screen break", category: "Rest" },
  { id: "ws-11", icon: "🍎", text: "Enjoy a healthy fruit or nourishing snack", category: "Nourish" },
  { id: "ws-12", icon: "😴", text: "Prepare for rest 15 minutes earlier tonight", category: "Sleep" },
  { id: "ws-13", icon: "🌸", text: "Share a kind word with yourself or someone else", category: "Kindness" },
  { id: "ws-14", icon: "🌬️", text: "Practice 4-7-8 box breathing for 1 minute", category: "Focus" },
  { id: "ws-15", icon: "🛋️", text: "Tidy up your immediate workspace for 3 minutes", category: "Clarity" }
];

/**
 * Returns 3 daily wellness suggestions deterministically based on local calendar date.
 * Automatically changes every day at midnight and stays identical throughout a single day.
 */
export function getDailyWellnessPlan(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  const localMidnight = new Date(year, month, day);
  const dayIndex = Math.round(localMidnight.getTime() / (1000 * 60 * 60 * 24));
  
  const pool = WELLNESS_SUGGESTIONS_POOL;
  const poolSize = pool.length; // 15 suggestions
  
  const idx1 = Math.abs(dayIndex * 3) % poolSize;
  const idx2 = Math.abs(dayIndex * 3 + 1) % poolSize;
  const idx3 = Math.abs(dayIndex * 3 + 2) % poolSize;
  
  return [pool[idx1], pool[idx2], pool[idx3]];
}
