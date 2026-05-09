//weekly-courses/app/(dashboard)/student/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/custom/stats-card";
import { LevelBadge } from "@/components/custom/level-badge";
import { MultiplierIndicator } from "@/components/custom/multiplier-indicator";
import { ProgressRing } from "@/components/custom/progress-ring";
import { RecentActivityList } from "@/components/custom/recent-activity-list";
import { CourseCard } from "@/components/custom/course-card";
import { MiniRanking } from "@/components/custom/mini-ranking";
import {
  currentStudent,
  courses,
  recentActivities,
  ranking,
  motivationalMessages,
} from "@/data/mock-data";
import {
  getProgressToNextLevel,
  getPointsToNextLevel,
  getMotivationalMessage,
} from "@/lib/gamification";
import { Star, Target, Flame, Sparkles } from "lucide-react";

export default function StudentDashboard() {
  const [motivationalMessage, setMotivationalMessage] = useState("");

  useEffect(() => {
    setMotivationalMessage(getMotivationalMessage(motivationalMessages));
  }, []);

  const enrolledCourses = courses.filter((c) =>
    currentStudent.enrolledCourses.includes(c.id),
  );

  const progressToNextLevel = getProgressToNextLevel(
    currentStudent.points,
    currentStudent.level,
  );
  const pointsToNextLevel = getPointsToNextLevel(
    currentStudent.points,
    currentStudent.level,
  );

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border-4 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {currentStudent.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-balance">
              Hola, {currentStudent.name.split(" ")[0]}
            </h1>
            <div className="mt-1 flex items-center gap-3">
              <LevelBadge level={currentStudent.level} />
              <MultiplierIndicator streakDay={currentStudent.streak} />
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {motivationalMessage && (
          <Card className="bg-linear-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <Sparkles className="size-6 text-primary shrink-0" />
              <p className="text-sm font-medium italic text-pretty">
                {`"${motivationalMessage}"`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Puntos Totales"
          value={currentStudent.points.toLocaleString()}
          subtitle={
            pointsToNextLevel
              ? `${pointsToNextLevel} para ${currentStudent.level === "Bronce" ? "Plata" : "Oro"}`
              : "Nivel máximo"
          }
          icon={<Star className="size-6" />}
          valueClassName="text-primary"
        />
        <StatsCard
          title="Progreso General"
          value={`${currentStudent.progress}%`}
          subtitle="De todos los cursos"
          icon={<Target className="size-6" />}
        />
        <StatsCard
          title="Racha Actual"
          value={currentStudent.streak}
          subtitle={
            currentStudent.streak === 1
              ? "semana consecutiva"
              : "semanas consecutivas"
          }
          icon={<Flame className="size-6" />}
        />
        {/* <Card className="overflow-hidden">
          <CardContent className="flex items-center justify-center p-6">
            <ProgressRing progress={progressToNextLevel} size={100}>
              <div className="text-center">
                <p className="text-2xl font-bold">{progressToNextLevel}%</p>
                <p className="text-xs text-muted-foreground">al siguiente nivel</p>
              </div>
            </ProgressRing>
          </CardContent>
        </Card> */}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Courses and Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Miniranking */}
          <MiniRanking
            ranking={ranking}
            currentUserId={currentStudent.id}
            limit={5}
          />
        </div>

        {/* Right Column - Ranking */}
        <div className="space-y-8">
          <section>
            <RecentActivityList activities={recentActivities.slice(0, 5)} />
          </section>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumen de Actividad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">
                  Actividades completadas
                </span>
                <span className="font-semibold">
                  {courses.reduce((sum, c) => sum + c.completedActivities, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">
                  Actividades pendientes
                </span>
                <span className="font-semibold">
                  {courses.reduce(
                    (sum, c) =>
                      sum + (c.totalActivities - c.completedActivities),
                    0,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">
                  Cursos en progreso
                </span>
                <span className="font-semibold">
                  {
                    enrolledCourses.filter(
                      (c) => c.progress > 0 && c.progress < 100,
                    ).length
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
