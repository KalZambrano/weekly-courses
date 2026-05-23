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
  weekNumber: number
  completedAt?: string
  description?: string
  pointsAwarded?: number // Points actually awarded (considers multipliers)
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
    totalActivities: 54,
    completedActivities: 9,
    activities: [
      // Week 1
      { id: 'a1', name: 'Introducción a ecuaciones lineales', type: 'video', status: 'completed', points: 50, duration: '15 min', weekNumber: 1, completedAt: '2026-03-24', description: 'Aprende los fundamentos de ecuaciones lineales' },
      { id: 'a2', name: 'Lectura: Conceptos básicos', type: 'reading', status: 'completed', points: 30, duration: '12 min', weekNumber: 1, completedAt: '2026-03-25', description: 'Material introductorio sobre álgebra' },
      { id: 'a3', name: 'Ejercicios: Ecuaciones básicas', type: 'exercise', status: 'completed', points: 75, duration: '20 min', weekNumber: 1, completedAt: '2026-03-26', description: 'Resuelve 10 ecuaciones lineales simples' },
      { id: 'a4', name: 'Quiz: Ecuaciones lineales', type: 'quiz', status: 'completed', points: 100, duration: '15 min', weekNumber: 1, completedAt: '2026-03-27', description: 'Evaluación de conceptos de la semana 1' },
      { id: 'a5', name: 'Sistemas de ecuaciones 2x2', type: 'video', status: 'completed', points: 50, duration: '18 min', weekNumber: 1, completedAt: '2026-03-28', description: 'Métodos de sustitución y eliminación' },
      { id: 'a6', name: 'Práctica: Sistemas de ecuaciones', type: 'exercise', status: 'completed', points: 75, duration: '25 min', weekNumber: 1, completedAt: '2026-03-29', description: 'Resuelve sistemas 2x2 usando dos métodos' },
      
      // Week 2
      { id: 'a7', name: 'Funciones cuadráticas - Parte 1', type: 'video', status: 'in-progress', points: 50, duration: '18 min', weekNumber: 2, description: 'Análisis de parábolas y vértices' },
      { id: 'a8', name: 'Lectura: Propiedades de funciones', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 2, description: 'Conceptos sobre dominio, rango y transformaciones' },
      { id: 'a9', name: 'Ejercicios: Gráficas de parábolas', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 2, description: 'Grafica y analiza funciones cuadráticas' },
      { id: 'a10', name: 'Quiz: Funciones cuadráticas', type: 'quiz', status: 'pending', points: 100, duration: '15 min', weekNumber: 2, description: 'Evaluación de funciones cuadráticas' },
      { id: 'a11', name: 'Aplicaciones de funciones cuadráticas', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 2, description: 'Problemas de optimización' },
      { id: 'a12', name: 'Proyecto: Modelado de trayectorias', type: 'exercise', status: 'pending', points: 100, duration: '40 min', weekNumber: 2, description: 'Crea modelos cuadráticos de fenómenos reales' },
      
      // Week 3
      { id: 'a13', name: 'Geometría básica - Ángulos y triángulos', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 3, description: 'Clasificación y propiedades de triángulos' },
      { id: 'a14', name: 'Lectura: Teoremas fundamentales', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 3, description: 'Teorema de Pitágoras y similitud' },
      { id: 'a15', name: 'Ejercicios: Cálculo de ángulos', type: 'exercise', status: 'pending', points: 75, duration: '20 min', weekNumber: 3, description: 'Resuelve problemas de ángulos' },
      { id: 'a16', name: 'Áreas y perímetros', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 3, description: 'Fórmulas para diferentes figuras geométricas' },
      { id: 'a17', name: 'Ejercicios: Áreas de polígonos', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 3, description: 'Calcula áreas de triángulos, cuadriláteros, etc.' },
      { id: 'a18', name: 'Quiz: Geometría plana', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 3, description: 'Evaluación de geometría' },
      
      // Week 4
      { id: 'a19', name: 'Trigonometría - Introducción', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 4, description: 'Seno, coseno y tangente' },
      { id: 'a20', name: 'Razones trigonométricas', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 4, description: 'Definiciones y propiedades' },
      { id: 'a21', name: 'Ejercicios: Cálculo de razones', type: 'exercise', status: 'pending', points: 75, duration: '20 min', weekNumber: 4, description: 'Calcula seno, coseno, tangente' },
      { id: 'a22', name: 'Identidades trigonométricas', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 4, description: 'Identidades fundamentales' },
      { id: 'a23', name: 'Ejercicios: Identidades', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 4, description: 'Demuestra y simplifica identidades' },
      { id: 'a24', name: 'Quiz: Trigonometría básica', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 4, description: 'Evaluación de trigonometría' },
      
      // Week 5-18 (placeholder activities)
      ...Array.from({ length: 14 }, (_, weekIdx) => {
        const week = weekIdx + 5;
        return [
          { id: `a${24 + weekIdx * 4 + 1}`, name: `Video: Tema de semana ${week}`, type: 'video' as const, status: 'pending' as const, points: 50, duration: '20 min', weekNumber: week, description: `Contenido principal de la semana ${week}` },
          { id: `a${24 + weekIdx * 4 + 2}`, name: `Lectura: Semana ${week}`, type: 'reading' as const, status: 'pending' as const, points: 30, duration: '15 min', weekNumber: week, description: `Material de referencia` },
          { id: `a${24 + weekIdx * 4 + 3}`, name: `Ejercicios: Semana ${week}`, type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '25 min', weekNumber: week, description: `Práctica de conceptos` },
          { id: `a${24 + weekIdx * 4 + 4}`, name: `Quiz: Semana ${week}`, type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '20 min', weekNumber: week, description: `Evaluación semanal` },
        ];
      }).flat()
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
    totalActivities: 48,
    completedActivities: 5,
    activities: [
      // Week 1
      { id: 'b1', name: 'Introducción a la mecánica', type: 'video', status: 'completed', points: 50, duration: '20 min', weekNumber: 1, completedAt: '2026-03-24', description: 'Conceptos fundamentales de movimiento' },
      { id: 'b2', name: 'Lectura: Sistema de referencia', type: 'reading', status: 'completed', points: 30, duration: '15 min', weekNumber: 1, completedAt: '2026-03-25', description: 'Marcos de referencia inerciales' },
      { id: 'b3', name: 'Ejercicios: Movimiento rectilíneo', type: 'exercise', status: 'completed', points: 75, duration: '25 min', weekNumber: 1, completedAt: '2026-03-26', description: 'Problemas de cinemática' },
      { id: 'b4', name: 'Lectura: Leyes de Newton', type: 'reading', status: 'completed', points: 30, duration: '18 min', weekNumber: 1, completedAt: '2026-03-27', description: 'Primera, segunda y tercera ley' },
      { id: 'b5', name: 'Quiz: Cinemática y dinámica', type: 'quiz', status: 'completed', points: 100, duration: '20 min', weekNumber: 1, completedAt: '2026-03-28', description: 'Evaluación de mecánica básica' },
      
      // Week 2
      { id: 'b6', name: 'Fuerzas y aceleración', type: 'video', status: 'in-progress', points: 50, duration: '18 min', weekNumber: 2, description: 'F=ma en diferentes contextos' },
      { id: 'b7', name: 'Energía y trabajo - Introducción', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 2, description: 'Concepto de trabajo y energía' },
      { id: 'b8', name: 'Lectura: Conservación de energía', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 2, description: 'Principios de conservación' },
      { id: 'b9', name: 'Ejercicios: Trabajo y energía', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 2, description: 'Aplicaciones de trabajo y energía' },
      { id: 'b10', name: 'Quiz: Energía', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 2, description: 'Evaluación de conceptos de energía' },
      { id: 'b11', name: 'Momentum e impulso', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 2, description: 'Cantidad de movimiento' },
      { id: 'b12', name: 'Ejercicios: Momentum', type: 'exercise', status: 'pending', points: 75, duration: '20 min', weekNumber: 2, description: 'Problemas de conservación de momentum' },
      
      // Week 3
      { id: 'b13', name: 'Movimiento circular', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 3, description: 'Velocidad angular y aceleración centrípeta' },
      { id: 'b14', name: 'Lectura: Gravitación', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 3, description: 'Ley de gravitación universal' },
      { id: 'b15', name: 'Ejercicios: Órbitas', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 3, description: 'Problemas de órbitas planetarias' },
      { id: 'b16', name: 'Termodinámica - Introducción', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 3, description: 'Temperatura y calor' },
      { id: 'b17', name: 'Ejercicios: Calor', type: 'exercise', status: 'pending', points: 75, duration: '20 min', weekNumber: 3, description: 'Cálculos de transferencia de calor' },
      { id: 'b18', name: 'Quiz: Movimiento y termodinámica', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 3, description: 'Evaluación de movimiento circular' },
      
      // Week 4
      { id: 'b19', name: 'Leyes de la termodinámica', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 4, description: 'Primera, segunda y tercera ley' },
      { id: 'b20', name: 'Lectura: Entropía', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 4, description: 'Concepto de entropía y desorden' },
      { id: 'b21', name: 'Ejercicios: Procesos termodinámicos', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 4, description: 'Cálculos de trabajo y calor' },
      { id: 'b22', name: 'Ondas - Introducción', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 4, description: 'Propiedades de las ondas' },
      { id: 'b23', name: 'Ejercicios: Propiedades de ondas', type: 'exercise', status: 'pending', points: 75, duration: '20 min', weekNumber: 4, description: 'Cálculos de longitud de onda y frecuencia' },
      { id: 'b24', name: 'Quiz: Termodinámica y ondas', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 4, description: 'Evaluación final' },
      
      // Week 5-18 (placeholder)
      ...Array.from({ length: 14 }, (_, weekIdx) => {
        const week = weekIdx + 5;
        return [
          { id: `b${24 + weekIdx * 4 + 1}`, name: `Video: Tema de semana ${week}`, type: 'video' as const, status: 'pending' as const, points: 50, duration: '20 min', weekNumber: week, description: `Contenido principal de la semana ${week}` },
          { id: `b${24 + weekIdx * 4 + 2}`, name: `Lectura: Semana ${week}`, type: 'reading' as const, status: 'pending' as const, points: 30, duration: '15 min', weekNumber: week, description: `Material de referencia` },
          { id: `b${24 + weekIdx * 4 + 3}`, name: `Ejercicios: Semana ${week}`, type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '25 min', weekNumber: week, description: `Práctica de conceptos` },
          { id: `b${24 + weekIdx * 4 + 4}`, name: `Quiz: Semana ${week}`, type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '20 min', weekNumber: week, description: `Evaluación semanal` },
        ];
      }).flat()
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
    totalActivities: 48,
    completedActivities: 2,
    activities: [
      // Week 1
      { id: 'c1', name: 'Introducción a la química orgánica', type: 'video', status: 'completed', points: 50, duration: '22 min', weekNumber: 1, completedAt: '2026-03-24', description: 'Conceptos fundamentales de carbono' },
      { id: 'c2', name: 'Lectura: Estructura del carbono', type: 'reading', status: 'completed', points: 30, duration: '18 min', weekNumber: 1, completedAt: '2026-03-25', description: 'Hibridación y enlaces covalentes' },
      { id: 'c3', name: 'Alcanos saturados', type: 'video', status: 'in-progress', points: 50, duration: '20 min', weekNumber: 1, description: 'Hidrocarburos saturados simples' },
      { id: 'c4', name: 'Ejercicios: Nomenclatura de alcanos', type: 'exercise', status: 'pending', points: 75, duration: '20 min', weekNumber: 1, description: 'Reglas IUPAC para naming' },
      { id: 'c5', name: 'Quiz: Alcanos', type: 'quiz', status: 'pending', points: 100, duration: '15 min', weekNumber: 1, description: 'Evaluación de alcanos' },
      
      // Week 2
      { id: 'c6', name: 'Alquenos y alquinos', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 2, description: 'Insaturaciones simples y triples' },
      { id: 'c7', name: 'Lectura: Isomería', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 2, description: 'Isómeros estructurales y estereoisómeros' },
      { id: 'c8', name: 'Ejercicios: Nomenclatura avanzada', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 2, description: 'Naming de compuestos complejos' },
      { id: 'c9', name: 'Reactividad de alquenos', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 2, description: 'Mecanismos de adición' },
      { id: 'c10', name: 'Quiz: Alquenos y alquinos', type: 'quiz', status: 'pending', points: 100, duration: '15 min', weekNumber: 2, description: 'Evaluación de insaturaciones' },
      { id: 'c11', name: 'Ejercicios: Reacciones de adición', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 2, description: 'Problemas de mecanismos' },
      
      // Week 3
      { id: 'c12', name: 'Compuestos aromáticos', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 3, description: 'Benceno y aromaticidad' },
      { id: 'c13', name: 'Lectura: Benceno y derivados', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 3, description: 'Estructura del benceno' },
      { id: 'c14', name: 'Ejercicios: Reactividad aromática', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 3, description: 'Reacciones de sustitución' },
      { id: 'c15', name: 'Grupos funcionales - Parte 1', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 3, description: 'Alcoholes, éteres, aldehídos' },
      { id: 'c16', name: 'Ejercicios: Grupos funcionales', type: 'exercise', status: 'pending', points: 75, duration: '20 min', weekNumber: 3, description: 'Identificación de grupos' },
      { id: 'c17', name: 'Quiz: Aromáticos y grupos', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 3, description: 'Evaluación de aromáticos' },
      
      // Week 4
      { id: 'c18', name: 'Grupos funcionales - Parte 2', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 4, description: 'Cetonas, ácidos carboxílicos, ésteres' },
      { id: 'c19', name: 'Lectura: Síntesis orgánica', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 4, description: 'Estrategias de síntesis' },
      { id: 'c20', name: 'Ejercicios: Reacciones de carbonilo', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 4, description: 'Adiciones nucleófilas' },
      { id: 'c21', name: 'Problemas de síntesis', type: 'exercise', status: 'pending', points: 75, duration: '30 min', weekNumber: 4, description: 'Síntesis multietapa' },
      { id: 'c22', name: 'Quiz: Grupos carbonilo', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 4, description: 'Evaluación final' },
      
      // Week 5-18 (placeholder)
      ...Array.from({ length: 14 }, (_, weekIdx) => {
        const week = weekIdx + 5;
        return [
          { id: `c${22 + weekIdx * 4 + 1}`, name: `Video: Tema de semana ${week}`, type: 'video' as const, status: 'pending' as const, points: 50, duration: '20 min', weekNumber: week, description: `Contenido principal de la semana ${week}` },
          { id: `c${22 + weekIdx * 4 + 2}`, name: `Lectura: Semana ${week}`, type: 'reading' as const, status: 'pending' as const, points: 30, duration: '15 min', weekNumber: week, description: `Material de referencia` },
          { id: `c${22 + weekIdx * 4 + 3}`, name: `Ejercicios: Semana ${week}`, type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '25 min', weekNumber: week, description: `Práctica de conceptos` },
          { id: `c${22 + weekIdx * 4 + 4}`, name: `Quiz: Semana ${week}`, type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '20 min', weekNumber: week, description: `Evaluación semanal` },
        ];
      }).flat()
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
    totalActivities: 54,
    completedActivities: 9,
    activities: [
      // Week 1
      { id: 'd1', name: 'Introducción a la programación', type: 'video', status: 'completed', points: 50, duration: '15 min', weekNumber: 1, completedAt: '2026-03-24', description: 'Conceptos fundamentales y lenguajes' },
      { id: 'd2', name: 'Lectura: Algoritmia básica', type: 'reading', status: 'completed', points: 30, duration: '12 min', weekNumber: 1, completedAt: '2026-03-25', description: 'Pensamiento algorítmico' },
      { id: 'd3', name: 'Variables y tipos de datos', type: 'video', status: 'completed', points: 50, duration: '18 min', weekNumber: 1, completedAt: '2026-03-26', description: 'Enteros, reales, strings y booleanos' },
      { id: 'd4', name: 'Ejercicio: Primeros programas', type: 'exercise', status: 'completed', points: 75, duration: '20 min', weekNumber: 1, completedAt: '2026-03-27', description: 'Escribe tu primer programa' },
      { id: 'd5', name: 'Quiz: Variables y tipos', type: 'quiz', status: 'completed', points: 100, duration: '12 min', weekNumber: 1, completedAt: '2026-03-28', description: 'Evaluación de variables' },
      
      // Week 2
      { id: 'd6', name: 'Operadores y expresiones', type: 'video', status: 'in-progress', points: 50, duration: '18 min', weekNumber: 2, description: 'Aritméticos, lógicos y de comparación' },
      { id: 'd7', name: 'Condicionales - If/Else', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 2, description: 'Estructuras de decisión' },
      { id: 'd8', name: 'Lectura: Control de flujo', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 2, description: 'Conceptos de rama y decisión' },
      { id: 'd9', name: 'Ejercicios: Condicionales', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 2, description: 'Problemas con if/else' },
      { id: 'd10', name: 'Switch/Case', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 2, description: 'Decisiones múltiples' },
      { id: 'd11', name: 'Quiz: Condicionales', type: 'quiz', status: 'pending', points: 100, duration: '15 min', weekNumber: 2, description: 'Evaluación de control de flujo' },
      { id: 'd12', name: 'Proyecto: Calculadora simple', type: 'exercise', status: 'pending', points: 100, duration: '30 min', weekNumber: 2, description: 'Aplicación de operadores' },
      
      // Week 3
      { id: 'd13', name: 'Bucles While', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 3, description: 'Bucles con condición' },
      { id: 'd14', name: 'Bucles For', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 3, description: 'Bucles con contador' },
      { id: 'd15', name: 'Lectura: Iteración', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 3, description: 'Conceptos de repetición' },
      { id: 'd16', name: 'Ejercicios: Bucles básicos', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 3, description: 'Problemas con while/for' },
      { id: 'd17', name: 'Bucles anidados', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 3, description: 'Bucles dentro de bucles' },
      { id: 'd18', name: 'Ejercicios: Bucles avanzados', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 3, description: 'Patrones complejos' },
      { id: 'd19', name: 'Quiz: Bucles e iteración', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 3, description: 'Evaluación de bucles' },
      
      // Week 4
      { id: 'd20', name: 'Funciones - Definición', type: 'video', status: 'pending', points: 50, duration: '20 min', weekNumber: 4, description: 'Cómo definir y usar funciones' },
      { id: 'd21', name: 'Parámetros y retorno', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 4, description: 'Argumentos y valores de retorno' },
      { id: 'd22', name: 'Lectura: Modularidad', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 4, description: 'Dividing code into functions' },
      { id: 'd23', name: 'Ejercicios: Funciones simples', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 4, description: 'Crear y llamar funciones' },
      { id: 'd24', name: 'Recursión', type: 'video', status: 'pending', points: 50, duration: '18 min', weekNumber: 4, description: 'Funciones que se llaman a sí mismas' },
      { id: 'd25', name: 'Ejercicios: Recursión', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 4, description: 'Problemas recursivos' },
      { id: 'd26', name: 'Quiz: Funciones y recursión', type: 'quiz', status: 'pending', points: 100, duration: '20 min', weekNumber: 4, description: 'Evaluación de funciones' },
      
      // Week 5-18 (placeholder)
      ...Array.from({ length: 14 }, (_, weekIdx) => {
        const week = weekIdx + 5;
        return [
          { id: `d${26 + weekIdx * 4 + 1}`, name: `Video: Tema de semana ${week}`, type: 'video' as const, status: 'pending' as const, points: 50, duration: '20 min', weekNumber: week, description: `Contenido principal de la semana ${week}` },
          { id: `d${26 + weekIdx * 4 + 2}`, name: `Lectura: Semana ${week}`, type: 'reading' as const, status: 'pending' as const, points: 30, duration: '15 min', weekNumber: week, description: `Material de referencia` },
          { id: `d${26 + weekIdx * 4 + 3}`, name: `Ejercicios: Semana ${week}`, type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '25 min', weekNumber: week, description: `Práctica de conceptos` },
          { id: `d${26 + weekIdx * 4 + 4}`, name: `Quiz: Semana ${week}`, type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '20 min', weekNumber: week, description: `Evaluación semanal` },
        ];
      }).flat()
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
