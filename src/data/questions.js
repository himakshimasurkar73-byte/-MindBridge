export const ROLE_QUESTIONS = {
  Student: [
    {
      id: "role_1",
      text: "Studies make me feel stressed.",
      isNegative: true,
    },
    {
      id: "role_2",
      text: "I find it difficult to balance studies and relaxation.",
      isNegative: true,
    },
    {
      id: "role_3",
      text: "I feel pressure about academic performance.",
      isNegative: true,
    },
  ],
  "Office Worker": [
    {
      id: "role_1",
      text: "My workload makes me feel stressed.",
      isNegative: true,
    },
    {
      id: "role_2",
      text: "I find it difficult to disconnect from work.",
      isNegative: true,
    },
    {
      id: "role_3",
      text: "I have enough time for rest and personal activities.",
      isNegative: false,
    },
  ],
  Homemaker: [
    {
      id: "role_1",
      text: "My daily responsibilities make me feel overwhelmed.",
      isNegative: true,
    },
    {
      id: "role_2",
      text: "I get enough personal time for myself.",
      isNegative: false,
    },
    {
      id: "role_3",
      text: "I feel supported by people around me.",
      isNegative: false,
    },
  ],
  "Business Owner": [
    {
      id: "role_1",
      text: "Business responsibilities leave me feeling drained.",
      isNegative: true,
    },
    {
      id: "role_2",
      text: "I can step away from work without constant anxiety.",
      isNegative: false,
    },
    {
      id: "role_3",
      text: "I feel confident in managing daily business pressures.",
      isNegative: false,
    },
  ],
  Teacher: [
    {
      id: "role_1",
      text: "Classroom and administrative demands stress me out.",
      isNegative: true,
    },
    {
      id: "role_2",
      text: "I am able to recharge outside teaching hours.",
      isNegative: false,
    },
    {
      id: "role_3",
      text: "I feel appreciated and supported in my role.",
      isNegative: false,
    },
  ],
  "Healthcare Worker": [
    {
      id: "role_1",
      text: "Long shifts or emotional demands feel overwhelming.",
      isNegative: true,
    },
    {
      id: "role_2",
      text: "I have adequate opportunity to rest between duties.",
      isNegative: false,
    },
    {
      id: "role_3",
      text: "I receive peer or organizational emotional support.",
      isNegative: false,
    },
  ],
  Other: [
    {
      id: "role_1",
      text: "My routine responsibilities make me feel overwhelmed.",
      isNegative: true,
    },
    {
      id: "role_2",
      text: "I find time to engage in hobbies and relaxation.",
      isNegative: false,
    },
    {
      id: "role_3",
      text: "I feel clear and focused about my daily tasks.",
      isNegative: false,
    },
  ],
};

export const WELLNESS_ASSESSMENT_QUESTIONS = [
  {
    id: "q1_stress",
    category: "Stress & Workload",
    dimension: "workStress",
    text: "I feel stressed or overwhelmed during my daily routine.",
    isNegative: true,
  },
  {
    id: "q2_sleep",
    category: "Sleep & Rest",
    dimension: "sleep",
    text: "I get enough quality sleep and wake up feeling refreshed.",
    isNegative: false,
  },
  {
    id: "q3_mood",
    category: "Mood & Emotional Well-Being",
    dimension: "emotional",
    text: "I feel happy, calm, and emotionally balanced most days.",
    isNegative: false,
  },
  {
    id: "q4_energy",
    category: "Energy & Vitality",
    dimension: "energy",
    text: "I have steady energy and focus to complete my daily activities.",
    isNegative: false,
  },
  {
    id: "q5_balance",
    category: "Life & Social Balance",
    dimension: "social",
    text: "I am able to maintain a healthy balance between work, personal life, and relaxation.",
    isNegative: false,
  },
];

export const WELLNESS_QUIZ_QUESTIONS = WELLNESS_ASSESSMENT_QUESTIONS;
export const PERSONAL_LIFE_QUIZ_QUESTIONS = [];

export const LIKERT_OPTIONS = [
  { label: "Never", value: 1 },
  { label: "Rarely", value: 2 },
  { label: "Sometimes", value: 3 },
  { label: "Often", value: 4 },
  { label: "Always", value: 5 },
];
