'use client'

import { ReactNode } from 'react'
import { StudentTutorial } from './student-tutorial'
import { TeacherTutorial } from './teacher-tutorial'

interface TutorialProviderProps {
  children: ReactNode
  role: 'student' | 'teacher'
}

export function TutorialProvider({ children, role }: TutorialProviderProps) {
  return (
    <>
      {role === 'student' && <StudentTutorial />}
      {role === 'teacher' && <TeacherTutorial />}
      {children}
    </>
  )
}
