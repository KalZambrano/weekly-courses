//weekly-courses/app/(dashboard)/teacher/layout.tsx
import { DashboardSidebar } from '@/components/custom/dashboard-sidebar'

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="teacher" />
      <main className="ml-64 flex-1 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
