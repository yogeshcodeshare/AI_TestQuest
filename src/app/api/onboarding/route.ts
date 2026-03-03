import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Level } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, goal, level, selectedTracks, dailyMinutes } = body

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
        },
      })
    }

    // Create or update profile
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        goal,
        level: level as Level,
        dailyMinutes,
      },
      update: {
        goal,
        level: level as Level,
        dailyMinutes,
      },
    })

    // Create or update preferences
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        selectedTracks,
      },
      update: {
        selectedTracks,
      },
    })

    // Initialize streak
    await prisma.streak.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
      },
      update: {},
    })

    // Initialize track progress for selected tracks
    for (const trackId of selectedTracks) {
      const track = await prisma.track.findUnique({
        where: { slug: trackId },
      })

      if (track) {
        await prisma.userTrackProgress.upsert({
          where: {
            userId_trackId: {
              userId: user.id,
              trackId: track.id,
            },
          },
          create: {
            userId: user.id,
            trackId: track.id,
            totalTasks: await prisma.task.count({
              where: { trackId: track.id, isPublished: true },
            }),
          },
          update: {},
        })
      }
    }

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
