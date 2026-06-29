"use client";
import { toast } from "sonner";
//weekly-courses/app/(dashboard)/teacher/courses/page.tsx

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { config } from "@/lib/config-api";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LevelBadge } from "@/components/custom/level-badge";
import {
  getAllCourses,
  getAllEvaluations,
  getAllEnrollments,
  getAllMaterials,
  getAllStudents,
  getAllAssignments,
  getAllGrades,
  handleDeleteCourse,
  handleDeleteMaterial,
} from "@/services/services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Trophy,
  Plus,
  Trash2,
  Pencil,
  FileText,
  Loader2,
  Activity,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export default function TeacherCoursesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [allMaterials, setAllMaterials] = useState<any[]>([]);
  const [allEvaluations, setAllEvaluations] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<any[]>([]);
  const [allGrades, setAllGrades] = useState<any[]>([]);
  const [tick, setTick] = useState(0);

  // Modales
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isViewGradesOpen, setIsViewGradesOpen] = useState(false);
  const [editQuizMaterialId, setEditQuizMaterialId] = useState<number | null>(null);
  const [editQuizEvaluationId, setEditQuizEvaluationId] = useState<number | null>(null);

  // Datos para Formularios
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Form: Crear Curso
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState(4);
  const [submittingCourse, setSubmittingCourse] = useState(false);
  // Form: Editar Curso
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [editCourseName, setEditCourseName] = useState("");
  const [editCourseDesc, setEditCourseDesc] = useState("");
  const [editCourseCredits, setEditCourseCredits] = useState(4);
  const [updatingCourse, setUpdatingCourse] = useState(false);

  // Form: Agregar Material
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialDesc, setMaterialDesc] = useState("");
  const [materialType, setMaterialType] = useState("PDF");
  const [materialUrl, setMaterialUrl] = useState("");
  const [materialSemana, setMaterialSemana] = useState<number>(1);
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [submittingMaterial, setSubmittingMaterial] = useState(false);

  // Form: Editar Material
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState<number | null>(null);
  const [editMaterialTitle, setEditMaterialTitle] = useState("");
  const [editMaterialDesc, setEditMaterialDesc] = useState("");
  const [editMaterialType, setEditMaterialType] = useState("PDF");
  const [editMaterialUrl, setEditMaterialUrl] = useState("");
  const [editMaterialSemana, setEditMaterialSemana] = useState<number>(1);
  const [editMaterialAsignacionId, setEditMaterialAsignacionId] = useState<
    number | null
  >(null);
  const [updatingMaterial, setUpdatingMaterial] = useState(false);

  // Form: Creador Visual de Quiz
  const [quizTitle, setQuizTitle] = useState("");
  const [quizWeight, setQuizWeight] = useState(20);
  const [quizPoints, setQuizPoints] = useState(20);
  const [quizSemana, setQuizSemana] = useState<number>(1);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      topic: "",
    },
  ]);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Grados cargados en modal
  const [gradesForCourse, setGradesForCourse] = useState<any[]>([]);

  // Form: Editar Nota
  const [isEditGradeOpen, setIsEditGradeOpen] = useState(false);
  const [editGradeId, setEditGradeId] = useState<number | null>(null);
  const [editGradeValue, setEditGradeValue] = useState<number>(0);
  const [editGradeObs, setEditGradeObs] = useState("");
  const [editGradeEstudiante, setEditGradeEstudiante] = useState<number | null>(
    null,
  );
  const [editGradeEvaluacion, setEditGradeEvaluacion] = useState<number | null>(
    null,
  );
  const [updatingGrade, setUpdatingGrade] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    const loadBackendData = async () => {
      setLoading(true);
      try {
        const teacherId = parseInt(user.id || "0");
        const [
          rawCourses,
          rawAssignments,
          rawMaterials,
          rawEvaluations,
          rawStudents,
          rawEnrollments,
          rawGrades,
        ] = await Promise.all([
          getAllCourses(),
          getAllAssignments(),
          getAllMaterials(),
          getAllEvaluations(),
          getAllStudents(),
          getAllEnrollments(),
          getAllGrades(),
        ]);

        setAllAssignments(rawAssignments);
        setAllMaterials(rawMaterials);
        setAllEvaluations(rawEvaluations);
        setAllStudents(rawStudents);
        setAllEnrollments(rawEnrollments);
        setAllGrades(rawGrades);

        // Filtrar asignaciones de este profesor
        const myAssignments = rawAssignments.filter(
          (a: any) => 
            a.asistenteIdAsignacionCuAs === teacherId ||
            a.asistente?.id === teacherId ||
            a.asistente?.dniEmpleado === user.id ||
            a.asistente?.dniEmpleado === user.email
        );

        // Mapear cursos con sus estadísticas reales
        const processedCourses = myAssignments
          .map((assignment: any) => {
            const course = rawCourses.find(
              (c: any) => c.id === assignment.cursoIdAsignacionCuAs,
            );
            if (!course) return null;

            // Estudiantes inscritos en este curso (basado en asignacionIdInscripcion)
            const courseEnrollments = rawEnrollments.filter(
              (e: any) => e.asignacionIdInscripcion === assignment.id,
            );
            const enrolledStudents = courseEnrollments
              .map((e: any) => {
                const student = rawStudents.find(
                  (s: any) => s.id === e.estudianteIdInscripcion,
                );
                return student
                  ? { ...student, points: e.totalPuntosInscripcion || 0 }
                  : null;
              })
              .filter(Boolean);

            // Materiales de esta asignación
            const courseMaterials = rawMaterials.filter(
              (m: any) =>
                m.asignacionCuAsIdMaterial === assignment.id,
            );

            // Evaluaciones asociadas a los materiales de este curso
            const courseEvaluations = rawEvaluations.filter((e: any) =>
              courseMaterials.some(
                (m: any) => m.id === e.materialCuEvaluacion,
              ),
            );

            // Calcular promedio de progreso de estudiantes (puntos de inscripción)
            const avgProgress =
              enrolledStudents.length > 0
                ? Math.round(
                    enrolledStudents.reduce(
                      (sum: number, s: any) => sum + Math.min(100, s.points),
                      0,
                    ) / enrolledStudents.length,
                  )
                : 0;

            // Puntos totales otorgables
            const totalPoints = courseEvaluations.reduce(
              (sum: number, e: any) => sum + (e.puntosEvaluacion || 0),
              0,
            );

            // Mapear icono
            let icon = "📚";
            const lowerName = course.nombreCurso.toLowerCase();
            if (lowerName.includes("mat") || lowerName.includes("algebra"))
              icon = "📐";
            else if (lowerName.includes("fis") || lowerName.includes("phy"))
              icon = "⚡";
            else if (lowerName.includes("qui") || lowerName.includes("chem"))
              icon = "🧪";
            else if (
              lowerName.includes("prog") ||
              lowerName.includes("code") ||
              lowerName.includes("web")
            )
              icon = "💻";

            return {
              id: course.id,
              assignmentId: assignment.id,
              name: course.nombreCurso,
              description: course.descripcionCurso,
              credits: course.creditosCurso,
              icon,
              progress: avgProgress,
              studentsCount: enrolledStudents.length,
              activitiesCount: courseMaterials.length,
              totalPoints: totalPoints || 100,
              materials: courseMaterials,
              evaluations: courseEvaluations,
              students: enrolledStudents,
            };
          })
          .filter(Boolean);

        setCourses(processedCourses);
      } catch (err) {
        console.error("Error fetching courses data:", err);
        toast({
          title: "Error de Carga",
          description: "No se pudieron obtener todos los datos del backend.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBackendData();
  }, [user, tick]);

  // SUBMIT: CREAR CURSO Y ASIGNACIÓN AUTOMÁTICA
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim() || !newCourseDesc.trim()) return;
    setSubmittingCourse(true);

    try {
      // 1. Crear el curso
      const courseRes = await fetchApi("/cursos/addCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCurso: newCourseName,
          descripcionCurso: newCourseDesc,
          creditosCurso: newCourseCredits,
        }),
      });

      const courseId = courseRes?.id || courseRes?.idCurso || courseRes?.data?.id || courseRes?.data?.idCurso;

      if (!courseId) {
        throw new Error("No se pudo obtener el ID del curso recién creado.");
      }

      // 2. Crear asignación al profesor actual
      await fetchApi("/asignacionCuAs/addAsignacionCuAs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asistenteIdAsignacionCuAs: parseInt(user?.id || "1"),
          cursoIdAsignacionCuAs: courseId,
        }),
      });

      toast({
        title: "¡Curso Creado!",
        description: `El curso "${newCourseName}" ha sido creado y asignado con éxito.`,
        className: "bg-success text-success-foreground border-none",
      });

      // Reset y recargar
      setNewCourseName("");
      setNewCourseDesc("");
      setNewCourseCredits(4);
      setIsCreateCourseOpen(false);
      setTick((t) => t + 1);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al Crear Curso",
        description: "Hubo un error al registrar el curso en el servidor.",
        variant: "destructive",
      });
    } finally {
      setSubmittingCourse(false);
    }
  };

  // UPDATE: EDITAR CURSO
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseId || !editCourseName.trim() || !editCourseDesc.trim())
      return;
    setUpdatingCourse(true);

    try {
      await fetchApi(`/cursos/updateCurso/${editCourseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCurso: editCourseName,
          descripcionCurso: editCourseDesc,
          creditosCurso: editCourseCredits,
        }),
      });

      toast({
        title: "¡Curso Actualizado!",
        description: `El curso ha sido modificado con éxito.`,
        className: "bg-success text-success-foreground border-none",
      });

      setIsEditCourseOpen(false);
      setTick((t) => t + 1);
    } catch (err) {
      toast({
        title: "Error al Actualizar",
        description: "Hubo un error al modificar el curso en el servidor.",
        variant: "destructive",
      });
    } finally {
      setUpdatingCourse(false);
    }
  };

  // SUBMIT: AGREGAR MATERIAL A CURSO
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim() || !materialDesc.trim()) return;
    setSubmittingMaterial(true);

    try {
      const formData = new FormData();
      formData.append("asignacionCuAsIdMaterial", selectedCourse.assignmentId.toString());
      formData.append("tituloMaterial", materialTitle);
      formData.append("descripcionMaterial", materialDesc);
      formData.append("tipoMaterial", materialType);
      formData.append("estadoMaterial", "true");
      formData.append("semana", materialSemana.toString());

      if (materialType === "Video") {
        formData.append("urlMaterial", materialUrl || "#");
      } else {
        formData.append("urlMaterial", "");
        if (materialFile) {
          formData.append("file", materialFile);
        }
      }

      await fetchApi(config.endpoints.materialCurso.create, {
        method: "POST",
        body: formData,
      });

      toast({
        title: "¡Material Subido!",
        description: `Se ha cargado "${materialTitle}" al curso.`,
        className: "bg-success text-success-foreground border-none",
      });

      setMaterialTitle("");
      setMaterialDesc("");
      setMaterialUrl("");
      setMaterialSemana(1);
      setMaterialFile(null);
      setIsAddMaterialOpen(false);
      setTick((t) => t + 1);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo registrar el material.",
        variant: "destructive",
      });
    } finally {
      setSubmittingMaterial(false);
    }
  };

  // UPDATE: EDITAR MATERIAL
  const handleUpdateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editMaterialId ||
      !editMaterialTitle.trim() ||
      !editMaterialDesc.trim()
    )
      return;
    setUpdatingMaterial(true);

    try {
      await fetchApi(config.endpoints.materialCurso.update(editMaterialId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asignacionCuAsIdMaterial: editMaterialAsignacionId,
          tituloMaterial: editMaterialTitle,
          descripcionMaterial: editMaterialDesc,
          tipoMaterial: editMaterialType,
          estadoMaterial: true,
          urlMaterial: editMaterialUrl || "#",
          fechaSubidaMaterial: new Date().toISOString().split("T")[0],
          semana: editMaterialSemana,
        }),
      });

      toast({
        title: "¡Material Actualizado!",
        description: `El material ha sido modificado con éxito.`,
        className: "bg-success text-success-foreground border-none",
      });

      setIsEditMaterialOpen(false);
      setTick((t) => t + 1);
    } catch (err) {
      toast({
        title: "Error al Actualizar",
        description: "Hubo un error al modificar el material en el servidor.",
        variant: "destructive",
      });
    } finally {
      setUpdatingMaterial(false);
    }
  };

  // LOGICA FORM QUIZ BUILDER
  const handleAddQuestionField = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        topic: "",
      },
    ]);
  };

  const handleRemoveQuestionField = (index: number) => {
    if (quizQuestions.length === 1) return;
    setQuizQuestions(quizQuestions.filter((_, idx) => idx !== index));
  };

  const handleQuestionTextChange = (index: number, val: string) => {
    const updated = [...quizQuestions];
    updated[index].question = val;
    setQuizQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, val: string) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[oIndex] = val;
    setQuizQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex: number, val: number) => {
    const updated = [...quizQuestions];
    updated[qIndex].correctAnswer = val;
    setQuizQuestions(updated);
  };

  const handleExplanationChange = (qIndex: number, val: string) => {
    const updated = [...quizQuestions];
    updated[qIndex].explanation = val;
    setQuizQuestions(updated);
  };

  const handleTopicChange = (qIndex: number, val: string) => {
    const updated = [...quizQuestions];
    updated[qIndex].topic = val;
    setQuizQuestions(updated);
  };

  // SUBMIT: CREAR O EDITAR QUIZ
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;
    setSubmittingQuiz(true);

    try {
      if (editQuizMaterialId) {
        // MODO EDICIÓN
        // 1. Actualizar el material
        await fetchApi(config.endpoints.materialCurso.update(editQuizMaterialId), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asignacionCuAsIdMaterial: selectedCourse.assignmentId,
            tituloMaterial: quizTitle,
            descripcionMaterial: `Evaluación interactiva: ${quizQuestions.length} preguntas`,
            tipoMaterial: "Quiz",
            estadoMaterial: true,
            urlMaterial: "#",
            fechaSubidaMaterial: new Date().toISOString().split("T")[0],
            semana: quizSemana,
          }),
        });

        // 2. Crear o Actualizar la Evaluación
        if (editQuizEvaluationId) {
          await fetchApi(config.endpoints.evaluacionCurso.update(editQuizEvaluationId), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              materialCuEvaluacion: editQuizMaterialId,
              inscripcionEsCuEvaluacion: null,
              tituloEvaluacion: quizTitle,
              porcentajeEvaluacion: quizWeight,
              puntosEvaluacion: quizPoints,
              fechaSubidaEvaluacion: new Date().toISOString().split("T")[0],
              preguntasEvaluacion: JSON.stringify(quizQuestions),
              semana: quizSemana,
            }),
          });
        } else {
          // Por si no tenía evaluación asignada aún
          await fetchApi(config.endpoints.evaluacionCurso.create, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              materialCuEvaluacion: editQuizMaterialId,
              inscripcionEsCuEvaluacion: null,
              tituloEvaluacion: quizTitle,
              porcentajeEvaluacion: quizWeight,
              puntosEvaluacion: quizPoints,
              fechaSubidaEvaluacion: new Date().toISOString().split("T")[0],
              preguntasEvaluacion: JSON.stringify(quizQuestions),
              semana: quizSemana,
            }),
          });
        }

        toast({
          title: "¡Quiz Actualizado!",
          description: `El quiz "${quizTitle}" ha sido actualizado con éxito.`,
          className: "bg-success text-success-foreground border-none",
        });

      } else {
        // MODO CREACIÓN
        // 1. Crear el material que representa al Quiz
        const quizMaterialFormData = new FormData();
        quizMaterialFormData.append("asignacionCuAsIdMaterial", selectedCourse.assignmentId.toString());
        quizMaterialFormData.append("tituloMaterial", quizTitle);
        quizMaterialFormData.append("descripcionMaterial", `Evaluación interactiva: ${quizQuestions.length} preguntas`);
        quizMaterialFormData.append("tipoMaterial", "Quiz");
        quizMaterialFormData.append("estadoMaterial", "true");
        quizMaterialFormData.append("urlMaterial", "#");
        quizMaterialFormData.append("semana", quizSemana.toString());

        const materialRes = await fetchApi(
          config.endpoints.materialCurso.create,
          {
            method: "POST",
            body: quizMaterialFormData,
          },
        );

        const materialId = materialRes?.id || materialRes?.idMaterial;

        if (!materialId) {
          throw new Error("No se pudo obtener el ID del material del Quiz.");
        }

        // 2. Crear la Evaluación en el backend con las preguntas JSON
        await fetchApi(config.endpoints.evaluacionCurso.create, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materialCuEvaluacion: materialId,
            inscripcionEsCuEvaluacion: null, // nullable now!
            tituloEvaluacion: quizTitle,
            porcentajeEvaluacion: quizWeight,
            puntosEvaluacion: quizPoints,
            fechaSubidaEvaluacion: new Date().toISOString().split("T")[0],
            preguntasEvaluacion: JSON.stringify(quizQuestions),
            semana: quizSemana,
          }),
        });

        toast({
          title: "¡Quiz Creado con Éxito!",
          description: `El quiz "${quizTitle}" está activo con ${quizQuestions.length} preguntas reales.`,
          className: "bg-success text-success-foreground border-none",
        });
      }

      setQuizTitle("");
      setQuizWeight(20);
      setQuizPoints(20);
      setQuizSemana(1);
      setQuizQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          topic: "",
        },
      ]);
      setEditQuizMaterialId(null);
      setEditQuizEvaluationId(null);
      setIsCreateQuizOpen(false);
      setTick((t) => t + 1);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al Registrar Quiz",
        description: "Hubo un fallo al subir la evaluación al servidor.",
        variant: "destructive",
      });
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // UPDATE: EDITAR NOTA
  const handleUpdateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editGradeId ||
      editGradeEstudiante === null ||
      editGradeEvaluacion === null
    )
      return;
    setUpdatingGrade(true);

    try {
      await fetchApi(`/nota/updateNota/${editGradeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estudianteNota: editGradeEstudiante,
          evaluacionCuNota: editGradeEvaluacion,
          observacionNota: editGradeObs || "Actualizado",
          calificacionNota: editGradeValue,
        }),
      });

      toast({
        title: "¡Nota Actualizada!",
        description: `La calificación ha sido modificada con éxito.`,
        className: "bg-success text-success-foreground border-none",
      });

      setIsEditGradeOpen(false);
      setIsViewGradesOpen(false);
      setTick((t) => t + 1);
    } catch (err) {
      toast({
        title: "Error al Actualizar",
        description: "Hubo un error al modificar la nota.",
        variant: "destructive",
      });
    } finally {
      setUpdatingGrade(false);
    }
  };

  // DELETE: ELIMINAR NOTA
  const handleDeleteGrade = async (gradeId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta calificación?")) return;

    try {
      await fetchApi(`/nota/deleteNota/${gradeId}`, {
        method: "DELETE",
      });

      toast({
        title: "¡Nota Eliminada!",
        description: `La calificación ha sido borrada con éxito.`,
        className: "bg-success text-success-foreground border-none",
      });

      setIsEditGradeOpen(false);
      setIsViewGradesOpen(false);
      setTick((t) => t + 1);
    } catch (err) {
      toast({
        title: "Error al Eliminar",
        description: "Hubo un error al eliminar la nota.",
        variant: "destructive",
      });
    }
  };

  // ABRIR VISTA DE NOTAS
  const handleOpenGrades = (course: any) => {
    setSelectedCourse(course);

    // Mapear los estudiantes y buscar sus notas reales para cada evaluación de este curso
    const courseGrades = course.students.map((student: any) => {
      // Obtener notas del estudiante correspondientes a las evaluaciones de este curso
      const studentEvaluationsGrades = course.evaluations.map(
        (evaluation: any) => {
          // Encontrar nota real en la lista global de notas
          const gradeMatch = allGrades.find(
            (g: any) =>
              g.estudianteNota === student.id &&
              g.evaluacionCuNota === evaluation.id,
          );
          return {
            evalId: evaluation.id,
            evalTitle: evaluation.tituloEvaluacion,
            gradeId: gradeMatch ? gradeMatch.id : null,
            grade: gradeMatch ? gradeMatch.calificacionNota : null,
            obs: gradeMatch ? gradeMatch.observacionNota : "",
          };
        },
      );

      return {
        id: student.id,
        name: `${student.nombreEstudiante} ${student.apellidoEstudiante}`,
        email: student.correoEstudiante,
        avatar: `${student.nombreEstudiante[0]}${student.apellidoEstudiante[0]}`,
        grades: studentEvaluationsGrades,
      };
    });

    setGradesForCourse(courseGrades);
    setIsViewGradesOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Cargando gestión de cursos...
        </span>
      </div>
    );
  }

  const uniqueCourses = courses.filter((course, index, self) => self.findIndex((c) => c.id === course.id) === index);

  return (
    <div className="min-h-screen p-8 bg-background">
      {/* Header con botón para Crear Curso */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="size-8 text-primary" />
            Gestión de Cursos (Docente)
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sube materiales, diseña exámenes de respuesta interactivos y
            califica a tus alumnos.
          </p>
        </div>

        <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 self-start sm:self-center">
              <Plus className="size-4" /> Crear Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Curso</DialogTitle>
              <DialogDescription>
                Registra el curso en la base de datos de la universidad. Se te
                asignará automáticamente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Nombre del Curso</Label>
                <Input
                  id="courseName"
                  placeholder="Ej: Álgebra Lineal Avanzada"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDesc">Descripción</Label>
                <Textarea
                  id="courseDesc"
                  placeholder="Temas principales y resumen..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCredits">Créditos Académicos</Label>
                <Input
                  id="courseCredits"
                  type="number"
                  min={1}
                  max={6}
                  value={newCourseCredits}
                  onChange={(e) =>
                    setNewCourseCredits(parseInt(e.target.value))
                  }
                  required
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={submittingCourse}>
                  {submittingCourse ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    "Crear Curso"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal: Editar Curso */}
      <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>
              Modifica los detalles del curso.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCourse} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCourseName">Nombre del Curso</Label>
              <Input
                id="editCourseName"
                value={editCourseName}
                onChange={(e) => setEditCourseName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCourseDesc">Descripción</Label>
              <Textarea
                id="editCourseDesc"
                value={editCourseDesc}
                onChange={(e) => setEditCourseDesc(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCourseCredits">Créditos Académicos</Label>
              <Input
                id="editCourseCredits"
                type="number"
                min={1}
                max={6}
                value={editCourseCredits}
                onChange={(e) => setEditCourseCredits(parseInt(e.target.value))}
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="submit" disabled={updatingCourse}>
                {updatingCourse ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Grid de Cursos del Docente */}
      {uniqueCourses.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {uniqueCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-md transition-shadow border-muted"
            >
              <CardHeader className="bg-muted/10 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{course.icon}</span>
                  <div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20"
                  >
                    {course.credits} créditos
                  </Badge>
                  <div className="flex gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setEditCourseId(course.id);
                        setEditCourseName(course.name);
                        setEditCourseDesc(course.description);
                        setEditCourseCredits(course.credits);
                        setIsEditCourseOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={async () => {
                        const ok = await handleDeleteCourse(course.id);
                        if (ok) setTick((t) => t + 1);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progreso promedio estudiantes
                    </span>
                    <span className="font-bold text-primary">
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2.5" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                    <Users className="size-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold">
                        {course.studentsCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Estudiantes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                    <FileText className="size-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold">
                        {course.activitiesCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Materiales / Quizzes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Materiales en el Curso */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">
                    Actividades del Curso
                  </h4>
                  {course.materials.length > 0 ? (
                    <div className="space-y-1.5 max-h-35 overflow-y-auto pr-1">
                      {course.materials.map((m: any, idx: number) => {
                        const hasEval = course.evaluations.some(
                          (ev: any) => ev.materialCuEvaluacion === m.id,
                        );
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs p-2 rounded bg-muted/20 border"
                          >
                            <span className="truncate font-medium flex items-center gap-1.5 max-w-[70%]">
                              {m.tipoMaterial === "Quiz" ? "📝" : "📄"}{" "}
                              {m.tituloMaterial}
                            </span>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant="secondary"
                                className="text-[10px] py-0.5"
                              >
                                {m.tipoMaterial}
                              </Badge>
                              {hasEval && (
                                <Badge
                                  variant="default"
                                  className="text-[10px] py-0.5 bg-success hover:bg-success"
                                >
                                  Evaluación
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-muted-foreground hover:text-primary ml-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (m.tipoMaterial === "Quiz") {
                                    const evaluation = course.evaluations.find(
                                      (ev: any) => ev.materialCuEvaluacion === m.id,
                                    );
                                    setQuizTitle(m.tituloMaterial);
                                    setQuizWeight(evaluation ? evaluation.porcentajeEvaluacion : 20);
                                    setQuizPoints(evaluation ? evaluation.puntosEvaluacion : 20);
                                    let parsedQuestions: Question[] = [];
                                    if (evaluation && evaluation.preguntasEvaluacion) {
                                      try {
                                        const parsed = typeof evaluation.preguntasEvaluacion === "string"
                                          ? JSON.parse(evaluation.preguntasEvaluacion)
                                          : evaluation.preguntasEvaluacion;
                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                          parsedQuestions = parsed;
                                        }
                                      } catch (err) {
                                        console.error("Error parsing quiz questions on edit:", err);
                                      }
                                    }
                                    if (parsedQuestions.length === 0) {
                                      parsedQuestions = [
                                        {
                                          question: "",
                                          options: ["", "", "", ""],
                                          correctAnswer: 0,
                                          explanation: "",
                                          topic: "",
                                        },
                                      ];
                                    }
                                    setQuizQuestions(parsedQuestions);
                                    setQuizSemana(m.semana || 1);
                                    setEditQuizMaterialId(m.id);
                                    setEditQuizEvaluationId(evaluation ? evaluation.id : null);
                                    setSelectedCourse(course);
                                    setIsCreateQuizOpen(true);
                                  } else {
                                    setEditMaterialId(m.id);
                                    setEditMaterialTitle(m.tituloMaterial);
                                    setEditMaterialDesc(m.descripcionMaterial);
                                    setEditMaterialType(m.tipoMaterial);
                                    setEditMaterialUrl(m.urlMaterial);
                                    setEditMaterialSemana(m.semana || 1);
                                    setEditMaterialAsignacionId(
                                      m.asignacionCuAsIdMaterial,
                                    );
                                    setIsEditMaterialOpen(true);
                                  }
                                }}
                              >
                                <Pencil className="size-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-muted-foreground hover:text-destructive"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const ok = await handleDeleteMaterial(m.id);
                                  if (ok) setTick((t) => t + 1);
                                }}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No hay actividades publicadas.
                    </p>
                  )}
                </div>

                {/* Acciones del Curso */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {/* Botón: Subir Material */}
                  <Dialog
                    open={isAddMaterialOpen && selectedCourse?.id === course.id}
                    onOpenChange={(open) => {
                      setSelectedCourse(course);
                      setIsAddMaterialOpen(open);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Plus className="size-3.5" /> Subir Material
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Subir Material a {course.name}
                        </DialogTitle>
                        <DialogDescription>
                          Añade diapositivas, PDFs, enlaces o videos al curso de
                          los estudiantes.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={handleAddMaterial}
                        className="space-y-4 py-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="matTitle">Título del Material</Label>
                          <Input
                            id="matTitle"
                            placeholder="Ej: Guía Teórica de Matrices"
                            value={materialTitle || ""}
                            onChange={(e) => setMaterialTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="matDesc">Descripción</Label>
                          <Textarea
                            id="matDesc"
                            placeholder="Resumen del material..."
                            value={materialDesc || ""}
                            onChange={(e) => setMaterialDesc(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="matType">Tipo de Material</Label>
                            <Select
                              value={materialType}
                              onValueChange={setMaterialType}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PDF">Documento PDF</SelectItem>
                                <SelectItem value="Diapositivas">
                                  Diapositivas PPT
                                </SelectItem>
                                <SelectItem value="Video">
                                  Video / Enlace Externo
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="matSemana">Semana</Label>
                            <Select
                              value={materialSemana.toString()}
                              onValueChange={(val) => setMaterialSemana(parseInt(val))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Semana" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => (
                                  <SelectItem key={w} value={w.toString()}>
                                    Semana {w}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {materialType === "Video" ? (
                          <div className="space-y-2">
                            <Label htmlFor="matUrl">URL del Recurso (Obligatorio)</Label>
                            <Input
                              id="matUrl"
                              type="url"
                              placeholder="https://example.com/..."
                              value={materialUrl || ""}
                              onChange={(e) => setMaterialUrl(e.target.value)}
                              required
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="matFile">Subir Archivo (.pdf, .ppt, .pptx)</Label>
                            <Input
                              id="matFile"
                              type="file"
                              accept=".pdf,.ppt,.pptx"
                              onChange={(e) => setMaterialFile(e.target.files?.[0] || null)}
                              required={!materialFile}
                            />
                          </div>
                        )}
                        <DialogFooter className="pt-2">
                          <Button type="submit" disabled={submittingMaterial}>
                            {submittingMaterial ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                              "Publicar Material"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Botón: Crear Quiz */}
                  <Dialog
                    open={isCreateQuizOpen && selectedCourse?.id === course.id}
                    onOpenChange={(open) => {
                      setSelectedCourse(course);
                      setIsCreateQuizOpen(open);
                      if (!open) {
                        setQuizTitle("");
                        setQuizWeight(20);
                        setQuizPoints(20);
                        setQuizQuestions([
                          {
                            question: "",
                            options: ["", "", "", ""],
                            correctAnswer: 0,
                            explanation: "",
                            topic: "",
                          },
                        ]);
                        setEditQuizMaterialId(null);
                        setEditQuizEvaluationId(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-primary border-primary/20 hover:bg-primary/5"
                      >
                        <Sparkles className="size-3.5 text-primary" /> Crear
                        Quiz
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <BrainCircuit className="size-5 text-primary" />
                          {editQuizMaterialId ? "Editar Quiz" : "Constructor Visual de Quizzes"}
                        </DialogTitle>
                        <DialogDescription>
                          {editQuizMaterialId 
                            ? "Actualiza las preguntas, opciones y puntajes del quiz directamente." 
                            : "Diseña cuestionarios interactivos reales. Tus preguntas se guardarán directamente en el backend."}
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={handleCreateQuiz}
                        className="space-y-6 py-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-4">
                          <div className="sm:col-span-1 space-y-2">
                            <Label htmlFor="quizTitle">Nombre del Quiz</Label>
                            <Input
                              id="quizTitle"
                              placeholder="Ej: Quiz 2: Matrices"
                              value={quizTitle || ""}
                              onChange={(e) => setQuizTitle(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quizSemana">Semana</Label>
                            <Select
                              value={quizSemana.toString()}
                              onValueChange={(val) => setQuizSemana(parseInt(val))}
                            >
                              <SelectTrigger id="quizSemana">
                                <SelectValue placeholder="Semana" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => (
                                  <SelectItem key={w} value={w.toString()}>
                                    Semana {w}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quizPoints">
                              Puntos Totales (Nota)
                            </Label>
                            <Input
                              id="quizPoints"
                              type="number"
                              min={1}
                              max={100}
                              value={isNaN(quizPoints) ? "" : quizPoints}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setQuizPoints(isNaN(val) ? 0 : val);
                              }}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quizWeight">
                              Peso en el Curso (%)
                            </Label>
                            <Input
                              id="quizWeight"
                              type="number"
                              min={1}
                              max={100}
                              value={isNaN(quizWeight) ? "" : quizWeight}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setQuizWeight(isNaN(val) ? 0 : val);
                              }}
                              required
                            />
                          </div>
                        </div>

                        {/* Listado de Preguntas */}
                        <div className="space-y-4 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                              <span>
                                Preguntas creadas: {quizQuestions.length}
                              </span>
                            </h3>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={handleAddQuestionField}
                            >
                              + Añadir Pregunta
                            </Button>
                          </div>

                          {quizQuestions.map((q, qIdx) => (
                            <Card
                              key={qIdx}
                              className="p-4 space-y-4 bg-muted/10 relative border-dashed"
                            >
                              {quizQuestions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    handleRemoveQuestionField(qIdx)
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              )}
                              <div className="font-semibold text-xs text-primary">
                                Pregunta #{qIdx + 1}
                              </div>

                              <div className="space-y-2">
                                <Label>Texto de la Pregunta</Label>
                                <Textarea
                                  placeholder="Escribe el enunciado de la pregunta..."
                                  value={q.question || ""}
                                  onChange={(e) =>
                                    handleQuestionTextChange(
                                      qIdx,
                                      e.target.value,
                                    )
                                  }
                                  required
                                />
                              </div>

                              {/* Opciones */}
                              <div className="grid gap-3 sm:grid-cols-2">
                                {q.options.map((option, oIdx) => (
                                  <div key={oIdx} className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">
                                      Opción {oIdx + 1}
                                    </Label>
                                    <Input
                                      placeholder={`Respuesta ${oIdx + 1}`}
                                      value={option || ""}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          qIdx,
                                          oIdx,
                                          e.target.value,
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="grid gap-4 sm:grid-cols-3">
                                {/* Respuesta Correcta */}
                                <div className="space-y-2">
                                  <Label>Opción Correcta</Label>
                                  <Select
                                    value={q.correctAnswer.toString()}
                                    onValueChange={(val) =>
                                      handleCorrectAnswerChange(
                                        qIdx,
                                        parseInt(val),
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="0">
                                        Opción 1
                                      </SelectItem>
                                      <SelectItem value="1">
                                        Opción 2
                                      </SelectItem>
                                      <SelectItem value="2">
                                        Opción 3
                                      </SelectItem>
                                      <SelectItem value="3">
                                        Opción 4
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Tema */}
                                <div className="sm:col-span-2 space-y-2">
                                  <Label>Tema / Concepto</Label>
                                  <Input
                                    placeholder="Ej: Suma de matrices"
                                    value={q.topic || ""}
                                    onChange={(e) =>
                                      handleTopicChange(qIdx, e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              {/* Explicación */}
                              <div className="space-y-2">
                                <Label>Explicación (Justificación)</Label>
                                <Textarea
                                  placeholder="¿Por qué esta respuesta es la correcta?..."
                                  value={q.explanation || ""}
                                  onChange={(e) =>
                                    handleExplanationChange(
                                      qIdx,
                                      e.target.value,
                                    )
                                  }
                                  className="h-16"
                                />
                              </div>
                            </Card>
                          ))}
                        </div>

                        <DialogFooter className="pt-2 border-t">
                          <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            disabled={submittingQuiz}
                          >
                            {submittingQuiz ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : editQuizMaterialId ? (
                              "Guardar Cambios"
                            ) : (
                              "Publicar Quiz en el Servidor"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Botón: Ver Notas por Estudiante */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 ml-auto text-muted-foreground hover:text-foreground"
                    onClick={() => handleOpenGrades(course)}
                  >
                    <GraduationCap className="size-4" /> Ver Notas
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center bg-card">
          <BookOpen className="size-16 text-muted-foreground/30 animate-pulse" />
          <h3 className="mt-4 text-xl font-semibold">
            No tienes cursos a tu cargo
          </h3>
          <p className="mt-2 text-muted-foreground max-w-sm">
            Registra tu primer curso haciendo clic en el botón superior derecho.
            ¡Te conectarás al instante!
          </p>
        </div>
      )}

      {/* Modal: Editar Material */}
      <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
            <DialogDescription>
              Modifica los detalles del material seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateMaterial} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editMatTitle">Título del Material</Label>
              <Input
                id="editMatTitle"
                value={editMaterialTitle || ""}
                onChange={(e) => setEditMaterialTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMatDesc">Descripción</Label>
              <Textarea
                id="editMatDesc"
                value={editMaterialDesc || ""}
                onChange={(e) => setEditMaterialDesc(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editMatType">Tipo de Material</Label>
                <Select
                  value={editMaterialType}
                  onValueChange={setEditMaterialType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">Documento PDF</SelectItem>
                    <SelectItem value="Diapositivas">Diapositivas PPT</SelectItem>
                    <SelectItem value="Video">Video / Enlace Externo</SelectItem>
                    <SelectItem value="Quiz">Quiz Interactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMatSemana">Semana</Label>
                <Select
                  value={editMaterialSemana.toString()}
                  onValueChange={(val) => setEditMaterialSemana(parseInt(val))}
                >
                  <SelectTrigger id="editMatSemana">
                    <SelectValue placeholder="Semana" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => (
                      <SelectItem key={w} value={w.toString()}>
                        Semana {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMatUrl">URL del Recurso</Label>
              <Input
                id="editMatUrl"
                value={editMaterialUrl || ""}
                onChange={(e) => setEditMaterialUrl(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="submit" disabled={updatingMaterial}>
                {updatingMaterial ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: VER NOTAS DEL CURSO */}
      <Dialog open={isViewGradesOpen} onOpenChange={setIsViewGradesOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-gold" />
              Notas de Estudiantes: {selectedCourse?.name}
            </DialogTitle>
            <DialogDescription>
              Detalle de notas reales obtenidas por los alumnos en cada quiz
              disponible en este curso.
            </DialogDescription>
          </DialogHeader>

          {selectedCourse?.evaluations?.length > 0 ? (
            <div className="mt-4 overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Estudiante</TableHead>
                    {selectedCourse.evaluations.map((ev: any) => (
                      <TableHead
                        key={ev.idEvaluacion}
                        className="text-center font-semibold"
                      >
                        {ev.tituloEvaluacion}
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          Max: {ev.puntosEvaluacion} pts |{" "}
                          {ev.porcentajeEvaluacion}%
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesForCourse.length > 0 ? (
                    gradesForCourse.map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              <AvatarFallback className="text-xs font-semibold">
                                {student.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate max-w-37.5">
                                {student.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate max-w-37.5">
                                {student.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        {student.grades.map((eg: any, idx: number) => (
                          <TableCell key={idx} className="text-center">
                            {eg.grade !== null ? (
                              <div className="flex flex-col items-center gap-1">
                                <Badge
                                  className="bg-success/15 text-success hover:bg-success/20 border-none font-bold cursor-pointer"
                                  onClick={() => {
                                    setEditGradeId(eg.gradeId);
                                    setEditGradeValue(eg.grade);
                                    setEditGradeObs(eg.obs);
                                    setEditGradeEstudiante(student.id);
                                    setEditGradeEvaluacion(eg.evalId);
                                    setIsEditGradeOpen(true);
                                  }}
                                >
                                  {eg.grade} pts{" "}
                                  <Pencil className="size-2.5 ml-1" />
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/60 text-xs">
                                -
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={selectedCourse.evaluations.length + 1}
                        className="text-center py-8 text-muted-foreground italic"
                      >
                        No hay alumnos matriculados en este curso.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10 mt-4">
              <AlertCircle className="size-8 text-muted-foreground/60" />
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                No se han diseñado exámenes para este curso.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Crea un quiz real para comenzar a registrar notas de
                estudiantes.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: EDITAR NOTA */}
      <Dialog open={isEditGradeOpen} onOpenChange={setIsEditGradeOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Editar Calificación</DialogTitle>
            <DialogDescription>
              Modifica la nota asignada a este estudiante.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateGrade} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editGradeVal">Puntaje</Label>
              <Input
                id="editGradeVal"
                type="number"
                min={0}
                max={100}
                value={editGradeValue}
                onChange={(e) => setEditGradeValue(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editGradeObs">Observación</Label>
              <Textarea
                id="editGradeObs"
                value={editGradeObs}
                onChange={(e) => setEditGradeObs(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2 flex justify-between sm:justify-between">
              {editGradeId && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDeleteGrade(editGradeId)}
                >
                  Eliminar Nota
                </Button>
              )}
              <Button type="submit" disabled={updatingGrade}>
                {updatingGrade ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
