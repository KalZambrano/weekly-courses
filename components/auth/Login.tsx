"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Credenciales inválidas");
    }
    setLoading(false);
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
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Correo Electrónico
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="correo@institucion.edu.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <p className="text-center text-sm text-slate-500 pt-1">
              Plataforma Académica Institucional
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
