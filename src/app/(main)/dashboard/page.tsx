import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Target, 
  ArrowRight, 
  BookOpen,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { XpDisplay } from '@/components/gamification/xp-display'
import { StreakDisplay } from '@/components/gamification/streak-display'
import { LevelBadge } from '@/components/gamification/level-badge'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function getUserData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      profile: true,
      preferences: true,
    },
  })

  return dbUser
}

async function getTodayMission(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const mission = await prisma.dailyMission.findFirst({
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

async function getStreak(userId: string) {
  const streak = await prisma.streak.findUnique({
    where: { userId },
  })
  return streak
}

async function getUserProgress(userId: string) {
  const progress = await prisma.userProgress.findMany({
    where: {
      userId,
      isWeakArea: true,
    },
    orderBy: {
      accuracy: 'asc',
    },
    take: 3,
  })
  return progress
}

async function getTrackProgress(userId: string) {
  const progress = await prisma.userTrackProgress.findMany({
    where: { userId },
    include: {
      track: true,
    },
    orderBy: {
      percentComplete: 'desc',
    },
    take: 3,
  })
  return progress
}

export default async function DashboardPage() {
  let userData
  try {
    userData = await getUserData()
  } catch (error: any) {
    if (error?.message?.includes('Missing Supabase')) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Configuration Error</h1>
          <p className="text-muted-foreground">{error.message}</p>
          <p className="text-sm text-muted-foreground">Please check your environment variables in Vercel.</p>
        </div>
      )
    }
    throw error
  }

  if (!userData) {
    redirect('/login')
  }

  // If user hasn't completed onboarding, redirect there
  if (!userData.profile) {
    redirect('/onboarding')
  }

  const [mission, streak, weakAreas, trackProgress] = await Promise.all([
    getTodayMission(userData.id),
    getStreak(userData.id),
    getUserProgress(userData.id),
    getTrackProgress(userData.id),
  ])

  const profile = userData.profile!
  const remainingTasks = mission ? mission.totalTasks - mission.completedTasks : 0

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {userData.name || 'Learner'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to continue your SDET journey today?
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <XpDisplay 
          totalXp={profile.totalXp} 
          showProgress 
          size="md"
        />
        <StreakDisplay 
          currentStreak={streak?.currentStreak || 0}
          longestStreak={streak?.longestStreak || 0}
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LevelBadge level={profile.currentLevel} size="lg" showLabel />
          </CardContent>
        </Card>
      </div>

      {/* Daily Mission CTA */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-600/10" />
        <CardContent className="relative p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Daily Mission</h2>
                <p className="text-muted-foreground">
                  {mission ? (
                    remainingTasks > 0 ? (
                      <>{remainingTasks} tasks remaining today</>
                    ) : (
                      <>All tasks completed! 🎉</>
                    )
                  ) : (
                    <>No mission generated yet</>
                  )}
                </p>
              </div>
            </div>
            <Link href="/mission">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600">
                {mission && remainingTasks === 0 ? (
                  <>
                    Review Mission
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue Mission
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </Link>
          </div>
          
          {mission && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round((mission.completedTasks / mission.totalTasks) * 100)}%</span>
              </div>
              <Progress 
                value={(mission.completedTasks / mission.totalTasks) * 100} 
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Track Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Tracks</CardTitle>
                <CardDescription>Progress in your learning paths</CardDescription>
              </div>
              <Link href="/roadmap">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {trackProgress.length > 0 ? (
              trackProgress.map((progress) => (
                <div key={progress.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: progress.track.color }}
                      />
                      <span className="font-medium">{progress.track.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progress.percentComplete)}%
                    </span>
                  </div>
                  <Progress value={progress.percentComplete} className="h-2" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tracks started yet</p>
                <Link href="/roadmap">
                  <Button variant="link" className="mt-2">
                    Start your first track
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak Areas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Areas to Improve</CardTitle>
                <CardDescription>Topics that need more practice</CardDescription>
              </div>
              <Link href="/progress">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakAreas.length > 0 ? (
              weakAreas.map((area) => (
                <div 
                  key={area.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-sm">{area.entityName}</p>
                      <p className="text-xs text-muted-foreground">
                        Accuracy: {Math.round(area.accuracy)}%
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-xs">
                    Practice
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Great job! No weak areas detected</p>
                <p className="text-sm mt-1">Keep up the good work!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
