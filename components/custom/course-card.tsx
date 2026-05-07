//weekly-courses/components/custom/course-card.tsx
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/data/mock-data";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  course: Course;
  showContinueButton?: boolean;
}

export function CourseCard({
  course,
  showContinueButton = true,
}: CourseCardProps) {
  const isCompleted = course.progress === 100;

  return (
    <Link href={`/student/courses/${course.id}`} className="block">
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{course.icon}</span>
              <div>
                <h3 className="font-semibold leading-tight">{course.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </div>
            </div>
            {isCompleted && (
              <CheckCircle2 className="size-6 shrink-0 text-success" />
            )}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1" />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            {course.completedActivities} de {course.totalActivities} actividades
            completadas
          </p>
        </CardFooter>

        {/* {showContinueButton && (
          <CardFooter className="border-t bg-muted/30 px-6 py-4">
            <Link href={`/student/courses/${course.id}`} className="w-full">
              <Button
                className="w-full"
                variant={isCompleted ? "outline" : "default"}
              >
                {isCompleted ? "Revisar" : "Continuar"}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardFooter>
        )} */}
      </Card>
    </Link>
  );
}
