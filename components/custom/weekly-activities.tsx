'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityItem } from '@/components/custom/activity-item'
import type { Activity } from '@/data/mock-data'
import { getCurrentWeek, getWeekDates } from '@/lib/gamification'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface WeeklyActivitiesProps {
  activities: Activity[]
  onActivityStart: (activity: Activity) => void
}

export function WeeklyActivities({ activities, onActivityStart }: WeeklyActivitiesProps) {
  const currentWeek = getCurrentWeek()
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)

  // Group activities by week
  const activitiesByWeek = useMemo(() => {
    const grouped: Record<number, Activity[]> = {}
    
    for (let week = 1; week <= 18; week++) {
      grouped[week] = activities.filter(a => a.weekNumber === week).sort((a, b) => {
        // Sort by: in-progress first, then completed, then pending
        const statusOrder = { 'in-progress': 0, 'completed': 1, 'pending': 2 }
        return statusOrder[a.status] - statusOrder[b.status]
      })
    }
    
    return grouped
  }, [activities])

  // Get week stats
  const getWeekStats = (week: number) => {
    const weekActivities = activitiesByWeek[week] || []
    const completed = weekActivities.filter(a => a.status === 'completed').length
    const inProgress = weekActivities.filter(a => a.status === 'in-progress').length
    const total = weekActivities.length
    
    return { completed, inProgress, total }
  }

  const handlePrevWeek = () => {
    setSelectedWeek(Math.max(1, selectedWeek - 1))
  }

  const handleNextWeek = () => {
    setSelectedWeek(Math.min(18, selectedWeek + 1))
  }

  const { start: weekStart, end: weekEnd } = getWeekDates(selectedWeek)
  const isCurrent = selectedWeek === currentWeek
  const selectedWeekActivities = activitiesByWeek[selectedWeek] || []
  const stats = getWeekStats(selectedWeek)

  const formatDateRange = (start: Date, end: Date) => {
    return `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Semana {selectedWeek}
                {isCurrent && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    Actual
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDateRange(weekStart, weekEnd)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Week Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Actividades</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold text-success">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">En progreso</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevWeek}
              disabled={selectedWeek === 1}
              className="gap-2"
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>

            {/* Week Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
                <Button
                  key={week}
                  size="sm"
                  variant={week === selectedWeek ? 'default' : 'outline'}
                  onClick={() => setSelectedWeek(week)}
                  className={`flex-shrink-0 ${week === currentWeek ? 'ring-2 ring-orange-500' : ''}`}
                >
                  {week}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              disabled={selectedWeek === 18}
              className="gap-2"
            >
              Siguiente
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities for selected week */}
      {selectedWeekActivities.length > 0 ? (
        <div className="space-y-4">
          {/* In Progress Activities */}
          {selectedWeekActivities.filter(a => a.status === 'in-progress').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="size-3 rounded-full bg-orange-500 animate-pulse" />
                  En Progreso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedWeekActivities
                  .filter(a => a.status === 'in-progress')
                  .map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      onStart={() => onActivityStart(activity)}
                    />
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Completed Activities */}
          {selectedWeekActivities.filter(a => a.status === 'completed').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="size-3 rounded-full bg-success" />
                  Completadas ({selectedWeekActivities.filter(a => a.status === 'completed').length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedWeekActivities
                  .filter(a => a.status === 'completed')
                  .map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Pending Activities */}
          {selectedWeekActivities.filter(a => a.status === 'pending').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="size-3 rounded-full bg-muted-foreground/30" />
                  Pendientes ({selectedWeekActivities.filter(a => a.status === 'pending').length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedWeekActivities
                  .filter(a => a.status === 'pending')
                  .map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      onStart={() => onActivityStart(activity)}
                    />
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              No hay actividades programadas para esta semana
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
