'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Users, 
  BarChart3,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface DashboardSidebarProps {
  role: 'student' | 'teacher'
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/student', icon: <LayoutDashboard className="size-5" /> },
  { label: 'Mis Cursos', href: '/student/courses', icon: <BookOpen className="size-5" /> },
  { label: 'Ranking', href: '/student/ranking', icon: <Trophy className="size-5" /> },
]

const teacherNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/teacher', icon: <LayoutDashboard className="size-5" /> },
  { label: 'Estudiantes', href: '/teacher/students', icon: <Users className="size-5" /> },
  { label: 'Cursos', href: '/teacher/courses', icon: <BookOpen className="size-5" /> },
  { label: 'Métricas', href: '/teacher/metrics', icon: <BarChart3 className="size-5" /> },
]

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  
  const navItems = role === 'student' ? studentNavItems : teacherNavItems
  const otherRole = role === 'student' ? 'teacher' : 'student'
  const otherRoleLabel = role === 'student' ? 'Vista Docente' : 'Vista Estudiante'
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href={`/${role}`} className="flex items-center gap-2">
            <GraduationCap className="size-8 text-sidebar-primary" />
            <span className="text-lg font-bold">UTP+ Reforce</span>
          </Link>
        )}
        {collapsed && (
          <Link href={`/${role}`} className="mx-auto">
            <GraduationCap className="size-8 text-sidebar-primary" />
          </Link>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== `/${role}` && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
      
      {/* Role Switcher */}
      <div className="border-t border-sidebar-border p-3">
        <Link href={`/${otherRole}`}>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            {role === 'student' ? <Users className="size-5" /> : <GraduationCap className="size-5" />}
            {!collapsed && <span className="ml-3">{otherRoleLabel}</span>}
          </Button>
        </Link>
      </div>
      
      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            collapsed ? "justify-center" : "justify-end"
          )}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
    </aside>
  )
}
