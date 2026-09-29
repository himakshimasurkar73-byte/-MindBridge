export const THOUGHTS = [
  "Peace begins with a single conscious breath.",
  "Small steps taken each day add up to grand achievements.",
  "Be as patient and kind with yourself as you are with others.",
  "Your value isn't measured by your productivity.",
  "Rest is not a reward; it is an essential part of living.",
  "Focus on how far you've come, not just how far you have to go.",
  "Growth is quiet, gradual, and often invisible until suddenly it's not.",
  "You don't have to carry everything all at once.",
  "Nourish your mind with thoughts of self-compassion today.",
  "Every small effort you make today is an investment in your future peace.",
  "It is completely okay to pause, reset, and start again.",
  "Celebrate the small victories—they build the foundation for great success.",
  "Your present circumstances do not limit where you can go tomorrow.",
  "Kindness toward yourself creates space for resilience to grow.",
  "Trust the process of your own unique journey.",
  "Softness and gentle care are signs of profound inner strength.",
  "Let go of what you cannot control and focus on what brings you clarity.",
  "You bring light and perspective to the world just by being yourself.",
  "Progress isn't always linear; every day brings a fresh opportunity.",
  "Give yourself permission to slow down and enjoy the quiet moments.",
  "Your mind is a garden; nurture it with positivity and patience.",
  "You are stronger than the challenges you are facing today.",
  "Focus your energy on what uplifts and energizes your spirit.",
  "Taking time for self-reflection is an act of courage.",
  "Allow yourself to feel proud of how hard you are trying.",
  "Peace of mind is found in honoring your personal boundaries.",
  "Every sunrise brings a clean slate and new possibilities.",
  "You have overcome difficult days before, and you will thrive today too.",
  "Happiness often grows in the quietest, simplest moments.",
  "Believe in your ability to handle whatever comes your way today.",
  "You are worthy of happiness, health, and peace of mind."
];

/**
 * Calculates the thought of the day index based on local calendar date.
 * Ensures the exact same thought is selected for 24 hours of a single day,
 * advances by 1 thought every midnight, and cycles smoothly across a 30+ day cycle.
 */
export function getThoughtForDate(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Calculate total number of calendar days relative to epoch
  const localMidnight = new Date(year, month, day);
  const dayIndex = Math.round(localMidnight.getTime() / (1000 * 60 * 60 * 24));
  
  const cycleLength = THOUGHTS.length; // 31 distinct thoughts
  const index = Math.abs(dayIndex) % cycleLength;
  
  return {
    thought: THOUGHTS[index],
    dayNumber: index + 1,
    totalCycle: cycleLength
  };
}
