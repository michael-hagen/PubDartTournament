import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PreparationTab from './preparation/PreparationTab'
import { useTranslation } from 'react-i18next'
import { FileCog, Swords, Trophy } from 'lucide-react'
import { useAppActions, useAppStore } from '@/store/AppStore'
import TournamentTab from './tournament/TournamentTab'
import ReportTab from './report/ReportTab'
import { isGameStateType } from '@/globals/types'

export default function ContentTabs() {
  const { t } = useTranslation(['app'])
  const gameState = useAppStore((state) => state.gameState)
  const selectedTab = useAppStore((state) => state.selectedTab)
  const { setSelectedTab } = useAppActions()

  const handleTabChange = (value: string) => {
    if (!isGameStateType(value)) return
    setSelectedTab(value)
  }

  return (
    <Tabs
      value={selectedTab}
      className="absolute inset-0 mt-16 md:mt-18 lg:mt-20 ml-4 mr-4 rounded-md border border-gray-600/10 dark:border-gray-200/20 bg-black/5 dark:bg-white/5 overflow-auto"
      onValueChange={handleTabChange}
    >
      <div className="flex">
        <TabsList variant="line" className="mx-auto gap-6 md:gap-12 lg:gap-18 pt-4 bg-transparent">
          {/* <TabsList variant="line" className="grid w-100 grid-cols-3"> */}
          <TabsTrigger
            value="PREPARATION"
            className="text-lg border-none data-[state=active]:text-emerald-600! dark:data-[state=active]:text-emerald-500!"
          >
            <FileCog />
            {t('PREPARATION', { ns: 'app' })}
          </TabsTrigger>
          <TabsTrigger
            disabled={gameState === 'PREPARATION'}
            value="TOURNAMENT"
            className="text-lg border-none data-[state=active]:text-emerald-600! dark:data-[state=active]:text-emerald-500!"
          >
            <Swords />
            {t('TOURNAMENT', { ns: 'app' })}
          </TabsTrigger>
          <TabsTrigger
            disabled={gameState === 'PREPARATION' || gameState === 'TOURNAMENT'}
            value="REPORT"
            className="text-lg border-none data-[state=active]:text-emerald-600! dark:data-[state=active]:text-emerald-500!"
          >
            <Trophy />
            {t('REPORT', { ns: 'app' })}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="PREPARATION" className="flex-1 min-h-0 overflow-y-auto">
        <PreparationTab />
      </TabsContent>

      <TabsContent value="TOURNAMENT" className="flex-1 min-h-0 overflow-y-auto">
        <TournamentTab />
      </TabsContent>
      <TabsContent value="REPORT" className="flex-1 min-h-0 overflow-y-auto">
        <ReportTab />
      </TabsContent>
    </Tabs>
  )
}
