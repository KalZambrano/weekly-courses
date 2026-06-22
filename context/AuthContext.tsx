//WEEKLY-COURSES/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchApi } from '@/lib/api';
import { config } from '@/lib/config-api';

type UserRole = 'student' | 'teacher' | null;

interface User {
  email: string; // Lo usaremos para guardar el DNI por ahora
  role: UserRole;
  name: string;
  token?: string;
  id?: string;
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

// Función auxiliar para decodificar el JWT en el frontend
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('user');

    if (loggedIn && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = async (emailOrDni: string, password: string): Promise<boolean> => {

    // BYPASS PARA EL ESTUDIANTE DE PRUEBA ---
    if (emailOrDni === 'student@utp.edu.pe') {
      const userData: User = {
        email: 'student@utp.edu.pe',
        role: 'student',
        name: 'Estudiante de Prueba',
        token: 'mock-token-123'
      };
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-token-123');
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    }

    try {
      // ATENCIÓN: Usando fetchApi en lugar de fetch directo para usar la configuración centralizada
      const data = await fetchApi(config.endpoints.login, {
        method: 'POST',
        // Mapeamos lo que recibe React a lo que espera Spring Boot
        body: JSON.stringify({
          dni: emailOrDni,
          password: password
        }),
      });

      if (data && data.token) {
          // Decodificamos el token para sacar el rol y el DNI
          const decodedToken = decodeJWT(data.token);

          // Mapeamos los roles de Spring Boot a los de Next.js
          // Si es ADMIN lo hacemos teacher, si no, student.
          const frontendRole: UserRole = decodedToken?.role === 'ADMIN' ? 'teacher' : 'student';
          const dni = decodedToken?.sub || emailOrDni;

          let name = `Usuario ${dni}`;
          let id = dni;

          if (frontendRole === 'student') {
            try {
              const studentData = await fetchApi(config.endpoints.asistentes.getOne(dni), {
                headers: { 'Authorization': `Bearer ${data.token}` }
              });
              if (studentData && studentData.idEstudiante) {
                name = `${studentData.nombreEstudiante} ${studentData.apellidoEstudiante}`;
                id = studentData.idEstudiante.toString();
              } else {
                console.warn("Student profile returned null or empty:", studentData);
              }
            } catch (e) {
              console.error("Error fetching student profile from backend:", e);
            }
          } else if (frontendRole === 'teacher') {
            try {
              const assistantData = await fetchApi(config.endpoints.asistentes.getOne(dni), {
                headers: { 'Authorization': `Bearer ${data.token}` }
              });
              if (assistantData) {
                name = `${assistantData.nombreUsuario} ${assistantData.apellidoUsuario}`;
                id = assistantData.idUsuario.toString();
              }
            } catch (e) {
              console.error("Error fetching assistant profile from backend:", e);
            }
          }

          const userData: User = {
            email: dni,
            role: frontendRole,
            name: name,
            token: data.token,
            id: id
          };

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', data.token); // Guardamos el token para futuras peticiones

          setIsAuthenticated(true);
          setUser(userData);
          return true;
        }

      return false;
    } catch (error) {
      console.error('Error de conexión con el backend:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};