import Link from 'next/link'
import { 
  Zap, 
  Target, 
  Trophy, 
  Code, 
  GitBranch, 
  Play,
  Terminal,
  CheckCircle,
  ArrowRight,
  Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Target,
    title: 'Daily Missions',
    description: 'Get personalized daily tasks (15-60 min) that fit your schedule and learning goals.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Submit answers and get immediate evaluation with detailed explanations.',
  },
  {
    icon: Trophy,
    title: 'Gamified Learning',
    description: 'Earn XP, maintain streaks, unlock badges, and level up as you learn.',
  },
]

const tracks = [
  { icon: Code, name: 'Python for Testers', color: 'bg-blue-500', description: 'Learn Python scripting for automation' },
  { icon: Terminal, name: 'JavaScript & TypeScript', color: 'bg-yellow-500', description: 'Master modern web testing languages' },
  { icon: Play, name: 'Playwright Automation', color: 'bg-green-500', description: 'Modern browser automation framework' },
  { icon: GitBranch, name: 'Git & CI/CD', color: 'bg-orange-500', description: 'Version control and pipeline basics' },
]

const steps = [
  { number: '1', title: 'Choose Your Path', description: 'Select tracks based on your goals and current level' },
  { number: '2', title: 'Complete Daily Tasks', description: 'Practice with bite-sized missions every day' },
  { number: '3', title: 'Track Progress', description: 'See your skills grow with detailed analytics' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 to-white dark:from-slate-950 dark:to-slate-900 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 dark:bg-violet-900/30 px-4 py-2 text-sm font-medium text-violet-700 dark:text-violet-300 mb-6">
              <Flame className="h-4 w-4" />
              <span>Free Forever for QA Learners</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Become an{' '}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                SDET
              </span>{' '}
              with Daily Practice
            </h1>

            {/* Subheading */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Master automation testing, Playwright, Python, and CI/CD through 
              gamified daily missions. Designed for manual testers transitioning 
              to automation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#tracks">
                <Button size="lg" variant="outline">
                  Explore Tracks
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white dark:border-slate-900"
                  />
                ))}
              </div>
              <span>Join QA learners worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Small daily practice leads to big career changes. Our platform makes 
              learning automation testing engaging and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Learning Tracks</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from multiple tracks designed specifically for QA professionals. 
              Mix and match to create your personalized learning path.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {tracks.map((track) => {
              const Icon = track.icon
              return (
                <Card key={track.name} className="card-hover overflow-hidden">
                  <div className={`h-2 ${track.color}`} />
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-lg ${track.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{track.name}</h3>
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple. Begin your transformation from manual 
              tester to automation expert today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-violet-200 to-purple-200 dark:from-violet-900 dark:to-purple-900 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-violet-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your SDET Journey?
          </h2>
          <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of QA professionals who are leveling up their automation skills. 
            Completely free, forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">TestQuest AI</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} TestQuest AI. Free for all QA learners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
