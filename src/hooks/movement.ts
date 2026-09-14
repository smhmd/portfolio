import { useEffect } from 'react'

import { useGlobals } from 'src/contexts'
import type { Direction } from 'src/lib/types'

type Props = {
  handler(direction: Direction): void
  disabled?: boolean
}

const MIN_SWIPE_DISTANCE = 30

/**
 * Detects swipe gestures in four directions (up, down, left, right).
 */
export const useDirectionalSwipe = ({ handler, disabled }: Props) => {
  const { isAppDrawerOpen } = useGlobals()

  useEffect(() => {
    if (disabled) return
    const controller = new AbortController()

    let startX = 0
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (isAppDrawerOpen.current) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAppDrawerOpen.current) return
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY

      const deltaX = endX - startX
      const deltaY = endY - startY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
          handler(deltaX > 0 ? 'right' : 'left')
        }
      } else {
        if (Math.abs(deltaY) > MIN_SWIPE_DISTANCE) {
          handler(deltaY > 0 ? 'down' : 'up')
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, {
      signal: controller.signal,
    })
    window.addEventListener('touchend', handleTouchEnd, {
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [disabled, handler])
}

const directionKeyCodes: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
}

/**
 *
 * Detects directional keyboard input (arrow keys or WASD).
 */
export const useDirectionalKeyDown = ({ handler, disabled }: Props) => {
  const { isAppDrawerOpen } = useGlobals()

  useEffect(() => {
    if (disabled) return
    const controller = new AbortController()

    function keydownEvenHandler(e: KeyboardEvent) {
      if (isAppDrawerOpen.current) return
      const direction = directionKeyCodes[e.code]
      if (direction) {
        e.preventDefault()
        handler(direction)
      }
    }

    window.addEventListener('keydown', keydownEvenHandler, {
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [disabled, handler])
}
