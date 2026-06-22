export const config = {
    endpoints: {
        login: '/login/login',
        asistentes: {
            getAll: '/asistentes/listAsistentes',
            getOne: (id: string) => `/asistentes/findAsistenteById/${id}`,
            create: '/asistentes/addAsistentes',
            delete: (id: string) => `/asistentes/deleteAsistente?id=${id}`
        },
        cursos: {
            getAll: '/cursos/listCursos',
            getOne: (id: string) => `/cursos/findCursoById/${id}`,
            create: '/cursos/addCurso',
            delete: (id: number) => `/cursos/deleteCurso?id=${id}`
        },
        estudiantes: {
            getAll: '/Estudiantes/listEstudiantes',
            getOne: (id: string) => `/Estudiantes/findEstudianteById/${id}`,
            create: '/Estudiantes/addEstudiante',
            delete: (id: string) => `/Estudiantes/deleteEstudiante?id=${id}`
        },
        asignacionCuAs: {
            getAll: '/asignacionCuAs/listAsignacionCuAs',
            getOne: (id: string) => `/asignacionCuAs/findAsignacionCuAsById/${id}`,
            create: '/asignacionCuAs/addAsignacionCuAs',
            delete: (id: string) => `/asignacionCuAs/deleteAsignacionCuAs?id=${id}`
        },
        materialCurso: {
            getAll: '/materialCurso/listMaterialCurso',
            // getOne: (id: string) => `/materialCurso/findMaterialCursoById/${id}`,
            create: '/materialCurso/addMaterialCurso',
            // delete: '/materialCurso/deleteMaterialCurso'
        },
        inscripcionEsCu: {
            getAll: '/inscripcionEsCu/listInscripcionEsCu',
            // getOne: (id: string) => `/inscripcionEsCu/findInscripcionEsCuById/${id}`,
            create: '/inscripcionEsCu/addInscripcionEsCu',
            // delete: '/inscripcionEsCu/deleteInscripcionEsCu'
        },
        evaluacionCurso: {
            getAll: '/evaluacionCurso/listEvaluacionCurso',
            // getOne: (id: string) => `/evaluacionCurso/findEvaluacionCursoById/${id}`,
            create: '/evaluacionCurso/addEvaluacionCurso',
            // delete: '/evaluacionCurso/deleteEvaluacionCurso'
        },
        notaEvaluacion: {
            getAll: '/notaEvaluacion/listNotaEvaluacion',
            // getOne: (id: string) => `/notaEvaluacion/findNotaEvaluacionById/${id}`,
            create: '/notaEvaluacion/addNotaEvaluacion',
            // delete: '/notaEvaluacion/deleteNotaEvaluacion'
        }
    }
}