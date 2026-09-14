import clsx from 'clsx'

import { AlertOctagon, AlertTriangle } from 'src/icons'

type Severity = 'error' | 'warning'

type AlertProps = {
  severity: Severity
  title?: string
  message?: string
  action?: {
    label: string
    handler(): void
  }
}

const variants = {
  error: {
    Icon: AlertOctagon,
    styles: {
      wrapper: 'bg-red-500/10 border-red-500 text-red-300',
      button: 'bg-red-500/30 hover:bg-red-500/60 focus-visible:ring-red-500',
    },
    role: 'alert',
    'aria-live': 'assertive',
  },
  warning: {
    Icon: AlertTriangle,
    styles: {
      wrapper: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      button:
        'bg-yellow-500/20 hover:bg-yellow-500/30 focus-visible:ring-yellow-500',
    },
    role: 'status',
    'aria-live': 'polite',
  },
} as const

export function Alert({ severity = 'warning', message, action }: AlertProps) {
  const { Icon, styles, ...props } = variants[severity]

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-between gap-4 sm:flex-row',
        'animate-fade-in rounded-lg border p-4',
        'text-xs',
        styles.wrapper,
      )}
      {...props}>
      <div className='flex items-center gap-2'>
        <Icon aria-hidden className='size-4 shrink-0 fill-current' />
        <p>{message}</p>
      </div>
      {action && (
        <button
          onClick={action.handler}
          className={clsx(
            styles.button,
            'w-full sm:w-auto',
            'cursor-pointer rounded-md px-3 py-1.5',
            'whitespace-nowrap font-medium',
            'transition-colors',
            'outline-none focus-visible:ring-2',
          )}>
          {action.label}
        </button>
      )}
    </div>
  )
}
