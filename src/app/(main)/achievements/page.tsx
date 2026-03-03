'use client'

import { Trophy, Lock, Star, Flame, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MOCK_MODE, MOCK_PROFILE, MOCK_STREAK, MOCK_BADGES } from '@/lib/mock'
import { calculateLevel } from '@/lib/utils'

export default function AchievementsPage() {
  const profile = MOCK_PROFILE
  const streak = MOCK_STREAK
  const badges = MOCK_BADGES

  const unlockedCount = badges.filter(b => b.isUnlocked).length
  const levelInfo = calculateLevel(profile.totalXp)

  const stats = [
    {
      icon: Target,
      label: 'Tasks Completed',
      value: 25,
      color: 'text-blue-500',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${streak.currentStreak} days`,
      color: 'text-orange-500',
    },
    {
      icon: Star,
      label: 'Total XP',
      value: profile.totalXp,
      color: 'text-amber-500',
    },
    {
      icon: Trophy,
      label: 'Badges Earned',
      value: `${unlockedCount}/${badges.length}`,
      color: 'text-violet-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and unlock badges
        </p>
      </div>

      {/* Mock Mode Banner */}
      {MOCK_MODE && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
            🛠️ Mock Mode Enabled - Using sample data
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">Level {levelInfo.level}</p>
              <p className="text-sm text-muted-foreground">
                {levelInfo.currentLevelXp} / {levelInfo.xpForNextLevel} XP to next level
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next Level</p>
              <p className="text-xl font-bold text-amber-500">{levelInfo.level + 1}</p>
            </div>
          </div>
          <Progress value={levelInfo.progressPercent} variant="xp" className="h-3" />
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card 
              key={badge.id} 
              className={`transition-all ${
                badge.isUnlocked ? 'card-hover' : 'opacity-60'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`
                    h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0
                    ${badge.isUnlocked 
                      ? 'bg-gradient-to-br ' + badge.color
                      : 'bg-muted'
                    }
                  `}>
                    {badge.isUnlocked ? (
                      <Trophy className="h-7 w-7 text-white" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${
                      !badge.isUnlocked && 'text-muted-foreground'
                    }`}>
                      {badge.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                    {badge.isUnlocked && badge.unlockedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                    {!badge.isUnlocked && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Keep learning to unlock!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
