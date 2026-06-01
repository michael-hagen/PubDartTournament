import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/AppStore'
import { motion } from 'framer-motion'

export default function Numpad() {
  const numpadCallback = useAppStore((state) => state.numpadCallback)

  const dispatchNumKey = (key: string) => {
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: key,
      code: 'Digit' + key,
      bubbles: true,
      cancelable: true,
    })

    numpadCallback(keyDownEvent)
  }

  const dispatchKey = (key: string) => {
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: key,
      code: key,
      bubbles: true,
      cancelable: true,
    })

    numpadCallback(keyDownEvent)
  }

  const focusNextElement = () => {
    const selector = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetWidth > 0 && el.offsetHeight > 0,
    )

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

    if (currentIndex > -1) {
      const nextIndex = (currentIndex + 1) % focusableElements.length
      focusableElements[nextIndex].focus()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, width: 0 }}
      animate={{ opacity: 1, height: 'auto', width: 'auto' }}
      exit={{ opacity: 0, height: 0, width: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="flex justify-center items-center w-full h-full p-4">
        <div className="grid grid-cols-3 gap-2">
          {['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'].map((key) => (
            <Button
              variant="outline"
              className="w-12 h-10"
              tabIndex={-1}
              onMouseDown={(e) => {
                e.preventDefault()
                dispatchNumKey(key)
              }}
            >
              {key}
            </Button>
          ))}
          <Button
            variant="outline"
            className="w-12 h-10 text-2xl text-primary"
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault()
              dispatchKey('Backspace')
            }}
          >
            ⌫
          </Button>
          <Button
            variant="outline"
            className="w-12 h-10 text-3xl text-primary"
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault()
              // dispatchKey('Tab')
              focusNextElement()
            }}
          >
            ⇥
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
