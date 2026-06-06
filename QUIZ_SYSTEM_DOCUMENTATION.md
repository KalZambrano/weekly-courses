# Sistema de Quizzes e Intentos - Documentación

## Descripción General

He implementado un sistema completo de quizzes con preguntas de opción múltiple, intentos limitados, puntuación dinámica, y recomendaciones inteligentes para estudiantes.

## Características Principales

### 1. **Preguntas de Opción Múltiple**
- Cada quiz contiene una serie de preguntas con 4 opciones
- Cada pregunta tiene:
  - `question`: Texto de la pregunta
  - `options`: Array de 4 opciones
  - `correctAnswer`: Índice de la respuesta correcta
  - `explanation`: Explicación de por qué esa es la respuesta correcta
  - `topic`: Tema al que pertenece la pregunta

### 2. **Sistema de Intentos Limitados**
- Cada quiz tiene un número máximo de intentos (configurable, por defecto 3)
- Cada intento se guarda con:
  - `attemptNumber`: Número secuencial del intento
  - `score`: Puntuación obtenida (de 0 a 20)
  - `answers`: Array de respuestas seleccionadas
  - `completedAt`: Timestamp de cuándo se completó
  - `pointsEarned`: Puntos otorgados si aprobó

### 3. **Nota Mínima de Aprobación**
- Nota mínima requerida: 12 puntos (de 20)
- Cada pregunta correcta = 5 puntos
- Máximo posible: 4 preguntas × 5 = 20 puntos

### 4. **Puntuación con Multiplicadores**
- Los puntos solo se otorgan una vez cuando el quiz es aprobado
- La puntuación utiliza dos multiplicadores:
  - **Multiplicador de racha**: x2 (primeros 3 días), x1.5 (días 4-5), x1 (sin racha)
  - **Multiplicador de día**: x1.5 (lunes-jueves), x1 (viernes-domingo)
- Fórmula: `puntos_base × multiplicador_racha × multiplicador_día`

### 5. **Guardado del Mejor Puntaje**
- Se guarda el mejor puntaje de todos los intentos
- Aunque el usuario apruebe en el primer intento, puede hacer reintentos para mejorar
- Los puntos solo se otorgan cuando se aprueba por primera vez

### 6. **Recomendaciones Inteligentes**
- Si fallas, el sistema identifica automáticamente los temas en los que fallaste
- Muestra una lista de temas a repasar con referencia al material de la semana
- Las recomendaciones ayudan a guiar el estudio del estudiante

## Estructura de Datos

### Interface: `QuizQuestion`
```typescript
{
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  topic: string
}
```

### Interface: `QuizAttempt`
```typescript
{
  attemptNumber: number
  score: number
  answers: number[]
  completedAt: string
  pointsEarned: number
}
```

### Interface: `Activity` (extendida)
```typescript
{
  // ... campos originales
  quiz?: {
    questions: QuizQuestion[]
    maxAttempts: number
    passingScore: number
  }
  attempts?: QuizAttempt[]
  bestAttemptScore?: number
  isApproved?: boolean
}
```

## Componentes Implementados

### 1. **QuizViewer** (`components/custom/quiz-viewer.tsx`)
- Componente principal para resolver quizzes
- Características:
  - Navegación entre preguntas (anterior/siguiente)
  - Indicador de progreso
  - Selector de preguntas (números clickeables)
  - Mostrar respuesta y explicación después de enviar
  - Contador de intentos restantes
  - Historial de intentos

### 2. **ActivityCard** (`components/custom/activity-card.tsx`)
- Card visual para cada actividad
- Muestra:
  - Tipo de actividad (icono y nombre)
  - Descripción breve
  - Para quizzes: información de intentos, mejor puntaje, estado de aprobación
  - Botón de acción contextualizado (Realizar, Reintentar, Completado)
  - Duración y puntos base

## Flujo de Usuario

1. **Acceder a un Curso**
   - Estudiante ve la lista de actividades organizadas por semana

2. **Seleccionar un Quiz**
   - Hace clic en "Realizar Quiz" en la tarjeta de la actividad

3. **Resolver el Quiz**
   - Responde todas las preguntas
   - Ve el progreso mientras avanza
   - Al final, envía sus respuestas

4. **Recibir Retroalimentación**
   - Si **aprueba** (≥12 puntos):
     - Ve confirmación de aprobación
     - Se le otorgan puntos (solo una vez)
     - Puede reintentar para mejorar puntaje
   - Si **no aprueba** (<12 puntos):
     - Ve los temas en los que falló
     - Recibe recomendaciones para repasar
     - Puede intentar de nuevo si le restan intentos

5. **Reintentos**
   - Puede hacer más intentos hasta el límite
   - El sistema guarda el mejor puntaje
   - Ver historial de todos los intentos

## Ejemplo de Datos en Mock Data

Se incluyen dos quizzes como ejemplo:

### Quiz 1: Ecuaciones Lineales (Completado)
- Semana 1
- 4 preguntas
- 3 intentos máximo
- Estado: Aprobado (18/20 puntos)
- Historial: 1 intento completado

### Quiz 2: Funciones Cuadráticas (Pendiente)
- Semana 2
- 4 preguntas
- 3 intentos máximo
- Estado: Sin intentos aún

## Cálculo de Puntos - Ejemplo

**Quiz: Ecuaciones Lineales**
- Puntos base: 100
- Racha actual del estudiante: 5 días
- Multiplicador de racha: x1.5
- Día actual: Martes (lunes-jueves)
- Multiplicador de día: x1.5
- **Puntos otorgados: 100 × 1.5 × 1.5 = 225 puntos**

## Integración en la Aplicación

1. Las actividades ahora muestran información de quizzes en las tarjetas
2. Al hacer clic en un quiz, se abre el QuizViewer
3. Los intentos y puntuaciones se guardan en el objeto Activity
4. Los puntos se reflejan en el perfil del estudiante

## Archivos Modificados/Creados

- ✅ `data/mock-data.ts` - Interfaces y datos actualizados
- ✅ `components/custom/quiz-viewer.tsx` - Nuevo componente
- ✅ `components/custom/activity-card.tsx` - Nuevo componente
- ✅ `components/custom/weekly-activities.tsx` - Actualizado para usar ActivityCard
- ✅ `app/(dashboard)/student/courses/[id]/page.tsx` - Integración de QuizViewer

## Próximas Mejoras Posibles

- [ ] Persistencia en base de datos (actualmente en mock data)
- [ ] Analytics de desempeño por tema
- [ ] Generación automática de preguntas
- [ ] Sistema de tutorías basado en fallos
- [ ] Badges por logros en quizzes
