'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from 'sonner'
import { fetchApi } from '@/lib/api'
import { config } from '@/lib/config-api'
import { 
  getAllCourses, 
  getAllAssignments, 
  getAllMaterials, 
  getAllEvaluations, 
  handleDeleteCourse,
  handleDeleteMaterial 
} from '@/services/services'
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Pencil, 
  FileText, 
  PlusCircle, 
  MinusCircle, 
  BrainCircuit, 
  BookMarked,
  Link as LinkIcon,
  Loader2, 
  UserCheck, 
  Sparkles,
  Search,
  ArrowRight,
  Hash
} from 'lucide-react'
import Link from 'next/link'

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [tick, setTick] = useState(0)

  // Modales Curso
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)

  // Modales Contenido
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false)

  // Formulario de Curso (Creación)
  const [courseName, setCourseName] = useState('')
  const [courseDesc, setCourseDesc] = useState('')
  const [courseCredits, setCourseCredits] = useState('4')
  const [submittingCourse, setSubmittingCourse] = useState(false)

  // Formulario de Curso (Edición)
  const [editCourseId, setEditCourseId] = useState<number | null>(null)
  const [editCourseName, setEditCourseName] = useState('')
  const [editCourseDesc, setEditCourseDesc] = useState('')
  const [editCourseCredits, setEditCourseCredits] = useState('4')
  const [updatingCourse, setUpdatingCourse] = useState(false)

  // Formulario de Material
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialDesc, setMaterialDesc] = useState('')
  const [materialType, setMaterialType] = useState('PDF')
  const [materialUrl, setMaterialUrl] = useState('')
  const [submittingMaterial, setSubmittingMaterial] = useState(false)

  // Formulario de Quiz (Quiz Builder)
  const [quizTitle, setQuizTitle] = useState('')
  const [quizWeight, setQuizWeight] = useState(20)
  const [quizPoints, setQuizPoints] = useState(20)
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      topic: "",
    }
  ])
  const [submittingQuiz, setSubmittingQuiz] = useState(false)

  // Estados de error para validaciones visuales
  const [errCreateCourse, setErrCreateCourse] = useState<any>({})
  const [errEditCourse, setErrEditCourse] = useState<any>({})
  const [errAddMaterial, setErrAddMaterial] = useState<any>({})
  const [errCreateQuiz, setErrCreateQuiz] = useState<any>({})

  useEffect(() => {
    if (!isCreateOpen) setErrCreateCourse({})
  }, [isCreateOpen])

  useEffect(() => {
    if (!isEditOpen) setErrEditCourse({})
  }, [isEditOpen])

  useEffect(() => {
    if (!isAddMaterialOpen) setErrAddMaterial({})
  }, [isAddMaterialOpen])

  useEffect(() => {
    if (!isCreateQuizOpen) setErrCreateQuiz({})
  }, [isCreateQuizOpen])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [allCourses, allAss, allMat, allEval] = await Promise.all([
          getAllCourses(),
          getAllAssignments(),
          getAllMaterials(),
          getAllEvaluations()
        ])
        setCourses(allCourses)
        setAssignments(allAss)
        setMaterials(allMat)
        setEvaluations(allEval)
      } catch (error) {
        console.error(error)
        toast.error("Error al cargar los datos académicos")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [tick])

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrCreateCourse({})
    const newErrors: any = {}
    if (!courseName.trim()) newErrors.courseName = "El nombre del curso es obligatorio."
    if (!courseDesc.trim()) newErrors.courseDesc = "La descripción del curso es obligatoria."
    if (!courseCredits || parseInt(courseCredits) <= 0) newErrors.courseCredits = "Los créditos deben ser mayores que 0."

    if (Object.keys(newErrors).length > 0) {
      setErrCreateCourse(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingCourse(true)

    try {
      await fetchApi('/cursos/addCurso', {
        method: 'POST',
        body: JSON.stringify({
          nombreCurso: courseName.trim(),
          descripcionCurso: courseDesc.trim(),
          creditosCurso: parseInt(courseCredits)
        })
      })

      toast.success("¡Curso creado con éxito!", {
        description: `Se registró el curso '${courseName}' correctamente.`
      })

      setCourseName('')
      setCourseDesc('')
      setCourseCredits('4')
      setIsCreateOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al registrar el curso en el servidor.")
    } finally {
      setSubmittingCourse(false)
    }
  }

  const openEditCourse = (c: any) => {
    setErrEditCourse({})
    setEditCourseId(c.id)
    setEditCourseName(c.nombreCurso)
    setEditCourseDesc(c.descripcionCurso)
    setEditCourseCredits(c.creditosCurso.toString())
    setIsEditOpen(true)
  }

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrEditCourse({})
    const newErrors: any = {}
    if (!editCourseName.trim()) newErrors.editCourseName = "El nombre del curso es obligatorio."
    if (!editCourseDesc.trim()) newErrors.editCourseDesc = "La descripción del curso es obligatoria."
    if (!editCourseCredits || parseInt(editCourseCredits) <= 0) newErrors.editCourseCredits = "Los créditos deben ser mayores que 0."

    if (Object.keys(newErrors).length > 0) {
      setErrEditCourse(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setUpdatingCourse(true)

    try {
      await fetchApi(`/cursos/updateCurso/${editCourseId}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombreCurso: editCourseName.trim(),
          descripcionCurso: editCourseDesc.trim(),
          creditosCurso: parseInt(editCourseCredits)
        })
      })

      toast.success("¡Curso actualizado con éxito!")
      setIsEditOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar el curso en el servidor.")
    } finally {
      setUpdatingCourse(false)
    }
  }

  const onDeleteCourse = async (courseId: number) => {
    const success = await handleDeleteCourse(courseId)
    if (success) {
      setTick(t => t + 1)
    }
  }

  // Métodos de Contenido
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrAddMaterial({})
    const newErrors: any = {}
    if (!materialTitle.trim()) newErrors.materialTitle = "El título es obligatorio."
    if (!materialDesc.trim()) newErrors.materialDesc = "La descripción es obligatoria."
    if ((materialType === 'Video' || materialType === 'Link') && !materialUrl.trim()) {
      newErrors.materialUrl = "La URL del material es obligatoria para este tipo."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrAddMaterial(newErrors)
      toast.error("Por favor completa los campos correctamente.")
      return
    }

    setSubmittingMaterial(true)

    try {
      await fetchApi(config.endpoints.materialCurso.create, {
        method: "POST",
        body: JSON.stringify({
          asignacionCuAsIdMaterial: selectedCourse.assignmentId,
          tituloMaterial: materialTitle.trim(),
          descripcionMaterial: materialDesc.trim(),
          tipoMaterial: materialType,
          estadoMaterial: true,
          urlMaterial: materialUrl.trim() || "#",
          fechaSubidaMaterial: new Date().toISOString().split("T")[0],
        })
      })

      toast.success("¡Material subido con éxito!")
      setMaterialTitle('')
      setMaterialDesc('')
      setMaterialUrl('')
      setIsAddMaterialOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al subir material")
    } finally {
      setSubmittingMaterial(false)
    }
  }

  // Quiz Builder Handlers
  const handleAddQuestionField = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        topic: "",
      }
    ])
  }

  const handleRemoveQuestionField = (index: number) => {
    if (quizQuestions.length === 1) return
    setQuizQuestions(quizQuestions.filter((_, idx) => idx !== index))
  }

  const handleQuestionTextChange = (index: number, val: string) => {
    const updated = [...quizQuestions]
    updated[index].question = val
    setQuizQuestions(updated)
  }

  const handleOptionChange = (qIndex: number, oIndex: number, val: string) => {
    const updated = [...quizQuestions]
    updated[qIndex].options[oIndex] = val
    setQuizQuestions(updated)
  }

  const handleCorrectAnswerChange = (qIndex: number, val: number) => {
    const updated = [...quizQuestions]
    updated[qIndex].correctAnswer = val
    setQuizQuestions(updated)
  }

  const handleExplanationChange = (qIndex: number, val: string) => {
    const updated = [...quizQuestions]
    updated[qIndex].explanation = val
    setQuizQuestions(updated)
  }

  const handleTopicChange = (qIndex: number, val: string) => {
    const updated = [...quizQuestions]
    updated[qIndex].topic = val
    setQuizQuestions(updated)
  }

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrCreateQuiz({})
    const newErrors: any = {}
    if (!quizTitle.trim()) newErrors.quizTitle = "El título del quiz es obligatorio."
    if (!quizPoints || quizPoints <= 0) newErrors.quizPoints = "Los puntos deben ser mayores que 0."

    const questionsErrors: any[] = []
    let hasQuestionErrors = false
    quizQuestions.forEach((q, idx) => {
      const qErr: any = {}
      if (!q.question.trim()) {
        qErr.question = "El enunciado de la pregunta es obligatorio."
        hasQuestionErrors = true
      }
      const optErrs: string[] = []
      q.options.forEach((opt, optIdx) => {
        if (!opt.trim()) {
          optErrs[optIdx] = "La opción no puede estar vacía."
          hasQuestionErrors = true
        } else {
          optErrs[optIdx] = ""
        }
      })
      qErr.options = optErrs
      if (!q.topic.trim()) {
        qErr.topic = "El tema es obligatorio."
        hasQuestionErrors = true
      }
      if (!q.explanation.trim()) {
        qErr.explanation = "La explicación es obligatoria."
        hasQuestionErrors = true
      }
      questionsErrors[idx] = qErr
    })

    if (hasQuestionErrors) {
      newErrors.questions = questionsErrors
    }

    if (Object.keys(newErrors).length > 0) {
      setErrCreateQuiz(newErrors)
      toast.error("Por favor completa las preguntas correctamente.")
      return
    }

    setSubmittingQuiz(true)

    try {
      // 1. Crear Material del Quiz
      const materialRes = await fetchApi(config.endpoints.materialCurso.create, {
        method: "POST",
        body: JSON.stringify({
          asignacionCuAsIdMaterial: selectedCourse.assignmentId,
          tituloMaterial: quizTitle.trim(),
          descripcionMaterial: `Evaluación interactiva: ${quizQuestions.length} preguntas`,
          tipoMaterial: "Quiz",
          estadoMaterial: true,
          urlMaterial: "#",
          fechaSubidaMaterial: new Date().toISOString().split("T")[0],
        })
      })

      const materialId = materialRes?.id || materialRes?.idMaterial
      if (!materialId) {
        throw new Error("No se pudo obtener el ID del material del Quiz.")
      }

      // 2. Crear la Evaluación
      await fetchApi(config.endpoints.evaluacionCurso.create, {
        method: "POST",
        body: JSON.stringify({
          materialCuEvaluacion: materialId,
          inscripcionEsCuEvaluacion: null,
          tituloEvaluacion: quizTitle.trim(),
          porcentajeEvaluacion: quizWeight,
          puntosEvaluacion: quizPoints,
          fechaSubidaEvaluacion: new Date().toISOString().split("T")[0],
          preguntasEvaluacion: JSON.stringify(quizQuestions),
        })
      })

      toast.success("¡Quiz creado con éxito!")
      setQuizTitle('')
      setQuizWeight(20)
      setQuizPoints(20)
      setQuizQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          topic: "",
        }
      ])
      setIsCreateQuizOpen(false)
      setTick(t => t + 1)
    } catch (error) {
      console.error(error)
      toast.error("Error al registrar el quiz")
    } finally {
      setSubmittingQuiz(false)
    }
    console.log(quizQuestions)
    console.log(quizTitle)
  }

  const onDeleteMaterialLocal = async (materialId: number) => {
    const success = await handleDeleteMaterial(materialId)
    if (success) {
      setTick(t => t + 1)
    }
  }

  const getCourseDetails = (courseId: number) => {
    // Buscar asignación vinculada a este curso
    const assignment = assignments.find(a => a.cursoIdAsignacionCuAs === courseId)
    const courseMaterials = assignment 
      ? materials.filter(m => m.asignacionCuAsIdMaterial === assignment.id)
      : []
    const courseQuizzes = courseMaterials.filter(m => m.tipoMaterial === 'Quiz')
    const courseDocs = courseMaterials.filter(m => m.tipoMaterial !== 'Quiz')

    return {
      assignmentId: assignment?.id || null,
      teacherName: assignment?.asistente 
        ? `${assignment.asistente.nombreEmpleado} ${assignment.asistente.apellidoEmpleado}`
        : null,
      materials: courseDocs,
      quizzes: courseQuizzes
    }
  }

  const filteredCourses = courses.filter(c => 
    c.nombreCurso.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.descripcionCurso.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <BookMarked className="size-8 text-blue-700" />
            Gestión de Cursos
          </h1>
          <p className="mt-2 text-slate-500">
            Administra los cursos de la plataforma, sube material de estudio y añade evaluaciones.
          </p>
        </div>

        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl h-11 gap-2 shadow-sm"
        >
          <Plus className="size-4" />
          Nuevo Curso
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200"
          />
        </div>
      </div>

      {/* Courses Cards Grid */}
      {loading ? (
        <div className="flex py-20 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-blue-700" />
          <span className="ml-3 text-slate-500 font-medium">Cargando cursos y contenidos...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c) => {
              const details = getCourseDetails(c.id)
              
              return (
                <Card key={c.id} className="border-slate-200 hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden rounded-2xl">
                  {/* Card Header */}
                  <CardHeader className="bg-slate-100/40 border-b border-slate-100 flex flex-row justify-between items-start pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-blue-150 text-blue-700 font-semibold px-2 py-0.5 rounded">
                          ID: #{c.id}
                        </span>
                        {details.assignmentId ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg">
                            Asignado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 rounded-lg">
                            Sin Docente
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800 pt-1">
                        {c.nombreCurso}
                      </CardTitle>
                    </div>

                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditCourse(c)}
                        className="text-slate-400 hover:text-blue-700"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDeleteCourse(c.id)}
                        className="text-slate-400 hover:text-red-650"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Card Body */}
                  <CardContent className="flex-1 p-6 space-y-4">
                    <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">
                      {c.descripcionCurso}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
                      <div>Créditos: <span className="text-blue-700 font-bold">{c.creditosCurso}</span></div>
                      {details.teacherName && (
                        <div className="flex items-center gap-1">
                          Docente: <span className="text-slate-700 font-bold">{details.teacherName}</span>
                        </div>
                      )}
                    </div>

                    {/* Expandable Content (Accordion) */}
                    {details.assignmentId ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="materials" className="border-slate-100">
                          <AccordionTrigger className="text-slate-700 hover:text-blue-750 font-bold text-sm py-3">
                            Ver Materiales de Clase ({details.materials.length})
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4 space-y-2">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-slate-400 font-medium">Materiales Subidos</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedCourse({ id: c.id, assignmentId: details.assignmentId })
                                  setIsAddMaterialOpen(true)
                                }}
                                className="h-8 rounded-lg text-xs gap-1 border-slate-200"
                              >
                                <Plus className="size-3" /> Subir Material
                              </Button>
                            </div>

                            {details.materials.length > 0 ? (
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {details.materials.map((m: any) => (
                                  <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-100/50 border border-slate-100">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText className="size-4 text-blue-600 shrink-0" />
                                      <span className="text-xs font-medium text-slate-700 truncate">{m.tituloMaterial}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => onDeleteMaterialLocal(m.id)}
                                      className="h-6 w-6 text-slate-400 hover:text-red-650"
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-450 italic py-2 text-center">No hay materiales de clase cargados.</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="quizzes" className="border-none">
                          <AccordionTrigger className="text-slate-700 hover:text-blue-750 font-bold text-sm py-3">
                            Ver Evaluaciones / Quizzes ({details.quizzes.length})
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-2 space-y-2">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-slate-400 font-medium">Evaluaciones creadas</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedCourse({ id: c.id, assignmentId: details.assignmentId })
                                  setIsCreateQuizOpen(true)
                                }}
                                className="h-8 rounded-lg text-xs gap-1 border-slate-200"
                              >
                                <BrainCircuit className="size-3 text-emerald-600" /> Crear Quiz
                              </Button>
                            </div>

                            {details.quizzes.length > 0 ? (
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {details.quizzes.map((m: any) => (
                                  <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-100/50 border border-slate-100">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <BrainCircuit className="size-4 text-emerald-600 shrink-0" />
                                      <span className="text-xs font-medium text-slate-700 truncate">{m.tituloMaterial}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => onDeleteMaterialLocal(m.id)}
                                      className="h-6 w-6 text-slate-400 hover:text-red-650"
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-450 italic py-2 text-center">No hay exámenes interactivos creados.</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <div className="rounded-xl bg-amber-50/50 border border-amber-200/50 p-3.5 text-center text-xs text-amber-700 flex flex-col items-center gap-1.5">
                        <span>Debes asignar un docente a este curso para poder agregar materiales y exámenes.</span>
                        <Link href="/admin/assignments">
                          <Button size="sm" variant="link" className="text-blue-700 p-0 h-auto font-bold gap-1">
                            Ir a Asignar Docente
                            <ArrowRight className="size-3" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">
              No se encontraron materias registradas.
            </div>
          )}
        </div>
      )}

      {/* Modal: Crear Curso */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <BookOpen className="size-6 text-blue-700" />
              Nuevo Curso Académico
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Registra una nueva materia para el dictado y la matrícula estudiantil.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCourse} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="course-name" className="text-slate-600 font-medium">Nombre del Curso</Label>
              <Input
                id="course-name"
                placeholder="Ej. Matemática II"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateCourse.courseName ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errCreateCourse.courseName && <p className="text-red-500 text-xs">{errCreateCourse.courseName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-desc" className="text-slate-600 font-medium">Descripción</Label>
              <Textarea
                id="course-desc"
                placeholder="Ej. Cálculo integral y ecuaciones diferenciales..."
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-205 min-h-[80px] ${errCreateCourse.courseDesc ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errCreateCourse.courseDesc && <p className="text-red-500 text-xs">{errCreateCourse.courseDesc}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-credits" className="text-slate-600 font-medium">Créditos Académicos</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="course-credits"
                  type="text"
                  placeholder="4"
                  maxLength={2}
                  value={courseCredits}
                  onChange={(e) => setCourseCredits(e.target.value.replace(/\D/g, ''))}
                  required
                  className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateCourse.courseCredits ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
              </div>
              {errCreateCourse.courseCredits && <p className="text-red-500 text-xs">{errCreateCourse.courseCredits}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border-slate-200 text-slate-700"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingCourse}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl gap-2"
              >
                {submittingCourse ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar Curso"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Curso */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <Pencil className="size-5 text-blue-750" />
              Editar Curso
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Modifica los metadatos y créditos del curso seleccionado.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateCourse} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-course-name" className="text-slate-600 font-medium">Nombre del Curso</Label>
              <Input
                id="edit-course-name"
                value={editCourseName}
                onChange={(e) => setEditCourseName(e.target.value)}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditCourse.editCourseName ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errEditCourse.editCourseName && <p className="text-red-500 text-xs">{errEditCourse.editCourseName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-desc" className="text-slate-600 font-medium">Descripción</Label>
              <Textarea
                id="edit-course-desc"
                value={editCourseDesc}
                onChange={(e) => setEditCourseDesc(e.target.value)}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-205 min-h-[80px] ${errEditCourse.editCourseDesc ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errEditCourse.editCourseDesc && <p className="text-red-500 text-xs">{errEditCourse.editCourseDesc}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-credits" className="text-slate-600 font-medium">Créditos Académicos</Label>
              <Input
                id="edit-course-credits"
                type="text"
                value={editCourseCredits}
                onChange={(e) => setEditCourseCredits(e.target.value.replace(/\D/g, ''))}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errEditCourse.editCourseCredits ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errEditCourse.editCourseCredits && <p className="text-red-500 text-xs">{errEditCourse.editCourseCredits}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl border-slate-200 text-slate-700"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={updatingCourse}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl gap-2"
              >
                {updatingCourse ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Subir Material */}
      <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <FileText className="size-6 text-blue-700" />
              Subir Material de Estudio
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Carga archivos PDF o introduce enlaces a videos o páginas externas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMaterial} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mat-title" className="text-slate-650 font-medium">Título del Material</Label>
              <Input
                id="mat-title"
                placeholder="Ej. Semana 1: Vectores en R3"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errAddMaterial.materialTitle ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errAddMaterial.materialTitle && <p className="text-red-500 text-xs">{errAddMaterial.materialTitle}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mat-desc" className="text-slate-655 font-medium">Descripción</Label>
              <Input
                id="mat-desc"
                placeholder="Ej. Introducción y teoría elemental sobre vectores"
                value={materialDesc}
                onChange={(e) => setMaterialDesc(e.target.value)}
                required
                className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errAddMaterial.materialDesc ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
              />
              {errAddMaterial.materialDesc && <p className="text-red-500 text-xs">{errAddMaterial.materialDesc}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-650 font-medium">Tipo</Label>
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger className="rounded-xl border-slate-200 focus-visible:ring-blue-200">
                    <SelectValue placeholder="PDF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">Documento PDF</SelectItem>
                    <SelectItem value="Video">Video Tutorial</SelectItem>
                    <SelectItem value="Link">Enlace Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat-url" className="text-slate-655 font-medium">URL / Enlace</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="mat-url"
                    placeholder="http://example.com/pdf"
                    value={materialUrl}
                    onChange={(e) => setMaterialUrl(e.target.value)}
                    className={`pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errAddMaterial.materialUrl ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errAddMaterial.materialUrl && <p className="text-red-500 text-xs">{errAddMaterial.materialUrl}</p>}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddMaterialOpen(false)}
                className="rounded-xl border-slate-200 text-slate-700"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingMaterial}
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl gap-2"
              >
                {submittingMaterial ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  "Subir Material"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Crear Quiz */}
      <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
              <BrainCircuit className="size-6 text-emerald-600" />
              Creador Visual de Quizzes
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Diseña una evaluación interactiva estructurando las preguntas, alternativas y respuestas correctas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateQuiz} className="space-y-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="quiz-title" className="text-slate-650 font-medium">Título del Quiz</Label>
                <Input
                  id="quiz-title"
                  placeholder="Ej. Evaluación: Dinámica Lineal"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-200 ${errCreateQuiz.quizTitle ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errCreateQuiz.quizTitle && <p className="text-red-500 text-xs">{errCreateQuiz.quizTitle}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiz-points" className="text-slate-655 font-medium">Puntos Totales</Label>
                <Input
                  id="quiz-points"
                  type="number"
                  value={quizPoints}
                  onChange={(e) => setQuizPoints(parseInt(e.target.value) || 20)}
                  required
                  className={`rounded-xl border-slate-200 focus-visible:ring-blue-205 ${errCreateQuiz.quizPoints ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                />
                {errCreateQuiz.quizPoints && <p className="text-red-500 text-xs">{errCreateQuiz.quizPoints}</p>}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6 border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-amber-500" />
                  Preguntas del Examen ({quizQuestions.length})
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestionField}
                  className="h-8 gap-1 rounded-lg text-xs"
                >
                  <PlusCircle className="size-3.5 text-blue-700" /> Agregar Pregunta
                </Button>
              </div>

              {quizQuestions.map((q, qIndex) => {
                const qErr = errCreateQuiz.questions?.[qIndex] || {}
                return (
                  <div key={qIndex} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 relative">
                    <div className="absolute top-4 right-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={quizQuestions.length === 1}
                        onClick={() => handleRemoveQuestionField(qIndex)}
                        className="h-7 w-7 text-slate-400 hover:text-red-650"
                      >
                        <MinusCircle className="size-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 pr-8">
                      <Label className="text-slate-600 font-bold text-xs">Pregunta #{qIndex + 1}</Label>
                      <Input
                        placeholder="Escribe la enunciado de la pregunta..."
                        value={q.question}
                        onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        required
                        className={`rounded-xl bg-white border-slate-200 ${qErr.question ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                      />
                      {qErr.question && <p className="text-red-500 text-xs">{qErr.question}</p>}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((option, oIndex) => {
                        const optErr = qErr.options?.[oIndex]
                        return (
                          <div key={oIndex} className="space-y-1">
                            <Label className="text-slate-500 text-xs">Opción {oIndex + 1}</Label>
                            <Input
                              placeholder={`Opción ${oIndex + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              required
                              className={`rounded-xl bg-white border-slate-200 ${optErr ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                            />
                            {optErr && <p className="text-red-500 text-xs">{optErr}</p>}
                          </div>
                        )
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-600 font-medium text-xs">Opción Correcta</Label>
                        <Select 
                          value={q.correctAnswer.toString()} 
                          onValueChange={(v) => handleCorrectAnswerChange(qIndex, parseInt(v))}
                        >
                          <SelectTrigger className="rounded-xl bg-white border-slate-200">
                            <SelectValue placeholder="Opción 1" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Opción 1 (A)</SelectItem>
                            <SelectItem value="1">Opción 2 (B)</SelectItem>
                            <SelectItem value="2">Opción 3 (C)</SelectItem>
                            <SelectItem value="3">Opción 4 (D)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-600 font-medium text-xs">Tema / Tema de estudio</Label>
                        <Input
                          placeholder="Ej. Cinemática"
                          value={q.topic}
                          onChange={(e) => handleTopicChange(qIndex, e.target.value)}
                          required
                          className={`rounded-xl bg-white border-slate-200 ${qErr.topic ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                        />
                        {qErr.topic && <p className="text-red-500 text-xs">{qErr.topic}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-655 text-xs">Retroalimentación / Explicación</Label>
                      <Input
                        placeholder="Explica por qué es la alternativa correcta..."
                        value={q.explanation}
                        onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                        required
                        className={`rounded-xl bg-white border-slate-200 ${qErr.explanation ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                      />
                      {qErr.explanation && <p className="text-red-500 text-xs">{qErr.explanation}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateQuizOpen(false)}
                className="rounded-xl border-slate-200 text-slate-700"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submittingQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold"
              >
                {submittingQuiz ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Publicar Quiz"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
