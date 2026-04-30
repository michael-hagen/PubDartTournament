import { useAppStore } from '@/store/AppStore'
import ZoomSlider from './ZoomSlider'
import { File } from 'lucide-react'

export default function Statusbar() {
  const gameName = useAppStore((state) => state.tournament.name)
  const selectedTab = useAppStore((state) => state.selectedTab)

  return (
    <div className="flex justify-center h-10 ps-4 pt-2 pe-4 pb-2">
      <div className="flex-1 flex gap-2 text-sm text-muted-foreground">
        <File size={16} />
        {gameName}
      </div>
      <div>{selectedTab === 'TOURNAMENT' && <ZoomSlider />}</div>
    </div>
  )
}
