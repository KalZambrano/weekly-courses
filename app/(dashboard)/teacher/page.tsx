'use client'
//weekly-courses/app/(dashboard)/teacher/page.tsx

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { StatsCard } from '@/components/custom/stats-card'
import { LevelBadge } from '@/components/custom/level-badge'
import { TeacherTutorial } from '@/components/tutorials/teacher-tutorial'
import { useTutorial } from '@/hooks/useTutorial'
import { Loader2 } from 'lucide-react'
import { 
  getAllStudents,
  getAllEnrollments,
  getAllAssignments,
  getAllCourses,
  getAllMaterials,
  getAllGrades,
  getAllEvaluations
} from '@/services/services'
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TeacherDashboard() {
  const { shouldShowTutorial, isLoading: tutorialLoading, markTutorialAsShown } = useTutorial('teacher');
  const [teacherName, setTeacherName] = useState<string>('Docente')
  
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completedActivities: 0,
    pendingActivities: 0,
    totalPoints: 0,
  })
  const [dashboardCourses, setDashboardCourses] = useState<any[]>([])
  const [dashboardStudents, setDashboardStudents] = useState<any[]>([])
  const [levelDistribution, setLevelDistribution] = useState({ Oro: 0, Plata: 0, Bronce: 0 })
  const [topPerformers, setTopPerformers] = useState<any[]>([])
  const [needsAttention, setNeedsAttention] = useState<any[]>([])

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        if (parsed && parsed.name) {
          setTeacherName(parsed.name)
        }
      } catch (e) {
        console.error("Error parsing user from localStorage in dashboard:", e)
      }
    }
  }, [])

  useEffect(() => {
    const loadRealDashboardData = async () => {
      setLoading(true)
      try {
        const userStr = localStorage.getItem('user')
        let teacherId: number | null = null;
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            if (parsed && parsed.id) {
              teacherId = parseInt(parsed.id);
            }
          } catch (e) {
            console.error("Error parsing user from localStorage:", e);
          }
        }

        const [
          allStudents,
          allEnrollments,
          allAssignments,
          allCourses,
          allMaterials,
          allGrades,
          allEvaluations,
        ] = await Promise.all([
          getAllStudents().catch(() => []),
          getAllEnrollments().catch(() => []),
          getAllAssignments().catch(() => []),
          getAllCourses().catch(() => []),
          getAllMaterials().catch(() => []),
          getAllGrades().catch(() => []),
          getAllEvaluations().catch(() => []),
        ]);

        // 1. Filtrar asignaciones del docente
        const docenteAssignments = allAssignments.filter((a: any) => {
          const assTeacherId = a.asistenteIdAsignacionCuAs || a.asistenteIdAsignacion || (a.asistente?.id) || (a.asistente?.idEmpleado);
          return assTeacherId === teacherId;
        });
        const docenteAssignmentIds = docenteAssignments.map((a: any) => a.id || a.idAsignacion);

        // 2. Filtrar inscripciones de estas asignaciones
        const docenteEnrollments = allEnrollments.filter((e: any) => 
          docenteAssignmentIds.includes(e.asignacionIdInscripcion)
        );

        // 3. Estudiantes del docente
        const docenteStudentIds = Array.from(new Set(docenteEnrollments.map((e: any) => e.estudianteIdInscripcion)));
        const docenteStsList = allStudents.filter((s: any) => {
          const sId = s.id || s.idEstudiante;
          return sId && docenteStudentIds.includes(sId);
        });

        // 4. Mapear datos detallados para estudiantes del docente
        const mappedStudents = docenteStsList.map((s: any) => {
          const sId = s.id || s.idEstudiante;
          const sEnrollments = docenteEnrollments.filter((e: any) => e.estudianteIdInscripcion === sId);
          
          // Puntos acumulados del estudiante en los cursos del docente
          const points = sEnrollments.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion || 0), 0);

          let level: "Bronce" | "Plata" | "Oro" = "Bronce";
          if (points >= 3000) level = "Oro";
          else if (points >= 2000) level = "Plata";

          // Cursos de este alumno con este docente
          const sCourses = sEnrollments.map((e: any) => {
            const assignment = docenteAssignments.find((a: any) => (a.id || a.idAsignacion) === e.asignacionIdInscripcion);
            const course = allCourses.find((c: any) => (c.id || c.idCurso) === (assignment?.cursoIdAsignacionCuAs || assignment?.cursoIdAsignacion));
            return course ? { id: course.id || course.idCurso, progress: e.totalPuntosInscripcion > 0 ? Math.min(100, e.totalPuntosInscripcion) : 0 } : null;
          }).filter(Boolean);

          const progress = sCourses.length > 0
            ? Math.round(sCourses.reduce((sum: number, c: any) => sum + c.progress, 0) / sCourses.length)
            : 0;

          const nombre = s.nombreEstudiante || "";
          const apellido = s.apellidoEstudiante || "";
          const avatar = nombre && apellido ? `${nombre[0]}${apellido[0]}` : "E";

          return {
            id: sId.toString(),
            name: `${nombre} ${apellido}`,
            email: s.correoEstudiante || "",
            avatar: avatar,
            points: points,
            level: level,
            progress: progress,
            streak: 3, // simulación de racha
          };
        });

        // 5. Cursos del docente
        const mappedCourses = docenteAssignments.map((a: any) => {
          const course = allCourses.find((c: any) => (c.id || c.idCurso) === (a.cursoIdAsignacionCuAs || a.cursoIdAsignacion));
          if (!course) return null;

          const assId = a.id || a.idAsignacion;
          const courseEnrs = docenteEnrollments.filter((e: any) => e.asignacionIdInscripcion === assId);
          const enrolledCount = courseEnrs.length;
          
          const progressSum = courseEnrs.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion > 0 ? Math.min(100, e.totalPuntosInscripcion) : 0), 0);
          const courseProgress = enrolledCount > 0 ? Math.round(progressSum / enrolledCount) : 0;

          // Icono según curso
          const lowerName = course.nombreCurso.toLowerCase();
          let icon = '📚';
          if (lowerName.includes('mat')) icon = '📐';
          else if (lowerName.includes('fis') || lowerName.includes('phy')) icon = '⚡';
          else if (lowerName.includes('qui') || lowerName.includes('chem')) icon = '🧪';
          else if (lowerName.includes('prog') || lowerName.includes('code')) icon = '💻';

          return {
            id: course.id || course.idCurso,
            name: course.nombreCurso,
            icon: icon,
            progress: courseProgress,
            enrolledCount: enrolledCount
          };
        }).filter(Boolean);

        // 6. Actividades / Calificaciones completadas reales del docente
        const docenteMaterials = allMaterials.filter((m: any) => docenteAssignmentIds.includes(m.asignacionCuAsIdMaterial));
        const docenteMaterialIds = docenteMaterials.map((m: any) => m.id);
        
        // Evaluaciones de los materiales del docente
        const docenteEvaluations = allEvaluations.filter((ev: any) => docenteMaterialIds.includes(ev.materialCuEvaluacion));
        const docenteEvaluationIds = docenteEvaluations.map((ev: any) => ev.id);

        // Calificaciones reales de estudiantes en evaluaciones del docente
        const docenteGrades = allGrades.filter((g: any) => docenteEvaluationIds.includes(g.evaluacionCuNota));
        const completedCount = docenteGrades.length;

        // Actividades pendientes
        const expectedTotalActivities = docenteEvaluations.reduce((sum: number, ev: any) => {
          const mat = docenteMaterials.find((m: any) => m.id === ev.materialCuEvaluacion);
          const assId = mat?.asignacionCuAsIdMaterial;
          const enrolledCount = docenteEnrollments.filter((e: any) => e.asignacionIdInscripcion === assId).length;
          return sum + enrolledCount;
        }, 0);

        const pendingCount = Math.max(0, expectedTotalActivities - completedCount);

        // Puntos totales otorgados reales del docente
        const totalPointsAwarded = docenteEnrollments.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion || 0), 0);

        // Promedio de progreso global del docente
        const globalProgressSum = mappedStudents.reduce((sum: number, s: any) => sum + s.progress, 0);
        const globalAverageProgress = mappedStudents.length > 0 ? Math.round(globalProgressSum / mappedStudents.length) : 0;

        setMetrics({
          totalStudents: mappedStudents.length,
          activeStudents: mappedStudents.filter((s: any) => s.progress > 0).length,
          averageProgress: globalAverageProgress,
          completedActivities: completedCount,
          pendingActivities: pendingCount,
          totalPoints: totalPointsAwarded
        });

        setDashboardCourses(mappedCourses);
        setDashboardStudents(mappedStudents);

        // Distribución por nivel
        const dist = {
          Oro: mappedStudents.filter((s: any) => s.level === 'Oro').length,
          Plata: mappedStudents.filter((s: any) => s.level === 'Plata').length,
          Bronce: mappedStudents.filter((s: any) => s.level === 'Bronce').length
        };
        setLevelDistribution(dist);

        // Top Performers
        const sortedTop = [...mappedStudents].sort((a: any, b: any) => b.points - a.points).slice(0, 5);
        setTopPerformers(sortedTop);

        // Requieren atención
        const sortedAttention = [...mappedStudents].sort((a: any, b: any) => a.progress - b.progress).slice(0, 3);
        setNeedsAttention(sortedAttention);

      } catch (err) {
        console.error("Error loading real dashboard teacher metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRealDashboardData();
  }, []);

  useEffect(() => {
    // Auto-start tutorial if it should be shown and everything is loaded
    if (!tutorialLoading && shouldShowTutorial) {
      const timer = setTimeout(() => {
        const tutorialButton = document.getElementById('start-teacher-tutorial');
        if (tutorialButton) {
          tutorialButton.click();
        }
      }, 500); // Small delay to ensure DOM is ready
      return () => clearTimeout(timer);
    }
  }, [tutorialLoading, shouldShowTutorial]);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Cargando panel del docente...
        </span>
      </div>
    );
  }

  const totalStsCount = dashboardStudents.length;
  const safeTotalStudents = totalStsCount === 0 ? 1 : totalStsCount;

  return (
    <div className="min-h-screen p-8">
      <TeacherTutorial onTutorialEnd={markTutorialAsShown} />
      
      {/* Header */}
      <div className="teacher-header mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hola, {teacherName} (Docente)</h1>
          <p className="mt-2 text-muted-foreground">
            Monitorea el progreso y rendimiento de tus estudiantes
          </p>
        </div>
        {/* Help Button */}
        <button
          onClick={() => {
            const tutorialButton = document.getElementById('start-teacher-tutorial');
            if (tutorialButton) {
              tutorialButton.click();
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors w-fit"
        >
          <HelpCircle className="size-4" />
          Ver Tutorial
        </button>
      </div>
      
      {/* Key Metrics */}
      <div className="teacher-key-metrics mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Estudiantes"
          value={metrics.totalStudents}
          subtitle={`${metrics.activeStudents} activos`}
          icon={<Users className="size-6" />}
        />
        <StatsCard
          title="Progreso Promedio"
          value={`${metrics.averageProgress}%`}
          subtitle="De todos los cursos"
          icon={<TrendingUp className="size-6" />}
          valueClassName="text-primary"
        />
        <StatsCard
          title="Actividades Completadas"
          value={metrics.completedActivities}
          subtitle={`${metrics.pendingActivities} pendientes`}
          icon={<CheckCircle2 className="size-6" />}
        />
        <StatsCard
          title="Puntos Otorgados"
          value={metrics.totalPoints.toLocaleString()}
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
            <CardContent className="teacher-course-overview space-y-4">
              {dashboardCourses.length > 0 ? (
                dashboardCourses.map((course) => (
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
                      <p className="text-2xl font-bold">{course.enrolledCount}</p>
                      <p className="text-xs text-muted-foreground">estudiantes</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No hay cursos asignados a este docente en la base de datos.
                </div>
              )}
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
            <CardContent className="teacher-students-table">
              <div className="overflow-x-auto">
                {dashboardStudents.length > 0 ? (
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
                      {dashboardStudents.map((student) => (
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
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Ningún estudiante matriculado en tus cursos aún.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="teacher-level-distribution flex items-center gap-2 text-lg">
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
                      style={{ width: `${(levelDistribution.Oro / safeTotalStudents) * 100}%` }}
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
                      style={{ width: `${(levelDistribution.Plata / safeTotalStudents) * 100}%` }}
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
                      style={{ width: `${(levelDistribution.Bronce / safeTotalStudents) * 100}%` }}
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
              <CardTitle className="teacher-top-performers flex items-center gap-2 text-lg">
                <Trophy className="size-5 text-gold" />
                Top Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPerformers.length > 0 ? (
                topPerformers.map((student, index) => (
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
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Ningún estudiante registrado en el curso aún.
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Students Needing Attention */}
          <Card>
            <CardHeader>
              <CardTitle className="teacher-needs-attention flex items-center gap-2 text-lg">
                <Clock className="size-5 text-destructive" />
                Requieren Atención
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {needsAttention.length > 0 ? (
                needsAttention.map((student) => (
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
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Todos tus estudiantes tienen un progreso excelente.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
