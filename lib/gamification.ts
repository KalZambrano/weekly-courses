//weekly-courses/lib/gamification.ts
export type Level = 'Bronce' | 'Plata' | 'Oro'

export interface MultiplierInfo {
  value: number
  label: string
  description: string
}

// Get day multiplier based on day of week (Monday-Thursday: x1.5, Friday-Sunday: x1)
export const getDayMultiplier = (): number => {
  const day = new Date().getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Monday (1) to Thursday (4): x1.5
  if (day >= 1 && day <= 4) return 1.5
  // Friday (5), Saturday (6), Sunday (0): x1
  return 1
}

// Get day name for display
export const getDayName = (): string => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return days[new Date().getDay()]
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

// Week calculation functions
const SEMESTER_START_DATE = new Date('2026-03-23') // March 23, 2026 - Week 1 start
export const TOTAL_WEEKS = 18

// Get current week number (1-18)
export const getCurrentWeek = (): number => {
  const now = new Date()
  const diffTime = now.getTime() - SEMESTER_START_DATE.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const currentWeek = Math.floor(diffDays / 7) + 1
  return Math.min(Math.max(1, currentWeek), TOTAL_WEEKS)
}

// Get start and end dates for a specific week
export const getWeekDates = (weekNumber: number): { start: Date; end: Date } => {
  const startDate = new Date(SEMESTER_START_DATE)
  startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7)
  
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)
  
  return { start: startDate, end: endDate }
}

// Check if a date is within the current week
export const isCurrentWeek = (date: Date): boolean => {
  const currentWeek = getCurrentWeek()
  const { start, end } = getWeekDates(currentWeek)
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  const startDate = new Date(start)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(end)
  endDate.setHours(23, 59, 59, 999)
  
  return checkDate >= startDate && checkDate <= endDate
}

// Calculate points with day multiplier and week validation
export const calculatePointsWithMultiplier = (basePoints: number, activityDate?: Date): { points: number; multiplier: number; isCurrentWeek: boolean } => {
  const dayMultiplier = getDayMultiplier()
  const isCurrentWeekActivity = activityDate ? isCurrentWeek(activityDate) : true
  
  // Only apply multiplier if it's current week
  const finalMultiplier = isCurrentWeekActivity ? dayMultiplier : 0
  const points = Math.round(basePoints * finalMultiplier)
  
  return {
    points,
    multiplier: dayMultiplier,
    isCurrentWeek: isCurrentWeekActivity
  }
}

// Complete activity: mark activity completed, award points (only if in current week), update student and ranking
import { courses, currentStudent, ranking, recentActivities, allStudents } from '@/data/mock-data'

export const completeActivity = (courseId: string, activityId: string, activityDate?: Date) => {
  const course = courses.find(c => c.id === courseId)
  if (!course) return { awarded: 0, message: 'Curso no encontrado' }

  const activity = course.activities.find(a => a.id === activityId)
  if (!activity) return { awarded: 0, message: 'Actividad no encontrada' }

  if (activity.status === 'completed') return { awarded: 0, message: 'Actividad ya completada' }

  const now = activityDate || new Date()
  activity.status = 'completed'
  activity.completedAt = now.toISOString()

  const { points, multiplier, isCurrentWeek: isCurrent } = calculatePointsWithMultiplier(activity.points, now)

  // Update current student only if it's the current week (points > 0)
  if (points > 0) {
    currentStudent.points += points
    // update level
    currentStudent.level = getLevel(currentStudent.points)
  }

  // Update course progress
  const completedCount = course.activities.filter(a => a.status === 'completed').length
  course.completedActivities = completedCount
  course.progress = Math.round((completedCount / course.totalActivities) * 100)

  // Update ranking array
  const studentRank = ranking.find(r => r.id === currentStudent.id)
  if (studentRank) {
    studentRank.points += points
  } else {
    ranking.push({ id: currentStudent.id, name: currentStudent.name, avatar: currentStudent.avatar, points: currentStudent.points, level: currentStudent.level, position: ranking.length + 1 })
  }

  // Re-sort ranking and update positions
  ranking.sort((a, b) => b.points - a.points)
  ranking.forEach((r, idx) => { r.position = idx + 1 })

  // Update allStudents global list if present
  const s = allStudents.find(st => st.id === currentStudent.id)
  if (s) s.points = currentStudent.points

  // Add to recent activities
  recentActivities.unshift({
    id: `${Date.now()}`,
    courseName: course.name,
    activityName: activity.name,
    type: activity.type,
    points: points,
    completedAt: now.toISOString()
  })

  // Keep recentActivities reasonable length
  if (recentActivities.length > 20) recentActivities.splice(20)

  return {
    awarded: points,
    multiplier,
    isCurrentWeek: isCurrent,
    message: points > 0 ? 'Puntos otorgados' : 'Material fuera de la semana actual - no hay puntos'
  }
}

// Get day multiplier info for display
export const getDayMultiplierInfo = (): MultiplierInfo => {
  const value = getDayMultiplier()
  
  if (value === 1.5) {
    return {
      value: 1.5,
      label: 'x1.5',
      description: 'Día de semana - 50% más puntos'
    }
  }
  
  return {
    value: 1,
    label: 'x1',
    description: 'Fin de semana - Puntos normales'
  }
}
