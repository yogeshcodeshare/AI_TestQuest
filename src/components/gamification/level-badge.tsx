'use client'

import { Star, Crown, Gem, Trophy, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

// Level tiers with icons and colors
const getLevelTier = (level: number) => {
  if (level >= 50) return { icon: Crown, color: 'from-yellow-400 via-amber-500 to-orange-500', label: 'Legend' }
  if (level >= 40) return { icon: Gem, color: 'from-purple-400 via-violet-500 to-indigo-500', label: 'Master' }
  if (level >= 30) return { icon: Trophy, color: 'from-blue-400 via-cyan-500 to-teal-500', label: 'Expert' }
  if (level >= 20) return { icon: Award, color: 'from-green-400 via-emerald-500 to-teal-500', label: 'Advanced' }
  if (level >= 10) return { icon: Star, color: 'from-orange-400 via-amber-500 to-yellow-500', label: 'Intermediate' }
  return { icon: Star, color: 'from-slate-400 via-gray-500 to-zinc-500', label: 'Beginner' }
}

export function LevelBadge({ 
  level, 
  size = 'md', 
  showLabel = false,
  className 
}: LevelBadgeProps) {
  const tier = getLevelTier(level)
  const Icon = tier.icon

  const sizeClasses = {
    sm: { container: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-xs' },
    md: { container: 'h-12 w-12', icon: 'h-6 w-6', text: 'text-sm' },
    lg: { container: 'h-16 w-16', icon: 'h-8 w-8', text: 'text-base' },
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br shadow-lg",
        tier.color,
        sizeClasses[size].container
      )}>
        <Icon className={cn("text-white", sizeClasses[size].icon)} />
      </div>
      
      {showLabel && (
        <div>
          <div className={cn("font-bold", sizeClasses[size].text)}>
            Level {level}
          </div>
          <div className="text-xs text-muted-foreground">
            {tier.label}
          </div>
        </div>
      )}
    </div>
  )
}
