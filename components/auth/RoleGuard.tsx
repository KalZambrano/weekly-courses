//WEEKLY-COURSES/components/auth/RoleGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('student' | 'teacher' | 'admin')[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está autenticado, no hacer nada (AppContent manejará la redirección al login)
    if (!isAuthenticated || !user) {
      return;
    }

    // Si el usuario no tiene el rol requerido, redirigir a su dashboard correspondiente
    if (!user.role || !allowedRoles.includes(user.role)) {
      if (user.role === 'student') {
        router.push('/student');
      } else if (user.role === 'teacher') {
        router.push('/teacher');
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
        // Si no tiene rol, redirigir al login
        router.push('/');
      }
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  // Si no está autenticado o no tiene el rol correcto, no renderizar nada
  if (!isAuthenticated || !user || !user.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
