import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Target, 
  CheckCircle2, 
  Circle,
  Clock,
  ArrowRight,
  Zap,
  Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { generateDailyMission } from '@/services/mission-generator'
import { formatDuration } from '@/lib/utils'

async function getMission(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Try to get existing mission
  let mission = await prisma.dailyMission.findFirst({
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

  // Generate new mission if none exists
  if (!mission) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true,
      },
    })

    if (!user?.profile || !user?.preferences) {
      redirect('/onboarding')
    }

    mission = await generateDailyMission(userId, {
      dailyMinutes: user.profile.dailyMinutes,
      selectedTracks: user.preferences.selectedTracks,
      userLevel: user.profile.level,
    })
  }

  return mission
}

export default async function MissionPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!dbUser) {
    redirect('/onboarding')
  }

  const mission = await getMission(dbUser.id)
  const progress = Math.round((mission.completedTasks / mission.totalTasks) * 100)
  const remainingTasks = mission.totalTasks - mission.completedTasks

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="h-8 w-8 text-violet-500" />
            Daily Mission
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-2xl font-bold">{progress}%</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {mission.completedTasks}/{mission.totalTasks}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-3" />

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="font-semibold">{mission.completedTasks}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Circle className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Remaining</div>
              <div className="font-semibold">{remainingTasks}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="h-5 w-5 text-amber-500" />
            <div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
              <div className="font-semibold">{mission.totalXp}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Est. Time</div>
              <div className="font-semibold">
                {formatDuration(mission.tasks.reduce((acc, t) => acc + t.task.estimatedMinutes, 0))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mission.tasks.map((dailyTask, index) => {
            const task = dailyTask.task
            const isCompleted = dailyTask.status === 'COMPLETED'
            const isPending = dailyTask.status === 'PENDING'

            return (
              <div key={dailyTask.id}>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                  {/* Status Indicator */}
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : isPending 
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium truncate ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      <Badge variant={task.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} className="text-xs">
                        {task.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span 
                        className="flex items-center gap-1"
                        style={{ color: task.track.color }}
                      >
                        {task.track.name}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(task.estimatedMinutes)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/mission/task/${dailyTask.id}`}>
                    <Button 
                      variant={isCompleted ? 'outline' : 'default'}
                      size="sm"
                      className={isCompleted ? '' : 'bg-gradient-to-r from-violet-600 to-purple-600'}
                    >
                      {isCompleted ? (
                        'Review'
                      ) : (
                        <>
                          Start
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
                {index < mission.tasks.length - 1 && <Separator />}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Completion Message */}
      {remainingTasks === 0 && (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Mission Complete! 🎉</h2>
            <p className="opacity-90">
              Great job! You&apos;ve completed all tasks for today. Come back tomorrow for more!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
