import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, FileText, Trophy } from 'lucide-react'

async function getAdminStats() {
  const [
    totalUsers,
    totalTracks,
    totalTasks,
    totalSubmissions,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.track.count(),
    prisma.task.count(),
    prisma.submission.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    }),
  ])

  return {
    totalUsers,
    totalTracks,
    totalTasks,
    totalSubmissions,
    recentUsers,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users },
    { label: 'Tracks', value: stats.totalTracks, icon: BookOpen },
    { label: 'Tasks', value: stats.totalTasks, icon: FileText },
    { label: 'Submissions', value: stats.totalSubmissions, icon: Trophy },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of platform metrics and activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <Icon className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{user.name || 'Unnamed'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {stats.recentUsers.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No users yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
