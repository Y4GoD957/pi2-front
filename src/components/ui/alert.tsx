import * as React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

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

function AlertSuccess({ message }: { message: string }) {
  return (
    <Alert className="flex items-start gap-2 border-emerald-300 bg-emerald-50 text-emerald-700">
      <CheckCircle2 className="mt-0.5 size-4" aria-hidden="true" />
      <span>{message}</span>
    </Alert>
  )
}

export { Alert, AlertError, AlertSuccess }
