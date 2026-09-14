import { lazy, Suspense } from 'react'

import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'

import { Lights } from './Lights'

const Scene = lazy(() => import('./Scene'))

export function Stage() {
  return (
    <Canvas
      dpr={[1, 2]}
      orthographic
      camera={{
        zoom: 100,
        position: [5, 5, 5],
      }}
      gl={{
        autoClear: false,
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      onCreated={({ camera, raycaster }) => {
        // We are using layers heavily in this app.
        // Enable camera for all layers.
        camera.layers.enableAll()
        // We specifically enable raycasting to layer 2 (current highest) for interactions.
        raycaster.layers.set(2)
        raycaster.layers.enable(2)
      }}>
      <Suspense fallback={null}>
        <Lights />
        <Scene />
      </Suspense>
    </Canvas>
  )
}
