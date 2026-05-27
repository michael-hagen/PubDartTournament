import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CONNECTION_STRING_PREFIX } from '@/globals/globals'
import { useRef, useState, type PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

interface ConnectDialogProps extends PropsWithChildren {
  handleConnect: (connectionString: string) => void
}

export function ConnectDialog({ children, handleConnect }: ConnectDialogProps) {
  const { t } = useTranslation(['common', 'app'])
  const [isOpen, setIsOpen] = useState(false)
  const [connectionString, setConnectionString] = useState(CONNECTION_STRING_PREFIX)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOKClicked = () => {
    setIsOpen(false)
    handleConnect(connectionString)
  }

  const handleOnFocus = () => {
    setTimeout(() => inputRef.current?.setSelectionRange(connectionString.length, connectionString.length), 50)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('app:CONNECT_DIALOG_TITLE')}</DialogTitle>
          <DialogDescription>{t('app:CONNECT_DIALOG_DESCRIPTION')}</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="connection-string">{t('app:CONNECT_DIALOG_CONNECTION_STRING_LABEL')}</Label>
            <Input
              ref={inputRef}
              id="connection-string"
              name="connectionString"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              onFocus={handleOnFocus}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('CANCEL')}</Button>
          </DialogClose>
          <Button onClick={handleOKClicked}>{t('OK')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
