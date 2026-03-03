'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Check if environment variables are available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing. Please check environment variables.')
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setIsSent(true)
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Zap className="h-7 w-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue your SDET journey
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Check your email</h3>
              <p className="text-muted-foreground mt-1">
                We sent a magic link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Click the link to sign in instantly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              We&apos;ll email you a magic link for a password-free sign in.
            </p>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-violet-600 hover:text-violet-500">
            Create one
          </Link>
        </div>
        <Link href="/" className="text-center text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </CardFooter>
    </Card>
  )
}
