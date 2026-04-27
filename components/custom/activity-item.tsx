'use client'

import { Button } from '@/components/ui/button'
import { getActivityTypeInfo } from '@/lib/gamification'
import type { Activity } from '@/data/mock-data'
import { CheckCircle2, Circle, PlayCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItemProps {
  activity: Activity
  onStart?: () => void
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: 'Completado',
    className: 'text-success'
  },
  'in-progress': {
    icon: PlayCircle,
    label: 'En progreso',
    className: 'text-primary'
  },
  pending: {
    icon: Circle,
    label: 'Pendiente',
    className: 'text-muted-foreground'
  }
}

export function ActivityItem({ activity, onStart }: ActivityItemProps) {
  const typeInfo = getActivityTypeInfo(activity.type)
  const status = statusConfig[activity.status]
  const StatusIcon = status.icon
  
  return (
    <div 
      className={cn(
        "flex items-center gap-4 rounded-lg border p-4 transition-all",
        activity.status === 'completed' && "bg-success/5 border-success/20",
        activity.status === 'in-progress' && "bg-primary/5 border-primary/20 ring-2 ring-primary/10",
        activity.status === 'pending' && "hover:bg-muted/50"
      )}
    >
      {/* Status Icon */}
      <StatusIcon className={cn("size-6 shrink-0", status.className)} />
      
      {/* Activity Type Badge */}
      <div className={`rounded-lg p-2 ${typeInfo.color}`}>
        <span className="text-lg">{typeInfo.icon}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium",
          activity.status === 'completed' && "line-through text-muted-foreground"
        )}>
          {activity.name}
        </p>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {activity.duration}
          </span>
          <span>|</span>
          <span className="font-medium text-primary">+{activity.points} pts</span>
        </div>
      </div>
      
      {/* Action */}
      {activity.status === 'pending' && (
        <Button size="sm" onClick={onStart}>
          Iniciar
        </Button>
      )}
      {activity.status === 'in-progress' && (
        <Button size="sm" variant="secondary" onClick={onStart}>
          Continuar
        </Button>
      )}
      {activity.status === 'completed' && activity.completedAt && (
        <div className="text-right">
          <p className="text-sm font-medium text-success">+{activity.points}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(activity.completedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short'
            })}
          </p>
        </div>
      )}
    </div>
  )
}
