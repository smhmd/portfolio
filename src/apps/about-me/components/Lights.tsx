import { Object3D } from 'three'

const TARGET = new Object3D()
TARGET.position.set(0, 1.2, 1.7)

export function Lights() {
  return (
    <>
      <primitive object={TARGET} />

      <spotLight
        castShadow
        target={TARGET}
        position={[-4, 10, 0]}
        angle={0.75}
        penumbra={0.5}
        decay={0}
        intensity={1.5}
        color='#ffd9ae'
        shadow-mapSize={[2048, 2048]}
        shadow-focus={0.8}
        shadow-camera-near={4}
        shadow-camera-far={16}
      />

      <directionalLight
        position={[-2, 3.5, 6]}
        intensity={1.4}
        color='#c1b9ff'
      />
    </>
  )
}
