'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Lightbulb, RotateCcw, Zap } from 'lucide-react'
import { getDayMultiplier, getMultiplierInfo } from '@/lib/gamification'
import type { Activity, QuizAttempt } from '@/data/mock-data'
import { currentStudent } from '@/data/mock-data'

interface QuizViewerProps {
  activity: Activity
  onComplete?: (attemptData: QuizAttempt) => void
}

export function QuizViewer({ activity, onComplete }: QuizViewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [attemptCount, setAttemptCount] = useState(activity.attempts?.length || 0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  
  const quiz = activity.quiz
  
  if (!quiz) {
    return <div className="p-8 text-center text-muted-foreground">Error: No quiz data found for this activity</div>
  }

  const questions = quiz.questions
  const currentQ = questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined
  const answeredAll = selectedAnswers.length === questions.length
  const canRetake = attemptCount < quiz.maxAttempts
  const dayMultiplier = getDayMultiplier()
  const multiplierInfo = getMultiplierInfo(currentStudent.streak)

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const calculateScore = () => {
    let correctCount = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++
      }
    })
    return (correctCount / questions.length) * 20 // Máximo 20 puntos
  }

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setIsSubmitted(true)
    
    const isApproved = finalScore >= quiz.passingScore
    const pointsEarned = isApproved ? activity.points * dayMultiplier : 0
    
    // Crear intento
    const newAttempt: QuizAttempt = {
      attemptNumber: attemptCount + 1,
      score: finalScore,
      answers: selectedAnswers,
      completedAt: new Date().toISOString(),
      pointsEarned: pointsEarned
    }

    if (isApproved && !activity.isApproved) {
      setQuizCompleted(true)
      onComplete?.(newAttempt)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRetake = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setIsSubmitted(false)
    setScore(0)
    setAttemptCount(attemptCount + 1)
    setQuizCompleted(false)
  }

  const progressPercent = ((currentQuestion + 1) / questions.length) * 100

  if (isSubmitted) {
    const isApproved = score >= quiz.passingScore
    const failedTopics = questions
      .filter((q, idx) => selectedAnswers[idx] !== q.correctAnswer)
      .map(q => q.topic)
      .filter((v, i, a) => a.indexOf(v) === i)

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className={`inline-flex size-20 items-center justify-center rounded-full ${isApproved ? 'bg-success/20' : 'bg-red-500/20'}`}>
            {isApproved ? (
              <CheckCircle2 className="size-10 text-success" />
            ) : (
              <AlertCircle className="size-10 text-red-600" />
            )}
          </div>
          
          <div>
            <h2 className={`text-3xl font-bold ${isApproved ? 'text-success' : 'text-red-600'}`}>
              {isApproved ? '¡Aprobado!' : 'No Aprobado'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isApproved 
                ? `¡Excelente! Obtuviste ${score.toFixed(1)} de ${questions.length * 5} puntos` 
                : `Obtuviste ${score.toFixed(1)} de ${questions.length * 5} puntos. Necesitas ${quiz.passingScore} para aprobar`}
            </p>
          </div>
        </div>

        {isApproved && (
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="rounded-full bg-success/20 p-2 shrink-0">
                <Zap className="size-5 text-success" />
              </div>
              <div>
                <h4 className="font-bold text-success">Puntos Ganados</h4>
                <p className="text-sm text-success/80 mt-1">
                  Has ganado <strong>{(activity.points * dayMultiplier).toFixed(0)} puntos</strong> con multiplicador <strong>{multiplierInfo.label}</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isApproved && failedTopics.length > 0 && (
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="size-5 text-orange-600" />
                Recomendaciones para mejorar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Te recomendamos repasar estos temas antes de intentar nuevamente:
              </p>
              <ul className="space-y-2">
                {failedTopics.map((topic) => (
                  <li key={topic} className="text-sm flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-orange-600" />
                    <strong>{topic}</strong> - Revisa el material de la semana
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          {canRetake && (
            <Button onClick={handleRetake} size="lg" className="gap-2">
              <RotateCcw className="size-4" />
              Intentar de nuevo ({attemptCount}/{quiz.maxAttempts})
            </Button>
          )}
          {!canRetake && (
            <Button disabled size="lg" variant="secondary">
              Máximo de intentos alcanzado
            </Button>
          )}
          <Button onClick={() => window.history.back()} variant="outline" size="lg">
            Volver
          </Button>
        </div>

        {/* Resumen de intentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de Intentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activity.attempts?.map((attempt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Intento {attempt.attemptNumber}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{attempt.score.toFixed(1)}/{questions.length * 5}</span>
                  {attempt.score >= quiz.passingScore && (
                    <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">Aprobado</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{activity.name}</h2>
          <span className="text-sm text-muted-foreground">
            Intento {attemptCount + 1}/{quiz.maxAttempts}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span className="font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    selectedAnswers[currentQuestion] === idx
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === idx
                        ? 'border-primary bg-primary'
                        : 'border-muted'
                    }`}>
                      {selectedAnswers[currentQuestion] === idx && (
                        <div className="size-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Anterior
            </Button>
            <div className="flex-1" />
            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!answeredAll}
                className="bg-success hover:bg-success/90"
              >
                Enviar Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Indicador de preguntas respondidas */}
      <div className="flex flex-wrap gap-2">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`size-10 rounded-lg font-semibold transition-all ${
              selectedAnswers[idx] !== undefined
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted-foreground'
            } ${currentQuestion === idx ? 'ring-2 ring-primary ring-offset-2' : ''}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
