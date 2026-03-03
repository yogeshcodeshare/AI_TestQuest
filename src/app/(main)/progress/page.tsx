'use client'

import { 
  TrendingUp, 
  BarChart3,
  Target,
  Calendar,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MOCK_MODE, MOCK_STREAK, MOCK_WEAK_AREAS, MOCK_RECENT_SUBMISSIONS } from '@/lib/mock'
import { formatDate } from '@/lib/utils'

export default function ProgressPage() {
  const streak = MOCK_STREAK
  const weakAreas = MOCK_WEAK_AREAS
  const recentSubmissions = MOCK_RECENT_SUBMISSIONS

  const stats = {
    totalSubmissions: 25,
    correctSubmissions: 18,
    accuracy: 72,
  }

  const strongAreas = [
    { name: 'Python Basics', accuracy: 85 },
    { name: 'Git Commands', accuracy: 90 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your learning journey and identify areas for improvement
        </p>
      </div>

      {/* Mock Mode Banner */}
      {MOCK_MODE && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
            🛠️ Mock Mode Enabled - Using sample data
          </p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold">{stats.accuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak?.currentStreak || 0} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <Award className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Strong Areas</p>
                <p className="text-2xl font-bold">{strongAreas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weak Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <BarChart3 className="h-5 w-5" />
              Areas to Improve
            </CardTitle>
            <CardDescription>
              Topics where you need more practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakAreas.length > 0 ? (
              weakAreas.map((area) => (
                <div key={area.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{area.entityName}</span>
                    <span className="text-sm text-amber-600">
                      {Math.round(area.accuracy)}% accuracy
                    </span>
                  </div>
                  <Progress value={area.accuracy} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {area.completedTasks} of {area.totalTasks} tasks completed
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No weak areas detected!</p>
                <p className="text-sm">Keep up the good work!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strong Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Strong Areas
            </CardTitle>
            <CardDescription>
              Topics you&apos;ve mastered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {strongAreas.map((area) => (
              <div key={area.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{area.name}</span>
                  <span className="text-sm text-green-600">
                    {area.accuracy}% accuracy
                  </span>
                </div>
                <Progress value={area.accuracy} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentSubmissions.length > 0 ? (
            recentSubmissions.map((submission) => (
              <div 
                key={submission.id} 
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      submission.result === 'CORRECT' ? 'bg-green-500' :
                      submission.result === 'PARTIAL' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} 
                  />
                  <div>
                    <p className="font-medium">{submission.task.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span style={{ color: submission.task.track.color }}>
                        {submission.task.track.name}
                      </span>
                      <span>•</span>
                      <span>{submission.task.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{submission.score}%</p>
                  <p className="text-xs text-muted-foreground">
                    {submission.xpEarned > 0 && `+${submission.xpEarned} XP`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No submissions yet</p>
              <p className="text-sm">Start your daily mission to track progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
