'use client'
import { toast } from 'sonner'
//weekly-courses/app/(dashboard)/teacher/students/page.tsx

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LevelBadge } from '@/components/custom/level-badge'
import { Badge } from '@/components/ui/badge'
import { config } from '@/lib/config-api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchApi } from '@/lib/api' // <-- Importamos nuestro interceptor
import { handleDeleteStudent, getAllEnrollments, getAllAssignments, getAllCourses, getAllStudents } from '@/services/services'
import {
  Search,
  Trash2,
  Pencil,
  Filter,
  Users,
  Mail,
  BookOpen,
  Flame,
  TrendingUp,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export default function TeacherStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<'all' | 'Oro' | 'Plata' | 'Bronce'>('all')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  // ESTADOS PARA LA HU-10 (Notas del Backend)
  const [notasReales, setNotasReales] = useState<any[]>([])
  const [cargandoNotas, setCargandoNotas] = useState(false)

  const [students, setStudents] = useState<any[]>([])

  // Form: Editar Estudiante
  const [tick, setTick] = useState(0)
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false)
  const [editStudentId, setEditStudentId] = useState<string | null>(null)
  const [editStudentNombre, setEditStudentNombre] = useState('')
  const [editStudentApellido, setEditStudentApellido] = useState('')
  const [editStudentEmail, setEditStudentEmail] = useState('')
  const [editStudentPass, setEditStudentPass] = useState('')
  const [updatingStudent, setUpdatingStudent] = useState(false)

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editStudentId || !editStudentNombre.trim() || !editStudentApellido.trim() || !editStudentEmail.trim()) return
    setUpdatingStudent(true)

    try {
      await fetchApi(`/estudiante/updateEstudiante/${editStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreEstudiante: editStudentNombre,
          apellidoEstudiante: editStudentApellido,
          correoEstudiante: editStudentEmail,
          contrasenaEstudiante: editStudentPass
        })
      })

      toast.success("¡Estudiante Actualizado!", {
        description: `Los datos de ${editStudentNombre} han sido modificados con éxito.`,
      })

      setIsEditStudentOpen(false)
      setTick(t => t + 1)
    } catch (err) {
      toast.error("Error al Actualizar", {
        description: "Hubo un error al modificar el estudiante en el servidor."
      })
    } finally {
      setUpdatingStudent(false)
    }
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      try {
        const [allSts, allEnrollments, allAssignments, allCourses] = await Promise.all([
          getAllStudents(),
          getAllEnrollments(),
          getAllAssignments(),
          getAllCourses()
        ]);

        // Obtener el ID del docente logueado desde localStorage
        const userStr = localStorage.getItem('user');
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

        // Obtener asignaciones vinculadas a este docente
        const docenteAssignments = allAssignments.filter((a: any) => {
          const assTeacherId = a.asistenteIdAsignacionCuAs || a.asistenteIdAsignacion || (a.asistente?.id) || (a.asistente?.idEmpleado);
          return assTeacherId === teacherId;
        });

        // Obtener IDs de asignaciones del docente
        const docenteAssignmentIds = docenteAssignments.map((a: any) => a.id || a.idAsignacion);

        // Obtener inscripciones para estas asignaciones
        const docenteEnrollments = allEnrollments.filter((e: any) => 
          docenteAssignmentIds.includes(e.asignacionIdInscripcion)
        );

        // Obtener IDs de estudiantes inscritos
        const docenteStudentIds = docenteEnrollments.map((e: any) => e.estudianteIdInscripcion);

        // Filtrar estudiantes de la base de datos
        const filteredSts = allSts.filter((s: any) => {
          const studentId = s?.id || s?.idEstudiante;
          return studentId && docenteStudentIds.includes(studentId);
        });

        const mapped = filteredSts.map((s: any) => {
          const studentId = s?.id || s?.idEstudiante;
          const studentEnrollments = studentId ? allEnrollments.filter((e: any) => e.estudianteIdInscripcion === studentId) : [];
          const totalPoints = studentEnrollments.reduce((sum: number, e: any) => sum + (e.totalPuntosInscripcion || 0), 0);

          let level: "Bronce" | "Plata" | "Oro" = "Bronce";
          if (totalPoints >= 3000) level = "Oro";
          else if (totalPoints >= 2000) level = "Plata";

          const studentCourses = studentEnrollments.map((enrollment: any) => {
            const assignment = allAssignments.find((a: any) => (a.id || a.idAsignacion) === enrollment.asignacionIdInscripcion);
            if (!assignment) return null;
            const course = allCourses.find((c: any) => (c.id || c.idCurso) === (assignment.cursoIdAsignacionCuAs || assignment.cursoIdAsignacion));
            if (!course) return null;

            const progress = enrollment.totalPuntosInscripcion > 0 ? Math.min(100, enrollment.totalPuntosInscripcion) : 0;
            
            // Map icon based on name
            const lowerName = course.nombreCurso.toLowerCase();
            let icon = '📚';
            if (lowerName.includes('mat')) icon = '📐';
            else if (lowerName.includes('fis') || lowerName.includes('phy')) icon = '⚡';
            else if (lowerName.includes('qui') || lowerName.includes('chem')) icon = '🧪';
            else if (lowerName.includes('prog') || lowerName.includes('code')) icon = '💻';

            return {
              id: (course.id || course.idCurso).toString(),
              name: course.nombreCurso,
              icon: icon,
              progress: progress,
              enrollmentId: enrollment.id || enrollment.idInscripcion
            };
          }).filter(Boolean);

          const progress = studentCourses.length > 0 
            ? Math.round(studentCourses.reduce((sum: number, c: any) => sum + c.progress, 0) / studentCourses.length)
            : 0;

          const nombre = s?.nombreEstudiante || "";
          const apellido = s?.apellidoEstudiante || "";
          const correo = s?.correoEstudiante || "";
          const avatarStr = nombre && apellido ? `${nombre[0]}${apellido[0]}` : "E";

          return {
            id: studentId?.toString() || "",
            name: nombre && apellido ? `${nombre} ${apellido}` : "Estudiante Sin Nombre",
            email: correo,
            avatar: avatarStr,
            points: totalPoints,
            level: level,
            progress: progress,
            streak: 5,
            courses: studentCourses,
            rawNombre: nombre,
            rawApellido: apellido,
            rawPass: s?.contrasenaEstudiante || ""
          };
        });

        setStudents(mapped);
      } catch (err) {
        console.error("Error loading teacher students page data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tick]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === 'all' || student.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const selectedStudentData = selectedStudent
    ? students.find(s => s.id === selectedStudent)
    : null

  const studentCourses = selectedStudentData?.courses || []

  // EFECTO PARA TRAER LAS NOTAS DEL BACKEND CUANDO SE SELECCIONA UN ALUMNO
  useEffect(() => {
    if (selectedStudentData) {
      const fetchNotasDelBackend = async () => {
        setCargandoNotas(true)
        try {
          // Llamamos al endpoint usando el ID del estudiante (como lo configuraste en Spring Boot)
          const data = await fetchApi(`/nota/findNotasByEstudiante/${selectedStudentData.id}`)
          setNotasReales(data)
        } catch (error) {
          console.log("Endpoint de notas aún no disponible o falló.")
          setNotasReales([])
        } finally {
          setCargandoNotas(false)
        }
      }
      fetchNotasDelBackend()
    }
  }, [selectedStudentData])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando gestión de estudiantes...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="size-8 text-primary" />
          Gestión de Estudiantes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Visualiza y gestiona el progreso de tus estudiantes
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar estudiantes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as typeof levelFilter)}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filtrar por nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="Oro">Oro</SelectItem>
            <SelectItem value="Plata">Plata</SelectItem>
            <SelectItem value="Bronce">Bronce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Students List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Estudiantes ({filteredStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-all hover:bg-muted/50 cursor-pointer",
                    selectedStudent === student.id && "ring-2 ring-primary bg-primary/5"
                  )}
                >
                  <Avatar className="size-12">
                    <AvatarFallback className={cn(
                      selectedStudent === student.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}>
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{student.name}</p>
                      <LevelBadge level={student.level} size="sm" showIcon={false} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-primary">{student.points.toLocaleString('en-US')}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                      <Flame className={cn(
                        "size-3",
                        student.streak > 0 ? "text-orange-500" : ""
                      )} />
                      <span>{student.streak}d</span>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Student Detail Panel */}
        <div>
          {selectedStudentData ? (
            <Card className="sticky top-8">
              <CardHeader className="text-center pb-2 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                   <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => {
                     setEditStudentId(selectedStudentData.id);
                     setEditStudentNombre(selectedStudentData.rawNombre);
                     setEditStudentApellido(selectedStudentData.rawApellido);
                     setEditStudentEmail(selectedStudentData.email);
                     setEditStudentPass(selectedStudentData.rawPass);
                     setIsEditStudentOpen(true);
                   }}>
                     <Pencil className="size-4" />
                   </Button>
                   <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteStudent(selectedStudentData.id)}>
                     <Trash2 className="size-4" />
                   </Button>
                </div>
                <Avatar className="mx-auto size-20 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {selectedStudentData.avatar}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{selectedStudentData.name}</CardTitle>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span className="text-sm">{selectedStudentData.email}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedStudentData.points.toLocaleString('en-US')}
                    </p>
                    <p className="text-xs text-muted-foreground">Puntos</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center flex flex-col items-center justify-center">
                    <LevelBadge level={selectedStudentData.level} />
                    <p className="mt-1 text-xs text-muted-foreground">Nivel</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="size-4" />
                      Progreso General
                    </span>
                    <span className="font-medium">{selectedStudentData.progress}%</span>
                  </div>
                  <Progress value={selectedStudentData.progress} className="h-2" />
                </div>

                {/* Streak */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <Flame className={cn(
                      "size-5",
                      selectedStudentData.streak > 0 ? "text-orange-500" : "text-muted-foreground"
                    )} />
                    <span>Racha actual</span>
                  </div>
                  <span className="font-bold">
                    {selectedStudentData.streak} {selectedStudentData.streak === 1 ? 'día' : 'días'}
                  </span>
                </div>

                {/* HU-10: Panel de Puntajes por Actividad (Acordeón y Tabla) */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <BookOpen className="size-4" />
                    Desempeño por Curso ({studentCourses.length})
                  </h4>

                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {studentCourses.map((course: any) => (
                      <AccordionItem key={course.id} value={course.id} className="border rounded-lg px-3 bg-background">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 w-full pr-4">
                            <span className="text-xl">{course.icon}</span>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-medium truncate">{course.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={course.progress} className="h-1.5 flex-1" />
                                <span className="text-xs font-medium text-muted-foreground w-8 text-right">{course.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pt-2 pb-4">
                          <div className="rounded-md border max-h-[250px] overflow-y-auto">
                            <Table>
                              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                  <TableHead className="h-8 text-xs">Actividad</TableHead>
                                  <TableHead className="h-8 text-xs text-right">Puntaje</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {cargandoNotas ? (
                                  <TableRow>
                                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground text-xs">
                                      Cargando notas desde el servidor...
                                    </TableCell>
                                  </TableRow>
                                ) : (() => {
                                  const courseNotes = notasReales.filter((n: any) => 
                                    n.evaluacionCuNota?.inscripcionEsCuEvaluacion?.idInscripcion === course.enrollmentId
                                  );
                                  return courseNotes.length > 0 ? (
                                    // RENDERIZAMOS DATOS REALES DEL BACKEND FILTRADOS POR CURSO
                                    courseNotes.map((notaBackend, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="py-2">
                                          <div className="flex items-center gap-2">
                                            <CheckCircle2 className="size-3 text-success shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                              <span className="text-xs font-medium truncate max-w-[140px]" title={notaBackend.evaluacionCuNota?.tituloEvaluacion}>
                                                {notaBackend.evaluacionCuNota?.tituloEvaluacion || 'Evaluación'}
                                              </span>
                                              <span className="text-[10px] text-muted-foreground">
                                                {notaBackend.evaluacionCuNota?.materialCuEvaluacion?.tipoMaterial || 'Actividad'}
                                              </span>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-2 text-right">
                                          <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-none text-[10px]">
                                            {notaBackend.notaNota} pts
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={2} className="text-center py-4 text-muted-foreground text-xs">
                                        No hay notas registradas para este curso.
                                      </TableCell>
                                    </TableRow>
                                  );
                                })()}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-8">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="size-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">Selecciona un estudiante</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Haz clic en un estudiante para ver sus detalles y notas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL: EDITAR ESTUDIANTE */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Estudiante</DialogTitle>
            <DialogDescription>
              Modifica los datos personales y de acceso del estudiante.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStudent} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStuNombre">Nombre</Label>
                <Input
                  id="editStuNombre"
                  value={editStudentNombre}
                  onChange={(e) => setEditStudentNombre(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStuApellido">Apellido</Label>
                <Input
                  id="editStuApellido"
                  value={editStudentApellido}
                  onChange={(e) => setEditStudentApellido(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStuEmail">Correo Electrónico</Label>
              <Input
                id="editStuEmail"
                type="email"
                value={editStudentEmail}
                onChange={(e) => setEditStudentEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStuPass">Contraseña</Label>
              <Input
                id="editStuPass"
                type="text"
                value={editStudentPass}
                onChange={(e) => setEditStudentPass(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="submit" disabled={updatingStudent}>
                {updatingStudent ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}