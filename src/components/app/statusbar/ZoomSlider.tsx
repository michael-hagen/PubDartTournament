import { useAppActions, useAppStore } from '@/store/AppStore'
import { ZoomIn, ZoomOut } from 'lucide-react'
import SliderWithTooltip from '../../common/SliderWithTooltip'

export default function ZoomSlider() {
  const tournamentPanelScale = useAppStore((state) => state.tournamentPanelScale)
  const { setTournamentPanelScale } = useAppActions()

  const handleValueChange = (value: number[]) => {
    if (!value || value.length <= 0) return
    const newScale = value[0]
    setTournamentPanelScale(newScale)
  }

  return (
    <div className="flex justify-center w-50 gap-2 pt-1">
      <ZoomOut />
      <SliderWithTooltip
        defaultValue={[tournamentPanelScale]}
        value={[tournamentPanelScale]}
        min={50}
        max={150}
        step={1}
        className=""
        onValueChange={handleValueChange}
      />
      <ZoomIn />
    </div>
  )
}
