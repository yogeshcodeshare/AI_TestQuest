import { prisma } from '@/lib/prisma'
import { TaskType, Difficulty } from '@prisma/client'

interface MissionConfig {
  dailyMinutes: number
  selectedTracks: string[]
  userLevel: string
}

export async function generateDailyMission(userId: string, config: MissionConfig) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if mission already exists for today
  const existingMission = await prisma.dailyMission.findFirst({
    where: {
      userId,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      tasks: {
        include: {
          task: {
            include: {
              track: true,
              options: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (existingMission) {
    return existingMission
  }

  // Get user's progress to personalize difficulty
  const userProgress = await prisma.userProgress.findMany({
    where: { userId },
  })

  // Determine number of tasks based on daily minutes
  const taskCount = config.dailyMinutes <= 15 ? 3 : config.dailyMinutes <= 30 ? 5 : 7

  // Get track IDs from slugs
  const tracks = await prisma.track.findMany({
    where: {
      slug: { in: config.selectedTracks },
      isPublished: true,
    },
  })

  const trackIds = tracks.map(t => t.id)

  if (trackIds.length === 0) {
    throw new Error('No valid tracks selected')
  }

  // Determine difficulty distribution based on user level
  let difficulties: Difficulty[] = []
  switch (config.userLevel) {
    case 'BEGINNER':
      difficulties = [Difficulty.EASY, Difficulty.EASY, Difficulty.MEDIUM]
      break
    case 'INTERMEDIATE':
      difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.MEDIUM, Difficulty.HARD]
      break
    case 'ADVANCED':
      difficulties = [Difficulty.MEDIUM, Difficulty.HARD, Difficulty.HARD]
      break
    default:
      difficulties = [Difficulty.EASY, Difficulty.MEDIUM]
  }

  // Fetch tasks
  const tasks = await fetchDiverseTasks(trackIds, taskCount, difficulties, userId)

  // Create mission
  const mission = await prisma.dailyMission.create({
    data: {
      userId,
      date: today,
      totalTasks: tasks.length,
      tasks: {
        create: tasks.map((task, index) => ({
          taskId: task.id,
          order: index,
        })),
      },
    },
    include: {
      tasks: {
        include: {
          task: {
            include: {
              track: true,
              options: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  return mission
}

async function fetchDiverseTasks(
  trackIds: string[],
  count: number,
  difficulties: Difficulty[],
  userId: string
) {
  // Get tasks the user hasn't seen recently
  const recentSubmissions = await prisma.submission.findMany({
    where: { userId },
    select: { taskId: true },
    take: 100,
    orderBy: { createdAt: 'desc' },
  })

  const recentTaskIds = new Set(recentSubmissions.map(s => s.taskId))

  // Fetch available tasks from selected tracks
  const availableTasks = await prisma.task.findMany({
    where: {
      trackId: { in: trackIds },
      isPublished: true,
      id: { notIn: Array.from(recentTaskIds) },
    },
    include: {
      track: true,
    },
  })

  // Group by track for diversity
  const tasksByTrack = new Map<string, typeof availableTasks>()
  for (const task of availableTasks) {
    if (!tasksByTrack.has(task.trackId)) {
      tasksByTrack.set(task.trackId, [])
    }
    tasksByTrack.get(task.trackId)!.push(task)
  }

  // Select tasks ensuring track diversity
  const selectedTasks: typeof availableTasks = []
  let difficultyIndex = 0

  while (selectedTasks.length < count && availableTasks.length > 0) {
    // Rotate through tracks
    const trackIndex = selectedTasks.length % trackIds.length
    const currentTrackId = trackIds[trackIndex]
    const trackTasks = tasksByTrack.get(currentTrackId) || []

    // Find a task with appropriate difficulty
    const targetDifficulty = difficulties[difficultyIndex % difficulties.length]
    const suitableTask = trackTasks.find(t => t.difficulty === targetDifficulty)
      || trackTasks[0] // Fallback to any task from this track

    if (suitableTask) {
      selectedTasks.push(suitableTask)
      // Remove selected task from available pool
      const idx = availableTasks.findIndex(t => t.id === suitableTask.id)
      if (idx > -1) availableTasks.splice(idx, 1)
      const trackIdx = trackTasks.findIndex(t => t.id === suitableTask.id)
      if (trackIdx > -1) trackTasks.splice(trackIdx, 1)
    }

    difficultyIndex++
  }

  // Shuffle for variety
  return selectedTasks.sort(() => Math.random() - 0.5)
}
