//weekly-courses/app/(dashboard)/student/ranking/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LevelBadge } from '@/components/custom/level-badge'
import { ranking, currentStudent } from '@/data/mock-data'
import { Trophy, Medal, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RankingPage() {
  const topThree = ranking.slice(0, 3)
  const restOfRanking = ranking.slice(3)
  
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ranking Global</h1>
        <p className="mt-2 text-muted-foreground">
          Compite con otros estudiantes y alcanza la cima
        </p>
      </div>
      
      {/* Top 3 Podium */}
      <div className="mb-12">
        <div className="flex items-end justify-center gap-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <Avatar className="size-20 border-4 border-silver ring-4 ring-silver/20">
              <AvatarFallback className="bg-silver text-silver-foreground text-xl font-bold">
                {topThree[1]?.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="mt-3 text-center">
              <Medal className="mx-auto size-8 text-silver" />
              <p className="mt-1 font-semibold">{topThree[1]?.name}</p>
              <p className="text-2xl font-bold text-primary">{topThree[1]?.points.toLocaleString()}</p>
              <LevelBadge level={topThree[1]?.level || 'Bronce'} size="sm" />
            </div>
            <div className="mt-4 h-24 w-28 rounded-t-lg bg-silver/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-silver-foreground/50">2</span>
            </div>
          </div>
          
          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 size-10 text-gold" />
              <Avatar className="size-28 border-4 border-gold ring-4 ring-gold/30">
                <AvatarFallback className="bg-gold text-gold-foreground text-2xl font-bold">
                  {topThree[0]?.avatar}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-3 text-center">
              <Trophy className="mx-auto size-10 text-gold" />
              <p className="mt-1 text-lg font-semibold">{topThree[0]?.name}</p>
              <p className="text-3xl font-bold text-primary">{topThree[0]?.points.toLocaleString()}</p>
              <LevelBadge level={topThree[0]?.level || 'Oro'} />
            </div>
            <div className="mt-4 h-32 w-32 rounded-t-lg bg-gold/30 flex items-center justify-center">
              <span className="text-5xl font-bold text-gold-foreground/50">1</span>
            </div>
          </div>
          
          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <Avatar className="size-20 border-4 border-bronze ring-4 ring-bronze/20">
              <AvatarFallback className="bg-bronze text-bronze-foreground text-xl font-bold">
                {topThree[2]?.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="mt-3 text-center">
              <Medal className="mx-auto size-8 text-bronze" />
              <p className="mt-1 font-semibold">{topThree[2]?.name}</p>
              <p className="text-2xl font-bold text-primary">{topThree[2]?.points.toLocaleString()}</p>
              <LevelBadge level={topThree[2]?.level || 'Bronce'} size="sm" />
            </div>
            <div className="mt-4 h-16 w-28 rounded-t-lg bg-bronze/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-bronze-foreground/50">3</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full Ranking List */}
      <Card>
        <CardHeader>
          <CardTitle>Clasificación Completa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ranking.map((student) => {
              const isCurrentUser = student.id === currentStudent.id
              const isTopThree = student.position <= 3
              
              return (
                <div 
                  key={student.id}
                  className={cn(
                    "flex items-center gap-4 rounded-lg p-4 transition-colors",
                    isCurrentUser 
                      ? "bg-primary/10 ring-2 ring-primary/20" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <div 
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-sm font-bold",
                      student.position === 1 && "bg-gold text-gold-foreground",
                      student.position === 2 && "bg-silver text-silver-foreground",
                      student.position === 3 && "bg-bronze text-bronze-foreground",
                      !isTopThree && "bg-muted text-muted-foreground"
                    )}
                  >
                    {student.position}
                  </div>
                  
                  <Avatar className="size-12">
                    <AvatarFallback className={cn(
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary"
                    )}>
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      isCurrentUser && "text-primary"
                    )}>
                      {student.name}
                      {isCurrentUser && <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded-full">Tú</span>}
                    </p>
                    <LevelBadge level={student.level} size="sm" />
                  </div>
                  
                  <p className="text-xl font-bold text-primary">
                    {student.points.toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">pts</span>
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
