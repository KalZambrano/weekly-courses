//weekly-courses/app/(dashboard)/teacher/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { StatsCard } from '@/components/custom/stats-card'
import { LevelBadge } from '@/components/custom/level-badge'
import { allStudents, courses, teacherMetrics, ranking } from '@/data/mock-data'
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TeacherDashboard() {
  const averageProgress = allStudents.reduce((sum, s) => sum + s.progress, 0) / allStudents.length
  const activeStudentsCount = allStudents.filter(s => s.streak > 0).length
  
  // Top performers
  const topPerformers = [...allStudents].sort((a, b) => b.points - a.points).slice(0, 5)
  
  // Students needing attention (lowest progress)
  const needsAttention = [...allStudents].sort((a, b) => a.progress - b.progress).slice(0, 3)
  
  // Level distribution
  const levelDistribution = {
    Oro: allStudents.filter(s => s.level === 'Oro').length,
    Plata: allStudents.filter(s => s.level === 'Plata').length,
    Bronce: allStudents.filter(s => s.level === 'Bronce').length
  }
  
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel del Docente</h1>
        <p className="mt-2 text-muted-foreground">
          Monitorea el progreso y rendimiento de tus estudiantes
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Estudiantes"
          value={teacherMetrics.totalStudents}
          subtitle={`${activeStudentsCount} activos esta semana`}
          icon={<Users className="size-6" />}
        />
        <StatsCard
          title="Progreso Promedio"
          value={`${averageProgress.toFixed(1)}%`}
          subtitle="De todos los cursos"
          icon={<TrendingUp className="size-6" />}
          valueClassName="text-primary"
        />
        <StatsCard
          title="Actividades Completadas"
          value={teacherMetrics.completedActivities}
          subtitle={`${teacherMetrics.pendingActivities} pendientes`}
          icon={<CheckCircle2 className="size-6" />}
        />
        <StatsCard
          title="Puntos Otorgados"
          value={teacherMetrics.totalPointsAwarded.toLocaleString()}
          subtitle="Total acumulado"
          icon={<Trophy className="size-6" />}
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                Resumen de Cursos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course) => {
                const enrolledCount = allStudents.filter(s => 
                  s.enrolledCourses.includes(course.id)
                ).length
                
                return (
                  <div key={course.id} className="flex items-center gap-4 rounded-lg border p-4">
                    <span className="text-3xl">{course.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{course.name}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progreso promedio</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{enrolledCount}</p>
                      <p className="text-xs text-muted-foreground">estudiantes</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          
          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                Todos los Estudiantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Estudiante</th>
                      <th className="pb-3 font-medium">Nivel</th>
                      <th className="pb-3 font-medium">Puntos</th>
                      <th className="pb-3 font-medium">Progreso</th>
                      <th className="pb-3 font-medium">Racha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-muted/50">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="text-xs">
                                {student.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <LevelBadge level={student.level} size="sm" />
                        </td>
                        <td className="py-3 font-medium">{student.points.toLocaleString()}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="h-2 w-20" />
                            <span className="text-sm">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            student.streak > 0 
                              ? "bg-success/10 text-success" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {student.streak} días
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="size-5 text-primary" />
                Distribución por Nivel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-gold" />
                  <span>Oro</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gold transition-all"
                      style={{ width: `${(levelDistribution.Oro / allStudents.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold">{levelDistribution.Oro}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-silver" />
                  <span>Plata</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-silver transition-all"
                      style={{ width: `${(levelDistribution.Plata / allStudents.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold">{levelDistribution.Plata}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-bronze" />
                  <span>Bronce</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-bronze transition-all"
                      style={{ width: `${(levelDistribution.Bronce / allStudents.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold">{levelDistribution.Bronce}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="size-5 text-gold" />
                Top Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPerformers.map((student, index) => (
                <div 
                  key={student.id}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50"
                >
                  <span className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                    index === 0 && "bg-gold text-gold-foreground",
                    index === 1 && "bg-silver text-silver-foreground",
                    index === 2 && "bg-bronze text-bronze-foreground",
                    index > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </span>
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.progress}% completado</p>
                  </div>
                  <div className="flex items-center gap-1 text-success">
                    <ArrowUpRight className="size-4" />
                    <span className="font-bold">{student.points.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Students Needing Attention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="size-5 text-destructive" />
                Requieren Atención
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {needsAttention.map((student) => (
                <div 
                  key={student.id}
                  className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                >
                  <Avatar className="size-10">
                    <AvatarFallback className="text-sm">{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={student.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{student.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-destructive">
                    <ArrowDownRight className="size-4" />
                    <span className="text-sm font-medium">
                      {student.streak === 0 ? 'Sin racha' : `${student.streak}d`}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
