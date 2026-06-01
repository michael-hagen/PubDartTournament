import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import { AnimatePresence } from 'framer-motion'

import { isThemeType } from './globals/types'
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from './globals/defaults'

import { TooltipProvider } from './components/ui/tooltip'
import ContentContainer from './components/app/content/ContentContainer'
import Navbar from './components/app/navbar/Navbar'
import Statusbar from './components/app/statusbar/Statusbar'

import { useAppActions, useAppStore } from './store/AppStore'
import { finishTournament } from './store/TournamentActions'
import { Toaster } from 'sonner'
import Numpad from './components/app/numpad/Numpad'

export default function App() {
  const isInitialized = useRef(false)
  const { i18n } = useTranslation()
  const { setLanguage, setTheme, setShowConfetti } = useAppActions()
  const showNumpad = useAppStore((state) => state.showNumpad)
  const [numpadBottom, setNumpadBottom] = useState(true)
  const showConfetti = useAppStore((state) => state.showConfetti)
  const timerRef = useRef<number | null>(null)

  // Set language and theme at app start
  useEffect(() => {
    if (!isInitialized.current) {
      const language = i18n.language.split(/[_-]/)[0] || DEFAULT_LANGUAGE
      setLanguage(language)

      const storedTheme = localStorage.getItem('theme')
      const theme = storedTheme ? (isThemeType(storedTheme) ? storedTheme : DEFAULT_THEME) : DEFAULT_THEME
      setTheme(theme)
      localStorage.setItem('theme', theme)
      document.documentElement.classList.remove('light', 'dark', 'custom')
      document.documentElement.classList.add(theme)
      isInitialized.current = true
    }
  }, [i18n.language, setLanguage, setTheme])

  // Handle viewport height for mobile and fullscreen
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      setNumpadBottom(window.innerWidth < window.innerHeight)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // Show a confetti firework at the end of the tournament
  useEffect(() => {
    if (showConfetti) {
      const stopConfetti = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setShowConfetti(false)
          confetti.reset()
          finishTournament()
        }
      }

      timerRef.current = setInterval(() => {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          zIndex: 100,
        })
      }, 300)

      window.addEventListener('keydown', stopConfetti)
      window.addEventListener('pointerdown', stopConfetti)

      // Cleanup event listener and timer
      return () => {
        window.removeEventListener('keydown', stopConfetti)
        window.removeEventListener('pointerdown', stopConfetti)
        stopConfetti()
      }
    }
  }, [setShowConfetti, showConfetti])

  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex flex-col" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        <Navbar />
        <div className="flex-1 flex flex-row">
          <div className="flex-1 flex flex-col overflow-auto">
            <ContentContainer />
            {(!showNumpad || !numpadBottom) && <Statusbar />}
            <AnimatePresence>{showNumpad && numpadBottom && <Numpad />}</AnimatePresence>
          </div>
          <AnimatePresence>{showNumpad && !numpadBottom && <Numpad />}</AnimatePresence>
        </div>
      </div>
      {showConfetti && <div className="fixed inset-0 pointer-events-none z-100" />}
    </TooltipProvider>
  )
}
