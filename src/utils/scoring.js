/**
 * Transparent scoring engine for MindBridge Quiz
 */
export function calculateWellnessScore(answers, arg2, arg3, arg4) {
  // Option values: 1 (Never), 2 (Rarely), 3 (Sometimes), 4 (Often), 5 (Always)
  
  let totalMaxScore = 0;
  let totalEarnedScore = 0;

  // Track category sums
  let dimensionScores = {
    emotional: { earned: 0, max: 0 },
    sleep: { earned: 0, max: 0 },
    energy: { earned: 0, max: 0 },
    workStress: { earned: 0, max: 0 },
    social: { earned: 0, max: 0 }
  };

  let allQuestions = [];
  if (Array.isArray(arg2)) {
    allQuestions = arg2;
  } else {
    allQuestions = [...(arg2 || []), ...(arg3 || []), ...(arg4 || [])];
  }

  // Fallback default if array is empty
  if (!allQuestions || allQuestions.length === 0) {
    allQuestions = [
      { id: 'q1_stress', dimension: 'workStress', isNegative: true },
      { id: 'q2_sleep', dimension: 'sleep', isNegative: false },
      { id: 'q3_mood', dimension: 'emotional', isNegative: false },
      { id: 'q4_energy', dimension: 'energy', isNegative: false },
      { id: 'q5_balance', dimension: 'social', isNegative: false },
    ];
  }

  allQuestions.forEach((q) => {
    const rawVal = Number(answers[q.id] || 3);
    // If negative question ("Studies make me feel stressed"):
    // Never (1) -> 5 points (Best wellness)
    // Always (5) -> 1 point (Low wellness)
    let processedVal = q.isNegative ? (6 - rawVal) : rawVal;

    totalEarnedScore += processedVal;
    totalMaxScore += 5;

    // Map to dimension
    const dim = q.dimension || (q.isNegative ? "workStress" : "emotional");
    if (!dimensionScores[dim]) {
      dimensionScores[dim] = { earned: 0, max: 0 };
    }
    dimensionScores[dim].earned += processedVal;
    dimensionScores[dim].max += 5;
  });

  const overallPercent = Math.round((totalEarnedScore / totalMaxScore) * 100);

  // Categorize
  let category = "GOOD WELLNESS";
  let statusColor = "#10B981"; // Mint green
  let statusBadge = "🟢 GOOD WELLNESS";
  let tagline = "You are maintaining a strong, positive equilibrium in your daily life.";

  if (overallPercent < 50) {
    category = "HIGH STRESS / LOW WELLNESS";
    statusColor = "#EF4444"; // Warm red/coral accent
    statusBadge = "🟠 HIGH STRESS / LOW WELLNESS";
    tagline = "You are experiencing noticeable stress and could benefit from extra gentleness and self-care.";
  } else if (overallPercent < 70) {
    category = "NEEDS ATTENTION";
    statusColor = "#F59E0B"; // Amber yellow
    statusBadge = "🟡 NEEDS ATTENTION";
    tagline = "Your routine shows areas of pressure that warrant attentive, nurturing habits.";
  }

  // Calculate percentages for each indicator
  const calcPct = (dimObj) => {
    if (!dimObj || dimObj.max === 0) return 70;
    return Math.round((dimObj.earned / dimObj.max) * 100);
  };

  const breakdown = {
    emotional: calcPct(dimensionScores.emotional),
    sleep: calcPct(dimensionScores.sleep),
    energy: calcPct(dimensionScores.energy),
    workStress: calcPct(dimensionScores.workStress),
    social: calcPct(dimensionScores.social)
  };

  return {
    overallScore: overallPercent,
    category,
    statusBadge,
    statusColor,
    tagline,
    breakdown,
    disclaimer: "This result reflects your responses in this assessment and is not a medical diagnosis."
  };
}
