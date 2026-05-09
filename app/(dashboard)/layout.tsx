//weekly-courses/app/(dashboard)/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EduBoost - Plataforma Educativa',
  description: 'Refuerzo académico con gamificación 24/7',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
