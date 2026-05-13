import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ErrorDialogProps {
  errorMsg: string | null
  setErrorMsg: (msg: string | null) => void
}

export default function ErrorDialog({ errorMsg, setErrorMsg }: ErrorDialogProps) {
  const { t } = useTranslation(['common'])

  return (
    <AlertDialog open={!!errorMsg} onOpenChange={() => setErrorMsg(null)}>
      <AlertDialogTrigger asChild>
        <div />
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-red-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">{t('ERROR', 'Error')}</AlertDialogTitle>
          <AlertDialogDescription className="max-h-100 overflow-auto">{errorMsg}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setErrorMsg(null)}>{t('OK')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
