'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Target, 
  Map, 
  BarChart3, 
  Trophy,
  Settings,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mission', label: 'Daily Mission', icon: Target },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
]

const secondaryNavItems = [
  { href: '/profile', label: 'Profile', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path
    return pathname.startsWith(path)
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] flex-col border-r bg-background overflow-y-auto">
      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Daily Mission Highlight */}
        <Link href="/mission">
          <div className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors",
            isActive('/mission') 
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white" 
              : "hover:bg-accent"
          )}>
            <Target className="h-5 w-5" />
            <div className="flex flex-col">
              <span className="font-medium">Daily Mission</span>
              <span className="text-xs opacity-80">3 tasks remaining</span>
            </div>
          </div>
        </Link>

        <div className="my-4 border-t" />

        {navItems.filter(item => item.href !== '/mission').map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="p-4 border-t">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Upgrade Banner */}
      <div className="p-4 m-4 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-200 dark:border-violet-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="font-medium text-sm">Free Forever</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          TestQuest AI is completely free for all QA learners.
        </p>
      </div>
    </aside>
  )
}
