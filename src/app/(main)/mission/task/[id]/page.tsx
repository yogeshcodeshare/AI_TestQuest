'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Clock, 
  Lightbulb, 
  ArrowLeft, 
  Send,
  Loader2,
  Code,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'
import { TASK_TYPE_LABELS } from '@/lib/constants'
import { MOCK_TASKS } from '@/lib/mock'

interface TaskPageProps {
  params: { id: string }
}

export default function TaskPage({ params }: TaskPageProps) {
  const router = useRouter()
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Find task from mock data based on the daily task ID
  const dailyTaskIndex = parseInt(params.id.replace('daily-task-', '')) - 1
  const mockTask = MOCK_TASKS[dailyTaskIndex] || MOCK_TASKS[0]
  
  const task = {
    id: params.id,
    title: mockTask.title,
    prompt: mockTask.prompt,
    type: mockTask.type,
    difficulty: mockTask.difficulty,
    estimatedMinutes: mockTask.estimatedMinutes,
    tags: mockTask.tags,
    hint: mockTask.hint,
    codeSnippet: mockTask.codeSnippet,
    track: mockTask.track,
    options: mockTask.options,
  }

  const handleSubmit = async () => {
    if (!answer.trim()) return

    setIsSubmitting(true)
    
    try {
      // In mock mode, simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push(`/mission/task/${params.id}/result?answer=${encodeURIComponent(answer)}`)
    } catch (error) {
      console.error(error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderTaskInput = () => {
    switch (task.type) {
      case 'MCQ':
      case 'TRUE_FALSE':
        return (
          <RadioGroup value={answer} onValueChange={setAnswer} className="space-y-3">
            {task.options?.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted transition-colors">
                <RadioGroupItem value={option.optionId} id={option.optionId} />
                <Label htmlFor={option.optionId} className="flex-1 cursor-pointer">
                  <span className="font-medium text-muted-foreground mr-2">{option.optionId}.</span>
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'FILL_IN_BLANK':
      case 'SHORT_ANSWER':
        return (
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="text-lg"
          />
        )

      case 'CODE_COMPLETION':
      case 'DEBUGGING':
        return (
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="// Write your code here..."
            className="font-mono text-sm min-h-[200px]"
          />
        )

      case 'ORDERING':
        return (
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter items in order, separated by commas..."
            className="text-lg"
          />
        )

      default:
        return (
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="text-lg min-h-[150px]"
          />
        )
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link href="/mission">
        <Button variant="ghost" className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mission
        </Button>
      </Link>

      {/* Task Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={task.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>
              {task.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {TASK_TYPE_LABELS[task.type as keyof typeof TASK_TYPE_LABELS] || task.type}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span style={{ color: task.track.color }}>{task.track.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(task.estimatedMinutes)}
            </span>
          </div>
        </div>
      </div>

      {/* Task Content */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Prompt */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">{task.prompt}</p>
          </div>

          {/* Code Snippet if present */}
          {task.codeSnippet && (
            <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
              <pre className="text-slate-50 font-mono text-sm">
                <code>{task.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Answer Input */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Your Answer</Label>
            {renderTaskInput()}
          </div>

          {/* Hint Section */}
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-medium"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? 'Hide Hint' : 'Need a hint?'}
            </button>
            {showHint && (
              <p className="mt-2 text-amber-800 dark:text-amber-200 text-sm">
                {task.hint}
              </p>
            )}
          </div>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-purple-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Answer
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
