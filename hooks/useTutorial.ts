import { useEffect, useState } from 'react'

const TUTORIAL_KEY_STUDENT = 'weekly-courses-tutorial-student-shown'
const TUTORIAL_KEY_TEACHER = 'weekly-courses-tutorial-teacher-shown'

export function useTutorial(role: 'student' | 'teacher') {
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage only on client side
    const tutorialKey = role === 'student' ? TUTORIAL_KEY_STUDENT : TUTORIAL_KEY_TEACHER
    const hasSeenTutorial = localStorage.getItem(tutorialKey)
    
    setShouldShowTutorial(!hasSeenTutorial)
    setIsLoading(false)
  }, [role])

  const markTutorialAsShown = () => {
    const tutorialKey = role === 'student' ? TUTORIAL_KEY_STUDENT : TUTORIAL_KEY_TEACHER
    localStorage.setItem(tutorialKey, 'true')
    setShouldShowTutorial(false)
  }

  return { shouldShowTutorial, isLoading, markTutorialAsShown }
}
