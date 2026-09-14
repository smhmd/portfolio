import { useEffect, useRef } from 'react'

import { Dialog, type DialogRootActions } from '@base-ui/react/dialog'
import clsx from 'clsx'

import { useGlobals } from 'src/contexts'

import { BentoButton } from './BentoButton'
import { Content } from './Content'

export const AppDrawer = () => {
  const dialogRef = useRef<DialogRootActions>(null)
  const { isAppDrawerOpen } = useGlobals()

  function handleOpenChange(open: boolean) {
    isAppDrawerOpen.current = open
  }

  useEffect(
    () => () => {
      isAppDrawerOpen.current = false
    },
    [],
  )

  function handleClose() {
    dialogRef.current?.close()
  }

  return (
    <nav>
      <Dialog.Root actionsRef={dialogRef} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop
            className={clsx(
              'backdrop-blur-xs fixed inset-0 z-0 bg-black/60',
              'data-open:animate-fade-in data-closed:animate-fade-out',
            )}
          />
          <Content onAppClick={handleClose} />
        </Dialog.Portal>
        <BentoButton />
      </Dialog.Root>
    </nav>
  )
}
