import { config } from '@/lib/config-api'
import { fetchApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

// CURSOS
export const getAllCourses = async () => {
    return fetchApi(config.endpoints.cursos.getAll)
        .catch((e) => {
            console.error(e)
            return []
        })
}

export const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso? Se eliminará de forma permanente.")) return

    try {
        await fetchApi(config.endpoints.cursos.delete(courseId), {
            method: 'DELETE'
        })

        toast({
            title: "¡Curso Eliminado!",
            description: `El curso ha sido eliminado con éxito.`,
            className: "bg-success text-success-foreground border-none"
        })
    } catch (err) {
        toast({
            title: "Error al Eliminar",
            description: "Hubo un error al eliminar el curso en el servidor.",
            variant: "destructive"
        })
    }
}

// MATERIAL

export const getAllMaterials = async (): Promise<any[]> => {
    return fetchApi(config.endpoints.materialCurso.getAll)
        .catch((e) => {
            console.error(e)
            return []
        })
}

export const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este material?")) return

    try {
        await fetchApi(`/material/deleteMaterial/${materialId}`, {
            method: 'DELETE'
        })

        toast({
            title: "¡Material Eliminado!",
            description: `El material ha sido eliminado con éxito.`,
            className: "bg-success text-success-foreground border-none"
        })

    } catch (err) {
        toast({
            title: "Error al Eliminar",
            description: "Hubo un error al eliminar el material en el servidor.",
            variant: "destructive"
        })
    }
}

// ASIGNACION
export const getAllAssignments = async (): Promise<any[]> => {
    return fetchApi(config.endpoints.asignacionCuAs.getAll)
        .catch((e) => {
            console.error(e)
            return []
        })
}

// EVALUACION CURSO
export const getAllEvaluations = async (): Promise<any[]> => {
    return fetchApi(config.endpoints.evaluacionCurso.getAll)
        .catch((e) => {
            console.error(e)
            return []
        })
}

// ESTUDIANTES
export const getAllStudents = async (): Promise<any[]> => {
    return fetchApi(config.endpoints.estudiantes.getAll)
        .catch((e) => {
            console.error(e)
            return []
        })
}

export const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este estudiante de la plataforma?")) return

    try {
        await fetchApi(config.endpoints.estudiantes.delete(studentId), {
            method: 'DELETE'
        })

        console.log("Estudiante Eliminado")
    } catch (err) {
        console.error(err)
    }
}

// INSCRIPCION
export const getAllEnrollments = async (): Promise<any[]> => {
    return fetchApi(config.endpoints.inscripcionEsCu.getAll)
        .catch((e) => {
            console.error(e)
            return []
        })
}

// NOTAS
export const getAllGrades = async (): Promise<any[]> => {
    return fetchApi(config.endpoints.notaEvaluacion.getAll)
        .catch((e) => {
            console.error(e);
            return [];
        });
};