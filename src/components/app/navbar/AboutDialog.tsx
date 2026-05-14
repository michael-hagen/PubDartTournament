import { type PropsWithChildren } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import AboutImageDark from '@/assets/AboutDark.jpg'
import AboutImageLight from '@/assets/AboutLight.jpg'
import { useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'

export default function AboutDialog(props: PropsWithChildren) {
  const { t } = useTranslation(['common', 'app'])
  const theme = useAppStore((state) => state.theme)
  const appVersion = import.meta.env.APP_VERSION ?? '0.0.0'
  const appDate = import.meta.env.APP_DATE ?? ''
  const aboutImage = theme === 'dark' ? AboutImageDark : AboutImageLight

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="m-0 p-0 overflow-hidden min-w-140 md:min-w-160 lg:min-w-180">
        <div className="relative flex flex-col">
          <div className="grow">
            <img src={aboutImage} alt={t('app:ABOUT_IMAGE_ALT')} className="w-full h-auto object-cover" />
          </div>

          <DialogHeader className="absolute top-4 w-full flex justify-center">
            <DialogTitle className="text-3xl text-center">{t('app:ABOUT_TITLE')}</DialogTitle>
            <DialogDescription className="sr-only">{t('app:ABOUT_DESCRIPTION')}</DialogDescription>
          </DialogHeader>
          <div className="absolute bottom-12 w-full flex justify-center z-10">
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
