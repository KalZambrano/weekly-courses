'use client'

import { useEffect, useState } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

interface TeacherTutorialProps {
  onTutorialEnd?: () => void
}

export function TeacherTutorial({ onTutorialEnd }: TeacherTutorialProps) {
  const [driverInstance, setDriverInstance] = useState<any>(null)

  useEffect(() => {
    // Create driver instance
    const driverObj = driver({
      showProgress: true,
      allowClose: true,
      onDestroyed: () => {
        onTutorialEnd?.()
      },
      steps: [
        {
          element: '.teacher-header',
          popover: {
            title: '¡Bienvenido al Panel del Docente!',
            description: 'Este es tu centro de control para monitorear el progreso y rendimiento de tus estudiantes. Aquí encontrarás toda la información que necesitas.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.teacher-key-metrics',
          popover: {
            title: 'Métricas Clave',
            description: 'Aquí ves de un vistazo: total de estudiantes, progreso promedio, actividades completadas y puntos otorgados. Estas son tus KPIs principales.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.teacher-course-overview',
          popover: {
            title: 'Resumen de Cursos',
            description: 'Observa el progreso de cada curso y cuántos estudiantes están inscritos en cada uno. Identifica dónde necesita más apoyo.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.teacher-students-table',
          popover: {
            title: 'Tabla de Estudiantes',
            description: 'Detalle completo de cada estudiante: su nivel, puntos, progreso y racha. Haz clic para profundizar en el rendimiento individual.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.teacher-level-distribution',
          popover: {
            title: 'Distribución por Nivel',
            description: 'Visualiza cuántos estudiantes hay en cada nivel (Oro, Plata, Bronce). Esto te ayuda a entender la distribución de habilidades de tu clase.',
            side: 'top',
            align: 'end'
          }
        },
        {
          element: '.teacher-top-performers',
          popover: {
            title: 'Top Rendimiento',
            description: 'Tus mejores estudiantes. Reconocerlos puede motivar al resto de la clase a mejorar su desempeño.',
            side: 'top',
            align: 'end'
          }
        },
        {
          element: '.teacher-needs-attention',
          popover: {
            title: 'Estudiantes que Requieren Atención',
            description: 'Los estudiantes con menor progreso se muestran aquí. Es importante ofrecerles apoyo adicional para que se pongan al día.',
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
      id="start-teacher-tutorial"
    >
      Start Tutorial
    </button>
  )
}
