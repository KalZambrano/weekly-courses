'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import { fetchApi } from '@/lib/api'
import { 
  getAllCourses, 
  getAllStudents, 
  getAllAssistants, 
  getAllAssignments, 
  getAllEnrollments 
} from '@/services/services'
import { 
  UserCheck, 
  BookCheck, 
  Plus, 
  Users, 
  BookOpen, 
  Calendar, 
  Loader2, 
  Award 
} from 'lucide-react'

export default function AdminAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'assignments' | 'enrollments'>('assignments')
  const [courses, setCourses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [assistants, setAssistants] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  // Modales
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isEnrollOpen, setIsEnrollOpen] = useState(false)

  // Formulario Asignación Docente -> Curso
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [submittingAssign, setSubmittingAssign] = useState(false)

  // Formulario Matrícula Estudiante -> Asignación
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [submittingEnroll, setSubmittingEnroll] = useState(false)

  // Estados de error para validaciones visuales
  const [errCreateAssignment, setErrCreateAssignment] = useState<any>({})
  const [errCreateEnrollment, setErrCreateEnrollment] = useState<any>({})

  useEffect(() => {
    if (!isAssignOpen) setErrCreateAssignment({})
  }, [isAssignOpen])

  useEffect(() => {
    if (!isEnrollOpen) setErrCreateEnrollment({})
  }, [isEnrollOpen])

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      try {
        const [allCourses, allSts, allAsis, allAss, allEnr] = await Promise.all([
          getAllCourses(),
          getAllStudents(),
          getAllAssistants(),
          getAllAssignments(),
          getAllEnrollments()
        ])
        setCourses(allCourses)
        setStudents(allSts)
        // Differentiate assistants to show only teachers if needed
        setAssistants(allAsis.filter((a: any) => a.rolesEmpleado === 'ADMIN' || a.rolesEmpleado === 'ASISTENTE'))
        setAssignments(allAss)
        setEnrollments(allEnr)
      } catch (error) {
        console.error(error)
        toast.error("Error al cargar los datos de vinculaciones")
      } finally {
        setLoading(false)
      }
    }
    loadAllData()
  }, [tick])

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrCreateAssignment({})
    const newErrors: any = {}
    if (!selectedCourse) newErrors.selectedCourse = "Por favor selecciona un curso."
    if (!selectedTeacher) newErrors.selectedTeacher = "Por favor selecciona un docente."

    if (Object.keys(newErrors).length > 0) {
      setErrCreateAssignment(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingAssign(true)
    try {
      await fetchApi('/asignacionCuAs/addAsignacionCuAs', {
        method: 'POST',
        body: JSON.stringify({
          asistenteIdAsignacionCuAs: parseInt(selectedTeacher),
          cursoIdAsignacionCuAs: parseInt(selectedCourse)
        })
      })

      const courseName = courses.find(c => c.id === parseInt(selectedCourse))?.nombreCurso || 'Curso'
      const teacherName = assistants.find(t => t.id === parseInt(selectedTeacher))?.nombreEmpleado || 'Docente'

      toast.success("¡Docente asignado con éxito!", {
        description: `Se vinculó a ${teacherName} con el curso '${courseName}'.`
      })

      setSelectedCourse('')
      setSelectedTeacher('')
      setIsAssignOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al guardar la asignación en el servidor.")
    } finally {
      setSubmittingAssign(false)
    }
  }

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrCreateEnrollment({})
    const newErrors: any = {}
    if (!selectedStudent) newErrors.selectedStudent = "Por favor selecciona un estudiante."
    if (!selectedAssignment) newErrors.selectedAssignment = "Por favor selecciona una asignación de clase."

    if (Object.keys(newErrors).length > 0) {
      setErrCreateEnrollment(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingEnroll(true)
    try {
      await fetchApi('/inscripcionEsCu/addInscripcionEsCu', {
        method: 'POST',
        body: JSON.stringify({
          estudianteIdInscripcion: parseInt(selectedStudent),
          asignacionIdInscripcion: parseInt(selectedAssignment),
          totalPuntosInscripcion: 0,
          fechaInscripcion: new Date().toISOString()
        })
      })

      const studentName = students.find(s => s.id === parseInt(selectedStudent))?.nombreEstudiante || 'Estudiante'
      toast.success("¡Estudiante matriculado con éxito!", {
        description: `Se matriculó a ${studentName} correctamente.`
      })

      setSelectedStudent('')
      setSelectedAssignment('')
      setIsEnrollOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al registrar la matrícula en el servidor.")
    } finally {
      setSubmittingEnroll(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <UserCheck className="size-8 text-blue-700" />
            Gestión de Asignaciones y Matrículas
          </h1>
          <p className="mt-2 text-slate-500">
            Vincula docentes al dictado de materias e inscribe estudiantes en las respectivas clases.
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setIsAssignOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl h-11 gap-2 shadow-sm"
          >
            <Plus className="size-4" />
            Asignar Docente
          </Button>
          <Button 
            onClick={() => setIsEnrollOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 gap-2 shadow-sm"
          >
            <Plus className="size-4" />
            Matricular Estudiante
          </Button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="mb-6 flex justify-center md:justify-start">
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-slate-200/60 p-1 rounded-xl w-full justify-center">
            <TabsTrigger value="assignments" className="rounded-lg px-6 py-2 text-sm font-semibold">
              Asignación Docente
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="rounded-lg px-6 py-2 text-sm font-semibold">
              Matrícula Alumnos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table Content */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex py-20 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-blue-700" />
              <span className="ml-3 text-slate-500 font-medium">Cargando datos...</span>
            </div>
          ) : activeTab === 'assignments' ? (
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="text-slate-600 font-semibold w-24">ID</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Curso</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Docente Responsable</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Fecha de Asignación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length > 0 ? (
                  assignments.map((ass) => (
                    <TableRow key={ass.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-slate-500 font-semibold">#{ass.id}</TableCell>
                      <TableCell className="font-bold text-slate-800">
                        {ass.curso?.nombreCurso || `Curso #${ass.cursoIdAsignacionCuAs}`}
                      </TableCell>
                      <TableCell className="text-slate-700 font-medium">
                        {ass.asistente ? `${ass.asistente.nombreEmpleado} ${ass.asistente.apellidoEmpleado}` : `Docente #${ass.asistenteIdAsignacionCuAs}`}
                      </TableCell>
                      <TableCell className="text-slate-500 flex items-center gap-1.5 py-4">
                        <Calendar className="size-4 text-slate-400" />
                        {new Date(ass.fechaAsignacionCuAs).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                      No se han registrado asignaciones de docentes a cursos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="text-slate-600 font-semibold w-24">ID</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Estudiante</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Curso Asignado</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Docente</TableHead>
                  <TableHead className="text-slate-600 font-semibold w-36 text-center">Puntos Totales</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Fecha Matrícula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length > 0 ? (
                  enrollments.map((enr) => (
                    <TableRow key={enr.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-slate-500 font-semibold">#{enr.id}</TableCell>
                      <TableCell className="font-bold text-slate-800">
                        {enr.estudiante ? `${enr.estudiante.nombreEstudiante} ${enr.estudiante.apellidoEstudiante}` : `Estudiante #${enr.estudianteIdInscripcion}`}
                      </TableCell>
                      <TableCell className="text-slate-700 font-medium">
                        {enr.asignacion?.curso?.nombreCurso || `Curso #${enr.asignacion?.cursoIdAsignacionCuAs}`}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {enr.asignacion?.asistente ? `${enr.asignacion.asistente.nombreEmpleado} ${enr.asignacion.asistente.apellidoEmpleado}` : 'No Asignado'}
                      </TableCell>
                      <TableCell className="text-center font-bold text-emerald-600">
                        <span className="flex items-center justify-center gap-1">
                          <Award className="size-4" />
                          {enr.totalPuntosInscripcion}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 flex items-center gap-1.5 py-4">
                        <Calendar className="size-4 text-slate-400" />
                        {new Date(enr.fechaInscripcion).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                      No se han registrado estudiantes matriculados en ningún curso.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal: Asignar Docente */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <BookOpen className="size-6 text-blue-700" />
              Asignación Docente a Curso
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Selecciona una materia académica y vincula al docente responsable de su dictado.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAssignment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-650 font-medium">Curso Académico</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateAssignment.selectedCourse ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecciona un curso..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nombreCurso} (Id: #{c.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errCreateAssignment.selectedCourse && <p className="text-red-500 text-xs">{errCreateAssignment.selectedCourse}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-650 font-medium">Docente Responsable</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateAssignment.selectedTeacher ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecciona un docente..." />
                </SelectTrigger>
                <SelectContent>
                  {assistants.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.nombreEmpleado} {t.apellidoEmpleado} (DNI: {t.dniEmpleado})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errCreateAssignment.selectedTeacher && <p className="text-red-500 text-xs">{errCreateAssignment.selectedTeacher}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAssignOpen(false)}
                className="rounded-xl border-slate-200 text-slate-700"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingAssign}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl gap-2"
              >
                {submittingAssign ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Asignando...
                  </>
                ) : (
                  "Asignar Docente"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Matricular Estudiante */}
      <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <Users className="size-6 text-emerald-600" />
              Matricular Estudiante
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Registra un estudiante a una de las clases que ya tienen docente asignado.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEnrollment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-650 font-medium">Estudiante</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateEnrollment.selectedStudent ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecciona un estudiante..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.nombreEstudiante} {s.apellidoEstudiante} (DNI: {s.dniEstudiante})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errCreateEnrollment.selectedStudent && <p className="text-red-500 text-xs">{errCreateEnrollment.selectedStudent}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-650 font-medium">Clase Asignada (Curso - Docente)</Label>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateEnrollment.selectedAssignment ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecciona una asignación..." />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map(ass => (
                    <SelectItem key={ass.id} value={ass.id.toString()}>
                      {ass.curso?.nombreCurso || 'Curso'} - {ass.asistente ? `${ass.asistente.nombreEmpleado} ${ass.asistente.apellidoEmpleado}` : 'Docente'} (Id: #{ass.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errCreateEnrollment.selectedAssignment && <p className="text-red-500 text-xs">{errCreateEnrollment.selectedAssignment}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEnrollOpen(false)}
                className="rounded-xl border-slate-200 text-slate-700"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingEnroll}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
              >
                {submittingEnroll ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Matriculando...
                  </>
                ) : (
                  "Matricular Alumno"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
