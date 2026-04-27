'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ActivityItem } from '@/components/custom/activity-item'
import { courses } from '@/data/mock-data'
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Trophy } from 'lucide-react'

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params)
  const course = courses.find(c => c.id === id)
  
  if (!course) {
    notFound()
  }
  
  const completedActivities = course.activities.filter(a => a.status === 'completed')
  const inProgressActivities = course.activities.filter(a => a.status === 'in-progress')
  const pendingActivities = course.activities.filter(a => a.status === 'pending')
  
  const totalPoints = course.activities.reduce((sum, a) => sum + a.points, 0)
  const earnedPoints = completedActivities.reduce((sum, a) => sum + a.points, 0)
  const totalDuration = course.activities.reduce((sum, a) => {
    const minutes = parseInt(a.duration)
    return sum + (isNaN(minutes) ? 0 : minutes)
  }, 0)
  
  return (
    <div className="min-h-screen p-8">
      {/* Back Button */}
      <Link href="/student/courses">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="size-4" />
          Volver a cursos
        </Button>
      </Link>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{course.icon}</span>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {course.description}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso del curso</span>
            <span className="font-semibold">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-3" />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actividades</p>
              <p className="text-xl font-bold">
                {course.completedActivities}/{course.totalActivities}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/10 p-2">
              <CheckCircle2 className="size-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completadas</p>
              <p className="text-xl font-bold">{completedActivities.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-gold/10 p-2">
              <Trophy className="size-5 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Puntos</p>
              <p className="text-xl font-bold">
                {earnedPoints}/{totalPoints}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-muted p-2">
              <Clock className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duración total</p>
              <p className="text-xl font-bold">{totalDuration} min</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activities List */}
      <div className="space-y-8">
        {/* In Progress */}
        {inProgressActivities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="size-3 rounded-full bg-primary animate-pulse" />
                En Progreso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inProgressActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Pending */}
        {pendingActivities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="size-3 rounded-full bg-muted-foreground/30" />
                Pendientes ({pendingActivities.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Completed */}
        {completedActivities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="size-5 text-success" />
                Completadas ({completedActivities.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
