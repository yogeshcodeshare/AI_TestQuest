// Core Types for TestQuest AI

import { 
  UserRole, 
  Level, 
  TaskType, 
  Difficulty, 
  MissionStatus, 
  DailyTaskStatus,
  SubmissionResult,
  ProgressEntityType,
  XpReason,
  BadgeRequirementType,
  RecommendationType
} from '@prisma/client'

// Re-export Prisma enums
export {
  UserRole,
  Level,
  TaskType,
  Difficulty,
  MissionStatus,
  DailyTaskStatus,
  SubmissionResult,
  ProgressEntityType,
  XpReason,
  BadgeRequirementType,
  RecommendationType,
}

// ==================== USER TYPES ====================

export interface UserWithProfile {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: UserRole
  profile?: UserProfile
  preferences?: UserPreferences
}

export interface UserProfile {
  id: string
  userId: string
  goal: string | null
  level: Level
  dailyMinutes: number
  totalXp: number
  currentLevel: number
}

export interface UserPreferences {
  id: string
  userId: string
  selectedTracks: string[]
  emailReminders: boolean
  streakAlerts: boolean
}

// ==================== LEARNING CONTENT TYPES ====================

export interface TrackWithModules {
  id: string
  slug: string
  name: string
  description: string
  icon: string | null
  color: string
  order: number
  isPublished: boolean
  modules: Module[]
  _count?: {
    tasks: number
  }
}

export interface Module {
  id: string
  trackId: string
  slug: string
  name: string
  description: string
  order: number
  isPublished: boolean
  hasBossChallenge: boolean
  bossChallengeDescription: string | null
  _count?: {
    tasks: number
  }
}

export interface TaskWithOptions {
  id: string
  trackId: string
  moduleId: string
  type: TaskType
  difficulty: Difficulty
  title: string
  prompt: string
  codeSnippet: string | null
  estimatedMinutes: number
  tags: string[]
  hint: string | null
  options?: TaskOption[]
  track?: {
    name: string
    color: string
  }
  module?: {
    name: string
  }
}

export interface TaskOption {
  id: string
  taskId: string
  optionId: string
  text: string
  isCorrect: boolean
}

// ==================== MISSION TYPES ====================

export interface DailyMissionWithTasks {
  id: string
  userId: string
  date: Date
  status: MissionStatus
  totalXp: number
  completedTasks: number
  totalTasks: number
  tasks: DailyTaskWithDetails[]
}

export interface DailyTaskWithDetails {
  id: string
  missionId: string
  taskId: string
  order: number
  status: DailyTaskStatus
  task: TaskWithOptions
  submissionId: string | null
}

// ==================== SUBMISSION TYPES ====================

export interface SubmissionWithTask {
  id: string
  userId: string
  taskId: string
  answer: string
  result: SubmissionResult
  score: number
  feedback: string | null
  xpEarned: number
  startedAt: Date
  submittedAt: Date
  timeSpentSeconds: number | null
  task: TaskWithOptions
}

export interface SubmissionInput {
  taskId: string
  answer: string
  timeSpentSeconds?: number
}

export interface EvaluationResult {
  result: SubmissionResult
  score: number
  feedback: string
  correctAnswer: string
  explanation: string
  commonMistakes: string | null
  xpEarned: number
}

// ==================== GAMIFICATION TYPES ====================

export interface StreakWithHistory {
  id: string
  userId: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date | null
  history: StreakDay[]
}

export interface StreakDay {
  id: string
  streakId: string
  date: Date
  completed: boolean
  xpEarned: number
}

export interface XpLogWithDetails {
  id: string
  userId: string
  amount: number
  reason: XpReason
  sourceId: string | null
  sourceType: string | null
  createdAt: Date
}

export interface BadgeWithUnlock {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  requirementType: BadgeRequirementType
  requirementValue: number
  unlockedAt?: Date
}

export interface UserBadgeWithDetails {
  id: string
  userId: string
  badgeId: string
  badge: BadgeWithUnlock
  unlockedAt: Date
}

// ==================== PROGRESS TYPES ====================

export interface UserProgressWithDetails {
  id: string
  userId: string
  entityType: ProgressEntityType
  entityId: string
  entityName: string
  totalTasks: number
  completedTasks: number
  correctAnswers: number
  accuracy: number
  masteryScore: number
  isWeakArea: boolean
  lastPracticedAt: Date | null
}

export interface UserTrackProgressWithDetails {
  id: string
  userId: string
  trackId: string
  completedModules: string[]
  completedTasks: number
  totalTasks: number
  percentComplete: number
  currentModuleId: string | null
  isCompleted: boolean
  completedAt: Date | null
  track?: {
    name: string
    color: string
  }
}

export interface DashboardStats {
  totalXp: number
  currentLevel: number
  currentStreak: number
  longestStreak: number
  totalTasksCompleted: number
  accuracy: number
  weakAreas: UserProgressWithDetails[]
  recentSubmissions: SubmissionWithTask[]
  activeTracks: UserTrackProgressWithDetails[]
}

// ==================== RECOMMENDATION TYPES ====================

export interface RecommendationWithDetails {
  id: string
  userId: string
  type: RecommendationType
  title: string
  description: string
  trackId: string | null
  moduleId: string | null
  tags: string[]
  priority: number
  isRead: boolean
  isActedUpon: boolean
  createdAt: Date
  expiresAt: Date | null
}

// ==================== ADMIN TYPES ====================

export interface AdminAuditLogWithAdmin {
  id: string
  adminId: string
  admin: {
    email: string
    name: string | null
  }
  action: string
  entityType: string
  entityId: string
  changes: Record<string, unknown> | null
  createdAt: Date
}

// ==================== FORM TYPES ====================

export interface OnboardingData {
  goal: string
  level: Level
  selectedTracks: string[]
  dailyMinutes: number
}

export interface TaskFormData {
  trackId: string
  moduleId: string
  type: TaskType
  difficulty: Difficulty
  title: string
  prompt: string
  codeSnippet?: string
  estimatedMinutes: number
  tags: string[]
  expectedAnswer: string
  explanation: string
  hint?: string
  commonMistakes?: string
  options?: {
    optionId: string
    text: string
    isCorrect: boolean
  }[]
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
