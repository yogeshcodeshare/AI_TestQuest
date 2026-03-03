// App Constants

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'TestQuest AI'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Gamification Constants
export const XP = {
  TASK_CORRECT_EASY: 10,
  TASK_CORRECT_MEDIUM: 20,
  TASK_CORRECT_HARD: 30,
  TASK_PARTIAL_MULTIPLIER: 0.5,
  STREAK_BONUS_BASE: 5,
  DAILY_BONUS: 50,
  PERFECT_DAY_BONUS: 100,
}

export const STREAK = {
  MIN_TASKS_FOR_STREAK: 1, // At least 1 task completed
  STREAK_HOURS_WINDOW: 48, // Can restore streak within 48 hours
}

export const BADGES = {
  STREAK_7: { id: 'streak-7', name: 'Week Warrior', description: '7-day streak', requirement: 7 },
  STREAK_30: { id: 'streak-30', name: 'Monthly Master', description: '30-day streak', requirement: 30 },
  TASKS_100: { id: 'tasks-100', name: 'Centurion', description: 'Complete 100 tasks', requirement: 100 },
  TASKS_500: { id: 'tasks-500', name: 'Task Master', description: 'Complete 500 tasks', requirement: 500 },
  PERFECT_DAY: { id: 'perfect-day', name: 'Perfect Day', description: 'Complete all daily tasks', requirement: 1 },
  FIRST_TRACK: { id: 'first-track', name: 'Track Starter', description: 'Complete your first track', requirement: 1 },
}

// Learning Constants
export const DAILY_MINUTES_OPTIONS = [15, 30, 60]

export const LEVELS = [
  { id: 'BEGINNER', name: 'Beginner', description: 'New to coding and automation' },
  { id: 'INTERMEDIATE', name: 'Intermediate', description: 'Some coding experience' },
  { id: 'ADVANCED', name: 'Advanced', description: 'Experienced, leveling up' },
] as const

export const GOALS = [
  { id: 'become_sdet', name: 'Become an SDET', description: 'Learn full automation testing' },
  { id: 'switch_to_automation', name: 'Switch to Automation', description: 'Transition from manual QA' },
  { id: 'learn_playwright', name: 'Learn Playwright', description: 'Master Playwright automation' },
  { id: 'learn_python', name: 'Learn Python for Testing', description: 'Python scripting for QA' },
  { id: 'improve_skills', name: 'Improve Existing Skills', description: 'Level up current knowledge' },
] as const

// Task Types
export const TASK_TYPE_LABELS: Record<string, string> = {
  MCQ: 'Multiple Choice',
  TRUE_FALSE: 'True or False',
  FILL_IN_BLANK: 'Fill in the Blank',
  SHORT_ANSWER: 'Short Answer',
  CODE_COMPLETION: 'Code Completion',
  DEBUGGING: 'Debugging',
  OUTPUT_PREDICTION: 'Output Prediction',
  SCENARIO_BASED: 'Scenario Based',
  ORDERING: 'Ordering',
}

// Difficulty Labels
export const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
}

// Track Slugs (for reference)
export const TRACK_SLUGS = {
  PYTHON: 'python-for-testers',
  JAVASCRIPT: 'javascript-fundamentals',
  TYPESCRIPT: 'typescript-fundamentals',
  PLAYWRIGHT: 'playwright-automation',
  GIT: 'git-github-basics',
  JENKINS: 'jenkins-basics',
  CICD: 'cicd-fundamentals',
} as const
