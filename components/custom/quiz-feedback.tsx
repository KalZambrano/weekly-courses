//weekly-courses/components/custom/activity-viewer.tsx 
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertTriangle, PlayCircle, RotateCcw, Eye, BookOpen } from 'lucide-react'

export function QuizFeedback() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-success tracking-wider uppercase mb-1">
                        Evaluación Completada
                    </p>
                    <h2 className="text-3xl font-bold">¡Felicidades!</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="gap-2">
                        <RotateCcw className="size-4" />
                        Volver a intentar
                    </Button>
                    <Button className="gap-2">
                        <Eye className="size-4" />
                        Revisar respuestas
                    </Button>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Tarjeta Izquierda: Puntaje */}
                <Card className="md:col-span-1 flex flex-col justify-center text-center p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg text-muted-foreground font-medium">
                            Puntaje Final
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-8">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-7xl font-black text-primary">85</span>
                            <span className="text-2xl font-bold text-muted-foreground">/100</span>
                        </div>

                        <div className="space-y-3 text-sm bg-muted/50 rounded-xl p-5">
                            <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Nota aprobatoria:</span>
                                <span className="font-bold">70/100</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-muted-foreground">Promedio de clase:</span>
                                <span className="font-bold">78/100</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tarjeta Derecha: Feedback */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Feedback Personalizado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Bloques de Fortaleza y Mejora */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex gap-3 p-4 rounded-xl border border-success/20 bg-success/5">
                                <TrendingUp className="size-6 text-success shrink-0" />
                                <div>
                                    <h4 className="font-bold text-success">Fortaleza</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Excelente dominio en la resolución de ecuaciones lineales. Respondiste todas las preguntas correctamente.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                                <AlertTriangle className="size-6 text-destructive shrink-0" />
                                <div>
                                    <h4 className="font-bold text-destructive">Área de mejora</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Tuviste dificultades con los sistemas de ecuaciones. Te sugerimos repasar los métodos de sustitución.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ruta de estudio recomendada */}
                        <div className="bg-muted/40 rounded-xl p-5 border">
                            <h4 className="font-semibold mb-4">Ruta de estudio recomendada</h4>
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background p-3 rounded-lg border gap-4">
                                    <div className="flex items-center gap-3">
                                        <PlayCircle className="size-5 text-primary shrink-0" />
                                        <span className="text-sm font-medium">Repaso: Método de Sustitución</span>
                                    </div>
                                    <Button size="sm" variant="secondary" className="shrink-0">
                                        Iniciar
                                    </Button>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background p-3 rounded-lg border gap-4">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="size-5 text-primary shrink-0" />
                                        <span className="text-sm font-medium">Lectura: Ejercicios Prácticos Guiados</span>
                                    </div>
                                    <Button size="sm" variant="secondary" className="shrink-0">
                                        Iniciar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}