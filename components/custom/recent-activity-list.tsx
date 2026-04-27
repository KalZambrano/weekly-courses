import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActivityTypeInfo } from '@/lib/gamification'
import type { RecentActivity } from '@/data/mock-data'
import { Clock } from 'lucide-react'

interface RecentActivityListProps {
  activities: RecentActivity[]
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="size-5 text-primary" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const typeInfo = getActivityTypeInfo(activity.type)
          
          return (
            <div 
              key={activity.id}
              className="flex items-center gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
            >
              <div className={`rounded-lg p-2 ${typeInfo.color}`}>
                <span className="text-lg">{typeInfo.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.activityName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.courseName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">+{activity.points}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.completedAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
