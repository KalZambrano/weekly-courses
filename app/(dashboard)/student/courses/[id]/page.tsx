//weekly-courses/app/(dashboard)/student/courses/[id]/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { ActivityItem } from '@/components/custom/activity-item'
import { MiniRanking } from '@/components/custom/mini-ranking'
import { WeeklyActivities } from '@/components/custom/weekly-activities'
import { ActivityViewer } from '@/components/custom/activity-viewer'
import { QuizViewer } from '@/components/custom/quiz-viewer'
import { QuizFeedback } from '@/components/custom/quiz-feedback'
import { LevelBadge } from '@/components/custom/level-badge'

import { useToast } from '@/hooks/use-toast'
import { completeActivity, getCurrentWeek } from '@/lib/gamification'
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Trophy, Search, Mail, Send, Loader2, Users } from 'lucide-react'

import { courses, allStudents, currentStudent } from '@/data/mock-data'
import type { Activity, RankingStudent, Student, QuizAttempt } from '@/data/mock-data'

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params)
  const { user } = useAuth()
  const { toast } = useToast()
  const course = courses.find(c => c.id === id)

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)
  const [, setTick] = useState(0)

  // ESTADOS PARA LA PESTAÑA DE COMPAÑEROS Y EL MODAL
  const [searchQuery, setSearchQuery] = useState('')
  const [studentToInvite, setStudentToInvite] = useState<Student | RankingStudent | null>(null)
  const [inviteMessage, setInviteMessage] = useState('')
  const [isSendingInvite, setIsSendingInvite] = useState(false)

  if (!course) {
    notFound()
  }

  // LÓGICA DE DATOS
  const courseStudents = allStudents.filter(s => s.enrolledCourses.includes(course.id))
  
  const courseRanking: RankingStudent[] = [...courseStudents]
    .sort((a, b) => b.points - a.points)
    .map((s, index) => ({ ...s, position: index + 1 }))

  const currentStudentData = allStudents.find(s => s.email === user?.email) || currentStudent
  const currentUserRanking = courseRanking.find(s => s.id === currentStudentData.id) || courseRanking[0]
  
  // Filtrado para la pestaña de compañeros
  const filteredCompanions = courseStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) && s.id !== currentStudentData.id
  )

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

  // FUNCIÓN PARA ABRIR EL MODAL
  const openInviteModal = (student: Student | RankingStudent) => {
    setStudentToInvite(student)
    setInviteMessage(`¡Hola ${student.name.split(' ')[0]}! Me gustaría invitarte a formar un grupo de estudio para este curso. ¿Te animas?`)
  }

  // FUNCIÓN PARA ENVIAR INVITACIÓN
  const handleSendInvitation = async () => {
    if (!studentToInvite) return
    setIsSendingInvite(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simula backend
      toast({
        title: "¡Invitación enviada!",
        description: `Se ha enviado un correo a ${studentToInvite.name}.`,
        className: "bg-success text-success-foreground border-none",
      })
      setStudentToInvite(null)
    } catch (error) {
      toast({ title: "Error", description: "No se pudo enviar.", variant: "destructive" })
    } finally {
      setIsSendingInvite(false)
    }
  }

  if (activeActivity) {
    return (
      <div className="min-h-screen p-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => setActiveActivity(null)}>
          <ArrowLeft className="size-4" /> Volver al temario
        </Button>
        {activeActivity.type === 'quiz' ? (
          <QuizViewer activity={activeActivity} onComplete={(attemptData: QuizAttempt) => {
              if (attemptData.score >= (activeActivity.quiz?.passingScore || 12)) {
                activeActivity.isApproved = true; 
                activeActivity.status = 'completed'; 
                activeActivity.bestAttemptScore = attemptData.score; 
                completeActivity(course.id, activeActivity.id)
              }
              if (!activeActivity.attempts) activeActivity.attempts = []
              activeActivity.attempts.push(attemptData); 
              setTick(t => t + 1)
            }} />
        ) : (
          <ActivityViewer activity={activeActivity} onComplete={() => { 
            completeActivity(course.id, activeActivity.id); 
            setActiveActivity(null); 
            setTick(t => t + 1) 
          }} />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <Link href="/student/courses">
        <Button variant="ghost" className="mb-6 gap-2"><ArrowLeft className="size-4" /> Volver a cursos</Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{course.icon}</span>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{course.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>👨‍🏫 {course.teacher}</span><span>|</span><span>📚 Sección {course.section}</span><span>|</span>
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

      {/* TABS ACTUALIZADOS A 3 COLUMNAS */}
      <Tabs defaultValue="temario" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="temario">Temario por Semana</TabsTrigger>
          <TabsTrigger value="ranking">Ranking Local</TabsTrigger>
          <TabsTrigger value="companeros">Compañeros</TabsTrigger>
        </TabsList>

        <TabsContent value="temario" className="space-y-8">
          <WeeklyActivities activities={course.activities} onActivityStart={(activity) => setActiveActivity(activity)} />
        </TabsContent>

        <TabsContent value="ranking">
          <div className="grid gap-6 md:grid-cols-3 items-start">
            <div className="md:col-span-2">
              <MiniRanking
                ranking={courseRanking}
                currentUserId={currentUserRanking?.id || ''}
                limit={courseRanking.length}
                title="Ranking del Curso"
                showFooter={false}
                showInviteButton={true}
                onInvite={openInviteModal}
              />
            </div>
            <div className="md:col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="pb-4"><CardTitle className="text-lg">Tu Desempeño</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">#{currentUserRanking?.position || '-'}</div>
                    <div><p className="font-semibold">Posición en el curso</p><p className="text-sm text-muted-foreground">De {courseRanking.length} estudiantes</p></div>
                  </div>
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tus puntos:</span><span className="font-bold text-primary">{currentUserRanking?.points.toLocaleString('en-US')} pts</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nivel actual:</span><span className="font-bold">{currentUserRanking?.level}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* NUEVA PESTAÑA: COMPAÑEROS */}
        <TabsContent value="companeros">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  Compañeros de Clase ({courseStudents.length - 1})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buscador */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nombre..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Lista de Compañeros */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCompanions.length > 0 ? (
                  filteredCompanions.map(student => (
                    <div key={student.id} className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-secondary">{student.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <LevelBadge level={student.level} size="sm" showIcon={false} />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => openInviteModal(student)}
                      >
                        <Mail className="size-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    No se encontraron compañeros con ese nombre.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL CENTRALIZADO DE INVITACIÓN */}
      <Dialog open={!!studentToInvite} onOpenChange={(open) => !open && setStudentToInvite(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5 text-primary" />
              Enviar Invitación
            </DialogTitle>
            <DialogDescription>
              Invita a <strong>{studentToInvite?.name}</strong> a formar un grupo de estudio. Se le enviará una notificación por correo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje de invitación</Label>
              <Textarea 
                id="message" 
                rows={4}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                className="resize-none focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setStudentToInvite(null)} disabled={isSendingInvite}>
              Cancelar
            </Button>
            <Button onClick={handleSendInvitation} disabled={isSendingInvite || !inviteMessage.trim()}>
              {isSendingInvite ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Enviando...</>
              ) : (
                <><Send className="mr-2 size-4" /> Enviar Correo</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}