import { cn } from '@/lib/utils'
import type { Level } from '@/lib/gamification'

interface LevelBadgeProps {
  level: Level
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const levelConfig = {
  Bronce: {
    bgColor: 'bg-bronze',
    textColor: 'text-bronze-foreground',
    icon: '🥉'
  },
  Plata: {
    bgColor: 'bg-silver',
    textColor: 'text-silver-foreground',
    icon: '🥈'
  },
  Oro: {
    bgColor: 'bg-gold',
    textColor: 'text-gold-foreground',
    icon: '🥇'
  }
}

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
}

export function LevelBadge({ level, size = 'md', showIcon = true }: LevelBadgeProps) {
  const config = levelConfig[level]
  
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        config.bgColor,
        config.textColor,
        sizeConfig[size]
      )}
    >
      {showIcon && <span>{config.icon}</span>}
      {level}
    </span>
  )
}
