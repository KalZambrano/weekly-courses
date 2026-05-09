//weekly-courses/app/(dashboard)/teacher/metrics/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { allStudents, courses, teacherMetrics, ranking } from '@/data/mock-data'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Trophy,
  Target,
  Flame,
  BookOpen,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TeacherMetricsPage() {
  // Calculate additional metrics
  const avgStreak = allStudents.reduce((sum, s) => sum + s.streak, 0) / allStudents.length
  const avgPoints = allStudents.reduce((sum, s) => sum + s.points, 0) / allStudents.length
  const totalActivitiesCompleted = courses.reduce((sum, c) => sum + c.completedActivities, 0)
  const totalActivities = courses.reduce((sum, c) => sum + c.totalActivities, 0)
  
  // Level distribution for chart
  const levelCounts = {
    Oro: allStudents.filter(s => s.level === 'Oro').length,
    Plata: allStudents.filter(s => s.level === 'Plata').length,
    Bronce: allStudents.filter(s => s.level === 'Bronce').length
  }
  
  // Progress distribution
  const progressRanges = [
    { label: '0-25%', count: allStudents.filter(s => s.progress <= 25).length, color: 'bg-red-500' },
    { label: '26-50%', count: allStudents.filter(s => s.progress > 25 && s.progress <= 50).length, color: 'bg-orange-500' },
    { label: '51-75%', count: allStudents.filter(s => s.progress > 50 && s.progress <= 75).length, color: 'bg-yellow-500' },
    { label: '76-100%', count: allStudents.filter(s => s.progress > 75).length, color: 'bg-green-500' }
  ]
  
  // Streak distribution
  const streakRanges = [
    { label: 'Sin racha', count: allStudents.filter(s => s.streak === 0).length },
    { label: '1-3 días', count: allStudents.filter(s => s.streak >= 1 && s.streak <= 3).length },
    { label: '4-7 días', count: allStudents.filter(s => s.streak >= 4 && s.streak <= 7).length },
    { label: '8+ días', count: allStudents.filter(s => s.streak >= 8).length }
  ]
  
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="size-8 text-primary" />
          Métricas y Análisis
        </h1>
        <p className="mt-2 text-muted-foreground">
          Estadísticas detalladas del rendimiento estudiantil
        </p>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estudiantes Activos</p>
                <p className="text-2xl font-bold">
                  {allStudents.filter(s => s.streak > 0).length}/{allStudents.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gold/10 p-3">
                <Trophy className="size-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio de Puntos</p>
                <p className="text-2xl font-bold">{avgPoints.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Flame className="size-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Racha Promedio</p>
                <p className="text-2xl font-bold">{avgStreak.toFixed(1)} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <CheckCircle2 className="size-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Completado</p>
                <p className="text-2xl font-bold">
                  {((totalActivitiesCompleted / totalActivities) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              Distribución por Nivel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-8 py-8">
              {/* Bronze Bar */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-2xl font-bold">{levelCounts.Bronce}</span>
                <div 
                  className="w-20 rounded-t-lg bg-bronze transition-all"
                  style={{ height: `${(levelCounts.Bronce / allStudents.length) * 150}px`, minHeight: '20px' }}
                />
                <span className="mt-2 text-sm font-medium">Bronce</span>
              </div>
              
              {/* Silver Bar */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-2xl font-bold">{levelCounts.Plata}</span>
                <div 
                  className="w-20 rounded-t-lg bg-silver transition-all"
                  style={{ height: `${(levelCounts.Plata / allStudents.length) * 150}px`, minHeight: '20px' }}
                />
                <span className="mt-2 text-sm font-medium">Plata</span>
              </div>
              
              {/* Gold Bar */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-2xl font-bold">{levelCounts.Oro}</span>
                <div 
                  className="w-20 rounded-t-lg bg-gold transition-all"
                  style={{ height: `${(levelCounts.Oro / allStudents.length) * 150}px`, minHeight: '20px' }}
                />
                <span className="mt-2 text-sm font-medium">Oro</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-primary" />
              Distribución de Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressRanges.map((range) => (
              <div key={range.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{range.label}</span>
                  <span className="font-medium">{range.count} estudiantes</span>
                </div>
                <div className="h-4 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn("h-full transition-all", range.color)}
                    style={{ width: `${(range.count / allStudents.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Streak Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="size-5 text-orange-500" />
              Distribución de Rachas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {streakRanges.map((range, index) => (
                <div 
                  key={range.label}
                  className={cn(
                    "rounded-lg p-4 text-center",
                    index === 0 ? "bg-muted/50" : "bg-orange-500/10"
                  )}
                >
                  <p className="text-3xl font-bold">{range.count}</p>
                  <p className="text-sm text-muted-foreground">{range.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Course Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Progreso por Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{course.icon}</span>
                    <span className="text-sm font-medium">{course.name}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{teacherMetrics.totalStudents}</p>
              <p className="text-muted-foreground">Total estudiantes</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{teacherMetrics.coursesManaged}</p>
              <p className="text-muted-foreground">Cursos gestionados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{teacherMetrics.completedActivities}</p>
              <p className="text-muted-foreground">Actividades completadas</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{teacherMetrics.totalPointsAwarded.toLocaleString()}</p>
              <p className="text-muted-foreground">Puntos otorgados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
