// Mock Authentication - Bypasses Supabase for local development

export const MOCK_USER = {
  id: 'mock-user-123',
  email: 'demo@example.com',
  name: 'Demo Learner',
  role: 'LEARNER' as const,
}

export const MOCK_PROFILE = {
  id: 'mock-profile-123',
  userId: 'mock-user-123',
  goal: 'become_sdet',
  level: 'INTERMEDIATE' as const,
  dailyMinutes: 30,
  totalXp: 1250,
  currentLevel: 3,
}

export const MOCK_PREFERENCES = {
  id: 'mock-pref-123',
  userId: 'mock-user-123',
  selectedTracks: ['python-for-testers', 'playwright-automation', 'git-github-basics'],
  emailReminders: false,
  streakAlerts: true,
}

// Mock auth functions
export function getMockUser() {
  return MOCK_USER
}

export function isMockAuthenticated() {
  return true // Always authenticated in mock mode
}
