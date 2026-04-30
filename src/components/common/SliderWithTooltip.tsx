import React, { useState } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export default function SliderWithTooltip({
  value,
  onValueChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <SliderPrimitive.Root
        {...props}
        value={value}
        onValueChange={onValueChange}
        className={cn('relative flex w-full touch-none select-none items-center', props.className)}
        onPointerDown={() => setShowTooltip(true)}
        onPointerUp={() => setShowTooltip(false)}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>

        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb className="relative block size-3 shrink-0 rounded-full border border-ring bg-foreground ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50" />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="px-2 py-1 text-xs font-medium"
            onPointerDown={(e) => e.preventDefault()}
          >
            {value}
          </TooltipContent>
        </Tooltip>
      </SliderPrimitive.Root>
    </TooltipProvider>
  )
}
