'use client'

import { Lock, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BadgeWithUnlock } from '@/types'

interface BadgeCardProps {
  badge: BadgeWithUnlock
  className?: string
}

export function BadgeCard({ badge, className }: BadgeCardProps) {
  const isUnlocked = !!badge.unlockedAt

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      isUnlocked ? "card-hover" : "opacity-60",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Badge Icon */}
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full shadow-md transition-all",
            isUnlocked
              ? `bg-gradient-to-br ${badge.color}`
              : "bg-muted"
          )}>
            {isUnlocked ? (
              <Award className="h-7 w-7 text-white" />
            ) : (
              <Lock className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {/* Badge Info */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold truncate",
              !isUnlocked && "text-muted-foreground"
            )}>
              {badge.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {badge.description}
            </p>
            
            {isUnlocked && badge.unlockedAt && (
              <p className="text-xs text-green-600 mt-2">
                Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
              </p>
            )}
            
            {!isUnlocked && (
              <p className="text-xs text-muted-foreground mt-2">
                Keep learning to unlock!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
