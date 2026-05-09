//weekly-courses/components/custom/course-card.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/data/mock-data";
import { CheckCircle2 } from "lucide-react";

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
      <Card className="flex h-55 flex-col overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="flex flex-1 flex-col p-6">
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

          <div className="mt-auto space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
            </div>
            <div className="relative">
              <Progress value={course.progress} className="h-2" />
              <div
                className="absolute top-full mt-1.5 -translate-x-1/2 text-[10px] whitespace-nowrap bg-blue-300 px-1.5 py-0.5 rounded-sm font-semibold"
                style={{ left: `${course.progress}%` }}
              >
                {course.progress}%
              </div>
              {/* <div
                className="absolute top-full mt-1.5 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
                style={{ left: `${course.progress}%`, top: 'calc(100% + 1.5rem)' }}
              >
                {course.completedActivities}/{course.totalActivities} actividades
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
