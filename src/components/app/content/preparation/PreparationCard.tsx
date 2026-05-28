import type { PropsWithChildren } from 'react'

interface PreparationCardProps extends PropsWithChildren {
  title: string
  className?: string
}

export function PreparationCard({ title, children, className }: PreparationCardProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-md border ${className}`}>
      <div className="bg-background border-b ps-2 pt-1 pb-1 text-muted-foreground">
        <div className="lg:text-lg">{title}</div>
      </div>
      <div className="flex-1 flex bg-card justify-center pt-2 pb-2 md:pt-4 md:pb-4 overflow-auto">{children}</div>
    </div>
  )
}
