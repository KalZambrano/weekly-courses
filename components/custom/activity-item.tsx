//weekly-courses/components/custom/activity-item.tsx
'use client'

import { Button } from '@/components/ui/button'
import { getActivityTypeInfo, getCurrentWeek, getDayMultiplierInfo, calculatePointsWithMultiplier } from '@/lib/gamification'
import type { Activity } from '@/data/mock-data'
import { CheckCircle2, Circle, PlayCircle, Clock, Zap } from 'lucide-react'
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
  
  const currentWeek = getCurrentWeek()
  const isCurrentWeekActivity = activity.weekNumber === currentWeek
  const multiplierInfo = getDayMultiplierInfo()
  const { points: calculatedPoints } = calculatePointsWithMultiplier(activity.points, new Date())
  
  return (
    <div 
      className={cn(
        "flex items-center gap-4 rounded-lg border p-4 transition-all",
        activity.status === 'completed' && "bg-success/5 border-success/20",
        activity.status === 'in-progress' && "bg-primary/5 border-primary/20 ring-2 ring-primary/10",
        activity.status === 'pending' && "hover:bg-muted/50",
        !isCurrentWeekActivity && activity.status === 'pending' && "opacity-60"
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
          <span className="text-xs">Semana {activity.weekNumber}</span>
          {!isCurrentWeekActivity && activity.status === 'pending' && (
            <>
              <span>|</span>
              <span className="text-xs text-orange-600">Fuera de semana actual</span>
            </>
          )}
        </div>
      </div>
      
      {/* Points with multiplier */}
      <div className="flex flex-col items-end gap-1">
        {activity.status === 'pending' && isCurrentWeekActivity && (
          <div className="flex items-center gap-1 text-sm">
            <Zap className="size-3 text-orange-500" />
            <span className="font-medium text-primary">
              +{calculatedPoints} pts
            </span>
            <span className="text-xs text-orange-600 font-semibold">
              {multiplierInfo.label}
            </span>
          </div>
        )}
        {activity.status === 'pending' && !isCurrentWeekActivity && (
          <div className="flex items-center gap-1 text-sm">
            <span className="font-medium text-muted-foreground">
              +{activity.points} pts
            </span>
            <span className="text-xs text-muted-foreground">
              (Sin puntos)
            </span>
          </div>
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
    </div>
  )
}
