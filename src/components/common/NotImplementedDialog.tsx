import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

export default function NotImplementedDialog({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('NOT_IMPLEMENTED_YET_TITLE')}</AlertDialogTitle>
          <AlertDialogDescription>{t('NOT_IMPLEMENTED_YET_DESCRIPTION')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('CLOSE')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
