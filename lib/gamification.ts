export type Level = 'Bronce' | 'Plata' | 'Oro'

export interface MultiplierInfo {
  value: number
  label: string
  description: string
}

// Get multiplier based on streak day
export const getMultiplier = (streakDay: number): number => {
  if (streakDay >= 1 && streakDay <= 3) return 2
  if (streakDay >= 4 && streakDay <= 5) return 1.5
  return 1
}

// Get multiplier info for display
export const getMultiplierInfo = (streakDay: number): MultiplierInfo => {
  const value = getMultiplier(streakDay)
  
  if (value === 2) {
    return {
      value: 2,
      label: 'x2',
      description: 'Racha inicial - Puntos dobles'
    }
  }
  
  if (value === 1.5) {
    return {
      value: 1.5,
      label: 'x1.5',
      description: 'Racha activa - 50% más puntos'
    }
  }
  
  return {
    value: 1,
    label: 'x1',
    description: 'Sin racha activa'
  }
}

// Calculate points with multiplier
export const calculatePoints = (basePoints: number, streakDay: number): number => {
  const multiplier = getMultiplier(streakDay)
  return Math.round(basePoints * multiplier)
}

// Determine level based on total points
export const getLevel = (points: number): Level => {
  if (points >= 3000) return 'Oro'
  if (points >= 1500) return 'Plata'
  return 'Bronce'
}

// Get level info for display
export const getLevelInfo = (level: Level) => {
  const levels = {
    Bronce: {
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-300',
      icon: '🥉',
      minPoints: 0,
      maxPoints: 1499,
      nextLevel: 'Plata' as Level | null
    },
    Plata: {
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-300',
      icon: '🥈',
      minPoints: 1500,
      maxPoints: 2999,
      nextLevel: 'Oro' as Level | null
    },
    Oro: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      icon: '🥇',
      minPoints: 3000,
      maxPoints: Infinity,
      nextLevel: null
    }
  }
  
  return levels[level]
}

// Calculate progress to next level
export const getProgressToNextLevel = (points: number, currentLevel: Level): number => {
  const levelInfo = getLevelInfo(currentLevel)
  
  if (!levelInfo.nextLevel) return 100 // Already at max level
  
  const pointsInLevel = points - levelInfo.minPoints
  const levelRange = levelInfo.maxPoints - levelInfo.minPoints + 1
  
  return Math.min(100, Math.round((pointsInLevel / levelRange) * 100))
}

// Get points needed for next level
export const getPointsToNextLevel = (points: number, currentLevel: Level): number | null => {
  const levelInfo = getLevelInfo(currentLevel)
  
  if (!levelInfo.nextLevel) return null // Already at max level
  
  return levelInfo.maxPoints + 1 - points
}

// Format large numbers
export const formatPoints = (points: number): string => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`
  }
  return points.toString()
}

// Get random motivational message
export const getMotivationalMessage = (messages: string[]): string => {
  const randomIndex = Math.floor(Math.random() * messages.length)
  return messages[randomIndex]
}

// Activity type icons
export const getActivityTypeInfo = (type: 'quiz' | 'exercise' | 'video' | 'reading') => {
  const types = {
    quiz: { label: 'Quiz', icon: '📝', color: 'text-blue-600 bg-blue-100' },
    exercise: { label: 'Ejercicio', icon: '✏️', color: 'text-green-600 bg-green-100' },
    video: { label: 'Video', icon: '🎬', color: 'text-red-600 bg-red-100' },
    reading: { label: 'Lectura', icon: '📖', color: 'text-orange-600 bg-orange-100' }
  }
  
  return types[type]
}
