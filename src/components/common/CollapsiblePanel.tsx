import { useState, type PropsWithChildren } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CollapsiblePanelProps extends PropsWithChildren {
  title: string
  className?: string
  titleClassName?: string
}

export default function CollapsiblePanel({ title, children, className, titleClassName }: CollapsiblePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col w-fit overflow-hidden rounded-md border transition-all duration-300 ease-in-out',
        isCollapsed ? 'min-w-10' : 'min-w-60',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center bg-background',
          isCollapsed ? 'flex-col h-full border-none' : 'flex-row w-full border-b',
        )}
      >
        <Button
          size="sm"
          variant="outline"
          className="h-6 lg:h-7 m-1.5 lg:m-2 p-1"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Plus /> : <Minus />}
        </Button>
        <div
          className={cn(
            'flex-1 lg:text-lg ps-1 pt-1',
            isCollapsed ? '[writing-mode:vertical-lr] tracking-wider' : '',
            titleClassName ? titleClassName : '',
          )}
        >
          {title}
        </div>
      </div>
      {!isCollapsed && <div className="flex-1 flex bg-card overflow-auto">{children}</div>}
    </div>
  )
}
