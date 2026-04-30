import { TooltipProvider } from './components/ui/tooltip'
import ContentContainer from './components/app/content/ContentContainer'
import Navbar from './components/app/navbar/Navbar'
import { useAppActions } from './store/AppStore'
import { DefaultLanguage, DefaultTheme } from './globals/defaults'
import { isThemeType } from './globals/types'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Statusbar from './components/app/statusbar/Statusbar'

export default function App() {
  const isInitialized = useRef(false)
  const { i18n } = useTranslation()
  const { setLanguage, setTheme } = useAppActions()

  useEffect(() => {
    if (!isInitialized.current) {
      const language = i18n.language.split(/[_-]/)[0] || DefaultLanguage
      setLanguage(language)

      const storedTheme = localStorage.getItem('theme')
      const theme = storedTheme ? (isThemeType(storedTheme) ? storedTheme : DefaultTheme) : DefaultTheme
      setTheme(theme)

      isInitialized.current = true
    }
  }, [i18n.language, setLanguage, setTheme])

  return (
    <TooltipProvider>
      <div className="min-h-full">
        <Navbar />
        <div className="flex flex-col min-h-screen max-h-screen">
          <ContentContainer />
          <Statusbar />
        </div>
      </div>
    </TooltipProvider>
  )
}
