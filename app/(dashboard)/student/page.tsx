"use client";
import { toast } from 'sonner'
//weekly-courses/app/(dashboard)/student/page.tsx

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/custom/stats-card";
import { LevelBadge } from "@/components/custom/level-badge";
import { MultiplierIndicator } from "@/components/custom/multiplier-indicator";
import { MiniRanking } from "@/components/custom/mini-ranking";
import { RecentActivityList } from "@/components/custom/recent-activity-list";
import { Loader2 } from "lucide-react";
import {
  currentStudent,
  recentActivities,
  motivationalMessages,
  ranking as mockRanking,
} from "@/data/mock-data";
import {
  getProgressToNextLevel,
  getPointsToNextLevel,
  getMotivationalMessage,
} from "@/lib/gamification";
import { Star, Target, Flame, Sparkles } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
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
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        if (!user.id) {
          throw new Error("No user ID found, using fallback dashboard data.");
        }

        // 1. Obtener la lista de todos los estudiantes para el Ranking y perfil
        const allStudents = await fetchApi("/estudiante/listEstudiantes").catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          });
        
        // Buscar el estudiante activo en la lista real del backend
        const realStudent = allStudents.find((s: any) => s.idEstudiante.toString() === user.id);
        
        // 2. Obtener inscripciones
        const enrollments = await fetchApi("/inscripcion/listInscripciones").catch((e) => {
            toast.error("Error de conexión", { description: "No se pudieron cargar los datos solicitados." })
            return []
          });
        
        // Filtrar las inscripciones del estudiante actual
        const studentId = parseInt(user.id);
        const myEnrollments = enrollments.filter((e: any) => e.estudianteIdInscripcion === studentId);

        // Calcular puntos y progreso general
        const points = myEnrollments.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion || 0), 0);
        
        // Determinar nivel basado en puntos (gamification frontend)
        let level: "Bronce" | "Plata" | "Oro" = "Bronce";
        if (points >= 3000) level = "Oro";
        else if (points >= 2000) level = "Plata";

        // Ordenar estudiantes para el ranking
        const sortedRanking = allStudents
          .map((s: any) => {
            // Sumar puntos de sus inscripciones
            const sEnrollments = enrollments.filter((e: any) => e.estudianteIdInscripcion === s.idEstudiante);
            const sPoints = sEnrollments.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion || 0), 0);
            
            let sLevel: "Bronce" | "Plata" | "Oro" = "Bronce";
            if (sPoints >= 3000) sLevel = "Oro";
            else if (sPoints >= 2000) sLevel = "Plata";

            return {
              id: s.idEstudiante.toString(),
              name: `${s.nombreEstudiante} ${s.apellidoEstudiante}`,
              avatar: `${s.nombreEstudiante[0]}${s.apellidoEstudiante[0]}`,
              points: sPoints,
              level: sLevel,
            };
          })
          .sort((a: any, b: any) => b.points - a.points);

        setRanking(sortedRanking.length > 0 ? sortedRanking : mockRanking);

        // Setear datos de perfil
        setStudentData({
          name: realStudent ? `${realStudent.nombreEstudiante} ${realStudent.apellidoEstudiante}` : user.name,
          avatar: realStudent ? `${realStudent.nombreEstudiante[0]}${realStudent.apellidoEstudiante[0]}` : user.name[0],
          points: points,
          level: level,
          progress: myEnrollments.length > 0 ? Math.round(myEnrollments.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion > 100 ? 100 : e.totalPuntosInscripcion), 0) / myEnrollments.length) : 0,
          streak: realStudent ? 5 : 0, // mock racha para conservar visuales
        });

        // Setear estadísticas del resumen de actividades
        setStats({
          completed: myEnrollments.filter((e: any) => e.totalPuntosInscripcion >= 100).length,
          pending: 12 - myEnrollments.filter((e: any) => e.totalPuntosInscripcion >= 100).length,
          inProgress: myEnrollments.filter((e: any) => e.totalPuntosInscripcion > 0 && e.totalPuntosInscripcion < 100).length,
        });

      } catch (err) {
        console.error("Error loading student dashboard data, loading fallback mock data:", err);
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
        <span className="ml-3 text-muted-foreground">Cargando dashboard...</span>
      </div>
    );
  }

  const progressToNextLevel = getProgressToNextLevel(
    studentData?.points || 0,
    studentData?.level || "Bronce"
  );
  const pointsToNextLevel = getPointsToNextLevel(
    studentData?.points || 0,
    studentData?.level || "Bronce"
  );

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="lg:col-span-2 space-y-8">
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
          <section>
            <RecentActivityList activities={recentActivities.slice(0, 5)} />
          </section>

          {/* Quick Stats Card */}
          <Card>
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
