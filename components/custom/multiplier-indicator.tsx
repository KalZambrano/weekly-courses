'use client'

import { cn } from '@/lib/utils'
import { getMultiplierInfo } from '@/lib/gamification'
import { Flame, Zap } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MultiplierIndicatorProps {
  streakDay: number
  className?: string
}

export function MultiplierIndicator({ streakDay, className }: MultiplierIndicatorProps) {
  const multiplierInfo = getMultiplierInfo(streakDay)
  
  const isActive = multiplierInfo.value > 1
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold transition-all",
              isActive 
                ? "bg-linear-to-r from-primary to-accent text-primary-foreground shadow-lg" 
                : "bg-muted text-muted-foreground",
              className
            )}
          >
            {isActive ? (
              <Flame className="size-5 animate-pulse" />
            ) : (
              <Zap className="size-5" />
            )}
            <span className="text-lg">{multiplierInfo.label}</span>
            {isActive && streakDay > 0 && (
              <span className="ml-1 text-sm opacity-90">
                ({streakDay} {streakDay === 1 ? 'semana' : 'semanas'})
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{multiplierInfo.description}</p>
          {isActive && streakDay > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Mantén tu racha para conservar el multiplicador
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
