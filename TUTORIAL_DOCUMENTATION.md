# Tutorial Visual del Dashboard - Documentación

## 📋 Descripción General

Se ha implementado un sistema de tutorial visual interactivo para los dashboards de **estudiantes** y **docentes** usando **driver.js**. El tutorial se muestra automáticamente la primera vez que un usuario accede al dashboard y puede ser activado manualmente en cualquier momento a través del botón "Ver Tutorial".

## 🎯 Características

- ✨ **Tutoriales Personalizados**: Diferentes flujos para estudiantes y docentes
- 🔄 **Detección Automática**: Se muestra solo la primera vez (usando localStorage)
- 🖱️ **Manual**: Botón "Ver Tutorial" disponible en ambos dashboards
- 🎨 **Diseño Integrado**: Estilos adaptados al tema de la aplicación
- 📱 **Responsive**: Funciona en todos los tamaños de pantalla
- ⌨️ **Interactivo**: Permite avanzar, retroceder y cancelar

## 📦 Dependencias Instaladas

```bash
pnpm add driver.js
```

## 🔧 Componentes Creados/Modificados

### Nuevos Componentes

#### 1. **`hooks/useTutorial.ts`**
Hook personalizado que gestiona el estado del tutorial.

```typescript
const { shouldShowTutorial, isLoading, markTutorialAsShown } = useTutorial('student')
```

**Propiedades:**
- `shouldShowTutorial`: boolean - Indica si se debe mostrar el tutorial
- `isLoading`: boolean - Estado de carga inicial
- `markTutorialAsShown()`: function - Marca el tutorial como visto

**Cómo funciona:**
- Verifica localStorage para determinar si el usuario ya vio el tutorial
- Usa una clave diferente para estudiantes y docentes
- Actualiza localStorage cuando se completa el tutorial

---

#### 2. **`components/tutorials/student-tutorial.tsx`**
Componente que renderiza el tutorial para estudiantes.

**Pasos del tutorial:**
1. **Encabezado** - Perfil, nivel y racha (elemento: `.student-header`)
2. **Estadísticas** - Puntos, progreso y racha (elemento: `.student-stats-grid`)
3. **Ranking** - Posición en la clasificación (elemento: `.student-ranking`)
4. **Actividad Reciente** - Últimas acciones (elemento: `.student-recent-activity`)
5. **Resumen de Actividad** - Estadísticas rápidas (elemento: `.student-activity-summary`)

---

#### 3. **`components/tutorials/teacher-tutorial.tsx`**
Componente que renderiza el tutorial para docentes.

**Pasos del tutorial:**
1. **Encabezado** - Introducción al panel (elemento: `.teacher-header`)
2. **Métricas Clave** - KPIs principales (elemento: `.teacher-key-metrics`)
3. **Resumen de Cursos** - Estado de cada curso (elemento: `.teacher-course-overview`)
4. **Tabla de Estudiantes** - Detalles de estudiantes (elemento: `.teacher-students-table`)
5. **Distribución por Nivel** - Estadísticas de niveles (elemento: `.teacher-level-distribution`)
6. **Top Rendimiento** - Mejores estudiantes (elemento: `.teacher-top-performers`)
7. **Requieren Atención** - Estudiantes con bajo progreso (elemento: `.teacher-needs-attention`)

---

#### 4. **`components/tutorials/tutorial-provider.tsx`**
Componente envolvente para facilitar la gestión de tutoriales.

```typescript
<TutorialProvider role="student">
  {children}
</TutorialProvider>
```

---

### Archivos Modificados

#### 1. **`app/(dashboard)/student/page.tsx`**
Cambios implementados:

```typescript
// Imports añadidos
import { StudentTutorial } from "@/components/tutorials/student-tutorial"
import { useTutorial } from "@/hooks/useTutorial"
import { HelpCircle } from "lucide-react"

// En el componente
const { shouldShowTutorial, isLoading, markTutorialAsShown } = useTutorial('student')

// Auto-iniciar tutorial
useEffect(() => {
  if (!isLoading && shouldShowTutorial) {
    const timer = setTimeout(() => {
      const tutorialButton = document.getElementById('start-student-tutorial')
      if (tutorialButton) tutorialButton.click()
    }, 500)
    return () => clearTimeout(timer)
  }
}, [isLoading, shouldShowTutorial])

// En el JSX
<StudentTutorial onTutorialEnd={markTutorialAsShown} />

// Botón manual
<button onClick={() => /* iniciar tutorial */}>
  <HelpCircle className="size-4" />
  Ver Tutorial
</button>
```

**Clases añadidas para los pasos del tutorial:**
- `.student-header` - Elemento del encabezado
- `.student-stats-grid` - Grid de estadísticas
- `.student-ranking` - Sección de ranking
- `.student-recent-activity` - Actividad reciente
- `.student-activity-summary` - Resumen de actividad

---

#### 2. **`app/(dashboard)/teacher/page.tsx`**
Cambios implementados:

```typescript
// Imports añadidos
import { useEffect, useState } from 'react'
import { TeacherTutorial } from '@/components/tutorials/teacher-tutorial'
import { useTutorial } from '@/hooks/useTutorial'
import { HelpCircle } from 'lucide-react'

// En el componente
const { shouldShowTutorial, isLoading, markTutorialAsShown } = useTutorial('teacher')

// Auto-iniciar tutorial
useEffect(() => {
  if (!isLoading && shouldShowTutorial) {
    const timer = setTimeout(() => {
      const tutorialButton = document.getElementById('start-teacher-tutorial')
      if (tutorialButton) tutorialButton.click()
    }, 500)
    return () => clearTimeout(timer)
  }
}, [isLoading, shouldShowTutorial])

// En el JSX
<TeacherTutorial onTutorialEnd={markTutorialAsShown} />

// Botón manual
<button onClick={() => /* iniciar tutorial */}>
  <HelpCircle className="size-4" />
  Ver Tutorial
</button>
```

**Clases añadidas para los pasos del tutorial:**
- `.teacher-header` - Encabezado del panel
- `.teacher-key-metrics` - Métricas clave
- `.teacher-course-overview` - Resumen de cursos
- `.teacher-students-table` - Tabla de estudiantes
- `.teacher-level-distribution` - Distribución por nivel
- `.teacher-top-performers` - Top rendimiento
- `.teacher-needs-attention` - Requieren atención

---

#### 3. **`app/globals.css`**
Estilos personalizados para driver.js:

```css
/* Driver.js Custom Styles */
.driver-popover {
  @apply rounded-lg border border-border bg-card shadow-lg;
}

.driver-popover-title {
  @apply font-bold text-foreground;
}

.driver-popover-description {
  @apply text-muted-foreground;
}

.driver-popover-footer {
  @apply flex gap-2 justify-end;
}

.driver-popover-footer button {
  @apply px-3 py-1 rounded text-sm font-medium transition-colors;
}

.driver-popover-footer button:not(.driver-popover-skip-btn) {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.driver-popover-skip-btn {
  @apply bg-muted text-muted-foreground hover:bg-muted/90;
}

.driver-overlay {
  @apply rounded-lg;
}
```

---

## 🚀 Cómo Funciona

### Flujo de Ejecución

1. **Primera Visita**
   ```
   Usuario accede al dashboard
   ↓
   Hook useTutorial verifica localStorage
   ↓
   shouldShowTutorial = true (no existe clave)
   ↓
   useEffect dispara el tutorial automáticamente
   ↓
   Usuario completa o cancela el tutorial
   ↓
   markTutorialAsShown() guarda en localStorage
   ```

2. **Visitas Posteriores**
   ```
   Usuario accede al dashboard
   ↓
   Hook useTutorial verifica localStorage
   ↓
   shouldShowTutorial = false (clave existe)
   ↓
   Tutorial NO se dispara automáticamente
   ↓
   Usuario puede presionar "Ver Tutorial" manualmente
   ```

### Almacenamiento en localStorage

```typescript
// Clave para estudiantes
'weekly-courses-tutorial-student-shown': 'true'

// Clave para docentes
'weekly-courses-tutorial-teacher-shown': 'true'
```

---

## 🎨 Personalización

### Para Agregar Nuevos Pasos al Tutorial

**En `student-tutorial.tsx` o `teacher-tutorial.tsx`:**

```typescript
{
  element: '.my-new-element',  // Selector CSS del elemento
  popover: {
    title: 'Título del Paso',
    description: 'Descripción detallada de qué hace este elemento.',
    side: 'bottom',  // Posición: 'top', 'bottom', 'left', 'right'
    align: 'start'   // Alineación: 'start', 'center', 'end'
  }
}
```

**En el HTML correspondiente, agregar la clase:**
```jsx
<div className="my-new-element">
  {/* Contenido */}
</div>
```

### Para Cambiar el Color de driver.js

Modificar `/app/globals.css` en la sección "Driver.js Custom Styles":

```css
.driver-popover {
  @apply bg-blue-100 border-blue-300; /* Nuevo color */
}

.driver-popover-footer button:not(.driver-popover-skip-btn) {
  @apply bg-blue-600 hover:bg-blue-700; /* Nuevo botón */
}
```

### Para Resetear el Tutorial (Desarrollo)

En la consola del navegador:
```javascript
// Para estudiantes
localStorage.removeItem('weekly-courses-tutorial-student-shown')

// Para docentes
localStorage.removeItem('weekly-courses-tutorial-teacher-shown')

// Recargar página
location.reload()
```

---

## 🔍 Testing

### Verificar que el Tutorial Se Dispara

1. Abre DevTools (F12)
2. Storage → LocalStorage
3. Elimina las claves `weekly-courses-tutorial-student-shown` y `weekly-courses-tutorial-teacher-shown`
4. Recarga la página
5. El tutorial debe iniciarse automáticamente

### Verificar el Botón Manual

1. Presiona "Ver Tutorial" en cualquier momento
2. El tutorial debe reiniciarse desde el principio
3. Ciérralo presionando ESC o en el botón de cerrar

---

## 📋 Resumen de Cambios

| Archivo | Cambio | Descripción |
|---------|--------|-------------|
| `hooks/useTutorial.ts` | ✨ Creado | Hook para gestionar estado del tutorial |
| `components/tutorials/student-tutorial.tsx` | ✨ Creado | Tutorial para estudiantes |
| `components/tutorials/teacher-tutorial.tsx` | ✨ Creado | Tutorial para docentes |
| `components/tutorials/tutorial-provider.tsx` | ✨ Creado | Provider envolvente (opcional) |
| `app/(dashboard)/student/page.tsx` | ✏️ Modificado | Integración de tutorial + botón manual |
| `app/(dashboard)/teacher/page.tsx` | ✏️ Modificado | Integración de tutorial + botón manual |
| `app/globals.css` | ✏️ Modificado | Estilos personalizados de driver.js |
| `package.json` | ✏️ Modificado | Añadido `driver.js` como dependencia |

---

## 💡 Notas Importantes

- El tutorial usa **localStorage** para recordar si ya se mostró (específico por navegador/dispositivo)
- Los elementos deben tener las clases CSS exactas para que driver.js los encuentre
- El tutorial se inicializa con un delay de 500ms para asegurar que el DOM esté completamente listo
- Los estilos de driver.js se aplican mediante las clases CSS mostradas arriba
- El botón "Ver Tutorial" está siempre disponible para revisiones posteriores

---

## 🆘 Troubleshooting

### El tutorial no se inicia automáticamente
- Verifica que localStorage está habilitado
- Abre DevTools y en Console ejecuta: `console.log(localStorage.getItem('weekly-courses-tutorial-student-shown'))`
- Si devuelve `null`, elimínalo manualmente

### Los elementos no se resaltan correctamente
- Verifica que las clases CSS coinciden exactamente (`.student-header`, `.teacher-header`, etc.)
- En DevTools, busca los elementos: `document.querySelector('.student-header')`
- Si devuelve `null`, la clase no está en el elemento

### El popover aparece en posición incorrecta
- Cambia la propiedad `side` a una de: `'top'`, `'bottom'`, `'left'`, `'right'`
- Usa `align` para ajustar: `'start'`, `'center'`, `'end'`

---

¡Los tutoriales están listos para mejorar la experiencia del usuario! 🎉
