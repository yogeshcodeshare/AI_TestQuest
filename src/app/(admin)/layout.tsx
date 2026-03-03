import Link from 'next/link'
import { redirect } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText,
  BarChart3,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function checkAdminAccess(email: string | undefined) {
  if (!email) return false
  
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  })

  return user?.role === 'ADMIN' || user?.role === 'CONTENT_MANAGER'
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tracks', label: 'Tracks', icon: BookOpen },
  { href: '/admin/tasks', label: 'Tasks', icon: FileText },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = await checkAdminAccess(user?.email)

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="flex h-14 items-center px-4 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            Admin Panel
          </Link>
          <div className="ml-auto">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
