import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Lock, 
  CheckCircle2, 
  PlayCircle,
  ChevronRight,
  Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function getTracks(userId: string) {
  const tracks = await prisma.track.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { tasks: true },
          },
        },
      },
    },
    orderBy: { order: 'asc' },
  })

  // Get user progress for each track
  const trackProgress = await prisma.userTrackProgress.findMany({
    where: { userId },
  })

  const progressMap = new Map(trackProgress.map(p => [p.trackId, p]))

  return tracks.map(track => ({
    ...track,
    progress: progressMap.get(track.id) || null,
  }))
}

export default async function RoadmapPage() {
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

  const tracks = await getTracks(dbUser.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          Your personalized path to becoming an SDET
        </p>
      </div>

      {/* Track Tabs */}
      <Tabs defaultValue={tracks[0]?.id} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2">
          {tracks.map((track) => (
            <TabsTrigger 
              key={track.id} 
              value={track.id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: track.color }}
              />
              {track.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tracks.map((track) => (
          <TabsContent key={track.id} value={track.id} className="space-y-6">
            {/* Track Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{track.name}</CardTitle>
                    <CardDescription className="mt-2 max-w-2xl">
                      {track.description}
                    </CardDescription>
                  </div>
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: track.color }}
                  >
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">
                      {Math.round(track.progress?.percentComplete || 0)}%
                    </span>
                  </div>
                  <Progress 
                    value={track.progress?.percentComplete || 0} 
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground">
                    {track.progress?.completedTasks || 0} of{' '}
                    {track.modules.reduce((acc, m) => acc + m._count.tasks, 0)} tasks completed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Modules</h2>
              
              {track.modules.map((module, index) => {
                const isLocked = index > 0 && !track.progress?.completedModules.includes(track.modules[index - 1].id)
                const isCompleted = track.progress?.completedModules.includes(module.id)
                const isCurrent = !isLocked && !isCompleted

                return (
                  <Card 
                    key={module.id} 
                    className={`transition-all ${
                      isLocked ? 'opacity-60' : 'card-hover'
                    } ${isCurrent ? 'border-violet-500 border-2' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Status Icon */}
                        <div className={`
                          h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0
                          ${isCompleted ? 'bg-green-100 text-green-600' : ''}
                          ${isCurrent ? 'bg-violet-100 text-violet-600' : ''}
                          ${isLocked ? 'bg-muted text-muted-foreground' : ''}
                        `}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : isLocked ? (
                            <Lock className="h-6 w-6" />
                          ) : (
                            <PlayCircle className="h-6 w-6" />
                          )}
                        </div>

                        {/* Module Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{module.name}</h3>
                            {isCurrent && (
                              <Badge className="bg-violet-100 text-violet-700">Current</Badge>
                            )}
                            {module.hasBossChallenge && (
                              <Badge variant="secondary">Boss Challenge</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {module._count.tasks} tasks
                          </p>
                        </div>

                        {/* Action */}
                        {!isLocked && (
                          <Link href={`/roadmap/module/${module.id}`}>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        )}
                      </div>

                      {module.hasBossChallenge && module.bossChallengeDescription && (
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                            <Trophy className="h-4 w-4" />
                            <span className="font-medium text-sm">Boss Challenge</span>
                          </div>
                          <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                            {module.bossChallengeDescription}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
