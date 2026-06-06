'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, BookOpen, CheckCircle2, Clock, Zap, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity } from '@/data/mock-data'

interface ActivityCardProps {
  activity: Activity
  onStart: () => void
}

export function ActivityCard({ activity, onStart }: ActivityCardProps) {
  const isPending = activity.status === 'pending'
  const isCompleted = activity.status === 'completed'
  const isQuiz = activity.type === 'quiz'
  const quizData = activity.quiz
  const attemptCount = activity.attempts?.length || 0
  const remainingAttempts = quizData ? quizData.maxAttempts - attemptCount : 0

  const getTypeIcon = () => {
    switch (activity.type) {
      case 'video':
        return '🎥'
      case 'reading':
        return '📖'
      case 'exercise':
        return '📝'
      case 'quiz':
        return '📊'
      default:
        return '📚'
    }
  }

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      isCompleted && 'opacity-75',
      !isPending && isQuiz && activity.isApproved && 'border-success/20 bg-success/5'
    )}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0">{getTypeIcon()}</span>
            <div className="min-w-0 flex-1">
              <h3 className={cn(
                'font-semibold text-sm',
                isCompleted && 'line-through text-muted-foreground'
              )}>
                {activity.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.description}
              </p>
            </div>
          </div>
          
          {isCompleted && (
            <CheckCircle2 className="size-5 text-success shrink-0" />
          )}
        </div>

        {/* Quiz info */}
        {isQuiz && quizData && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Preguntas: {quizData.questions.length}</span>
              <span className="text-muted-foreground">Nota mínima: {quizData.passingScore}</span>
            </div>
            
            {activity.isApproved ? (
              <div className="flex items-center gap-2 text-xs text-success font-semibold">
                <CheckCircle2 className="size-4" />
                Aprobado - Score: {activity.bestAttemptScore?.toFixed(1)}/{quizData.questions.length * 5}
              </div>
            ) : attemptCount > 0 ? (
              <div className="flex items-center gap-2 text-xs text-orange-600">
                <AlertCircle className="size-4" />
                Intento {attemptCount}/{quizData.maxAttempts} - Mejor: {activity.bestAttemptScore?.toFixed(1) || 0}/{quizData.questions.length * 5}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Intentos disponibles: {quizData.maxAttempts}</span>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {activity.duration}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="size-3" />
            {activity.points} pts
          </span>
          <Badge variant="outline" className="text-xs">
            Semana {activity.weekNumber}
          </Badge>
        </div>

        {/* Actions */}
        {isPending ? (
          <Button onClick={onStart} size="sm" className="w-full gap-2">
            <Play className="size-3" />
            {isQuiz ? 'Realizar Quiz' : 'Empezar'}
          </Button>
        ) : isCompleted && isQuiz && remainingAttempts > 0 ? (
          <Button onClick={onStart} size="sm" variant="secondary" className="w-full gap-2">
            <RotateCcw className="size-3" />
            Reintentar ({remainingAttempts} intentos)
          </Button>
        ) : isCompleted ? (
          <Button disabled size="sm" className="w-full" variant="secondary">
            Completado
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
