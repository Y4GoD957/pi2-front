import * as React from 'react'
import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

function Alert({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',
        className,
      )}
      {...props}
    />
  )
}

function AlertError({ message }: { message: string }) {
  return (
    <Alert className="flex items-start gap-2">
      <AlertCircle className="mt-0.5 size-4" aria-hidden="true" />
      <span>{message}</span>
    </Alert>
  )
}

export { Alert, AlertError }
