'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/custom/course-card'
import { PointsSystemInfo } from '@/components/custom/points-system-info'
import { courses, currentStudent } from '@/data/mock-data'
import { Search, BookOpen, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')
  
  const enrolledCourses = courses.filter(c => 
    currentStudent.enrolledCourses.includes(c.id)
  )
  
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'in-progress') return matchesSearch && course.progress > 0 && course.progress < 100
    if (filter === 'completed') return matchesSearch && course.progress === 100
    return matchesSearch
  })
  
  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: enrolledCourses.filter(c => c.progress === 100).length
  }
  
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="size-8 text-primary" />
          Mis Cursos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explora y continúa tu aprendizaje
        </p>
      </div>
      
      {/* Points System Info */}
      <div className="mb-8">
        <PointsSystemInfo />
      </div>
      
      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="gap-2"
        >
          Todos
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
            {stats.total}
          </span>
        </Button>
        <Button 
          variant={filter === 'in-progress' ? 'default' : 'outline'}
          onClick={() => setFilter('in-progress')}
          className="gap-2"
        >
          En progreso
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
            {stats.inProgress}
          </span>
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          className="gap-2"
        >
          Completados
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
            {stats.completed}
          </span>
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="recent">
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="progress">Mayor progreso</SelectItem>
            <SelectItem value="name">Nombre A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
          <BookOpen className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No se encontraron cursos</h3>
          <p className="mt-2 text-muted-foreground">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </div>
      )}
    </div>
  )
}
