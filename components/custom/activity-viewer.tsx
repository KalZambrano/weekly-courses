//weekly-courses/components/custom/activity-viewer.tsx 
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PlayCircle, CheckCircle2, BookOpen, Zap } from 'lucide-react'

export function ActivityViewer() {
    const [isCompleted, setIsCompleted] = useState(false)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Encabezado */}
            <header>
                <h2 className="text-2xl font-bold">Módulo 1: Introducción a la materia</h2>
                <p className="text-muted-foreground mt-1">
                    Aprende los conceptos fundamentales a través de este contenido interactivo.
                </p>
            </header>

            {/* Layout Principal */}
            <div className="grid gap-6 lg:grid-cols-3">

                {/* Columna Izquierda: Reproductor y Acción */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Reproductor Simulado */}
                    <div className="aspect-video w-full rounded-xl bg-black flex items-center justify-center group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <PlayCircle className="size-24 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300 z-10" />
                    </div>

                    {/* Tarjeta de Finalización */}
                    <Card>
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-lg">¿Finalizaste este contenido?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Marca la actividad como completada para registrar tu progreso y ganar puntos.
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className={isCompleted ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
                                onClick={() => setIsCompleted(true)}
                                disabled={isCompleted}
                            >
                                {isCompleted ? (
                                    <>
                                        <CheckCircle2 className="mr-2 size-5" />
                                        Completado
                                    </>
                                ) : (
                                    "Marcar como Completado"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Columna Derecha: Sidebar */}
                <div className="space-y-6">
                    {/* Tarjeta de Progreso y Lista */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Progreso del Módulo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Barra de progreso */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Completado</span>
                                    <span className="font-bold">{isCompleted ? '50%' : '40%'}</span>
                                </div>
                                <Progress value={isCompleted ? 50 : 40} className="h-2" />
                            </div>

                            {/* Lista de actividades */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="size-5 text-success shrink-0" />
                                    <span className="text-sm line-through text-muted-foreground">1. Conceptos previos</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isCompleted ? (
                                        <CheckCircle2 className="size-5 text-success shrink-0" />
                                    ) : (
                                        <PlayCircle className="size-5 text-primary shrink-0" />
                                    )}
                                    <span className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : 'font-bold text-primary'}`}>
                                        2. Introducción (Actual)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BookOpen className="size-5 text-muted-foreground shrink-0" />
                                    <span className="text-sm text-muted-foreground">3. Lectura complementaria</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BookOpen className="size-5 text-muted-foreground shrink-0" />
                                    <span className="text-sm text-muted-foreground">4. Ejercicios prácticos</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Recompensa */}
                    <Card className="bg-orange-500/10 border-orange-500/20">
                        <CardContent className="p-5 flex items-start gap-3">
                            <div className="rounded-full bg-orange-500/20 p-2 shrink-0">
                                <Zap className="size-5 text-orange-600 dark:text-orange-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-700 dark:text-orange-400">Potencial de Recompensa</h4>
                                <p className="text-sm text-orange-700/80 dark:text-orange-400/80 mt-1 leading-relaxed">
                                    ¡Mantén tu racha! Completar esta actividad te otorgará un multiplicador <strong>x2</strong> en tus puntos.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}