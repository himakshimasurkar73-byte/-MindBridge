export function getPersonalizedRecommendations(assessmentResults, userProfile) {
  const score = assessmentResults ? assessmentResults.overallScore : 72;
  const role = userProfile ? userProfile.occupation : "Student";
  const name = userProfile ? userProfile.name : "Friend";

  let title = "🌱 Keep Building Your Wellbeing";
  let categoryTheme = "good";
  let items = [];
  let professionalCallout = false;

  if (score >= 70) {
    title = "🌱 Keep Building Your Wellbeing";
    categoryTheme = "good";
    items = [
      { icon: "🏃", title: "Daily Physical Activity", desc: "Maintain your active momentum with 15 minutes of light cardio or brisk walking." },
      { icon: "🧘", title: "Short Meditation", desc: "Spend 5-10 minutes anchoring your focus using present-moment mindfulness." },
      { icon: "😴", title: "Maintain Sleep Routine", desc: "Keep a consistent bedtime to reinforce your circadian clock." },
      { icon: "😊", title: "Mood Tracking", desc: "Log your daily emotional patterns to notice what brings you joy." },
      { icon: "🌿", title: "Relaxation Activities", desc: "Dedicating time for hobbies, reading, or creative expression." }
    ];
  } else if (score >= 50) {
    title = "💜 Take a Little More Care of Yourself";
    categoryTheme = "attention";
    items = [
      { icon: "🌬️", title: "5–10 Minute Breathing Exercise", desc: "Practice box breathing during midday shifts to relieve tension." },
      { icon: "🚶", title: "Light Exercise", desc: "Take a calming 10-minute walk after meals or study sessions." },
      { icon: "🧘", title: "Guided Meditation", desc: "Listen to a soothing relaxation soundscape when feeling overwhelmed." },
      { icon: "🌙", title: "Better Sleep Routine", desc: "Dim artificial blue lights 30 minutes before sleep to ease rest." },
      { icon: "🗣️", title: "Talking to a Trusted Person", desc: "Share how you feel with a supportive friend, family member, or colleague." },
      { icon: "☕", title: "Taking Regular Breaks", desc: "Use a 25-minute focus, 5-minute rest pattern for work/study sessions." }
    ];
  } else {
    title = "💙 You Deserve Some Extra Support";
    categoryTheme = "high_stress";
    professionalCallout = true;
    items = [
      { icon: "🌬️", title: "Gentle Breathing Exercises", desc: "Focus on slow 4-second inhales and 7-second exhales to ground yourself." },
      { icon: "🧘", title: "Guided Relaxation", desc: "Try a progressive body scan to untangle physical tightness." },
      { icon: "🤸", title: "Light Movement", desc: "Do soft neck and shoulder stretches—no pressure to overexert." },
      { icon: "📔", title: "Journaling", desc: "Write down non-judgmental thoughts to declutter your mind." },
      { icon: "❤️", title: "Connecting with Someone Trusted", desc: "Reach out to someone who validates and cares for you." }
    ];
  }

  // Daily Plan generation based on role & time
  const dailyPlan = {
    morning: {
      time: "🌅 Morning",
      activity: "5-Minute Box Breathing & Hydration",
      detail: `Start your day as a ${role} with 5 deep breaths to set a serene tone.`
    },
    afternoon: {
      time: "☀️ Afternoon",
      activity: "10-Minute Mindful Walk & Stretch",
      detail: "Step away from screens and stretch your neck, back, and shoulders."
    },
    evening: {
      time: "🌆 Evening",
      activity: "5-Minute Light Movement or Journaling",
      detail: "Decompress after daily tasks by noting 3 small things that went well today."
    },
    night: {
      time: "🌙 Night",
      activity: "10-Minute Relaxation Meditation & Dim Lighting",
      detail: "Listen to ambient ocean waves or rain soundscape for peaceful sleep."
    }
  };

  return {
    title,
    categoryTheme,
    items,
    dailyPlan,
    professionalCallout,
    safetyNotice: "If these feelings are persistent, worsening, or interfering with your daily life, consider talking with a qualified mental-health professional or another trusted adult."
  };
}
