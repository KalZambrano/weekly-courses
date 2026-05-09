//weekly-courses/app/(dashboard)/teacher/courses/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { courses, allStudents } from '@/data/mock-data'
import { getActivityTypeInfo } from '@/lib/gamification'
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock,
  Trophy
} from 'lucide-react'

export default function TeacherCoursesPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="size-8 text-primary" />
          Gestión de Cursos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Visualiza el progreso y las estadísticas de cada curso
        </p>
      </div>
      
      {/* Courses Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {courses.map((course) => {
          const enrolledStudents = allStudents.filter(s => 
            s.enrolledCourses.includes(course.id)
          )
          const completedActivities = course.activities.filter(a => a.status === 'completed').length
          const inProgressActivities = course.activities.filter(a => a.status === 'in-progress').length
          const pendingActivities = course.activities.filter(a => a.status === 'pending').length
          const totalPoints = course.activities.reduce((sum, a) => sum + a.points, 0)
          
          return (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{course.icon}</span>
                  <div className="flex-1">
                    <CardTitle>{course.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso promedio</span>
                    <span className="font-bold text-primary">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <Users className="size-5 text-primary" />
                    <div>
                      <p className="text-xl font-bold">{enrolledStudents.length}</p>
                      <p className="text-xs text-muted-foreground">Estudiantes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <BookOpen className="size-5 text-primary" />
                    <div>
                      <p className="text-xl font-bold">{course.totalActivities}</p>
                      <p className="text-xs text-muted-foreground">Actividades</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <Trophy className="size-5 text-gold" />
                    <div>
                      <p className="text-xl font-bold">{totalPoints}</p>
                      <p className="text-xs text-muted-foreground">Puntos totales</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <CheckCircle2 className="size-5 text-success" />
                    <div>
                      <p className="text-xl font-bold">{completedActivities}</p>
                      <p className="text-xs text-muted-foreground">Completadas</p>
                    </div>
                  </div>
                </div>
                
                {/* Activities Breakdown */}
                <div>
                  <h4 className="mb-3 font-medium">Desglose de Actividades</h4>
                  <div className="space-y-2">
                    {(['video', 'quiz', 'exercise', 'reading'] as const).map((type) => {
                      const typeInfo = getActivityTypeInfo(type)
                      const count = course.activities.filter(a => a.type === type).length
                      const completed = course.activities.filter(a => a.type === type && a.status === 'completed').length
                      
                      if (count === 0) return null
                      
                      return (
                        <div key={type} className="flex items-center gap-3">
                          <div className={`rounded p-1.5 ${typeInfo.color}`}>
                            <span className="text-sm">{typeInfo.icon}</span>
                          </div>
                          <span className="flex-1 text-sm">{typeInfo.label}</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(completed / count) * 100} 
                              className="h-1.5 w-16" 
                            />
                            <span className="text-xs text-muted-foreground w-12 text-right">
                              {completed}/{count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Activity Status Summary */}
                <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-success" />
                    <span>Completadas: {completedActivities}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    <span>En progreso: {inProgressActivities}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-muted-foreground/30" />
                    <span>Pendientes: {pendingActivities}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
