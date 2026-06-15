//WEEKLY-COURSES/components/auth/Login.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  // CAMBIO 1: Cambiamos el estado 'email' por 'dni' para mayor claridad
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(dni, password);

    if (success) {
      // CAMBIO 2: Leemos el rol real que nos devolvió el backend (guardado en localStorage por AuthContext)
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role === 'teacher') {
          router.push('/teacher');
        } else {
          router.push('/student');
        }
      } else {
        router.push('/student');
      }
    } else {
      setError("Credenciales inválidas o error de conexión");
    }
    setLoading(false);
  };

  const fillCredentials = (userDni: string, userPassword: string) => {
    setDni(userDni);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#dbeafe_0%,transparent_40%)] pointer-events-none" />

      <Card className="w-full max-w-md border border-slate-200 shadow-xl rounded-2xl bg-white/95 backdrop-blur">
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <GraduationCap className="h-7 w-7 text-blue-700" />
          </div>

          <div>
            <CardTitle className="text-2xl font-semibold text-slate-800">
              Bienvenido
            </CardTitle>

            <CardDescription className="text-slate-500 mt-1 leading-relaxed">
              Accede a la plataforma educativa con tus credenciales
              institucionales
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-slate-700 font-medium">
                DNI o Correo Electrónico
              </Label>

              <Input
                id="dni"
                type="text" // CAMBIO 3: 'text' en lugar de 'email' para que acepte el DNI sin arroba
                placeholder="Ingresa tu DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Contraseña
                </Label>

                <button
                  type="button"
                  className="text-sm text-blue-700 hover:text-blue-800 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-200"
              />
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="rounded-xl border-red-200 bg-red-50"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium transition-all cursor-pointer"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </Button>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <p className="text-sm text-slate-600 font-medium mb-3 text-center">
                Usuarios de prueba
              </p>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 rounded-xl border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-all cursor-pointer text-left justify-start"
                  onClick={() => fillCredentials('student@utp.edu.pe', 'student123')}
                >
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Estudiante (Mock)</div>
                    <div className="text-xs text-slate-500">student@utp.edu.pe</div>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 rounded-xl border-slate-300 hover:bg-green-50 hover:border-green-300 text-slate-700 hover:text-green-700 transition-all cursor-pointer text-left justify-start"
                  onClick={() => fillCredentials('12345678', 'admin123')} // CAMBIO 4: Credenciales reales del backend
                >
                  <User className="h-4 w-4 mr-2 text-green-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Profesor (Backend Real)</div>
                    <div className="text-xs text-slate-500">DNI: 12345678</div>
                  </div>
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 pt-1">
              Plataforma Académica Institucional
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}