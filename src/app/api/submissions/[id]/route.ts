import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: {
        task: {
          select: {
            title: true,
            expectedAnswer: true,
            explanation: true,
            commonMistakes: true,
          },
        },
        dailyTask: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: submission.id,
      result: submission.result,
      score: submission.score,
      xpEarned: submission.xpEarned,
      answer: submission.answer,
      feedback: submission.feedback,
      task: submission.task,
      dailyTaskId: submission.dailyTask?.id,
    })
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}
