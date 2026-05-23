'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, TrendingUp, Clock, Zap } from 'lucide-react'

export function PointsSystemInfo() {
  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="size-5 text-orange-500" />
            Sistema de Puntos por Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bonus Info */}
          <Alert className="border-orange-300 bg-orange-50">
            <TrendingUp className="size-4 text-orange-600" />
            <AlertDescription className="text-orange-900 ml-2">
              <strong>Lunes a Jueves:</strong> Gana <strong>x1.5</strong> puntos en actividades de la semana actual
            </AlertDescription>
          </Alert>

          {/* Normal Info */}
          <Alert className="border-blue-300 bg-blue-50">
            <Clock className="size-4 text-blue-600" />
            <AlertDescription className="text-blue-900 ml-2">
              <strong>Viernes a Domingo:</strong> Gana <strong>x1</strong> puntos en actividades de la semana actual
            </AlertDescription>
          </Alert>

          {/* No Points Info */}
          <Alert className="border-red-300 bg-red-50">
            <AlertCircle className="size-4 text-red-600" />
            <AlertDescription className="text-red-900 ml-2">
              <strong>Después de la semana:</strong> No obtienes puntos por actividades vencidas (x0)
            </AlertDescription>
          </Alert>

          {/* Summary */}
          <div className="mt-4 p-3 rounded-lg bg-muted">
            <p className="text-sm font-semibold mb-2">Resumen:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ Siempre puedes <strong>ver el material</strong> de todas las semanas</li>
              <li>✓ El <strong>multiplicador</strong> depende del día de la semana</li>
              <li>✓ Los <strong>puntos x0</strong> se aplican después de la semana de vencimiento</li>
              <li>✓ Cada semana tiene <strong>actividades nuevas</strong> con diferentes tipos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
