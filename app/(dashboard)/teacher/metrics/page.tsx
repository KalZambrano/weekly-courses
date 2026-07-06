'use client'
//weekly-courses/app/(dashboard)/teacher/metrics/page.tsx

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  BarChart3, 
  TrendingUp, 
  Users, 
  Trophy,
  Target,
  Flame,
  BookOpen,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TeacherMetricsPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    avgPoints: 0,
    avgStreak: 0,
    completionRate: 0,
    completedActivities: 0,
    totalPoints: 0,
    coursesCount: 0,
  })
  
  const [levelCounts, setLevelCounts] = useState({ Oro: 0, Plata: 0, Bronce: 0 })
  const [progressRanges, setProgressRanges] = useState<any[]>([])
  const [streakRanges, setStreakRanges] = useState<any[]>([])
  const [teacherCourses, setTeacherCourses] = useState<any[]>([])

  useEffect(() => {
    const loadRealMetricsData = async () => {
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
          const points = sEnrollments.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion || 0), 0);

          let level: "Bronce" | "Plata" | "Oro" = "Bronce";
          if (points >= 3000) level = "Oro";
          else if (points >= 2000) level = "Plata";

          const sCourses = sEnrollments.map((e: any) => {
            const assignment = docenteAssignments.find((a: any) => (a.id || a.idAsignacion) === e.asignacionIdInscripcion);
            const course = allCourses.find((c: any) => (c.id || c.idCurso) === (assignment?.cursoIdAsignacionCuAs || assignment?.cursoIdAsignacion));
            return course ? { id: course.id || course.idCurso, progress: e.totalPuntosInscripcion > 0 ? Math.min(100, e.totalPuntosInscripcion) : 0 } : null;
          }).filter(Boolean);

          const progress = sCourses.length > 0
            ? Math.round(sCourses.reduce((sum: number, c: any) => sum + c.progress, 0) / sCourses.length)
            : 0;

          // Simular racha real o por racha calculada (si hay notas es al menos 3, si no es 0)
          const streak = points > 0 ? 3 : 0;

          return {
            id: sId.toString(),
            points: points,
            level: level,
            progress: progress,
            streak: streak
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

        setTeacherCourses(mappedCourses);

        // 6. Actividades / Calificaciones completadas reales del docente
        const docenteMaterials = allMaterials.filter((m: any) => docenteAssignmentIds.includes(m.asignacionCuAsIdMaterial));
        const docenteMaterialIds = docenteMaterials.map((m: any) => m.id);
        
        // Evaluaciones de los materiales del docente
        const docenteEvaluations = allEvaluations.filter((ev: any) => docenteMaterialIds.includes(ev.materialCuEvaluacion));
        const docenteEvaluationIds = docenteEvaluations.map((ev: any) => ev.id);

        // Calificaciones reales de estudiantes en evaluaciones del docente
        const docenteGrades = allGrades.filter((g: any) => docenteEvaluationIds.includes(g.evaluacionCuNota));
        const completedCount = docenteGrades.length;

        // Actividades esperadas
        const expectedTotalActivities = docenteEvaluations.reduce((sum: number, ev: any) => {
          const mat = docenteMaterials.find((m: any) => m.id === ev.materialCuEvaluacion);
          const assId = mat?.asignacionCuAsIdMaterial;
          const enrolledCount = docenteEnrollments.filter((e: any) => e.asignacionIdInscripcion === assId).length;
          return sum + enrolledCount;
        }, 0);

        const completionRate = expectedTotalActivities > 0 ? Math.round((completedCount / expectedTotalActivities) * 100) : 0;

        // Calcular promedio de puntos y racha
        const totalPointsSum = mappedStudents.reduce((sum: number, s: any) => sum + s.points, 0);
        const avgPoints = mappedStudents.length > 0 ? totalPointsSum / mappedStudents.length : 0;

        const totalStreakSum = mappedStudents.reduce((sum: number, s: any) => sum + s.streak, 0);
        const avgStreak = mappedStudents.length > 0 ? totalStreakSum / mappedStudents.length : 0;

        setMetrics({
          totalStudents: mappedStudents.length,
          activeStudents: mappedStudents.filter((s: any) => s.streak > 0).length,
          avgPoints: avgPoints,
          avgStreak: avgStreak,
          completionRate: completionRate,
          completedActivities: completedCount,
          totalPoints: totalPointsSum,
          coursesCount: mappedCourses.length,
        });

        // NivelCounts
        setLevelCounts({
          Oro: mappedStudents.filter((s: any) => s.level === 'Oro').length,
          Plata: mappedStudents.filter((s: any) => s.level === 'Plata').length,
          Bronce: mappedStudents.filter((s: any) => s.level === 'Bronce').length
        });

        // Progress ranges
        setProgressRanges([
          { label: '0-25%', count: mappedStudents.filter((s: any) => s.progress <= 25).length, color: 'bg-red-500' },
          { label: '26-50%', count: mappedStudents.filter((s: any) => s.progress > 25 && s.progress <= 50).length, color: 'bg-orange-500' },
          { label: '51-75%', count: mappedStudents.filter((s: any) => s.progress > 50 && s.progress <= 75).length, color: 'bg-yellow-500' },
          { label: '76-100%', count: mappedStudents.filter((s: any) => s.progress > 75).length, color: 'bg-green-500' }
        ]);

        // Streak ranges
        setStreakRanges([
          { label: 'Sin racha', count: mappedStudents.filter((s: any) => s.streak === 0).length },
          { label: '1-3 días', count: mappedStudents.filter((s: any) => s.streak >= 1 && s.streak <= 3).length },
          { label: '4-7 días', count: mappedStudents.filter((s: any) => s.streak >= 4 && s.streak <= 7).length },
          { label: '8+ días', count: mappedStudents.filter((s: any) => s.streak >= 8).length }
        ]);

      } catch (err) {
        console.error("Error loading real teacher metrics analyses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRealMetricsData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Cargando análisis y métricas...
        </span>
      </div>
    );
  }

  const safeTotalStudents = metrics.totalStudents === 0 ? 1 : metrics.totalStudents;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="size-8 text-primary" />
          Métricas y Análisis
        </h1>
        <p className="mt-2 text-muted-foreground">
          Estadísticas detalladas del rendimiento estudiantil
        </p>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estudiantes Activos</p>
                <p className="text-2xl font-bold">
                  {metrics.activeStudents}/{metrics.totalStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gold/10 p-3">
                <Trophy className="size-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio de Puntos</p>
                <p className="text-2xl font-bold">{metrics.avgPoints.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Flame className="size-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Racha Promedio</p>
                <p className="text-2xl font-bold">{metrics.avgStreak.toFixed(1)} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <CheckCircle2 className="size-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Completado</p>
                <p className="text-2xl font-bold">
                  {metrics.completionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              Distribución por Nivel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-8 py-8">
              {/* Bronze Bar */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-2xl font-bold">{levelCounts.Bronce}</span>
                <div 
                  className="w-20 rounded-t-lg bg-bronze transition-all"
                  style={{ height: `${(levelCounts.Bronce / safeTotalStudents) * 150}px`, minHeight: '20px' }}
                />
                <span className="mt-2 text-sm font-medium">Bronce</span>
              </div>
              
              {/* Silver Bar */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-2xl font-bold">{levelCounts.Plata}</span>
                <div 
                  className="w-20 rounded-t-lg bg-silver transition-all"
                  style={{ height: `${(levelCounts.Plata / safeTotalStudents) * 150}px`, minHeight: '20px' }}
                />
                <span className="mt-2 text-sm font-medium">Plata</span>
              </div>
              
              {/* Gold Bar */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-2xl font-bold">{levelCounts.Oro}</span>
                <div 
                  className="w-20 rounded-t-lg bg-gold transition-all"
                  style={{ height: `${(levelCounts.Oro / safeTotalStudents) * 150}px`, minHeight: '20px' }}
                />
                <span className="mt-2 text-sm font-medium">Oro</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-primary" />
              Distribución de Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressRanges.length > 0 ? (
              progressRanges.map((range) => (
                <div key={range.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{range.label}</span>
                    <span className="font-medium">{range.count} estudiantes</span>
                  </div>
                  <div className="h-4 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn("h-full transition-all", range.color)}
                      style={{ width: `${(range.count / safeTotalStudents) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Ninguna distribución de progreso calculada.
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Streak Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="size-5 text-orange-500" />
              Distribución de Rachas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {streakRanges.length > 0 ? (
                streakRanges.map((range, index) => (
                  <div 
                    key={range.label}
                    className={cn(
                      "rounded-lg p-4 text-center",
                      index === 0 ? "bg-muted/50" : "bg-orange-500/10"
                    )}
                  >
                    <p className="text-3xl font-bold">{range.count}</p>
                    <p className="text-sm text-muted-foreground">{range.label}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-4 text-center text-muted-foreground">
                  Ninguna distribución de rachas calculada.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Course Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Progreso por Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teacherCourses.length > 0 ? (
              teacherCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{course.icon}</span>
                      <span className="text-sm font-medium">{course.name}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No hay cursos asignados a este docente.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{metrics.totalStudents}</p>
              <p className="text-muted-foreground">Total estudiantes</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{metrics.coursesCount}</p>
              <p className="text-muted-foreground">Cursos gestionados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{metrics.completedActivities}</p>
              <p className="text-muted-foreground">Actividades completadas</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{metrics.totalPoints.toLocaleString()}</p>
              <p className="text-muted-foreground">Puntos otorgados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
