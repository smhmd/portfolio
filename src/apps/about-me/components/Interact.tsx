import { useLayoutEffect } from 'react'

import { type ThreeElements, useThree } from '@react-three/fiber'
import { DoubleSide } from 'three'

import { DRAG_SLOP, TOUCH_LINGER } from '../lib/common'
import { type NodeId } from '../lib/dialogue'
import { api, cursor } from '../lib/store'

/**
 * Discards the click the browser fires at the end of a drag. Not r3f's
 * `event.delta`, which measures displacement, so a drag out and back passes.
 */
let dragged = false

export function Hitbox({
  goto,
  children,
  ...props
}: ThreeElements['mesh'] & { goto: NodeId }) {
  return (
    <mesh {...props} onClick={() => !dragged && api.goto(goto)}>
      {children}
      <meshBasicMaterial
        transparent
        opacity={0}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

export function Interact() {
  const gl = useThree((s) => s.gl)

  useLayoutEffect(() => {
    const el = gl.domElement
    const controller = new AbortController()
    const { signal } = controller

    let x = 0
    let y = 0
    let travelled = 0
    let release: ReturnType<typeof setTimeout> | undefined

    // The canvas fills the viewport, so no getBoundingClientRect per move.
    const aim = (e: PointerEvent) => {
      clearTimeout(release)
      cursor.x = (e.clientX / window.innerWidth) * 2 - 1
      cursor.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const home = () => {
      cursor.x = 0
      cursor.y = 0
    }

    // Canvas only: a finger on the HUD is working the interface. A press
    // aims nothing — r3f raycasts on both press and click, so a lens that
    // moves in between walks the second ray off the avatar.

    el.addEventListener(
      'pointerdown',
      (e) => {
        x = e.clientX
        y = e.clientY
        travelled = 0
        dragged = false
      },
      { signal },
    )

    el.addEventListener(
      'pointermove',
      (e) => {
        if (!e.buttons) return // hovering, not dragging
        // Path length, not displacement.
        travelled += Math.hypot(e.clientX - x, e.clientY - y)
        x = e.clientX
        y = e.clientY
        dragged ||= travelled > DRAG_SLOP

        // Past the slop it can no longer become a click.
        if (dragged && e.pointerType !== 'mouse') aim(e)
      },
      { signal },
    )

    // Delayed, so a tap lands before the recoil starts.
    const lift = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      aim(e)
      release = setTimeout(home, TOUCH_LINGER * 1000)
    }

    el.addEventListener('pointerup', lift, { signal })
    el.addEventListener('pointercancel', lift, { signal })

    // The document, not the canvas: a canvas listener loses the cursor
    // exactly when it lands on a choice.
    const root = document.documentElement
    const mouse = (fn: (e: PointerEvent) => void) => (e: PointerEvent) =>
      e.pointerType === 'mouse' && fn(e)

    root.addEventListener('pointermove', mouse(aim), { signal })
    root.addEventListener('pointerleave', mouse(home), { signal })
    window.addEventListener('blur', home, { signal })

    return () => {
      clearTimeout(release)
      controller.abort()
    }
  }, [gl])

  return null
}
