//weekly-courses/components/custom/mini-ranking.tsx
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LevelBadge } from './level-badge'
import type { RankingStudent } from '@/data/mock-data'
import { Trophy, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MiniRankingProps {
  ranking: RankingStudent[]
  currentUserId: string
  limit?: number
}

export function MiniRanking({ ranking, currentUserId, limit = 5 }: MiniRankingProps) {
  const displayedRanking = ranking.slice(0, limit)
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="size-5 text-gold" />
          Ranking Global
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedRanking.map((student) => {
          const isCurrentUser = student.id === currentUserId
          const isTopThree = student.position <= 3
          
          return (
            <div 
              key={student.id}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 transition-colors",
                isCurrentUser 
                  ? "bg-primary/10 ring-2 ring-primary/20" 
                  : "hover:bg-muted/50"
              )}
            >
              <div 
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                  student.position === 1 && "bg-gold text-gold-foreground",
                  student.position === 2 && "bg-silver text-silver-foreground",
                  student.position === 3 && "bg-bronze text-bronze-foreground",
                  !isTopThree && "bg-muted text-muted-foreground"
                )}
              >
                {student.position}
              </div>
              
              <Avatar className="size-9">
                <AvatarFallback className={cn(
                  isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}>
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium truncate",
                  isCurrentUser && "text-primary"
                )}>
                  {student.name}
                  {isCurrentUser && <span className="ml-1 text-xs">(Tú)</span>}
                </p>
                <LevelBadge level={student.level} size="sm" />
              </div>
              
              <p className="font-bold text-primary">{student.points.toLocaleString()}</p>
            </div>
          )
        })}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Link href="/student/ranking" className="w-full">
          <Button variant="outline" className="w-full cursor-pointer">
            Ver ranking completo
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
