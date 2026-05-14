'use client';

import { useAuth } from '@/context/AuthContext';
import Login from '@/components/auth/Login';

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
}