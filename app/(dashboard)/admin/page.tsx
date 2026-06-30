'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { getAllStudents, getAllAssistants, getAllCourses } from '@/services/services'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    studentsCount: 0,
    teachersCount: 0,
    coursesCount: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, assistants, courses] = await Promise.all([
          getAllStudents(),
          getAllAssistants(),
          getAllCourses()
        ])
        
        // Differentiate assistants between teachers (ADMIN) and others if needed,
        // or just count all assistants as staff/teachers.
        const teachers = assistants.filter((a: any) => a.rolesEmpleado === 'ADMIN')
        
        setStats({
          studentsCount: students.length,
          teachersCount: assistants.length, // Show all assistants/teachers
          coursesCount: courses.length
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-blue-700" />
        <span className="ml-3 text-slate-500 font-medium">Cargando panel de administración...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ShieldAlert className="size-8 text-blue-700" />
            Panel de Administración
          </h1>
          <p className="mt-2 text-slate-500">
            Bienvenido al centro de control. Gestiona la plataforma e inscribe usuarios de forma segura.
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-100">
          Rol: Administrador
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Estudiantes</CardTitle>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
              <GraduationCap className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.studentsCount}</div>
            <p className="text-xs text-slate-400 mt-1">Registrados en la plataforma</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Docentes / Personal</CardTitle>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 border border-blue-100">
              <Users className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.teachersCount}</div>
            <p className="text-xs text-slate-400 mt-1">Asistentes y administradores activos</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Cursos Activos</CardTitle>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600 border border-purple-100">
              <BookOpen className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stats.coursesCount}</div>
            <p className="text-xs text-slate-400 mt-1">Materias académicas creadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Actions */}
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Settings className="size-5 text-slate-500" />
        Accesos Rápidos
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800 text-lg">Gestión y Creación de Usuarios</CardTitle>
            <CardDescription>
              Crea nuevos estudiantes y docentes uno por uno. Configura su DNI, apellidos independientes, celular y habilitación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white gap-2 rounded-xl h-11 w-full sm:w-auto">
                Ir a Gestión de Usuarios
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800 text-lg">Gestión de Cursos y Asignaciones</CardTitle>
            <CardDescription>
              Vincula docentes a cursos mediante asignaciones o inscribe estudiantes en las diferentes clases disponibles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/courses" className="flex-1 min-w-[200px]">
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl h-11 w-full gap-2">
                  Ver Cursos
                </Button>
              </Link>
              <Link href="/admin/assignments" className="flex-1 min-w-[200px]">
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl h-11 w-full gap-2">
                  Ver Asignaciones
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
