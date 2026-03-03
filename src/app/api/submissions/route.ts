import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSubmission } from '@/services/evaluation-engine'
import { awardXp, updateStreak, updateUserProgress, checkAndAwardBadges } from '@/services/gamification-engine'
import { XpReason, SubmissionResult } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dailyTaskId, taskId, answer, timeSpentSeconds } = body

    // Get task details
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { options: true },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Get user from daily task
    const dailyTask = await prisma.dailyTask.findUnique({
      where: { id: dailyTaskId },
      include: { mission: true },
    })

    if (!dailyTask) {
      return NextResponse.json(
        { error: 'Daily task not found' },
        { status: 404 }
      )
    }

    const userId = dailyTask.mission.userId

    // Evaluate the submission
    const evaluation = evaluateSubmission({
      taskType: task.type,
      expectedAnswer: task.expectedAnswer,
      userAnswer: answer,
      difficulty: task.difficulty,
    })

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        userId,
        taskId,
        answer,
        result: evaluation.result,
        score: evaluation.score,
        feedback: evaluation.feedback,
        xpEarned: evaluation.xpEarned,
        timeSpentSeconds: timeSpentSeconds || 0,
      },
    })

    // Update daily task
    await prisma.dailyTask.update({
      where: { id: dailyTaskId },
      data: {
        status: 'COMPLETED',
        submissionId: submission.id,
      },
    })

    // Update mission progress
    await prisma.dailyMission.update({
      where: { id: dailyTask.missionId },
      data: {
        completedTasks: { increment: 1 },
        totalXp: { increment: evaluation.xpEarned },
      },
    })

    // Award XP and update gamification
    if (evaluation.xpEarned > 0) {
      await awardXp(
        userId,
        evaluation.xpEarned,
        evaluation.result === SubmissionResult.CORRECT 
          ? XpReason.TASK_CORRECT 
          : XpReason.TASK_PARTIAL,
        taskId,
        'task'
      )
    }

    // Update streak
    await updateStreak(userId, evaluation.xpEarned)

    // Update progress tracking
    await updateUserProgress(
      userId,
      task.trackId,
      task.moduleId,
      task.tags,
      evaluation.result
    )

    // Check for new badges
    const newBadges = await checkAndAwardBadges(userId)

    return NextResponse.json({
      submissionId: submission.id,
      result: evaluation.result,
      score: evaluation.score,
      xpEarned: evaluation.xpEarned,
      newBadges: newBadges.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
      })),
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
