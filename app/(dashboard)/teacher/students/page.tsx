//weekly-courses/app/(dashboard)/teacher/students/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LevelBadge } from '@/components/custom/level-badge'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { allStudents, courses } from '@/data/mock-data'
import { getActivityTypeInfo } from '@/lib/gamification'
import {
  Search,
  Filter,
  Users,
  Mail,
  BookOpen,
  Flame,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export default function TeacherStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<'all' | 'Oro' | 'Plata' | 'Bronce'>('all')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  // TODO: BACKEND - Aquí harás un fetch a tu Estudiante-Server para traer la lista real
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === 'all' || student.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const selectedStudentData = selectedStudent
    ? allStudents.find(s => s.id === selectedStudent)
    : null

  // TODO: BACKEND - Aquí harás un fetch a tu Nota_Evaluacion-Server pasando el DNI del alumno
  const studentCourses = selectedStudentData
    ? courses.filter(c => selectedStudentData.enrolledCourses.includes(c.id))
    : []

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="size-8 text-primary" />
          Gestión de Estudiantes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Visualiza y gestiona el progreso de tus estudiantes
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar estudiantes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as typeof levelFilter)}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Filtrar por nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="Oro">Oro</SelectItem>
            <SelectItem value="Plata">Plata</SelectItem>
            <SelectItem value="Bronce">Bronce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Students List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Estudiantes ({filteredStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-all hover:bg-muted/50 cursor-pointer",
                    selectedStudent === student.id && "ring-2 ring-primary bg-primary/5"
                  )}
                >
                  <Avatar className="size-12">
                    <AvatarFallback className={cn(
                      selectedStudent === student.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}>
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{student.name}</p>
                      <LevelBadge level={student.level} size="sm" showIcon={false} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-primary">{student.points.toLocaleString('en-US')}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                      <Flame className={cn(
                        "size-3",
                        student.streak > 0 ? "text-orange-500" : ""
                      )} />
                      <span>{student.streak}d</span>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Student Detail Panel */}
        <div>
          {selectedStudentData ? (
            <Card className="sticky top-8">
              <CardHeader className="text-center pb-2">
                <Avatar className="mx-auto size-20 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {selectedStudentData.avatar}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{selectedStudentData.name}</CardTitle>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span className="text-sm">{selectedStudentData.email}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedStudentData.points.toLocaleString('en-US')}
                    </p>
                    <p className="text-xs text-muted-foreground">Puntos</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center flex flex-col items-center justify-center">
                    <LevelBadge level={selectedStudentData.level} />
                    <p className="mt-1 text-xs text-muted-foreground">Nivel</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="size-4" />
                      Progreso General
                    </span>
                    <span className="font-medium">{selectedStudentData.progress}%</span>
                  </div>
                  <Progress value={selectedStudentData.progress} className="h-2" />
                </div>

                {/* Streak */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <Flame className={cn(
                      "size-5",
                      selectedStudentData.streak > 0 ? "text-orange-500" : "text-muted-foreground"
                    )} />
                    <span>Racha actual</span>
                  </div>
                  <span className="font-bold">
                    {selectedStudentData.streak} {selectedStudentData.streak === 1 ? 'día' : 'días'}
                  </span>
                </div>

                {/* HU-10: Panel de Puntajes por Actividad (Acordeón y Tabla) */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <BookOpen className="size-4" />
                    Desempeño por Curso ({studentCourses.length})
                  </h4>

                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {studentCourses.map((course) => (
                      <AccordionItem key={course.id} value={course.id} className="border rounded-lg px-3 bg-background">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 w-full pr-4">
                            <span className="text-xl">{course.icon}</span>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-medium truncate">{course.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={course.progress} className="h-1.5 flex-1" />
                                <span className="text-xs font-medium text-muted-foreground w-8 text-right">{course.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pt-2 pb-4">
                          <div className="rounded-md border max-h-[250px] overflow-y-auto">
                            <Table>
                              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                  <TableHead className="h-8 text-xs">Actividad</TableHead>
                                  <TableHead className="h-8 text-xs text-right">Puntaje</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {/* Mostramos solo las primeras 15 actividades para no saturar la UI */}
                                {course.activities.slice(0, 15).map((activity) => {
                                  const typeInfo = getActivityTypeInfo(activity.type)
                                  return (
                                    <TableRow key={activity.id}>
                                      <TableCell className="py-2">
                                        <div className="flex items-center gap-2">
                                          {activity.status === 'completed' ? (
                                            <CheckCircle2 className="size-3 text-success shrink-0" />
                                          ) : (
                                            <Clock className="size-3 text-muted-foreground shrink-0" />
                                          )}
                                          <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-medium truncate max-w-[140px]" title={activity.name}>
                                              {activity.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                              {typeInfo.label}
                                            </span>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-2 text-right">
                                        {activity.status === 'completed' ? (
                                          <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-none text-[10px]">
                                            {activity.type === 'quiz' && activity.bestAttemptScore !== undefined
                                              ? `${activity.bestAttemptScore}/${activity.quiz?.passingScore || 20} pts`
                                              : `+${activity.points} pts`}
                                          </Badge>
                                        ) : (
                                          <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-8">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="size-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">Selecciona un estudiante</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Haz clic en un estudiante para ver sus detalles y notas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}