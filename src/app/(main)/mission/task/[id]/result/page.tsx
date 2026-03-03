'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Zap,
  Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MOCK_TASKS, MOCK_MODE } from '@/lib/mock'

export default function ResultPage() {
  const searchParams = useSearchParams()
  const userAnswer = searchParams.get('answer') || ''
  
  // Get the task ID from URL
  const taskId = typeof window !== 'undefined' 
    ? window.location.pathname.split('/')[3] 
    : 'daily-task-1'
  
  const dailyTaskIndex = parseInt(taskId.replace('daily-task-', '')) - 1
  const task = MOCK_TASKS[dailyTaskIndex] || MOCK_TASKS[0]
  
  // Simple evaluation logic
  const normalizedUser = userAnswer.toLowerCase().trim()
  const normalizedExpected = task.expectedAnswer.toLowerCase().trim()
  
  let result: 'CORRECT' | 'PARTIAL' | 'INCORRECT' = 'INCORRECT'
  let score = 0
  let xpEarned = 0
  
  if (normalizedUser === normalizedExpected) {
    result = 'CORRECT'
    score = 100
    xpEarned = task.difficulty === 'EASY' ? 10 : task.difficulty === 'MEDIUM' ? 20 : 30
  } else if (task.type === 'MCQ') {
    // For MCQ, it's either right or wrong
    result = 'INCORRECT'
    score = 0
    xpEarned = 0
  } else {
    // For text answers, check partial match
    const matchRatio = normalizedExpected.split('|').some((keyword: string) => 
      normalizedUser.includes(keyword.trim())
    ) ? 0.5 : 0
    
    if (matchRatio > 0) {
      result = 'PARTIAL'
      score = 50
      xpEarned = Math.floor((task.difficulty === 'EASY' ? 10 : task.difficulty === 'MEDIUM' ? 20 : 30) * 0.5)
    }
  }

  const isCorrect = result === 'CORRECT'
  const isPartial = result === 'PARTIAL'

  const resultConfig = {
    'CORRECT': {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
      title: 'Correct! 🎉',
      description: 'Great job! Your answer is correct.',
    },
    'PARTIAL': {
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      title: 'Partially Correct',
      description: 'Good effort! Your answer is partially correct.',
    },
    'INCORRECT': {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-200 dark:border-red-800',
      title: 'Not Quite',
      description: 'Keep learning! Review the explanation below.',
    },
  }

  const config = resultConfig[result]
  const ResultIcon = config.icon

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Mock Mode Banner */}
      {MOCK_MODE && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
            🛠️ Mock Mode - Results are simulated
          </p>
        </div>
      )}

      {/* Result Card */}
      <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full bg-white dark:bg-slate-900 ${config.color}`}>
              <ResultIcon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${config.color}`}>
                {config.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {config.description}
              </p>

              {/* Score & XP */}
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-xl font-bold">{score}%</div>
                </div>
                {xpEarned > 0 && (
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">XP Earned</div>
                      <div className="text-xl font-bold text-amber-500">+{xpEarned}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-muted-foreground mb-2">Correct Answer</h3>
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-medium text-green-800 dark:text-green-200">
                {task.expectedAnswer}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-muted-foreground mb-2">Detailed Explanation</h3>
            <p className="text-foreground leading-relaxed">
              {task.explanation}
            </p>
          </div>

          {task.commonMistakes && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">Common Mistakes</h3>
                <p className="text-foreground leading-relaxed">
                  {task.commonMistakes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Your Answer Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border ${
            isCorrect 
              ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
          }`}>
            <p className="font-mono text-sm">{userAnswer || 'No answer provided'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Link href={`/mission/task/${taskId}`}>
          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </Link>
        <Link href="/mission">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
            Continue Mission
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
