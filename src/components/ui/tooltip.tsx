import * as React from "react"

import { cn } from "@/lib/utils"

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div
          className={cn(
            "absolute z-50 px-3 py-1.5 text-xs text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-lg whitespace-nowrap pointer-events-none",
            {
              'bottom-full left-1/2 -translate-x-1/2 mb-2': side === 'top',
              'top-full left-1/2 -translate-x-1/2 mt-2': side === 'bottom',
              'right-full top-1/2 -translate-y-1/2 mr-2': side === 'left',
              'left-full top-1/2 -translate-y-1/2 ml-2': side === 'right',
            }
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45",
              {
                'top-full left-1/2 -translate-x-1/2 -mt-1': side === 'top',
                'bottom-full left-1/2 -translate-x-1/2 -mb-1': side === 'bottom',
                'top-1/2 -translate-y-1/2 -mr-1 right-full': side === 'left',
                'top-1/2 -translate-y-1/2 -ml-1 left-full': side === 'right',
              }
            )}
          />
        </div>
      )}
    </div>
  )
}
