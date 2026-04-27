'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LevelBadge } from '@/components/custom/level-badge'
import { allStudents, courses } from '@/data/mock-data'
import { 
  Search, 
  Filter, 
  Users, 
  Mail,
  BookOpen,
  Flame,
  TrendingUp
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
  
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === 'all' || student.level === levelFilter
    return matchesSearch && matchesLevel
  })
  
  const selectedStudentData = selectedStudent 
    ? allStudents.find(s => s.id === selectedStudent)
    : null
    
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
                    "w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-all hover:bg-muted/50",
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
                    <p className="font-bold text-primary">{student.points.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
                      {selectedStudentData.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Puntos</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
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
                
                {/* Enrolled Courses */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <BookOpen className="size-4" />
                    Cursos inscritos ({studentCourses.length})
                  </h4>
                  <div className="space-y-2">
                    {studentCourses.map((course) => (
                      <div 
                        key={course.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <span className="text-xl">{course.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{course.name}</p>
                          <Progress value={course.progress} className="mt-1 h-1.5" />
                        </div>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-8">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="size-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">Selecciona un estudiante</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Haz clic en un estudiante para ver sus detalles
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
