'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCurrentWeek, getWeekDates } from '@/lib/gamification'
import { Calendar } from 'lucide-react'

interface WeekSelectorProps {
  selectedWeek?: number
  onWeekChange?: (week: number) => void
}

export function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const currentWeek = getCurrentWeek()
  const [internalWeek, setInternalWeek] = useState(selectedWeek || currentWeek)

  const handleWeekChange = (value: string) => {
    const week = parseInt(value)
    setInternalWeek(week)
    onWeekChange?.(week)
  }

  const displayWeek = selectedWeek !== undefined ? selectedWeek : internalWeek

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="size-4" />
        <span>Semana:</span>
      </div>
      <Select value={displayWeek.toString()} onValueChange={handleWeekChange}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Selecciona semana" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => {
            const { start, end } = getWeekDates(week)
            const isCurrent = week === currentWeek
            
            return (
              <SelectItem 
                key={week} 
                value={week.toString()}
                className={isCurrent ? 'bg-primary/10 font-semibold' : ''}
              >
                <div className="flex items-center gap-2">
                  <span>Semana {week}</span>
                  {isCurrent && (
                    <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      Actual
                    </span>
                  )}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      {displayWeek && (
        <div className="text-sm text-muted-foreground">
          {(() => {
            const { start, end } = getWeekDates(displayWeek)
            const formatDate = (date: Date) => {
              return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            }
            return `${formatDate(start)} - ${formatDate(end)}`
          })()}
        </div>
      )}
    </div>
  )
}
