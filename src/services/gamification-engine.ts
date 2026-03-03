import { prisma } from '@/lib/prisma'
import { XpReason, SubmissionResult } from '@prisma/client'
import { XP, STREAK } from '@/lib/constants'

export async function awardXp(
  userId: string,
  amount: number,
  reason: XpReason,
  sourceId?: string,
  sourceType?: string
) {
  // Create XP log
  await prisma.xpLog.create({
    data: {
      userId,
      amount,
      reason,
      sourceId,
      sourceType,
    },
  })

  // Update user's total XP
  const profile = await prisma.userProfile.update({
    where: { userId },
    data: {
      totalXp: { increment: amount },
    },
  })

  // Check for level up
  const newLevel = calculateLevel(profile.totalXp)
  if (newLevel > profile.currentLevel) {
    await prisma.userProfile.update({
      where: { userId },
      data: { currentLevel: newLevel },
    })

    // Award level up bonus XP
    await prisma.xpLog.create({
      data: {
        userId,
        amount: newLevel * 10,
        reason: XpReason.LEVEL_UP,
      },
    })

    return { leveledUp: true, newLevel }
  }

  return { leveledUp: false, currentLevel: profile.currentLevel }
}

export async function updateStreak(userId: string, xpEarned: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let streak = await prisma.streak.findUnique({
    where: { userId },
  })

  if (!streak) {
    streak = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
      },
    })
  } else {
    const lastActivity = streak.lastActivityDate
      ? new Date(streak.lastActivityDate)
      : null

    // Check if already active today
    if (lastActivity && lastActivity.getTime() === today.getTime()) {
      // Already active today, just update the day record
      await prisma.streakDay.upsert({
        where: {
          streakId_date: {
            streakId: streak.id,
            date: today,
          },
        },
        update: {
          xpEarned: { increment: xpEarned },
        },
        create: {
          streakId: streak.id,
          date: today,
          completed: true,
          xpEarned,
        },
      })
    } else if (lastActivity && lastActivity.getTime() === yesterday.getTime()) {
      // Consecutive day - increment streak
      const newStreak = streak.currentStreak + 1
      await prisma.streak.update({
        where: { id: streak.id },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActivityDate: today,
        },
      })
    } else {
      // Streak broken - reset
      await prisma.streak.update({
        where: { id: streak.id },
        data: {
          currentStreak: 1,
          lastActivityDate: today,
        },
      })
    }

    // Create/update today's streak day
    await prisma.streakDay.upsert({
      where: {
        streakId_date: {
          streakId: streak.id,
          date: today,
        },
      },
      update: {
        completed: true,
        xpEarned: { increment: xpEarned },
      },
      create: {
        streakId: streak.id,
        date: today,
        completed: true,
        xpEarned,
      },
    })
  }

  return streak
}

export async function checkAndAwardBadges(userId: string) {
  const awardedBadges = []

  // Get user's stats
  const [profile, streak, submissionCount] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.submission.count({ where: { userId, result: SubmissionResult.CORRECT } }),
  ])

  if (!profile) return awardedBadges

  // Get all badges
  const badges = await prisma.badge.findMany()

  // Get user's existing badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  })
  const userBadgeIds = new Set(userBadges.map(ub => ub.badgeId))

  // Check each badge
  for (const badge of badges) {
    if (userBadgeIds.has(badge.id)) continue

    let shouldAward = false

    switch (badge.requirementType) {
      case 'STREAK_DAYS':
        shouldAward = (streak?.currentStreak || 0) >= badge.requirementValue
        break
      case 'TOTAL_XP':
        shouldAward = profile.totalXp >= badge.requirementValue
        break
      case 'TASKS_COMPLETED':
        shouldAward = submissionCount >= badge.requirementValue
        break
      // Add more badge types as needed
    }

    if (shouldAward) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      })
      awardedBadges.push(badge)

      // Award XP for badge unlock
      await awardXp(userId, 50, XpReason.BADGE_UNLOCK, badge.id, 'badge')
    }
  }

  return awardedBadges
}

export async function updateUserProgress(
  userId: string,
  trackId: string,
  moduleId: string,
  tags: string[],
  result: SubmissionResult
) {
  // Update track progress
  await updateTrackProgress(userId, trackId)

  // Update module progress
  await updateModuleProgress(userId, moduleId, trackId)

  // Update topic progress for each tag
  for (const tag of tags) {
    await updateTopicProgress(userId, tag, result)
  }
}

async function updateTrackProgress(userId: string, trackId: string) {
  const totalTasks = await prisma.task.count({
    where: { trackId, isPublished: true },
  })

  const completedTasks = await prisma.submission.count({
    where: {
      userId,
      task: { trackId },
      result: SubmissionResult.CORRECT,
    },
  })

  const percentComplete = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const isCompleted = completedTasks >= totalTasks && totalTasks > 0

  await prisma.userTrackProgress.upsert({
    where: {
      userId_trackId: { userId, trackId },
    },
    create: {
      userId,
      trackId,
      completedTasks,
      totalTasks,
      percentComplete,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
    update: {
      completedTasks,
      totalTasks,
      percentComplete,
      isCompleted,
      completedAt: isCompleted && !await prisma.userTrackProgress.findFirst({
        where: { userId, trackId, isCompleted: true }
      }) ? new Date() : undefined,
    },
  })
}

async function updateModuleProgress(userId: string, moduleId: string, trackId: string) {
  const totalTasks = await prisma.task.count({
    where: { moduleId, isPublished: true },
  })

  const completedTasks = await prisma.submission.count({
    where: {
      userId,
      task: { moduleId },
      result: SubmissionResult.CORRECT,
    },
  })

  // Mark module as completed if all tasks done
  if (completedTasks >= totalTasks && totalTasks > 0) {
    await prisma.userTrackProgress.updateMany({
      where: { userId, trackId },
      data: {
        completedModules: {
          push: moduleId,
        },
      },
    })
  }
}

async function updateTopicProgress(userId: string, topic: string, result: SubmissionResult) {
  const existing = await prisma.userProgress.findFirst({
    where: {
      userId,
      entityType: 'TOPIC',
      entityId: topic,
    },
  })

  if (existing) {
    const newTotal = existing.totalTasks + 1
    const newCorrect = existing.correctAnswers + (result === SubmissionResult.CORRECT ? 1 : result === SubmissionResult.PARTIAL ? 0.5 : 0)
    const newAccuracy = (newCorrect / newTotal) * 100

    await prisma.userProgress.update({
      where: { id: existing.id },
      data: {
        totalTasks: newTotal,
        correctAnswers: newCorrect,
        accuracy: newAccuracy,
        isWeakArea: newAccuracy < 60,
        lastPracticedAt: new Date(),
      },
    })
  } else {
    await prisma.userProgress.create({
      data: {
        userId,
        entityType: 'TOPIC',
        entityId: topic,
        entityName: topic,
        totalTasks: 1,
        correctAnswers: result === SubmissionResult.CORRECT ? 1 : result === SubmissionResult.PARTIAL ? 0.5 : 0,
        accuracy: result === SubmissionResult.CORRECT ? 100 : result === SubmissionResult.PARTIAL ? 50 : 0,
        isWeakArea: result !== SubmissionResult.CORRECT,
        lastPracticedAt: new Date(),
      },
    })
  }
}

function calculateLevel(totalXp: number): number {
  let level = 1
  let totalXpForCurrentLevel = 0

  while (totalXpForCurrentLevel + level * 100 <= totalXp) {
    totalXpForCurrentLevel += level * 100
    level++
  }

  return level
}
