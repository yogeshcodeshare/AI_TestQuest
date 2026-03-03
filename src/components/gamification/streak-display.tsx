'use client'

import { Flame, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  className?: string
}

export function StreakDisplay({ 
  currentStreak, 
  longestStreak,
  className 
}: StreakDisplayProps) {
  const isActive = currentStreak > 0
  const isRecord = currentStreak >= longestStreak && currentStreak > 0

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Streak Icon */}
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all",
            isActive 
              ? "bg-gradient-to-br from-orange-400 to-red-500 streak-fire" 
              : "bg-muted"
          )}>
            <Flame className={cn(
              "h-7 w-7",
              isActive ? "text-white" : "text-muted-foreground"
            )} />
          </div>

          {/* Streak Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-3xl font-bold",
                isActive ? "text-orange-500" : "text-muted-foreground"
              )}>
                {currentStreak}
              </span>
              <span className="text-sm text-muted-foreground">day streak</span>
              {isRecord && (
                <Trophy className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-1">
              Longest: {longestStreak} days
            </div>

            {/* Streak Status */}
            {!isActive && (
              <div className="text-xs text-orange-600 mt-2">
                Start your streak today!
              </div>
            )}
            {isActive && currentStreak < 7 && (
              <div className="text-xs text-orange-600 mt-2">
                {7 - currentStreak} days to Week Warrior badge!
              </div>
            )}
            {isActive && currentStreak >= 7 && currentStreak < 30 && (
              <div className="text-xs text-orange-600 mt-2">
                {30 - currentStreak} days to Monthly Master badge!
              </div>
            )}
          </div>
        </div>

        {/* Weekly Calendar View */}
        <div className="flex justify-between mt-4 pt-4 border-t">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium",
                i < (currentStreak % 7 || 7) && isActive
                  ? "bg-orange-100 text-orange-600"
                  : "bg-muted text-muted-foreground"
              )}>
                ✓
              </div>
              <span className="text-xs text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
