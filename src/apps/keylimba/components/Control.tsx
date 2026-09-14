import { Dialog } from '@base-ui/react/dialog'
import clsx from 'clsx'

import { Close } from 'src/icons'
import type { Props } from 'src/lib/types'

type ControlProps = Props<'span', { name: string; value?: React.ReactNode }>

export function Control({
  name,
  value = '',
  children,
  ...props
}: ControlProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={clsx(
          'flex w-full items-center justify-between',
          'px-6 py-3',
          'cursor-pointer outline-none',
          'hocus:bg-white/3 active:bg-white/3',
        )}>
        <span className='w-full text-left capitalize tracking-wider'>
          {name}
        </span>
        <span className='flex size-12 shrink-0 items-center justify-center whitespace-pre font-semibold'>
          <span {...props}>{value}</span>
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop
          forceRender
          className={clsx(
            'fixed inset-0 bg-black/60',
            'data-open:animate-fade-in data-closed:animate-fade-out',
          )}
        />
        <Dialog.Popup
          className={clsx(
            'fixed left-1/2 top-1/2',
            '-translate-x-1/2 -translate-y-1/2',
            'max-w-136 rounded-4xl w-full',
            'bg-neutral-900 text-white',
            'font-quicksand text-2.5xl tracking-wider',
            'outline-none',
            'data-open:animate-grow-in',
            'data-closed:animate-grow-out',
          )}>
          <section
            className={clsx(
              'relative flex flex-col',
              'pt-5.5 px-8 pb-10',
              'gap-y-14',
            )}>
            <Dialog.Title className='text-center capitalize'>
              {name}
            </Dialog.Title>

            <Dialog.Description className='sr-only'>
              Edit {name}
            </Dialog.Description>

            {children}

            <Dialog.Close
              className={clsx(
                'absolute right-4 top-4',
                'rounded-full p-2',
                'cursor-pointer outline-none',
                'transition-all duration-300',
                'hocus:rotate-90 hocus:bg-white/20',
              )}>
              <Close className='size-10 fill-current' aria-label='Close' />
            </Dialog.Close>
          </section>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
