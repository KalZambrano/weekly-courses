//weekly-courses/data/mock-data.ts
// Types
export interface Student {
  id: string
  name: string
  email: string
  avatar: string
  points: number
  level: 'Bronce' | 'Plata' | 'Oro'
  progress: number
  streak: number
  enrolledCourses: string[]
}

export interface Course {
  id: string
  name: string
  section: string
  teacher: string
  description: string
  icon: string
  progress: number
  totalActivities: number
  completedActivities: number
  activities: Activity[]
}

export interface Activity {
  id: string
  name: string
  type: 'quiz' | 'exercise' | 'video' | 'reading'
  status: 'pending' | 'completed' | 'in-progress'
  points: number
  duration: string
  completedAt?: string
}

export interface RecentActivity {
  id: string
  courseName: string
  activityName: string
  type: Activity['type']
  points: number
  completedAt: string
}

export interface RankingStudent {
  id: string
  name: string
  avatar: string
  points: number
  level: Student['level']
  position: number
}

// Mock Data
export const currentStudent: Student = {
  id: '1',
  name: 'María García',
  email: 'maria.garcia@edu.com',
  avatar: 'MG',
  points: 2450,
  level: 'Plata',
  progress: 68,
  streak: 5,
  enrolledCourses: ['1', '2', '3', '4']
}

export const courses: Course[] = [
  {
    id: '1',
    name: 'Matemáticas Avanzadas',
    section: '156245',
    teacher: 'Javier Ibarreche',
    description: 'Álgebra, geometría y cálculo para refuerzo académico',
    icon: '📐',
    progress: 75,
    totalActivities: 12,
    completedActivities: 9,
    activities: [
      { id: 'a1', name: 'Ecuaciones lineales', type: 'video', status: 'completed', points: 50, duration: '15 min', completedAt: '2024-01-15' },
      { id: 'a2', name: 'Quiz: Ecuaciones', type: 'quiz', status: 'completed', points: 100, duration: '10 min', completedAt: '2024-01-16' },
      { id: 'a3', name: 'Sistemas de ecuaciones', type: 'exercise', status: 'completed', points: 75, duration: '20 min', completedAt: '2024-01-17' },
      { id: 'a4', name: 'Funciones cuadráticas', type: 'video', status: 'completed', points: 50, duration: '18 min', completedAt: '2024-01-18' },
      { id: 'a5', name: 'Práctica: Funciones', type: 'exercise', status: 'completed', points: 75, duration: '25 min', completedAt: '2024-01-19' },
      { id: 'a6', name: 'Geometría básica', type: 'reading', status: 'completed', points: 30, duration: '12 min', completedAt: '2024-01-20' },
      { id: 'a7', name: 'Áreas y perímetros', type: 'exercise', status: 'completed', points: 75, duration: '20 min', completedAt: '2024-01-21' },
      { id: 'a8', name: 'Quiz: Geometría', type: 'quiz', status: 'completed', points: 100, duration: '15 min', completedAt: '2024-01-22' },
      { id: 'a9', name: 'Trigonometría intro', type: 'video', status: 'completed', points: 50, duration: '20 min', completedAt: '2024-01-23' },
      { id: 'a10', name: 'Funciones trigonométricas', type: 'exercise', status: 'in-progress', points: 75, duration: '25 min' },
      { id: 'a11', name: 'Identidades trigonométricas', type: 'reading', status: 'pending', points: 30, duration: '15 min' },
      { id: 'a12', name: 'Examen final', type: 'quiz', status: 'pending', points: 150, duration: '30 min' }
    ]
  },
  {
    id: '2',
    name: 'Física Fundamental',
    section: '156230',
    teacher: 'Juan Pérez',
    description: 'Mecánica, termodinámica y ondas',
    icon: '⚡',
    progress: 50,
    totalActivities: 10,
    completedActivities: 5,
    activities: [
      { id: 'b1', name: 'Introducción a la mecánica', type: 'video', status: 'completed', points: 50, duration: '20 min', completedAt: '2024-01-10' },
      { id: 'b2', name: 'Leyes de Newton', type: 'reading', status: 'completed', points: 30, duration: '15 min', completedAt: '2024-01-11' },
      { id: 'b3', name: 'Ejercicios: Fuerzas', type: 'exercise', status: 'completed', points: 75, duration: '25 min', completedAt: '2024-01-12' },
      { id: 'b4', name: 'Quiz: Mecánica', type: 'quiz', status: 'completed', points: 100, duration: '15 min', completedAt: '2024-01-13' },
      { id: 'b5', name: 'Energía y trabajo', type: 'video', status: 'completed', points: 50, duration: '18 min', completedAt: '2024-01-14' },
      { id: 'b6', name: 'Conservación de energía', type: 'exercise', status: 'in-progress', points: 75, duration: '20 min' },
      { id: 'b7', name: 'Termodinámica básica', type: 'reading', status: 'pending', points: 30, duration: '12 min' },
      { id: 'b8', name: 'Calor y temperatura', type: 'video', status: 'pending', points: 50, duration: '15 min' },
      { id: 'b9', name: 'Práctica: Termodinámica', type: 'exercise', status: 'pending', points: 75, duration: '25 min' },
      { id: 'b10', name: 'Examen parcial', type: 'quiz', status: 'pending', points: 120, duration: '25 min' }
    ]
  },
  {
    id: '3',
    name: 'Química Orgánica',
    section: '176288',
    teacher: 'María González',
    description: 'Compuestos orgánicos y reacciones químicas',
    icon: '🧪',
    progress: 30,
    totalActivities: 8,
    completedActivities: 2,
    activities: [
      { id: 'c1', name: 'Introducción a la química orgánica', type: 'video', status: 'completed', points: 50, duration: '22 min', completedAt: '2024-01-08' },
      { id: 'c2', name: 'Hidrocarburos', type: 'reading', status: 'completed', points: 30, duration: '18 min', completedAt: '2024-01-09' },
      { id: 'c3', name: 'Alcanos y alquenos', type: 'exercise', status: 'in-progress', points: 75, duration: '20 min' },
      { id: 'c4', name: 'Quiz: Hidrocarburos', type: 'quiz', status: 'pending', points: 100, duration: '15 min' },
      { id: 'c5', name: 'Grupos funcionales', type: 'video', status: 'pending', points: 50, duration: '20 min' },
      { id: 'c6', name: 'Alcoholes y éteres', type: 'reading', status: 'pending', points: 30, duration: '15 min' },
      { id: 'c7', name: 'Práctica: Nomenclatura', type: 'exercise', status: 'pending', points: 75, duration: '25 min' },
      { id: 'c8', name: 'Examen: Química orgánica', type: 'quiz', status: 'pending', points: 130, duration: '30 min' }
    ]
  },
  {
    id: '4',
    name: 'Programación Básica',
    section: '176289',
    teacher: 'Carlos Rodríguez',
    description: 'Fundamentos de programación y algoritmos',
    icon: '💻',
    progress: 90,
    totalActivities: 10,
    completedActivities: 9,
    activities: [
      { id: 'd1', name: 'Introducción a la programación', type: 'video', status: 'completed', points: 50, duration: '15 min', completedAt: '2024-01-01' },
      { id: 'd2', name: 'Variables y tipos de datos', type: 'reading', status: 'completed', points: 30, duration: '10 min', completedAt: '2024-01-02' },
      { id: 'd3', name: 'Ejercicio: Variables', type: 'exercise', status: 'completed', points: 75, duration: '20 min', completedAt: '2024-01-03' },
      { id: 'd4', name: 'Estructuras de control', type: 'video', status: 'completed', points: 50, duration: '18 min', completedAt: '2024-01-04' },
      { id: 'd5', name: 'Quiz: Condicionales', type: 'quiz', status: 'completed', points: 100, duration: '12 min', completedAt: '2024-01-05' },
      { id: 'd6', name: 'Bucles y ciclos', type: 'video', status: 'completed', points: 50, duration: '20 min', completedAt: '2024-01-06' },
      { id: 'd7', name: 'Práctica: Bucles', type: 'exercise', status: 'completed', points: 75, duration: '25 min', completedAt: '2024-01-07' },
      { id: 'd8', name: 'Funciones', type: 'reading', status: 'completed', points: 30, duration: '15 min', completedAt: '2024-01-08' },
      { id: 'd9', name: 'Quiz: Funciones', type: 'quiz', status: 'completed', points: 100, duration: '15 min', completedAt: '2024-01-09' },
      { id: 'd10', name: 'Proyecto final', type: 'exercise', status: 'in-progress', points: 200, duration: '60 min' }
    ]
  }
]

export const recentActivities: RecentActivity[] = [
  { id: '1', courseName: 'Matemáticas Avanzadas', activityName: 'Trigonometría intro', type: 'video', points: 50, completedAt: '2024-01-23' },
  { id: '2', courseName: 'Programación Básica', activityName: 'Quiz: Funciones', type: 'quiz', points: 100, completedAt: '2024-01-09' },
  { id: '3', courseName: 'Física Fundamental', activityName: 'Energía y trabajo', type: 'video', points: 50, completedAt: '2024-01-14' },
  { id: '4', courseName: 'Química Orgánica', activityName: 'Hidrocarburos', type: 'reading', points: 30, completedAt: '2024-01-09' },
  { id: '5', courseName: 'Matemáticas Avanzadas', activityName: 'Quiz: Geometría', type: 'quiz', points: 100, completedAt: '2024-01-22' }
]

export const ranking: RankingStudent[] = [
  { id: '10', name: 'Carlos Mendoza', avatar: 'CM', points: 3200, level: 'Oro', position: 1 },
  { id: '11', name: 'Ana Rodríguez', avatar: 'AR', points: 2980, level: 'Oro', position: 2 },
  { id: '12', name: 'Luis Fernández', avatar: 'LF', points: 2750, level: 'Plata', position: 3 },
  { id: '1', name: 'María García', avatar: 'MG', points: 2450, level: 'Plata', position: 4 },
  { id: '13', name: 'Sofia Torres', avatar: 'ST', points: 2200, level: 'Plata', position: 5 },
  { id: '14', name: 'Diego López', avatar: 'DL', points: 1950, level: 'Plata', position: 6 },
  { id: '15', name: 'Elena Ruiz', avatar: 'ER', points: 1800, level: 'Bronce', position: 7 },
  { id: '16', name: 'Pablo Sánchez', avatar: 'PS', points: 1650, level: 'Bronce', position: 8 },
  { id: '17', name: 'Laura Martín', avatar: 'LM', points: 1500, level: 'Bronce', position: 9 },
  { id: '18', name: 'Javier Gómez', avatar: 'JG', points: 1350, level: 'Bronce', position: 10 }
]

// Teacher specific data
export const allStudents: Student[] = [
  { id: '1', name: 'María García', email: 'maria.garcia@edu.com', avatar: 'MG', points: 2450, level: 'Plata', progress: 68, streak: 5, enrolledCourses: ['1', '2', '3', '4'] },
  { id: '10', name: 'Carlos Mendoza', email: 'carlos.mendoza@edu.com', avatar: 'CM', points: 3200, level: 'Oro', progress: 85, streak: 12, enrolledCourses: ['1', '2', '4'] },
  { id: '11', name: 'Ana Rodríguez', email: 'ana.rodriguez@edu.com', avatar: 'AR', points: 2980, level: 'Oro', progress: 82, streak: 8, enrolledCourses: ['1', '3', '4'] },
  { id: '12', name: 'Luis Fernández', email: 'luis.fernandez@edu.com', avatar: 'LF', points: 2750, level: 'Plata', progress: 75, streak: 6, enrolledCourses: ['1', '2', '3'] },
  { id: '13', name: 'Sofia Torres', email: 'sofia.torres@edu.com', avatar: 'ST', points: 2200, level: 'Plata', progress: 62, streak: 4, enrolledCourses: ['2', '3', '4'] },
  { id: '14', name: 'Diego López', email: 'diego.lopez@edu.com', avatar: 'DL', points: 1950, level: 'Plata', progress: 55, streak: 3, enrolledCourses: ['1', '4'] },
  { id: '15', name: 'Elena Ruiz', email: 'elena.ruiz@edu.com', avatar: 'ER', points: 1800, level: 'Bronce', progress: 48, streak: 2, enrolledCourses: ['1', '2', '3', '4'] },
  { id: '16', name: 'Pablo Sánchez', email: 'pablo.sanchez@edu.com', avatar: 'PS', points: 1650, level: 'Bronce', progress: 42, streak: 1, enrolledCourses: ['1', '2'] },
  { id: '17', name: 'Laura Martín', email: 'laura.martin@edu.com', avatar: 'LM', points: 1500, level: 'Bronce', progress: 38, streak: 0, enrolledCourses: ['3', '4'] },
  { id: '18', name: 'Javier Gómez', email: 'javier.gomez@edu.com', avatar: 'JG', points: 1350, level: 'Bronce', progress: 32, streak: 0, enrolledCourses: ['1', '2', '3', '4'] }
]

export const teacherMetrics = {
  totalStudents: 10,
  activeStudents: 8,
  averageProgress: 58.7,
  totalPointsAwarded: 22830,
  coursesManaged: 4,
  completedActivities: 156,
  pendingActivities: 44
}

export const motivationalMessages = [
  "Cada día es una nueva oportunidad para aprender algo increíble.",
  "El conocimiento es el único tesoro que crece cuando se comparte.",
  "Tu esfuerzo de hoy es tu éxito de mañana.",
  "Pequeños pasos llevan a grandes logros.",
  "La constancia vence lo que la dicha no alcanza.",
  "Aprender es el superpoder que nadie te puede quitar.",
  "Hoy es un gran día para superar tus límites.",
  "Cada ejercicio completado te acerca a tus metas."
]
