export const config = {
    endpoints: {
        login: '/login/login',
        asistentes: {
            getAll: '/asistentes/listAsistentes',
            getOne: (id: string) => `/asistentes/findAsistentesById/${id}`,
            create: '/asistentes/addAsistentes',
            delete: (id: string) => `/asistentes/deleteAsistentes?id=${id}`
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
            update: (id: string | number) => `/materialCurso/updateMaterialCurso/${id}`,
            delete: (id: number) => `/materialCurso/deleteMaterialCurso?id=${id}`
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
            update: (id: string | number) => `/evaluacionCurso/updateEvaluacionCurso/${id}`,
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