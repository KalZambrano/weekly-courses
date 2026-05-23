'use client';

import { DashboardSidebar } from '@/components/custom/dashboard-sidebar';
import RoleGuard from '@/components/auth/RoleGuard';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['student']}>
      <div className="flex min-h-screen">
        <DashboardSidebar role="student" />
        <main className="ml-64 flex-1 transition-all duration-300">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
