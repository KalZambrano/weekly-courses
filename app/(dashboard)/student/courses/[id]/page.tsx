//weekly-courses/app/(dashboard)/student/courses/[id]/page.tsx
'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityItem } from '@/components/custom/activity-item'
import { MiniRanking } from '@/components/custom/mini-ranking'
import { WeeklyActivities } from '@/components/custom/weekly-activities'
import { courses, allStudents, currentStudent } from '@/data/mock-data'
import type { Activity, RankingStudent } from '@/data/mock-data'
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Trophy } from 'lucide-react'

import { ActivityViewer } from '@/components/custom/activity-viewer'
import { completeActivity, getCurrentWeek } from '@/lib/gamification'
import { QuizFeedback } from '@/components/custom/quiz-feedback'

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params)
  const course = courses.find(c => c.id === id)

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)
  const [, setTick] = useState(0)

  if (!course) {
    notFound()
  }

  // LÓGICA DE RANKING DEL CURSO
  const courseRanking: RankingStudent[] = allStudents
    .filter(s => s.enrolledCourses.includes(course.id))
    .sort((a, b) => b.points - a.points)
    .map((s, index) => ({
      id: s.id,
      name: s.name,
      avatar: s.avatar,
      points: s.points,
      level: s.level,
      position: index + 1
    }))

  const currentUserRanking = courseRanking.find(s => s.id === currentStudent.id)
  const completedActivities = course.activities.filter(a => a.status === 'completed')
  const inProgressActivities = course.activities.filter(a => a.status === 'in-progress')
  const pendingActivities = course.activities.filter(a => a.status === 'pending')

  const totalPoints = course.activities.reduce((sum, a) => sum + a.points, 0)
  const earnedPoints = completedActivities.reduce((sum, a) => sum + a.points, 0)
  const totalDuration = course.activities.reduce((sum, a) => {
    const minutes = parseInt(a.duration)
    return sum + (isNaN(minutes) ? 0 : minutes)
  }, 0)

  const currentWeek = getCurrentWeek()

  if (activeActivity) {
    return (
      <div className="min-h-screen p-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => setActiveActivity(null)}
        >
          <ArrowLeft className="size-4" />
          Volver al temario
        </Button>

        {activeActivity.type === 'quiz' ? (
          <QuizFeedback />
        ) : (
          <ActivityViewer
            activity={activeActivity}
            onComplete={() => {
              // Complete activity, award points (if current week) and refresh UI
              completeActivity(course.id, activeActivity.id)
              setActiveActivity(null)
              setTick(t => t + 1)
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <Link href="/student/courses">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="size-4" />
          Volver a cursos
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{course.icon}</span>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {course.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>👨‍🏫 {course.teacher}</span>
              <span>|</span>
              <span>📚 Sección {course.section}</span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <span className={`size-2 rounded-full ${currentWeek === getCurrentWeek() ? 'bg-orange-500 animate-pulse' : 'bg-muted-foreground'}`} />
                Semana actual: {currentWeek}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso del curso</span>
            <span className="font-semibold">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-3" />
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="flex items-center gap-4 p-4"><div className="rounded-lg bg-primary/10 p-2"><BookOpen className="size-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Actividades</p><p className="text-xl font-bold">{course.completedActivities}/{course.totalActivities}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4"><div className="rounded-lg bg-success/10 p-2"><CheckCircle2 className="size-5 text-success" /></div><div><p className="text-sm text-muted-foreground">Completadas</p><p className="text-xl font-bold">{completedActivities.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4"><div className="rounded-lg bg-gold/10 p-2"><Trophy className="size-5 text-gold" /></div><div><p className="text-sm text-muted-foreground">Puntos</p><p className="text-xl font-bold">{earnedPoints}/{totalPoints}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4"><div className="rounded-lg bg-muted p-2"><Clock className="size-5 text-muted-foreground" /></div><div><p className="text-sm text-muted-foreground">Duración total</p><p className="text-xl font-bold">{totalDuration} min</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="temario" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="temario">Temario por Semana</TabsTrigger>
          <TabsTrigger value="ranking">Ranking Local</TabsTrigger>
        </TabsList>

        <TabsContent value="temario" className="space-y-8">
          <WeeklyActivities 
            activities={course.activities}
            onActivityStart={(activity) => setActiveActivity(activity)}
          />
        </TabsContent>

        <TabsContent value="ranking">
          <div className="grid gap-6 md:grid-cols-3 items-start">
            <div className="md:col-span-2">
              <MiniRanking
                ranking={courseRanking}
                currentUserId={currentStudent.id}
                limit={courseRanking.length}
                title="Ranking del Curso" 
                showFooter={false}        
              />
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Tu Desempeño</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      #{currentUserRanking?.position || '-'}
                    </div>
                    <div>
                      <p className="font-semibold">Posición en el curso</p>
                      <p className="text-sm text-muted-foreground">
                        De {courseRanking.length} estudiantes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tus puntos:</span>
                      <span className="font-bold text-primary">
                        {currentUserRanking?.points.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nivel actual:</span>
                      <span className="font-bold">{currentUserRanking?.level}</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                    ¡Completa actividades en la semana activa (lunes-jueves) para ganar x1.5 puntos!
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
