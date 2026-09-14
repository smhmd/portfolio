import { useLayoutEffect } from 'react'

import { useThree } from '@react-three/fiber'

import { store } from '../lib/store'

/** Never let a failed compile strand the splash. */
const TIMEOUT = 5_000

/**
 * `useProgress` only covers downloads; PMREM, shader compilation and texture
 * upload happen on first render. Mount after whatever populates the scene.
 * drei's `<Preload all />` uses `gl.compile`, which does not await the driver.
 */
export function Preload() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  useLayoutEffect(() => {
    let done = false

    const ready = () => {
      if (done) return
      done = true
      store.set({ ready: true })
    }

    const timer = setTimeout(ready, TIMEOUT)
    void gl.compileAsync(scene, camera).then(ready, ready)

    return () => {
      done = true
      clearTimeout(timer)
      // Not `enter`'s to clear: navigating to the route you are already on
      // runs the loader without unmounting the canvas.
      store.set({ ready: false })
    }
  }, [gl, scene, camera])

  return null
}
