import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/globals/types'
import type { LucideIcon } from 'lucide-react'
import { type PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

interface AlertDialogComponentProps extends PropsWithChildren {
  icon?: LucideIcon
  buttonTitle?: string
  dialogTitle: string
  dialogDescription: string
  disabled?: boolean
  handleClick?: () => void
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  className?: string
}

export default function AlertDialogComponent({
  icon: Icon,
  buttonTitle,
  dialogTitle,
  dialogDescription,
  disabled,
  handleClick,
  variant,
  size,
  className,
  children,
}: AlertDialogComponentProps) {
  const { t } = useTranslation(['common', 'app'])
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            disabled={disabled}
            variant={variant ? variant : 'outline'}
            size={size ? size : 'default'}
            className={className ? className : ''}
          >
            {Icon && <Icon className="text-primary" />}
            {buttonTitle ? t(buttonTitle) : ''}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(dialogTitle)}</AlertDialogTitle>
          <AlertDialogDescription>{t(dialogDescription)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClick}>{t('OK')}</AlertDialogAction>
          <AlertDialogCancel>{t('CANCEL')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
