'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type UserRole = 'student' | 'teacher' | null;

interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Usuarios de prueba para demostración
const MOCK_USERS = {
  student: {
    email: 'student@utp.edu.pe',
    password: 'student123',
    name: 'Juan Estudiante',
    role: 'student' as UserRole,
  },
  teacher: {
    email: 'teacher@utp.edu.pe',
    password: 'teacher123',
    name: 'María Profesora',
    role: 'teacher' as UserRole,
  },
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('user');
    
    if (loggedIn && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        // Si hay error al parsear, limpiar el localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call to Spring backend
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data));
        setIsAuthenticated(true);
        setUser(data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      // Mock login with test users
      const mockUser = Object.values(MOCK_USERS).find(
        (u) => u.email === email && u.password === password
      );

      if (mockUser) {
        const userData = {
          email: mockUser.email,
          role: mockUser.role,
          name: mockUser.name,
        };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      }

      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
