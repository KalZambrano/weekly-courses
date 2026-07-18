"use client";
//weekly-courses/app/(dashboard)/student/courses/[id]/page.tsx

import { useAuth } from "@/context/AuthContext";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { MiniRanking } from "@/components/custom/mini-ranking";
import { WeeklyActivities } from "@/components/custom/weekly-activities";
import { ActivityViewer } from "@/components/custom/activity-viewer";
import { QuizViewer } from "@/components/custom/quiz-viewer";
import { LevelBadge } from "@/components/custom/level-badge";

import { useToast } from "@/hooks/use-toast";
import { getCurrentWeek } from "@/lib/gamification";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Trophy,
  Search,
  Mail,
  Send,
  Loader2,
  Users,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { config } from "@/lib/config-api";
import {
  getAllEnrollments,
  getAllCourses,
  getAllAssignments,
  getAllMaterials,
  getAllStudents,
  getAllEvaluations,
  getAllGrades,
  getAllAssistants
} from "@/services/services";

import type {
  Activity,
  RankingStudent,
  Student,
  QuizAttempt,
} from "@/data/mock-data";

const defaultQuizQuestions = [
  {
    id: "q1",
    question: "¿Cuál es el valor de x en la ecuación 2x + 5 = 15?",
    options: ["x = 5", "x = 10", "x = 15", "x = 2"],
    correctAnswer: 0,
    explanation:
      "Restamos 5 a ambos lados: 2x = 10. Luego dividimos por 2: x = 5.",
    topic: "Ecuaciones Lineales",
  },
  {
    id: "q2",
    question:
      "¿Qué representa la pendiente (m) en una ecuación lineal y = mx + b?",
    options: [
      "La intersección con el eje Y",
      "La inclinación de la recta",
      "La intersección con el eje X",
      "El valor constante",
    ],
    correctAnswer: 1,
    explanation:
      "La pendiente m mide la inclinación o tasa de cambio de la recta.",
    topic: "Definiciones",
  },
  {
    id: "q3",
    question: "¿Cuál es el resultado de resolver 3x - 7 = 5x + 9?",
    options: ["x = -8", "x = 8", "x = -1", "x = 1"],
    correctAnswer: 0,
    explanation:
      "Restamos 3x a ambos lados: -7 = 2x + 9. Restamos 9: -16 = 2x. Dividimos por 2: x = -8.",
    topic: "Ecuaciones de Primer Grado",
  },
  {
    id: "q4",
    question: "¿Cómo se llama el punto (0, b) en la recta y = mx + b?",
    options: [
      "Pendiente",
      "Intersección con el eje X",
      "Intersección con el eje Y",
      "Origen",
    ],
    correctAnswer: 2,
    explanation:
      "Cuando x = 0, y = b, por lo tanto (0, b) es la intersección con el eje Y.",
    topic: "Gráficas",
  },
];

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const { toast } = useToast();
  const isTeacherView = user?.role === 'teacher';

  const [course, setCourse] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [courseStudents, setCourseStudents] = useState<Student[]>([]);
  const [courseRanking, setCourseRanking] = useState<RankingStudent[]>([]);
  const [currentUserRanking, setCurrentUserRanking] = useState<any>(null);

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [studentRecord, setStudentRecord] = useState<any>(null);
  const [courseEnrollment, setCourseEnrollment] = useState<any>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  // ESTADOS PARA LA PESTAÑA DE COMPAÑEROS Y EL MODAL
  const [searchQuery, setSearchQuery] = useState("");
  const [studentToInvite, setStudentToInvite] = useState<any>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    const loadCourseData = async () => {
      try {
        const isTeacherView = user.role === 'teacher';
        const studentId = isTeacherView ? -999 : parseInt(user.id || "0");
        const courseId = parseInt(id);

        const realCourse = await fetchApi(
          `/cursos/findCursoById/${courseId}`,
        ).catch((e) => {
          toast({
            title: "Error de conexión",
            description: "No se encontró el recurso solicitado.",
            variant: "destructive",
          });
          return null;
        });
        if (!realCourse) {
          setCourse(null);
          setLoading(false);
          return;
        }

        // 2. Obtener asignaciones, materiales, inscripciones, evaluaciones y notas
        const [
          allAssignments,
          allMaterials,
          allEnrollments,
          allEvaluations,
          myGrades,
          allStudents,
          allAssistants,
        ] = await Promise.all([
          getAllAssignments().catch(() => []),
          getAllMaterials().catch(() => []),
          getAllEnrollments().catch(() => []),
          getAllEvaluations().catch(() => []),
          getAllGrades().catch(() => []),
          getAllStudents().catch(() => []),
          getAllAssistants().catch(() => []),
        ]);

        // Encontrar asignación para este curso
        const assignment = allAssignments.find(
          (a: any) => (a.cursoIdAsignacionCuAs ?? a.cursoIdAsignacion) === courseId,
        );
        const assignmentId = assignment ? (assignment.id ?? assignment.idAsignacion) : null;
        const courseEnrollments = allEnrollments.filter(
          (e: any) => e.asignacionIdInscripcion === assignmentId,
        );
        const activeEnrollment = isTeacherView
          ? null
          : courseEnrollments.find(
              (e: any) => e.estudianteIdInscripcion === studentId,
            ) ?? null;
        const activeStudent = isTeacherView
          ? null
          : allStudents.find(
              (s: any) => (s.id ?? s.idEstudiante) === studentId,
            ) ?? null;
        const completedMaterialIds = (() => {
          const value = activeEnrollment?.materialesCompletadosInscripcion;
          if (Array.isArray(value)) return value.map(String);
          if (typeof value !== "string" || !value) return [];
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.map(String) : [];
          } catch {
            return value.split(",").filter(Boolean);
          }
        })();

        setCourseEnrollment(activeEnrollment);
        setStudentRecord(activeStudent);

        // Filtrar materiales de esta asignación
        const courseMaterials = allMaterials.filter(
          (m: any) => m.asignacionCuAsIdMaterial === assignmentId,
        );

        // Mapear materiales a Actividades
        const mappedActivities: Activity[] = courseMaterials.map((m: any) => {
          // Buscar evaluación asociada a este material
          const evaluation = allEvaluations.find(
            (e: any) => e.materialCuEvaluacion === m.id,
          );
          const evaluationId = evaluation ? evaluation.id : null;

          // Recuperar todos los intentos para conservar el historial completo.
          const evaluationGrades = (evaluationId && !isTeacherView)
            ? myGrades.filter(
                (g: any) =>
                  (g.evaluacionCuNota?.id ?? g.evaluacionCuNota) === evaluationId &&
                  (g.estudianteNota?.id ?? g.estudianteNota) === studentId,
              )
            : [];
          const approvedGrade = evaluationGrades.find(
            (g: any) => Number(g.calificacionNota) >= 12,
          );
          const bestGrade = evaluationGrades.reduce(
            (best: any, grade: any) =>
              !best || Number(grade.calificacionNota) > Number(best.calificacionNota)
                ? grade
                : best,
            null,
          );

          const isQuiz =
            evaluation !== undefined ||
            m.tipoMaterial?.toLowerCase().includes("quiz") ||
            m.tipoMaterial?.toLowerCase().includes("evaluacion");

          let quizQuestions = defaultQuizQuestions;
          if (evaluation && evaluation.preguntasEvaluacion) {
            try {
              const parsed =
                typeof evaluation.preguntasEvaluacion === "string"
                  ? JSON.parse(evaluation.preguntasEvaluacion)
                  : evaluation.preguntasEvaluacion;
              if (Array.isArray(parsed) && parsed.length > 0) {
                quizQuestions = parsed;
              }
            } catch (err) {
              console.error("Error parsing quiz questions from backend:", err);
            }
          }

          const status = isQuiz
            ? (approvedGrade ? "completed" : "pending")
            : (completedMaterialIds.includes(String(m.id)) ? "completed" : "pending");

          return {
            id: m.id.toString(),
            name: m.tituloMaterial,
            description: m.descripcionMaterial,
            type: isQuiz ? "quiz" : "reading",
            duration: "15 min",
            points: evaluation ? Math.round(evaluation.puntosEvaluacion) : 100,
            weekNumber: m.semana || 1, // Carga la semana real
            semana: m.semana || 1, // Carga la semana real
            status: status,
            url: m.urlMaterial || "#",
            backendEvaluationId: evaluationId, // Guardar ID del backend
            quiz: isQuiz
              ? {
                  questions: quizQuestions,
                  maxAttempts: 3,
                  passingScore: 12,
                }
              : undefined,
            attempts: evaluationGrades.map((grade: any, index: number) => ({
              attemptNumber: index + 1,
              score: Number(grade.calificacionNota),
              answers: [],
              completedAt: grade.fechaNota ?? grade.createdAt ?? "",
              pointsEarned: Number(grade.calificacionNota) >= 12 && index === 0
                ? Math.round(evaluation?.puntosEvaluacion ?? 0)
                : 0,
            })),
            bestAttemptScore: bestGrade ? Math.round(bestGrade.calificacionNota) : undefined,
            isApproved: Boolean(approvedGrade),
          };
        });

        // Mapear estudiantes del curso
        const mappedStudents: Student[] = courseEnrollments
          .map((enrollment: any) => {
            const s = allStudents.find(
              (student: any) =>
                (student.id || student.idEstudiante) === enrollment.estudianteIdInscripcion,
            );
            if (!s) return null;

            const sPoints = Number(enrollment.totalPuntosInscripcion ?? 0);
            let sLevel: "Bronce" | "Plata" | "Oro" = "Bronce";
            if (sPoints >= 3000) sLevel = "Oro";
            else if (sPoints >= 2000) sLevel = "Plata";

            return {
              id: (s.id || s.idEstudiante).toString(),
              name: `${s.nombreEstudiante} ${s.apellidoEstudiante}`,
              email: s.correoEstudiante,
              avatar: `${s.nombreEstudiante[0]}${s.apellidoEstudiante[0]}`,
              points: sPoints,
              level: sLevel,
              progress: sPoints > 100 ? 100 : Math.round(sPoints),
              streak: 5,
              enrolledCourses: [id],
            };
          })
          .filter((s): s is Student => s !== null);

        setCourseStudents(mappedStudents);

        // Generar Ranking del curso
        const sortedRanking = [...mappedStudents]
          .sort((a, b) => b.points - a.points)
          .map((s, index) => ({ ...s, position: index + 1 }));
        setCourseRanking(sortedRanking);

        // Buscar desempeño del estudiante actual
        const curUserRank = isTeacherView ? null : sortedRanking.find((s) => s.id === user.id);
        setCurrentUserRanking(curUserRank || null);

        // Progreso del curso basado en actividades completadas (o 40% si es simulación de docente)
        const totalAct = mappedActivities.length;
        const compAct = mappedActivities.filter(
          (a) => a.status === "completed",
        ).length;
        const progressPercent = totalAct === 0 ? 0 : (
          isTeacherView ? 40 : Math.round((compAct / totalAct) * 100)
        );

        let teacherName = "Sin docente asignado";
        if (isTeacherView && user?.name) {
          teacherName = user.name;
        } else if (assignment) {
          const teacherId = assignment.asistenteIdAsignacionCuAs || assignment.asistenteIdAsignacion || (assignment.asistente?.id) || (assignment.asistente?.idEmpleado);
          const teacherObj = allAssistants.find((as: any) => as.id === teacherId);
          if (teacherObj) {
            teacherName = `${teacherObj.nombreEmpleado} ${teacherObj.apellidoEmpleado}`;
          } else if (assignment.asistente) {
            teacherName = `${assignment.asistente.nombreEmpleado} ${assignment.asistente.apellidoEmpleado}`;
          }
        }

        setCourse({
          id: (realCourse.id ?? realCourse.idCurso ?? "").toString(),
          name: realCourse.nombreCurso,
          description: realCourse.descripcionCurso,
          icon: "📚", // icono fallback
          teacher: teacherName,
          section: "101",
          progress: progressPercent,
          totalActivities: totalAct,
          completedActivities: compAct,
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
        <span className="ml-3 text-muted-foreground">
          Cargando detalles del curso...
        </span>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  const completedActivities = activities.filter(
    (a) => a.status === "completed",
  );
  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const earnedPoints = Number(courseEnrollment?.totalPuntosInscripcion ?? 0);
  const totalDuration = activities.length * 15; // fallback estimación

  const currentWeek = getCurrentWeek();

  const filteredCompanions = courseStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (isTeacherView ? true : s.id !== user?.id),
  );

  // FUNCIÓN PARA ABRIR EL MODAL DE INVITACIÓN
  const openInviteModal = (student: Student | RankingStudent) => {
    setStudentToInvite(student);
    setInviteMessage(
      `¡Hola ${student.name.split(" ")[0]}! Me gustaría invitarte a formar un grupo de estudio para este curso. ¿Te animas?`,
    );
  };

  // FUNCIÓN PARA ENVIAR INVITACIÓN (Simulada)
  const handleSendInvitation = async () => {
    if (!studentToInvite) return;
    setIsSendingInvite(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "¡Invitación enviada!",
        description: `Se ha enviado un correo a ${studentToInvite.name}.`,
        className: "bg-success text-success-foreground border-none",
      });
      setStudentToInvite(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar.",
        variant: "destructive",
      });
    } finally {
      setIsSendingInvite(false);
    }
  };

  const getCompletedMaterialIds = (enrollment: any): string[] => {
    const value = enrollment?.materialesCompletadosInscripcion;
    if (Array.isArray(value)) return value.map(String);
    if (typeof value !== "string" || !value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return value.split(",").filter(Boolean);
    }
  };

  const persistPoints = async (points: number, completedMaterialId?: string) => {
    if (points <= 0 || !user?.id || !studentRecord || !courseEnrollment) return;

    const enrollmentId = courseEnrollment.id ?? courseEnrollment.idInscripcion;
    if (!enrollmentId) throw new Error("No se encontró la inscripción del curso.");

    const completedIds = getCompletedMaterialIds(courseEnrollment);
    const nextCompletedIds = completedMaterialId && !completedIds.includes(completedMaterialId)
      ? [...completedIds, completedMaterialId]
      : completedIds;
    const nextCoursePoints = Number(courseEnrollment.totalPuntosInscripcion ?? 0) + points;
    const nextGlobalPoints = Number(
      studentRecord.puntosEstudiante ?? studentRecord.puntos ?? studentRecord.points ?? 0,
    ) + points;

    await fetchApi(config.endpoints.inscripcionEsCu.update(enrollmentId), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...courseEnrollment,
        totalPuntosInscripcion: nextCoursePoints,
        materialesCompletadosInscripcion: JSON.stringify(nextCompletedIds),
      }),
    });

    await fetchApi(config.endpoints.estudiantes.update(user.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...studentRecord,
        puntosEstudiante: nextGlobalPoints,
      }),
    });

    setCourseEnrollment((current: any) => ({
      ...current,
      totalPuntosInscripcion: nextCoursePoints,
      materialesCompletadosInscripcion: JSON.stringify(nextCompletedIds),
    }));
    setStudentRecord((current: any) => ({ ...current, puntosEstudiante: nextGlobalPoints }));
  };

  // Guarda todos los intentos y premia únicamente la primera aprobación/finalización.
  const handleActivityComplete = async (
    activity: Activity,
    attemptData?: QuizAttempt,
  ) => {
    if (isSavingProgress) return;
    setIsSavingProgress(true);

    try {
      if (activity.type === "quiz") {
        if (!attemptData || !activity.backendEvaluationId) {
          throw new Error("El quiz no tiene una evaluación asociada.");
        }

        await fetchApi(config.endpoints.notaEvaluacion.create, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evaluacionCuNota: activity.backendEvaluationId,
            estudianteNota: Number(user?.id),
            calificacionNota: attemptData.score,
            observacionNota: JSON.stringify({
              intento: attemptData.attemptNumber,
              respuestas: attemptData.answers,
              fecha: attemptData.completedAt,
              aprobado: attemptData.score >= (activity.quiz?.passingScore ?? 12),
            }),
          }),
        });

        if (attemptData.pointsEarned > 0 && !activity.isApproved) {
          await persistPoints(Math.round(attemptData.pointsEarned));
        }

        toast({
          title: "Intento guardado",
          description: attemptData.pointsEarned > 0
            ? `Nota ${attemptData.score.toFixed(1)}. Se sumaron ${Math.round(attemptData.pointsEarned)} puntos.`
            : `Tu nota de ${attemptData.score.toFixed(1)} fue registrada.`,
          className: "bg-success text-success-foreground border-none",
        });
      } else {
        const completedIds = getCompletedMaterialIds(courseEnrollment);
        if (completedIds.includes(activity.id) || activity.status === "completed") {
          toast({
            title: "Material ya completado",
            description: "Este material ya otorgó sus puntos anteriormente.",
          });
          return;
        }

        await persistPoints(activity.points, activity.id);
        setActivities((current) => current.map((item) =>
          item.id === activity.id
            ? { ...item, status: "completed", completedAt: new Date().toISOString() }
            : item,
        ));
        toast({
          title: "Material completado",
          description: `Se sumaron ${activity.points} puntos a tu curso y ranking.`,
          className: "bg-success text-success-foreground border-none",
        });
        setActiveActivity(null);
      }

      setTick((current) => current + 1);
    } catch (error) {
      console.error("Error guardando progreso y puntos:", error);
      toast({
        title: "No se pudo guardar el progreso",
        description: "Tu resultado permanece en pantalla. Intenta nuevamente antes de salir.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSavingProgress(false);
    }
  };

  if (activeActivity) {
    return (
      <div className="min-h-screen p-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => setActiveActivity(null)}
        >
          <ArrowLeft className="size-4" /> Volver al temario
        </Button>
        {activeActivity.type === "quiz" ? (
          <QuizViewer
            activity={activeActivity}
            onComplete={(attemptData: QuizAttempt) =>
              handleActivityComplete(activeActivity, attemptData)
            }
            onClose={() => setActiveActivity(null)}
          />
        ) : (
          <ActivityViewer
            activity={activeActivity}
            onComplete={() => {
              handleActivityComplete(activeActivity);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Link href="/student/courses">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="size-4" /> Volver a cursos
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
                <span
                  className={`size-2 rounded-full ${currentWeek === getCurrentWeek() ? "bg-orange-500 animate-pulse" : "bg-muted-foreground"}`}
                />
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
              <p className="text-sm text-muted-foreground">Puntos acumulados</p>
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

      <Tabs defaultValue="temario" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="temario">Temario por Semana</TabsTrigger>
          <TabsTrigger value="ranking">Ranking Local</TabsTrigger>
          <TabsTrigger value="companeros">Compañeros</TabsTrigger>
        </TabsList>

        <TabsContent value="temario" className="space-y-8">
          {activities.length > 0 ? (
            <WeeklyActivities
              activities={activities}
              onActivityStart={(activity) => setActiveActivity(activity)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
              <BookOpen className="size-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                No hay materiales cargados aún
              </h3>
              <p className="mt-2 text-muted-foreground">
                El docente no ha subido recursos para este curso en la base de
                datos.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ranking">
          <div className="grid gap-6 md:grid-cols-3 items-start">
            <div className={isTeacherView ? "md:col-span-3" : "md:col-span-2"}>
              {courseRanking.length > 0 ? (
                <MiniRanking
                  ranking={courseRanking}
                  currentUserId={isTeacherView ? "" : (user?.id || "")}
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
            {!isTeacherView && (
              <div className="md:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Tu Desempeño</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                        #{currentUserRanking?.position || "-"}
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
                          {(currentUserRanking?.points || 0).toLocaleString(
                            "en-US",
                          )}{" "}
                          pts
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Nivel actual:
                        </span>
                        <span className="font-bold">
                          {currentUserRanking?.level || "Bronce"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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
                  filteredCompanions.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-secondary">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <LevelBadge
                          level={student.level}
                          size="sm"
                          showIcon={false}
                        />
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
      <Dialog
        open={!!studentToInvite}
        onOpenChange={(open) => !open && setStudentToInvite(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5 text-primary" />
              Enviar Invitación
            </DialogTitle>
            <DialogDescription>
              Invita a <strong>{studentToInvite?.name}</strong> a formar un
              grupo de estudio. Se le enviará una notificación por correo.
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
            <Button
              variant="outline"
              onClick={() => setStudentToInvite(null)}
              disabled={isSendingInvite}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendInvitation}
              disabled={isSendingInvite || !inviteMessage.trim()}
            >
              {isSendingInvite ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" /> Enviar Correo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
