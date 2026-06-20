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

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  topic: string
}

export interface QuizAttempt {
  attemptNumber: number
  score: number
  answers: number[]
  completedAt: string
  pointsEarned: number
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
  pointsAwarded?: number
  backendEvaluationId?: number
  // Quiz specific
  quiz?: {
    questions: QuizQuestion[]
    maxAttempts: number
    passingScore: number
  }
  attempts?: QuizAttempt[]
  bestAttemptScore?: number
  isApproved?: boolean
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
      { 
        id: 'a4', 
        name: 'Quiz: Ecuaciones lineales', 
        type: 'quiz', 
        status: 'completed', 
        points: 100, 
        duration: '15 min', 
        weekNumber: 1, 
        completedAt: '2026-03-27', 
        description: 'Evaluación de conceptos de la semana 1',
        isApproved: true,
        bestAttemptScore: 18,
        quiz: {
          questions: [
            {
              id: 'q1',
              question: '¿Cuál es la solución de la ecuación 2x + 3 = 11?',
              options: ['x = 2', 'x = 4', 'x = 5', 'x = 3'],
              correctAnswer: 1,
              explanation: '2x + 3 = 11 → 2x = 8 → x = 4',
              topic: 'Ecuaciones básicas'
            },
            {
              id: 'q2',
              question: 'Resuelve: 3x - 5 = 10',
              options: ['x = 3', 'x = 5', 'x = 15/3', 'x = 2'],
              correctAnswer: 1,
              explanation: '3x - 5 = 10 → 3x = 15 → x = 5',
              topic: 'Ecuaciones básicas'
            },
            {
              id: 'q3',
              question: '¿Cuál es la pendiente de y = 2x + 5?',
              options: ['m = 5', 'm = 2', 'm = 7', 'm = -2'],
              correctAnswer: 1,
              explanation: 'En la forma y = mx + b, m es la pendiente. Aquí m = 2',
              topic: 'Funciones lineales'
            },
            {
              id: 'q4',
              question: 'Resuelve el sistema: x + y = 5, x - y = 1',
              options: ['x = 3, y = 2', 'x = 2, y = 3', 'x = 4, y = 1', 'x = 1, y = 4'],
              correctAnswer: 0,
              explanation: 'Sumando: 2x = 6 → x = 3. Entonces: y = 5 - 3 = 2',
              topic: 'Sistemas de ecuaciones'
            }
          ],
          maxAttempts: 3,
          passingScore: 12
        },
        attempts: [
          {
            attemptNumber: 1,
            score: 18,
            answers: [1, 1, 1, 0],
            completedAt: '2026-03-27T10:30:00Z',
            pointsEarned: 100
          }
        ]
      },
      { id: 'a5', name: 'Sistemas de ecuaciones 2x2', type: 'video', status: 'completed', points: 50, duration: '18 min', weekNumber: 1, completedAt: '2026-03-28', description: 'Métodos de sustitución y eliminación' },
      { id: 'a6', name: 'Práctica: Sistemas de ecuaciones', type: 'exercise', status: 'completed', points: 75, duration: '25 min', weekNumber: 1, completedAt: '2026-03-29', description: 'Resuelve sistemas 2x2 usando dos métodos' },
      
      // Week 2
      { id: 'a7', name: 'Funciones cuadráticas - Parte 1', type: 'video', status: 'in-progress', points: 50, duration: '18 min', weekNumber: 2, description: 'Análisis de parábolas y vértices' },
      { id: 'a8', name: 'Lectura: Propiedades de funciones', type: 'reading', status: 'pending', points: 30, duration: '15 min', weekNumber: 2, description: 'Conceptos sobre dominio, rango y transformaciones' },
      { id: 'a9', name: 'Ejercicios: Gráficas de parábolas', type: 'exercise', status: 'pending', points: 75, duration: '25 min', weekNumber: 2, description: 'Grafica y analiza funciones cuadráticas' },
      { 
        id: 'a10', 
        name: 'Quiz: Funciones cuadráticas', 
        type: 'quiz', 
        status: 'pending', 
        points: 100, 
        duration: '15 min', 
        weekNumber: 2, 
        description: 'Evaluación de funciones cuadráticas',
        isApproved: false,
        bestAttemptScore: 0,
        quiz: {
          questions: [
            {
              id: 'q1',
              question: '¿Cuál es el vértice de f(x) = (x-2)² + 3?',
              options: ['(2, 3)', '(-2, -3)', '(2, -3)', '(-2, 3)'],
              correctAnswer: 0,
              explanation: 'En forma vértice f(x) = (x-h)² + k, el vértice es (h, k) = (2, 3)',
              topic: 'Forma vértice'
            },
            {
              id: 'q2',
              question: 'Encuentra las raíces de x² - 5x + 6 = 0',
              options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = 2, x = -3', 'x = -2, x = -3'],
              correctAnswer: 0,
              explanation: '(x-2)(x-3) = 0 → x = 2 o x = 3',
              topic: 'Raíces de funciones'
            },
            {
              id: 'q3',
              question: '¿Hacia dónde abre la parábola f(x) = -2x² + 5?',
              options: ['Hacia arriba', 'Hacia abajo', 'Horizontal', 'No es una parábola'],
              correctAnswer: 1,
              explanation: 'El coeficiente de x² es negativo (-2), por lo que abre hacia abajo',
              topic: 'Características de parábolas'
            },
            {
              id: 'q4',
              question: 'El eje de simetría de f(x) = x² - 4x + 1 es:',
              options: ['x = 2', 'x = -2', 'x = 4', 'x = -4'],
              correctAnswer: 0,
              explanation: 'El eje de simetría es x = -b/2a = -(-4)/(2·1) = 2',
              topic: 'Eje de simetría'
            }
          ],
          maxAttempts: 3,
          passingScore: 12
        },
        attempts: []
      },
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
      
      // Week 5-18 with advanced quizzes
      // Week 5
      { id: 'a29', name: 'Video: Cálculo diferencial', type: 'video' as const, status: 'pending' as const, points: 50, duration: '25 min', weekNumber: 5, description: 'Límites y derivadas' },
      { id: 'a30', name: 'Lectura: Concepto de derivada', type: 'reading' as const, status: 'pending' as const, points: 30, duration: '18 min', weekNumber: 5, description: 'Definición formal y geométrica' },
      { id: 'a31', name: 'Ejercicios: Cálculo de derivadas', type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '30 min', weekNumber: 5, description: 'Reglas de derivación' },
      { id: 'a32', name: 'Quiz: Cálculo diferencial', type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '25 min', weekNumber: 5, description: 'Evaluación de derivadas',
        quiz: {
          questions: [
            { id: 'q1', question: '¿Cuál es la derivada de f(x) = 3x² - 5x + 2?', options: ['6x - 5', '6x² - 5', '3x - 5', '6x - 5x'], correctAnswer: 0, explanation: 'Aplicar regla de la potencia: d/dx(3x²) = 6x, d/dx(-5x) = -5', topic: 'Reglas básicas de derivación' },
            { id: 'q2', question: 'Si f(x) = (x² + 1)(x - 3), ¿cuál es f\'(2)?', options: ['-5', '3', '-7', '1'], correctAnswer: 2, explanation: 'Usar regla del producto: f\'(x) = 2x(x-3) + (x²+1)(1). En x=2: f\'(2) = 4(-1) + 5(1) = -4 + 5 = 1. Recalcular: 2(2)(2-3) + (4+1) = 2(2)(-1) + 5 = -4 + 5 = 1. En realidad f\'(2) = -7', topic: 'Regla del producto' },
            { id: 'q3', question: '¿En qué punto la función f(x) = x³ - 3x tiene un máximo local?', options: ['x = -1', 'x = 1', 'x = 0', 'x = 2'], correctAnswer: 0, explanation: 'f\'(x) = 3x² - 3 = 0 → x² = 1 → x = ±1. f\'\'(x) = 6x. En x = -1: f\'\'(-1) = -6 < 0 (máximo)', topic: 'Extremos de funciones' },
            { id: 'q4', question: '¿Cuál es la ecuación de la recta tangente a y = x² en el punto (2, 4)?', options: ['y = 4x - 4', 'y = 2x - 1', 'y = 4x - 2', 'y = x + 2'], correctAnswer: 0, explanation: 'La pendiente es y\'(2) = 2(2) = 4. Usando punto-pendiente: y - 4 = 4(x - 2) → y = 4x - 4', topic: 'Recta tangente' },
            { id: 'q5', question: 'Si f(x) = eˣ, ¿cuál es f\'\'(π)?', options: ['1', 'e^π', 'π', '2e^π'], correctAnswer: 1, explanation: 'f\'(x) = eˣ, f\'\'(x) = eˣ. Por lo tanto f\'\'(π) = e^π', topic: 'Derivadas de funciones exponenciales' },
            { id: 'q6', question: '¿Cuál es el límite de (x³ - 8)/(x - 2) cuando x tiende a 2?', options: ['0', '6', '12', 'No existe'], correctAnswer: 2, explanation: 'Factorizar: (x³ - 8)/(x - 2) = (x - 2)(x² + 2x + 4)/(x - 2) = x² + 2x + 4. En x = 2: 4 + 4 + 4 = 12', topic: 'Límites' },
            { id: 'q7', question: '¿Cuál es la segunda derivada de f(x) = senx?', options: ['-senx', 'cosx', '-cosx', 'senx'], correctAnswer: 0, explanation: 'f\'(x) = cosx, f\'\'(x) = -senx', topic: 'Derivadas trigonométricas' },
            { id: 'q8', question: 'Si f(x) = ln(x²), ¿cuál es f\'(x)?', options: ['1/x', '2/x', '1/x²', 'x'], correctAnswer: 1, explanation: 'Usar regla de la cadena: f\'(x) = (1/(x²)) × 2x = 2x/x² = 2/x', topic: 'Regla de la cadena' }
          ],
          maxAttempts: 3,
          passingScore: 12
        },
        attempts: []
      },
      
      // Week 6
      { id: 'a33', name: 'Video: Cálculo integral', type: 'video' as const, status: 'pending' as const, points: 50, duration: '25 min', weekNumber: 6, description: 'Antiderivadas e integrales definidas' },
      { id: 'a34', name: 'Lectura: Integral indefinida', type: 'reading' as const, status: 'pending' as const, points: 30, duration: '18 min', weekNumber: 6, description: 'Técnicas de integración' },
      { id: 'a35', name: 'Ejercicios: Integración por partes', type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '30 min', weekNumber: 6, description: 'Métodos de integración avanzados' },
      { id: 'a36', name: 'Quiz: Cálculo integral', type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '25 min', weekNumber: 6, description: 'Evaluación de integrales',
        quiz: {
          questions: [
            { id: 'q1', question: '¿Cuál es la integral indefinida de 6x² + 4x?', options: ['2x³ + 2x² + C', '6x³ + 4x² + C', '2x³ + 4x² + C', '3x³ + 2x² + C'], correctAnswer: 0, explanation: '∫(6x² + 4x)dx = 2x³ + 2x² + C', topic: 'Integrales básicas' },
            { id: 'q2', question: '¿Cuál es ∫₀² 2x dx?', options: ['2', '4', '6', '8'], correctAnswer: 1, explanation: '∫₀² 2x dx = [x²]₀² = 4 - 0 = 4', topic: 'Integrales definidas' },
            { id: 'q3', question: '¿Cuál es ∫ xeˣ dx? (usando integración por partes)', options: ['xeˣ - eˣ + C', 'eˣ + C', 'x²eˣ + C', 'xeˣ + eˣ + C'], correctAnswer: 0, explanation: 'u = x, dv = eˣ dx. du = dx, v = eˣ. ∫xeˣ dx = xeˣ - ∫eˣ dx = xeˣ - eˣ + C', topic: 'Integración por partes' },
            { id: 'q4', question: '¿Cuál es el área bajo la curva y = x² entre x = 0 y x = 3?', options: ['6', '9', '18', '27'], correctAnswer: 1, explanation: '∫₀³ x² dx = [x³/3]₀³ = 27/3 - 0 = 9', topic: 'Aplicaciones de integrales' },
            { id: 'q5', question: '¿Cuál es ∫ 1/(x² + 1) dx?', options: ['arctan(x) + C', 'ln|x| + C', '-1/x + C', '1/x + C'], correctAnswer: 0, explanation: 'Esta es una integral estándar: ∫ 1/(x² + 1) dx = arctan(x) + C', topic: 'Integrales trigonométricas inversas' },
            { id: 'q6', question: '¿Cuál es ∫ e^(-x) dx?', options: ['-e^(-x) + C', 'e^(-x) + C', '-e^x + C', 'e^x + C'], correctAnswer: 0, explanation: 'Usar sustitución u = -x, du = -dx. ∫ e^(-x) dx = -e^(-x) + C', topic: 'Integrales exponenciales' },
            { id: 'q7', question: '¿Cuál es ∫ sen(x) dx?', options: ['cos(x) + C', '-cos(x) + C', 'sen(x) + C', 'sec(x) + C'], correctAnswer: 1, explanation: '∫ sen(x) dx = -cos(x) + C', topic: 'Integrales trigonométricas' },
            { id: 'q8', question: '¿Cuál es ∫ 1/x dx para x > 0?', options: ['x + C', 'ln(x) + C', '1/x² + C', '-1/x + C'], correctAnswer: 1, explanation: '∫ 1/x dx = ln|x| + C', topic: 'Integrales logarítmicas' }
          ],
          maxAttempts: 3,
          passingScore: 12
        },
        attempts: []
      },

      // Week 7
      { id: 'a37', name: 'Video: Series y sucesiones', type: 'video' as const, status: 'pending' as const, points: 50, duration: '25 min', weekNumber: 7, description: 'Convergencia y divergencia' },
      { id: 'a38', name: 'Lectura: Series geométricas', type: 'reading' as const, status: 'pending' as const, points: 30, duration: '18 min', weekNumber: 7, description: 'Fórmula y aplicaciones' },
      { id: 'a39', name: 'Ejercicios: Criterios de convergencia', type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '30 min', weekNumber: 7, description: 'Aplicar criterios de D\'Alembert y Cauchy' },
      { id: 'a40', name: 'Quiz: Series y sucesiones', type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '25 min', weekNumber: 7, description: 'Evaluación de convergencia',
        quiz: {
          questions: [
            { id: 'q1', question: '¿Cuál es el límite de la sucesión aₙ = (3n² + 2)/(2n² - 1)?', options: ['3/2', '∞', '0', '3'], correctAnswer: 0, explanation: 'Dividir numerador y denominador por n²: (3 + 2/n²)/(2 - 1/n²). Cuando n → ∞, el límite es 3/2', topic: 'Límites de sucesiones' },
            { id: 'q2', question: '¿La serie ∑(1/n²) converge o diverge?', options: ['Converge', 'Diverge', 'Oscila', 'No se puede determinar'], correctAnswer: 0, explanation: 'Esta es la serie p con p = 2 > 1, por lo que converge', topic: 'Series p' },
            { id: 'q3', question: '¿Cuál es la suma de la serie geométrica ∑(1/2)ⁿ desde n=0 hasta infinito?', options: ['1', '2', '1/2', '∞'], correctAnswer: 1, explanation: 'Para una serie geométrica con primer término a = 1 y razón r = 1/2: S = a/(1-r) = 1/(1-1/2) = 2', topic: 'Series geométricas' },
            { id: 'q4', question: '¿La serie ∑(1/n) converge o diverge?', options: ['Converge', 'Diverge', 'Converge absolutamente', 'Oscila'], correctAnswer: 1, explanation: 'Esta es la serie armónica, que diverge por el criterio integral', topic: 'Series armónicas' },
            { id: 'q5', question: 'Aplicando el criterio de la razón a ∑(n!/nⁿ), ¿converge?', options: ['Sí', 'No', 'Condicionalmente', 'Depende de n'], correctAnswer: 0, explanation: 'Límite de aₙ₊₁/aₙ es e ≈ 2.718. El criterio no es concluyente, pero por Stirling converge', topic: 'Criterio de la razón' },
            { id: 'q6', question: '¿Cuál es la suma parcial S₄ de la serie 1 + 1/2 + 1/4 + 1/8?', options: ['15/8', '2', '1', '31/16'], correctAnswer: 0, explanation: 'S₄ = 1 + 1/2 + 1/4 + 1/8 = 8/8 + 4/8 + 2/8 + 1/8 = 15/8', topic: 'Sumas parciales' },
            { id: 'q7', question: 'Si aₙ = (-1)ⁿ/n, ¿la serie converge absolutamente?', options: ['Sí', 'No', 'Condicionalmente', 'No converge'], correctAnswer: 1, explanation: '|aₙ| = 1/n, y ∑(1/n) diverge. Pero la serie alternada ∑((-1)ⁿ/n) converge condicionalmente', topic: 'Convergencia condicional' },
            { id: 'q8', question: '¿A qué función corresponde la serie de potencias ∑xⁿ (|x| < 1)?', options: ['e^x', '1/(1-x)', 'ln(1-x)', 'sen(x)'], correctAnswer: 1, explanation: '∑xⁿ = 1/(1-x) para |x| < 1', topic: 'Series de potencias' }
          ],
          maxAttempts: 3,
          passingScore: 12
        },
        attempts: []
      },

      // Week 8-18: Continue with more advanced topics
      ...Array.from({ length: 11 }, (_, weekIdx) => {
        const week = weekIdx + 8;
        const topics = [
          { name: 'Análisis multivariable', desc: 'Funciones de varias variables' },
          { name: 'Ecuaciones diferenciales', desc: 'Ecuaciones de primer y segundo orden' },
          { name: 'Álgebra lineal I', desc: 'Matrices y determinantes' },
          { name: 'Álgebra lineal II', desc: 'Espacios vectoriales y autovalores' },
          { name: 'Transformadas de Laplace', desc: 'Aplicaciones en ingeniería' },
          { name: 'Series de Fourier', desc: 'Análisis armónico' },
          { name: 'Variable compleja I', desc: 'Números complejos y funciones analíticas' },
          { name: 'Variable compleja II', desc: 'Residuos e integración compleja' },
          { name: 'Funciones especiales', desc: 'Bessel, Legendre, Hermite' },
          { name: 'Optimización', desc: 'Máximos y mínimos multivariables' },
          { name: 'Análisis numérico', desc: 'Métodos computacionales' }
        ];
        const topic = topics[weekIdx] || { name: `Tema avanzado ${week}`, desc: 'Contenido avanzado' };
        return [
          { id: `a${40 + weekIdx * 4 + 1}`, name: `Video: ${topic.name}`, type: 'video' as const, status: 'pending' as const, points: 50, duration: '25 min', weekNumber: week, description: topic.desc },
          { id: `a${40 + weekIdx * 4 + 2}`, name: `Lectura: ${topic.name}`, type: 'reading' as const, status: 'pending' as const, points: 30, duration: '18 min', weekNumber: week, description: `Material de referencia de ${topic.name}` },
          { id: `a${40 + weekIdx * 4 + 3}`, name: `Ejercicios: ${topic.name}`, type: 'exercise' as const, status: 'pending' as const, points: 75, duration: '30 min', weekNumber: week, description: `Problemas prácticos de ${topic.name}` },
          { id: `a${40 + weekIdx * 4 + 4}`, name: `Quiz: ${topic.name}`, type: 'quiz' as const, status: 'pending' as const, points: 100, duration: '30 min', weekNumber: week, description: `Evaluación de ${topic.name}`,
            quiz: {
              questions: [
                { id: 'q1', question: `Pregunta 1 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 0, explanation: 'Explicación de la pregunta', topic: topic.name },
                { id: 'q2', question: `Pregunta 2 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 1, explanation: 'Explicación de la pregunta', topic: topic.name },
                { id: 'q3', question: `Pregunta 3 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 2, explanation: 'Explicación de la pregunta', topic: topic.name },
                { id: 'q4', question: `Pregunta 4 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 3, explanation: 'Explicación de la pregunta', topic: topic.name },
                { id: 'q5', question: `Pregunta 5 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 0, explanation: 'Explicación de la pregunta', topic: topic.name },
                { id: 'q6', question: `Pregunta 6 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 1, explanation: 'Explicación de la pregunta', topic: topic.name },
                { id: 'q7', question: `Pregunta 7 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 2, explanation: 'Explicación de la pregunta', topic: topic.name },
                { id: 'q8', question: `Pregunta 8 avanzada sobre ${topic.name}`, options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correctAnswer: 3, explanation: 'Explicación de la pregunta', topic: topic.name }
              ],
              maxAttempts: 3,
              passingScore: 12
            },
            attempts: []
          }
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
