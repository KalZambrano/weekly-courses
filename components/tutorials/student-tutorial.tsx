'use client'

import { useEffect, useState } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

interface StudentTutorialProps {
  onTutorialEnd?: () => void
}

export function StudentTutorial({ onTutorialEnd }: StudentTutorialProps) {
  const [driverInstance, setDriverInstance] = useState<any>(null)

  useEffect(() => {
    // Create driver instance
    const driverObj = driver({
      showProgress: true,
      allowClose: true,
      overlayClickNext: true,
      onDestroy: () => {
        onTutorialEnd?.()
      },
      steps: [
        {
          element: '.student-header',
          popover: {
            title: '¡Bienvenido al Dashboard!',
            description: 'Aquí puedes ver tu perfil, nivel actual y racha de aprendizaje. Mantén tu racha activa para ganar más puntos.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.student-stats-grid',
          popover: {
            title: 'Tus Estadísticas',
            description: 'Estas tarjetas muestran tus puntos totales, progreso general y racha actual. Son tus métricas clave de aprendizaje.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.student-ranking',
          popover: {
            title: 'Tu Posición en el Ranking',
            description: 'Observa cómo te posicionas frente a otros estudiantes. ¡Sube de posición completando más actividades!',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '.student-recent-activity',
          popover: {
            title: 'Actividad Reciente',
            description: 'Aquí se muestran tus últimas acciones y logros en la plataforma. ¡Mantente activo!',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '.student-activity-summary',
          popover: {
            title: 'Resumen de Actividad',
            description: 'Un vistazo rápido a tus actividades completadas, pendientes y cursos en progreso.',
            side: 'top',
            align: 'end'
          }
        }
      ]
    })

    setDriverInstance(driverObj)

    return () => {
      if (driverObj) {
        driverObj.destroy()
      }
    }
  }, [onTutorialEnd])

  const startTutorial = () => {
    if (driverInstance) {
      driverInstance.drive()
    }
  }

  return (
    <button
      onClick={startTutorial}
      className="hidden"
      id="start-student-tutorial"
    >
      Start Tutorial
    </button>
  )
}
