'use client'
import { toast } from 'sonner'
//weekly-courses/app/(dashboard)/student/courses/[id]/page.tsx

import { useAuth } from '@/context/AuthContext'
import { use, useState, useEffect } from 'react'
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

import { MiniRanking } from '@/components/custom/mini-ranking'
import { WeeklyActivities } from '@/components/custom/weekly-activities'
import { ActivityViewer } from '@/components/custom/activity-viewer'
import { QuizViewer } from '@/components/custom/quiz-viewer'
import { LevelBadge } from '@/components/custom/level-badge'

import { useToast } from '@/hooks/use-toast'
import { getCurrentWeek } from '@/lib/gamification'
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Trophy, Search, Mail, Send, Loader2, Users } from 'lucide-react'
import { fetchApi } from '@/lib/api'

import type { Activity, RankingStudent, Student, QuizAttempt } from '@/data/mock-data'

const defaultQuizQuestions = [
  {
    id: "q1",
    question: "¿Cuál es el valor de x en la ecuación 2x + 5 = 15?",
    options: ["x = 5", "x = 10", "x = 15", "x = 2"],
    correctAnswer: 0,
    explanation: "Restamos 5 a ambos lados: 2x = 10. Luego dividimos por 2: x = 5.",
    topic: "Ecuaciones Lineales"
  },
  {
    id: "q2",
    question: "¿Qué representa la pendiente (m) en una ecuación lineal y = mx + b?",
    options: ["La intersección con el eje Y", "La inclinación de la recta", "La intersección con el eje X", "El valor constante"],
    correctAnswer: 1,
    explanation: "La pendiente m mide la inclinación o tasa de cambio de la recta.",
    topic: "Definiciones"
  },
  {
    id: "q3",
    question: "¿Cuál es el resultado de resolver 3x - 7 = 5x + 9?",
    options: ["x = -8", "x = 8", "x = -1", "x = 1"],
    correctAnswer: 0,
    explanation: "Restamos 3x a ambos lados: -7 = 2x + 9. Restamos 9: -16 = 2x. Dividimos por 2: x = -8.",
    topic: "Ecuaciones de Primer Grado"
  },
  {
    id: "q4",
    question: "¿Cómo se llama el punto (0, b) en la recta y = mx + b?",
    options: ["Pendiente", "Intersección con el eje X", "Intersección con el eje Y", "Origen"],
    correctAnswer: 2,
    explanation: "Cuando x = 0, y = b, por lo tanto (0, b) es la intersección con el eje Y.",
    topic: "Gráficas"
  }
];

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params)
  const { user } = useAuth()
  const { toast } = useToast()

  const [course, setCourse] = useState<any>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [courseStudents, setCourseStudents] = useState<Student[]>([])
  const [courseRanking, setCourseRanking] = useState<RankingStudent[]>([])
  const [currentUserRanking, setCurrentUserRanking] = useState<any>(null)
  
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  // ESTADOS PARA LA PESTAÑA DE COMPAÑEROS Y EL MODAL
  const [searchQuery, setSearchQuery] = useState('')
  const [studentToInvite, setStudentToInvite] = useState<any>(null)
  const [inviteMessage, setInviteMessage] = useState('')
  const [isSendingInvite, setIsSendingInvite] = useState(false)

  useEffect(() => {
    if (!user || !user.id) return;

    const loadCourseData = async () => {
      try {
        const studentId = parseInt(user.id || '0');
        const courseId = parseInt(id);

        // 1. Obtener detalles del curso
        const realCourse = await fetchApi(`/curso/findCursoById/${courseId}`).catch((e) => {
            toast.error("Error de conexión", { description: "No se encontró el recurso solicitado." })
            return null
          });
        if (!realCourse) {
          setCourse(null);
          setLoading(false);
          return;
        }

        // 2. Obtener asignaciones, materiales, inscripciones, evaluaciones y notas
        const [allAssignments, allMaterials, allEnrollments, allEvaluations, myGrades, allStudents] = await Promise.all([
          fetchApi('/asignacion/listAsignacion').catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          }),
          fetchApi('/material/listMaterial').catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          }),
          fetchApi('/inscripcion/listInscripciones').catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          }),
          fetchApi('/evaluacion/listEvaluaciones').catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          }),
          fetchApi(`/nota/findNotasByEstudiante/${studentId}`).catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          }),
          fetchApi('/estudiante/listEstudiantes').catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          })
        ]);

        // Encontrar asignación para este curso
        const assignment = allAssignments.find((a: any) => a.cursoIdAsignacion === courseId);
        const assignmentId = assignment ? assignment.idAsignacion : null;

        // Filtrar materiales de esta asignación
        const courseMaterials = allMaterials.filter((m: any) => m.asignacionCuAsIdMaterial === assignmentId);

        // Mapear materiales a Actividades
        const mappedActivities: Activity[] = courseMaterials.map((m: any) => {
          // Buscar evaluación asociada a este material
          const evaluation = allEvaluations.find((e: any) => e.materialCuEvaluacion === m.idMaterial);
          const evaluationId = evaluation ? evaluation.idEvaluacion : null;
          
          // Buscar nota si ya fue calificado
          const grade = evaluationId ? myGrades.find((g: any) => g.evaluacionCuNota?.idEvaluacion === evaluationId) : null;
          const status = grade ? 'completed' : 'pending';

          const isQuiz = evaluation !== undefined || m.tipoMaterial?.toLowerCase().includes('quiz') || m.tipoMaterial?.toLowerCase().includes('evaluacion');

          let quizQuestions = defaultQuizQuestions;
          if (evaluation && evaluation.preguntasEvaluacion) {
            try {
              const parsed = typeof evaluation.preguntasEvaluacion === 'string' 
                ? JSON.parse(evaluation.preguntasEvaluacion) 
                : evaluation.preguntasEvaluacion;
              if (Array.isArray(parsed) && parsed.length > 0) {
                quizQuestions = parsed;
              }
            } catch (err) {
              console.error("Error parsing quiz questions from backend:", err);
            }
          }

          return {
            id: m.idMaterial.toString(),
            name: m.tituloMaterial,
            description: m.descripcionMaterial,
            type: isQuiz ? 'quiz' : 'reading',
            duration: '15 min',
            points: evaluation ? Math.round(evaluation.puntosEvaluacion) : 100,
            weekNumber: 1, // Por defecto Semana 1
            status: status,
            url: m.urlMaterial || '#',
            backendEvaluationId: evaluationId, // Guardar ID del backend
            quiz: isQuiz ? {
              questions: quizQuestions,
              maxAttempts: 3,
              passingScore: 12
            } : undefined,
            bestAttemptScore: grade ? Math.round(grade.notaNota) : undefined,
            isApproved: grade ? grade.notaNota >= 12 : undefined
          };
        });

        // Filtrar inscripciones para este curso
        const courseEnrollments = allEnrollments.filter((e: any) => e.asignacionIdInscripcion === assignmentId);
        
        // Mapear estudiantes del curso
        const mappedStudents: Student[] = courseEnrollments.map((enrollment: any) => {
          const s = allStudents.find((student: any) => student.idEstudiante === enrollment.estudianteIdInscripcion);
          if (!s) return null;
          
          const sPoints = enrollment.totalPuntosInscripcion || 0;
          let sLevel: "Bronce" | "Plata" | "Oro" = "Bronce";
          if (sPoints >= 3000) sLevel = "Oro";
          else if (sPoints >= 2000) sLevel = "Plata";

          return {
            id: s.idEstudiante.toString(),
            name: `${s.nombreEstudiante} ${s.apellidoEstudiante}`,
            email: s.correoEstudiante,
            avatar: `${s.nombreEstudiante[0]}${s.apellidoEstudiante[0]}`,
            points: sPoints,
            level: sLevel,
            progress: sPoints > 100 ? 100 : Math.round(sPoints),
            streak: 5,
            enrolledCourses: [id]
          };
        }).filter((s: any) => s !== null);

        setCourseStudents(mappedStudents);

        // Generar Ranking del curso
        const sortedRanking = [...mappedStudents]
          .sort((a, b) => b.points - a.points)
          .map((s, index) => ({ ...s, position: index + 1 }));
        setCourseRanking(sortedRanking);

        // Buscar desempeño del estudiante actual
        const curUserRank = sortedRanking.find(s => s.id === user.id);
        setCurrentUserRanking(curUserRank || sortedRanking[0] || null);

        // Progreso del curso basado en actividades completadas
        const totalAct = mappedActivities.length;
        const compAct = mappedActivities.filter(a => a.status === 'completed').length;
        const progressPercent = totalAct > 0 ? Math.round((compAct / totalAct) * 100) : 0;

        setCourse({
          id: realCourse.idCurso.toString(),
          name: realCourse.nombreCurso,
          description: realCourse.descripcionCurso,
          icon: '📚', // icono fallback
          teacher: assignment ? `Asistente de Aprendizaje (Zaiko)` : 'Sin asignar',
          section: '101',
          progress: progressPercent,
          totalActivities: totalAct,
          completedActivities: compAct
        });

        setActivities(mappedActivities);

      } catch (err) {
        console.error("Error loading course details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [user, id, tick]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando detalles del curso...</span>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  const completedActivities = activities.filter(a => a.status === 'completed')
  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0)
  const earnedPoints = completedActivities.reduce((sum, a) => sum + (a.bestAttemptScore || a.points), 0)
  const totalDuration = activities.length * 15; // fallback estimación

  const currentWeek = getCurrentWeek()

  const filteredCompanions = courseStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) && s.id !== user?.id
  )

  // FUNCIÓN PARA ABRIR EL MODAL DE INVITACIÓN
  const openInviteModal = (student: Student | RankingStudent) => {
    setStudentToInvite(student)
    setInviteMessage(`¡Hola ${student.name.split(' ')[0]}! Me gustaría invitarte a formar un grupo de estudio para este curso. ¿Te animas?`)
  }

  // FUNCIÓN PARA ENVIAR INVITACIÓN (Simulada)
  const handleSendInvitation = async () => {
    if (!studentToInvite) return
    setIsSendingInvite(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
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

  // FUNCIÓN AL COMPLETAR ACTIVIDAD O QUIZ (Integrado con backend /nota/addNota)
  const handleActivityComplete = async (activity: Activity, attemptData?: QuizAttempt) => {
    if (activity.type === 'quiz' && attemptData) {
      const evaluationId = activity.backendEvaluationId;
      if (evaluationId) {
        try {
          // Registrar la nota en el backend real
          await fetchApi('/nota/addNota', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              evaluacionCuNota: evaluationId,
              estudianteNota: parseInt(user?.id || '1'),
              notaNota: attemptData.score,
              observacionNota: `Nota obtenida en el intento ${attemptData.attemptNumber} desde la plataforma Next.js.`
            })
          });
          
          toast({
            title: "¡Quiz calificado en el Backend!",
            description: `Tu nota de ${attemptData.score} pts ha sido guardada con éxito.`,
            className: "bg-success text-success-foreground border-none"
          });
        } catch (err) {
          console.error("Error guardando nota en el backend:", err);
          toast({
            title: "Error de Guardado",
            description: "La nota se calculó localmente pero no se pudo sincronizar al backend.",
            variant: "destructive"
          });
        }
      }
    }
    
    // Forzar recarga de datos
    setTick(t => t + 1);
    setActiveActivity(null);
  }

  if (activeActivity) {
    return (
      <div className="min-h-screen p-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => setActiveActivity(null)}>
          <ArrowLeft className="size-4" /> Volver al temario
        </Button>
        {activeActivity.type === 'quiz' ? (
          <QuizViewer activity={activeActivity} onComplete={(attemptData: QuizAttempt) => {
              handleActivityComplete(activeActivity, attemptData);
            }} />
        ) : (
          <ActivityViewer activity={activeActivity} onComplete={() => { 
            handleActivityComplete(activeActivity);
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
        <Card><CardContent className="flex items-center gap-4 p-4"><div className="rounded-lg bg-gold/10 p-2"><Trophy className="size-5 text-gold" /></div><div><p className="text-sm text-muted-foreground">Puntos acumulados</p><p className="text-xl font-bold">{earnedPoints}/{totalPoints}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4"><div className="rounded-lg bg-muted p-2"><Clock className="size-5 text-muted-foreground" /></div><div><p className="text-sm text-muted-foreground">Duración total</p><p className="text-xl font-bold">{totalDuration} min</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="temario" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="temario">Temario por Semana</TabsTrigger>
          <TabsTrigger value="ranking">Ranking Local</TabsTrigger>
          <TabsTrigger value="companeros">Compañeros</TabsTrigger>
        </TabsList>

        <TabsContent value="temario" className="space-y-8">
          {activities.length > 0 ? (
            <WeeklyActivities activities={activities} onActivityStart={(activity) => setActiveActivity(activity)} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
              <BookOpen className="size-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No hay materiales cargados aún</h3>
              <p className="mt-2 text-muted-foreground">
                El docente no ha subido recursos para este curso en la base de datos.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ranking">
          <div className="grid gap-6 md:grid-cols-3 items-start">
            <div className="md:col-span-2">
              {courseRanking.length > 0 ? (
                <MiniRanking
                  ranking={courseRanking}
                  currentUserId={user?.id || ''}
                  limit={courseRanking.length}
                  title="Ranking del Curso"
                  showFooter={false}
                  showInviteButton={true}
                  onInvite={openInviteModal}
                />
              ) : (
                <div className="py-8 text-center text-muted-foreground border rounded-lg">
                  Ningún estudiante registrado en el curso aún.
                </div>
              )}
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
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tus puntos:</span><span className="font-bold text-primary">{(currentUserRanking?.points || 0).toLocaleString('en-US')} pts</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nivel actual:</span><span className="font-bold">{currentUserRanking?.level || "Bronce"}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* COMPAÑEROS */}
        <TabsContent value="companeros">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  Compañeros de Clase ({Math.max(0, courseStudents.length - 1)})
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
                    No se encontraron compañeros de clase.
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