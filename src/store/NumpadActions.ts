import { debounce, isTouchDevice } from '@/lib/utils'
import { setState } from './AppStore'

function showNumpad(show: boolean) {
  if (!isTouchDevice()) return
  setState({ showNumpad: show })
}

export const showNumpadDebounced = debounce((show: boolean) => {
  showNumpad(show)
}, 300)
