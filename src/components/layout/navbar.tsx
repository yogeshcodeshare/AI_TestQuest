'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Flame, 
  Zap, 
  Trophy,
  User,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// In real mode, fetch user data from API
const user = {
  name: 'Learner',
  avatar: null,
  streak: 5,
  xp: 1250,
  level: 3,
}

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="hidden font-bold text-xl sm:inline-block">
            TestQuest AI
          </span>
        </Link>

        {/* Gamification Stats - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {/* Streak */}
          <div className="flex items-center gap-2">
            <Flame className={cn(
              "h-5 w-5",
              user.streak > 0 ? "text-orange-500 streak-fire" : "text-muted-foreground"
            )} />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Streak</span>
              <span className="text-sm font-bold">{user.streak} days</span>
            </div>
          </div>

          {/* XP & Level */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500">
              <span className="text-xs font-bold text-white">{user.level}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Level {user.level}</span>
              <span className="text-sm font-bold text-amber-500">{user.xp} XP</span>
            </div>
          </div>

          {/* Achievements */}
          <Link href="/achievements">
            <Button variant="ghost" size="icon" className={cn(
              "relative",
              isActive('/achievements') && "bg-accent"
            )}>
              <Trophy className="h-5 w-5" />
            </Button>
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <Button variant="ghost" size="icon" className={cn(
              isActive('/profile') && "bg-accent"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs">
                  {user.name?.charAt(0) || 'L'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold">{user.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="font-bold">{user.xp} XP</span>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
            </Link>
            <Link href="/mission" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Daily Mission</Button>
            </Link>
            <Link href="/roadmap" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Roadmap</Button>
            </Link>
            <Link href="/achievements" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Achievements</Button>
            </Link>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Profile</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
