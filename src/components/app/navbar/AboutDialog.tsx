import { type PropsWithChildren } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import AboutImageDark from '@/assets/AboutDark.jpg'
import AboutImageLight from '@/assets/AboutLight.jpg'
import { useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'

export default function AboutDialog(props: PropsWithChildren) {
  const { t } = useTranslation(['common', 'app'])
  const theme = useAppStore((state) => state.theme)
  const appVersion = import.meta.env.APP_VERSION
  const appDate = import.meta.env.APP_DATE

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-h-160 min-w-160 m-0 p-0 overflow-hidden">
        <div className="relative flex flex-col">
          <div className="grow">
            <img
              src={theme === 'dark' ? AboutImageDark : AboutImageLight}
              alt="About Image"
              className="w-[1024] h-[1024]"
            />
          </div>

          <div className="absolute top-4 w-full flex justify-center text-3xl">
            <p>{t('ABOUT') + ' ' + t('app:PUB') + ' ' + t('app:DART') + ' ' + t('app:TOURNAMENT')}</p>
          </div>
          <div className="absolute bottom-12 w-full flex justify-center ">
            <DialogClose asChild>
              <Button className="px-8">OK</Button>
            </DialogClose>
          </div>
          <div className="absolute bottom-4 w-full flex justify-center text-muted-foreground ">
            <p>{t('app:COPYRIGHT') + ` (Ver. ${appVersion} / ${appDate})`}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
