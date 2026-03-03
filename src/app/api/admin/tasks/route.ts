import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        track: {
          select: {
            name: true,
            color: true,
          },
        },
        module: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      trackId,
      moduleId,
      type,
      difficulty,
      title,
      prompt,
      codeSnippet,
      estimatedMinutes,
      tags,
      expectedAnswer,
      explanation,
      hint,
      commonMistakes,
      options,
    } = body

    const task = await prisma.task.create({
      data: {
        trackId,
        moduleId,
        type,
        difficulty,
        title,
        prompt,
        codeSnippet,
        estimatedMinutes: estimatedMinutes || 5,
        tags: tags || [],
        expectedAnswer,
        explanation,
        hint,
        commonMistakes,
        isPublished: false,
      },
    })

    // Create options for MCQ tasks
    if (options && options.length > 0) {
      await prisma.taskOption.createMany({
        data: options.map((opt: any) => ({
          taskId: task.id,
          optionId: opt.optionId,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
