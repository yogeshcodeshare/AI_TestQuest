'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Target, 
  Code, 
  GitBranch, 
  Play,
  Terminal,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Level } from '@prisma/client'
import { GOALS, DAILY_MINUTES_OPTIONS, LEVELS } from '@/lib/constants'

const TRACKS = [
  { id: 'python', name: 'Python for Testers', icon: Code, color: 'bg-blue-500', description: 'Learn Python scripting for test automation' },
  { id: 'javascript', name: 'JavaScript Fundamentals', icon: Terminal, color: 'bg-yellow-500', description: 'Modern JS for web testing' },
  { id: 'typescript', name: 'TypeScript Fundamentals', icon: Code, color: 'bg-blue-600', description: 'Type-safe automation code' },
  { id: 'playwright', name: 'Playwright Automation', icon: Play, color: 'bg-green-500', description: 'Modern browser automation' },
  { id: 'git', name: 'Git & GitHub Basics', icon: GitBranch, color: 'bg-orange-500', description: 'Version control for testers' },
  { id: 'jenkins', name: 'Jenkins Basics', icon: Target, color: 'bg-red-500', description: 'CI/CD pipeline fundamentals' },
  { id: 'cicd', name: 'CI/CD Fundamentals', icon: Sparkles, color: 'bg-purple-500', description: 'Continuous Integration/Deployment' },
]

const STEPS = [
  { id: 'goal', title: 'Your Goal', description: 'What do you want to achieve?' },
  { id: 'level', title: 'Your Level', description: 'Where are you starting from?' },
  { id: 'tracks', title: 'Choose Tracks', description: 'What do you want to learn?' },
  { id: 'time', title: 'Daily Time', description: 'How much time can you commit?' },
  { id: 'confirm', title: 'Ready!', description: 'Review and start learning' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    goal: '',
    level: '' as Level | '',
    selectedTracks: [] as string[],
    dailyMinutes: 30,
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: user.email,
        }),
      })

      if (!response.ok) throw new Error('Failed to save onboarding')

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!formData.goal
      case 1: return !!formData.level
      case 2: return formData.selectedTracks.length > 0
      case 3: return !!formData.dailyMinutes
      default: return true
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                index <= currentStep 
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  : "bg-muted text-muted-foreground"
              )}>
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{STEPS[currentStep].title}</h1>
          <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Goal */}
          {currentStep === 0 && (
            <div className="grid gap-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setFormData({ ...formData, goal: goal.id })}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
                    formData.goal === goal.id
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                      : "border-muted hover:border-violet-200"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center",
                    formData.goal === goal.id
                      ? "border-violet-500 bg-violet-500"
                      : "border-muted-foreground"
                  )}>
                    {formData.goal === goal.id && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Level */}
          {currentStep === 1 && (
            <div className="grid gap-4">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setFormData({ ...formData, level: level.id as Level })}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
                    formData.level === level.id
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                      : "border-muted hover:border-violet-200"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center",
                    formData.level === level.id
                      ? "border-violet-500 bg-violet-500"
                      : "border-muted-foreground"
                  )}>
                    {formData.level === level.id && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{level.name}</h3>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Tracks */}
          {currentStep === 2 && (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground mb-2">
                Select at least one track to get started. You can add more later.
              </p>
              {TRACKS.map((track) => {
                const Icon = track.icon
                const isSelected = formData.selectedTracks.includes(track.id)
                
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      const newTracks = isSelected
                        ? formData.selectedTracks.filter(t => t !== track.id)
                        : [...formData.selectedTracks, track.id]
                      setFormData({ ...formData, selectedTracks: newTracks })
                    }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all",
                      isSelected
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                        : "border-muted hover:border-violet-200"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      isSelected
                        ? "border-violet-500 bg-violet-500"
                        : "border-muted-foreground"
                    )}>
                      {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", track.color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{track.name}</h3>
                      <p className="text-sm text-muted-foreground">{track.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 4: Time */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                How much time can you dedicate to learning each day?
              </p>
              <div className="grid gap-3">
                {DAILY_MINUTES_OPTIONS.map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setFormData({ ...formData, dailyMinutes: minutes })}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all",
                      formData.dailyMinutes === minutes
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                        : "border-muted hover:border-violet-200"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      formData.dailyMinutes === minutes
                        ? "border-violet-500 bg-violet-500"
                        : "border-muted-foreground"
                    )}>
                      {formData.dailyMinutes === minutes && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{minutes} minutes</h3>
                      <p className="text-sm text-muted-foreground">
                        {minutes === 15 && "Quick daily practice"}
                        {minutes === 30 && "Balanced learning"}
                        {minutes === 60 && "Deep dive sessions"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2">You&apos;re all set!</h2>
                <p className="text-muted-foreground">Here&apos;s your learning plan:</p>
              </div>

              <div className="space-y-3 bg-muted rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="font-medium">
                    {GOALS.find(g => g.id === formData.goal)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Starting Level</span>
                  <span className="font-medium">
                    {LEVELS.find(l => l.id === formData.level)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracks</span>
                  <span className="font-medium">{formData.selectedTracks.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Time</span>
                  <span className="font-medium">{formData.dailyMinutes} minutes</span>
                </div>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                You can always change these settings later in your profile.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-violet-600 to-purple-600"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-violet-600 to-purple-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
