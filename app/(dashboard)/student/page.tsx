"use client";
import { toast } from "sonner";
//weekly-courses/app/(dashboard)/student/page.tsx

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/custom/stats-card";
import { LevelBadge } from "@/components/custom/level-badge";
import { MultiplierIndicator } from "@/components/custom/multiplier-indicator";
import { MiniRanking } from "@/components/custom/mini-ranking";
import { StudentTutorial } from "@/components/tutorials/student-tutorial";
import { useTutorial } from "@/hooks/useTutorial";
import { RecentActivityList } from "@/components/custom/recent-activity-list";
import { Loader2 } from "lucide-react";
import { getAllEnrollments, getAllStudents, getAllGrades, getAllEvaluations, getAllMaterials, getAllCourses, getAllAssignments } from "@/services/services";
import {
  currentStudent,
  recentActivities,
  motivationalMessages,
  ranking as mockRanking,
  courses,
} from "@/data/mock-data";
import {
  getProgressToNextLevel,
  getPointsToNextLevel,
  getMotivationalMessage,
  getCurrentWeek,
} from "@/lib/gamification";
import { Star, Target, Flame, Sparkles, HelpCircle } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const { shouldShowTutorial, isLoading, markTutorialAsShown } =
    useTutorial("student");
  const [ranking, setRanking] = useState<any[]>([]);
  const [recentActivitiesList, setRecentActivitiesList] = useState<any[]>([]);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 12,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMotivationalMessage(getMotivationalMessage(motivationalMessages));
  }, []);

  useEffect(() => {
    // Auto-start tutorial if it should be shown and everything is loaded
    if (!isLoading && shouldShowTutorial) {
      const timer = setTimeout(() => {
        const tutorialButton = document.getElementById(
          "start-student-tutorial",
        );
        if (tutorialButton) {
          tutorialButton.click();
        }
      }, 500); // Small delay to ensure DOM is ready
      return () => clearTimeout(timer);
    }

    if (!user) return;

    const loadDashboardData = async () => {
      try {
        if (!user.id) {
          throw new Error("No user ID found, using fallback dashboard data.");
        }

        // 1. Obtener datos transaccionales desde el Backend
        const [
          allStudents,
          allEnrollments,
          allGrades,
          allEvaluations,
          allMaterials,
          allCourses,
          allAssignments,
        ] = await Promise.all([
          getAllStudents(),
          getAllEnrollments(),
          getAllGrades(),
          getAllEvaluations(),
          getAllMaterials(),
          getAllCourses(),
          getAllAssignments(),
        ]);

        const studentId = parseInt(user.id);

        // Buscar el estudiante activo en la lista real del backend
        const realStudent = allStudents.find(
          (s: any) => (s?.id || s?.idEstudiante)?.toString() === user.id,
        );

        // Puntos acumulados reales del estudiante
        const points = realStudent ? (realStudent.puntos ?? realStudent.points ?? 0) : 0;

        // Determinar nivel basado en puntos (gamification)
        let level: "Bronce" | "Plata" | "Oro" = "Bronce";
        if (points >= 3000) level = "Oro";
        else if (points >= 1500) level = "Plata";

        // Ordenar estudiantes para el ranking por puntos reales del estudiante
        const sortedRanking = allStudents
          .map((s: any) => {
            const sPoints = s.puntos ?? s.points ?? 0;
            let sLevel: "Bronce" | "Plata" | "Oro" = "Bronce";
            if (sPoints >= 3000) sLevel = "Oro";
            else if (sPoints >= 1500) sLevel = "Plata";

            return {
              id: (s?.id || s?.idEstudiante)?.toString() || "",
              name: s?.nombreEstudiante && s?.apellidoEstudiante ? `${s.nombreEstudiante} ${s.apellidoEstudiante}` : "Estudiante",
              avatar: s?.nombreEstudiante && s?.apellidoEstudiante ? `${s.nombreEstudiante[0]}${s.apellidoEstudiante[0]}` : "E",
              points: sPoints,
              level: sLevel,
            };
          })
          .sort((a: any, b: any) => b.points - a.points)
          .map((s: any, idx: number) => ({ ...s, position: idx + 1 }));

        setRanking(sortedRanking.length > 0 ? sortedRanking : mockRanking);

        // Filtrar las inscripciones y materiales del estudiante actual para stats
        const myEnrollments = allEnrollments.filter(
          (e: any) => e.estudianteIdInscripcion === studentId,
        );

        const myCourseAssignmentIds = myEnrollments.map((e: any) => e.asignacionIdInscripcion);
        const myMaterials = allMaterials.filter((m: any) => myCourseAssignmentIds.includes(m.asignacionCuAsIdMaterial));
        
        // Obtener notas del estudiante (en la base de datos de sqlite se guardó estudianteNota como el ID del estudiante en el JSON de respuesta)
        const myGrades = allGrades.filter((g: any) => g.estudianteNota === studentId);

        // Calcular estadísticas reales
        const completedCount = myGrades.length;
        const pendingCount = Math.max(0, myMaterials.length - completedCount);

        setStats({
          completed: completedCount,
          pending: pendingCount,
          inProgress: 0,
        });

        // Calcular racha de semanas consecutivas basada en entregas reales del estudiante
        const semanasEntregadas = Array.from(
          new Set(
            myGrades
              .map((g: any) => {
                const evaluation = allEvaluations.find((e: any) => e.id === g.evaluacionCuNota);
                return evaluation ? evaluation.semana : null;
              })
              .filter((w): w is number => w !== null)
          )
        );

        const currentWeekNumber = getCurrentWeek();
        let calculatedStreak = 0;

        if (semanasEntregadas.includes(currentWeekNumber)) {
          let checkWeek = currentWeekNumber;
          while (semanasEntregadas.includes(checkWeek)) {
            calculatedStreak++;
            checkWeek--;
          }
        } else if (semanasEntregadas.includes(currentWeekNumber - 1)) {
          let checkWeek = currentWeekNumber - 1;
          while (semanasEntregadas.includes(checkWeek)) {
            calculatedStreak++;
            checkWeek--;
          }
        } else if (semanasEntregadas.length > 0) {
          calculatedStreak = 1;
        }

        // Setear datos de perfil
        setStudentData({
          name: realStudent
            ? `${realStudent.nombreEstudiante} ${realStudent.apellidoEstudiante}`
            : user.name,
          avatar: realStudent
            ? `${realStudent.nombreEstudiante[0]}${realStudent.apellidoEstudiante[0]}`
            : user.name[0],
          points: points,
          level: level,
          progress:
            myMaterials.length > 0
              ? Math.round((completedCount / myMaterials.length) * 100)
              : 0,
          streak: calculatedStreak > 0 ? calculatedStreak : 1, // Si solo tiene entregas en la semana actual o no tiene se inicializa en 1 si tiene entregas, de lo contrario 1 por defecto por visuales
        });

        // Actividades recientes reales del estudiante basadas en sus notas
        const realRecentActivities = myGrades.map((g: any) => {
          // evaluacionCuNota apunta al ID de la evaluación en el JSON respuesta
          const evaluation = allEvaluations.find((e: any) => e.id === g.evaluacionCuNota);
          const material = evaluation ? allMaterials.find((m: any) => m.id === evaluation.materialCuEvaluacion) : null;
          const assignment = material ? allAssignments.find((a: any) => a.id === material.asignacionCuAsIdMaterial) : null;
          const course = assignment ? allCourses.find((c: any) => c.id === (assignment.cursoIdAsignacionCuAs ?? assignment.cursoIdAsignacion)) : null;

          return {
            id: g.id.toString(),
            courseName: course ? course.nombreCurso : "Refuerzo Escolar",
            activityName: evaluation ? evaluation.tituloEvaluacion : "Quiz Completado",
            type: "quiz" as const,
            points: Math.round(g.calificacionNota),
            completedAt: new Date().toISOString()
          };
        });

        setRecentActivitiesList(realRecentActivities.length > 0 ? realRecentActivities : recentActivities.slice(0, 5));
      } catch (err) {
        console.error(
          "Error loading student dashboard data, loading fallback mock data:",
          err,
        );
        // Fallback completo a datos Mock
        setStudentData({
          name: user.name || currentStudent.name,
          avatar: user.name ? user.name[0] : currentStudent.avatar,
          points: currentStudent.points,
          level: currentStudent.level,
          progress: currentStudent.progress,
          streak: currentStudent.streak,
        });
        setRanking(mockRanking);
        setStats({
          completed: 4,
          pending: 8,
          inProgress: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Cargando dashboard...
        </span>
      </div>
    );
  }

  const progressToNextLevel = getProgressToNextLevel(
    studentData?.points || 0,
    studentData?.level || "Bronce",
  );
  const pointsToNextLevel = getPointsToNextLevel(
    studentData?.points || 0,
    studentData?.level || "Bronce",
  );

  return (
    <div className="min-h-screen p-8">
      <StudentTutorial onTutorialEnd={markTutorialAsShown} />

      {/* Header */}
      <div className="student-header mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border-4 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {studentData?.avatar || "US"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-balance">
              Hola, {studentData?.name.split(" ")[0]}
            </h1>
            <div className="mt-1 flex items-center gap-3">
              <LevelBadge level={studentData?.level || "Bronce"} />
              <MultiplierIndicator streakDay={studentData?.streak || 0} />
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {motivationalMessage && (
          <Card className="bg-linear-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <Sparkles className="size-6 text-primary shrink-0" />
              <p className="text-sm font-medium italic text-pretty">
                {`"${motivationalMessage}"`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Help Button */}
        <button
          onClick={() => {
            const tutorialButton = document.getElementById(
              "start-student-tutorial",
            );
            if (tutorialButton) {
              tutorialButton.click();
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          <HelpCircle className="size-4" />
          Ver Tutorial
        </button>
      </div>

      {/* Stats Grid */}
      <div className="student-stats-grid mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Puntos Totales"
          value={(studentData?.points || 0).toLocaleString("es-ES")}
          subtitle={
            pointsToNextLevel
              ? `${pointsToNextLevel} para ${studentData?.level === "Bronce" ? "Plata" : "Oro"}`
              : "Nivel máximo"
          }
          icon={<Star className="size-6" />}
          valueClassName="text-primary"
        />
        <StatsCard
          title="Progreso General"
          value={`${studentData?.progress || 0}%`}
          subtitle="De todos los cursos"
          icon={<Target className="size-6" />}
        />
        <StatsCard
          title="Racha Actual"
          value={studentData?.streak || 0}
          subtitle={
            studentData?.streak === 1
              ? "semana consecutiva"
              : "semanas consecutivas"
          }
          icon={<Flame className="size-6" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Courses and Activity */}
        <div className="student-ranking lg:col-span-2 space-y-8">
          {/* Miniranking */}
          {ranking.length > 0 && (
            <MiniRanking
              ranking={ranking}
              currentUserId={user?.id || ""}
              limit={5}
            />
          )}
        </div>

        {/* Right Column - Activity Summary */}
        <div className="space-y-8">
          <section className="student-recent-activity">
            <RecentActivityList activities={recentActivitiesList} />
          </section>

          {/* Quick Stats Card */}
          <Card className="student-activity-summary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumen de Actividad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">
                  Actividades completadas
                </span>
                <span className="font-semibold">{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">
                  Actividades en progreso
                </span>
                <span className="font-semibold">{stats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">
                  Actividades pendientes
                </span>
                <span className="font-semibold">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
