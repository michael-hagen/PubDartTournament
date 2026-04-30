import type { PropsWithChildren } from 'react'

interface PreparationCardProps extends PropsWithChildren {
  title: string
  className?: string
}

export function PreparationCard({ title, children, className }: PreparationCardProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-md border ${className}`}>
      <div className="bg-background border-b p-2">
        <div className="text-lg">{title}</div>
      </div>
      <div className="flex-1 flex bg-card justify-center p-4 overflow-auto">{children}</div>
    </div>
  )
}
