import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function calculateLevel(xp: number): { level: number; currentLevelXp: number; xpForNextLevel: number; progressPercent: number } {
  // Level formula: each level requires level * 100 XP
  // Level 1: 0-100, Level 2: 100-300, Level 3: 300-600, etc.
  let level = 1
  let totalXpForCurrentLevel = 0
  
  while (totalXpForCurrentLevel + level * 100 <= xp) {
    totalXpForCurrentLevel += level * 100
    level++
  }
  
  const currentLevelXp = xp - totalXpForCurrentLevel
  const xpForNextLevel = level * 100
  const progressPercent = Math.round((currentLevelXp / xpForNextLevel) * 100)
  
  return { level, currentLevelXp, xpForNextLevel, progressPercent }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-600 bg-green-100'
    case 'medium':
      return 'text-yellow-600 bg-yellow-100'
    case 'hard':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getResultColor(result: string): string {
  switch (result.toLowerCase()) {
    case 'correct':
      return 'text-green-600 bg-green-100 border-green-200'
    case 'partial':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    case 'incorrect':
      return 'text-red-600 bg-red-100 border-red-200'
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
