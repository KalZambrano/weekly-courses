'use client'
import { toast } from 'sonner'
//weekly-courses/app/(dashboard)/student/courses/page.tsx

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { courses as mockCourses } from '@/data/mock-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/custom/course-card'
import { PointsSystemInfo } from '@/components/custom/points-system-info'
import { Search, BookOpen, Filter, Loader2 } from 'lucide-react'
import { getAllEnrollments, getAllCourses, getAllAssignments } from '@/services/services'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CoursesPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!user) return

    const loadCoursesData = async () => {
      try {
        if (!user.id) {
          throw new Error("No user ID found, using fallback courses.");
        }

        if (user.role === 'teacher') {
          const teacherId = parseInt(user.id)
          const [allAssignments, allCourses] = await Promise.all([
            getAllAssignments(),
            getAllCourses()
          ])

          const myAssignments = allAssignments.filter((a: any) => {
            const assTeacherId = a.asistenteIdAsignacionCuAs || a.asistenteIdAsignacion || (a.asistente?.id) || (a.asistente?.idEmpleado);
            return assTeacherId === teacherId;
          });

          const mappedCourses = myAssignments.map((assignment: any) => {
            const course = allCourses.find((c: any) => 
              (c.id || c.idCurso) === (assignment.cursoIdAsignacionCuAs || assignment.cursoIdAsignacion)
            );
            if (!course) return null;

            return {
              id: (course.id ?? course.idCurso ?? "").toString(),
              enrollmentId: `sim-${assignment.id}`,
              name: course.nombreCurso,
              description: course.descripcionCurso,
              progress: 40,
              activitiesCount: 12,
              completedCount: 5,
              color: "indigo"
            };
          }).filter((c: any) => c !== null);

          const uniqueCourses = mappedCourses.filter((course: any, index: number, self: any[]) =>
            self.findIndex((c) => c.id === course.id) === index
          );

          setEnrolledCourses(uniqueCourses.length > 0 ? uniqueCourses : mockCourses);
          return;
        }

        const studentId = parseInt(user.id)
        
        // Fetch enrollments for this student
        const myEnrollments = await getAllEnrollments(studentId);

        // Map to course details using nested assignment and course data from backend
        const mappedCourses = myEnrollments.map((enrollment: any) => {
          const course = enrollment.asignacion?.curso;
          if (!course) return null;

          const progress = enrollment.totalPuntosInscripcion > 0 ? Math.min(100, enrollment.totalPuntosInscripcion) : 0;
          
          return {
            id: (course.id ?? course.idCurso ?? "").toString(),
            enrollmentId: (enrollment.id ?? enrollment.idInscripcion ?? "").toString(),
            name: course.nombreCurso,
            description: course.descripcionCurso,
            progress: progress,
            activitiesCount: 12,
            completedCount: progress >= 100 ? 12 : Math.round((progress / 100) * 12),
            color: "indigo"
          };
        }).filter((c: any) => c !== null);

        // Filter duplicates by course ID to guarantee unique cards for the student
        const uniqueCourses = mappedCourses.filter((course: any, index: number, self: any[]) =>
          self.findIndex((c) => c.id === course.id) === index
        );

        setEnrolledCourses(uniqueCourses);
      } catch (err) {
        console.error("Error loading student courses, using mock data:", err);
        setEnrolledCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando tus cursos...</span>
      </div>
    )
  }
  
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'in-progress') return matchesSearch && course.progress > 0 && course.progress < 100
    if (filter === 'completed') return matchesSearch && course.progress === 100
    return matchesSearch
  })
  
  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: enrolledCourses.filter(c => c.progress === 100).length
  }
  
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="size-8 text-primary" />
          Mis Cursos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explora y continúa tu aprendizaje
        </p>
      </div>
      
      {/* Points System Info */}
      <div className="mb-8">
        <PointsSystemInfo />
      </div>
      
      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="gap-2"
        >
          Todos
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
            {stats.total}
          </span>
        </Button>
        <Button 
          variant={filter === 'in-progress' ? 'default' : 'outline'}
          onClick={() => setFilter('in-progress')}
          className="gap-2"
        >
          En progreso
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
            {stats.inProgress}
          </span>
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          className="gap-2"
        >
          Completados
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
            {stats.completed}
          </span>
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="recent">
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="progress">Mayor progreso</SelectItem>
            <SelectItem value="name">Nombre A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
          <BookOpen className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No tienes cursos inscritos aún</h3>
          <p className="mt-2 text-muted-foreground">
            Comunícate con tu profesor o administrador para inscribirte en un curso.
          </p>
        </div>
      )}
    </div>
  )
}
