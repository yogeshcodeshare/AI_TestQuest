'use client'

import { Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { calculateLevel } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface XpDisplayProps {
  totalXp: number
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function XpDisplay({ 
  totalXp, 
  showProgress = true, 
  size = 'md',
  className 
}: XpDisplayProps) {
  const { level, currentLevelXp, xpForNextLevel, progressPercent } = calculateLevel(totalXp)
  
  const sizeClasses = {
    sm: { icon: 'h-6 w-6', text: 'text-sm', label: 'text-xs' },
    md: { icon: 'h-8 w-8', text: 'text-lg', label: 'text-sm' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl', label: 'text-base' },
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg",
          sizeClasses[size].icon
        )}>
          <Zap className={cn("text-white", size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6')} />
        </div>
        <div>
          <div className={cn("font-bold", sizeClasses[size].text)}>
            Level {level}
          </div>
          <div className={cn("text-muted-foreground", sizeClasses[size].label)}>
            {totalXp.toLocaleString()} XP total
          </div>
        </div>
      </div>
      
      {showProgress && (
        <div className="space-y-1">
          <Progress 
            value={progressPercent} 
            variant="xp"
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentLevelXp} / {xpForNextLevel} XP</span>
            <span>{progressPercent}% to Level {level + 1}</span>
          </div>
        </div>
      )}
    </div>
  )
}
