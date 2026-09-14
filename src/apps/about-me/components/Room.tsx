import { Addition, Base, Geometry, Subtraction } from '@react-three/csg'
import { BackSide, type Texture } from 'three'

import { PI } from 'src/lib/math'

import { project } from '../lib/projection'

/** One CSG box with the doorways cut out, textured by `lib/projection`. */

const HEIGHT = 4.17
const BACK = 5.85
const FRONT = 8.7
const SIDE = 4.425

export function Room({ map }: { map: Texture }) {
  return (
    <mesh receiveShadow position={[0, HEIGHT / 2, (FRONT - BACK) / 2]}>
      <Geometry>
        <Base>
          <boxGeometry args={[SIDE * 2, HEIGHT, FRONT + BACK]} />
        </Base>

        <Subtraction
          key='right-far-corner'
          position={[SIDE, 0, -(BACK + FRONT) / 2]}>
          <boxGeometry args={[1, HEIGHT, 0.98]} />
        </Subtraction>

        <Subtraction key='rear-corner' position={[SIDE, 0, BACK / 2]}>
          <boxGeometry args={[0.97, HEIGHT, 2.7]} />
        </Subtraction>

        <Subtraction key='right-entrance' position={[SIDE, 0, BACK]}>
          <boxGeometry args={[3.05, HEIGHT, 7.55]} />
        </Subtraction>

        <Subtraction key='left-entrance' position={[-SIDE, 0, BACK]}>
          <boxGeometry args={[2, HEIGHT, 7.5]} />
        </Subtraction>

        <Subtraction key='overhead' position={[0, 1.9, 2.075]} rotation-y={PI}>
          <planeGeometry args={[7.1, 1.04]} />
        </Subtraction>

        <Addition key='window' position={[-SIDE, -0.017, -2.6]}>
          <boxGeometry args={[0.25, HEIGHT - 0.035, 8.3]} />
        </Addition>

        <Addition key='raised-ceiling' position={[-0.25, HEIGHT / 2, -2.64]}>
          <boxGeometry args={[4.5, 0.23, 7.12]} />
        </Addition>

        <Subtraction
          key='raised-ceiling-entrance'
          position={[-0.24, HEIGHT / 2, 4.9]}>
          <boxGeometry args={[6.25, 0.24, 5]} />
        </Subtraction>

        <Addition key='hallway' position={[3, -0.72 / 2, FRONT - 2.665]}>
          <boxGeometry args={[2.3, HEIGHT - 0.72, 2.48]} />
        </Addition>
      </Geometry>

      {/* Standard, and it has to be: `scene.environment` only feeds
          physical materials, so Lambert would take the ambient with it. */}
      <meshStandardMaterial
        roughness={1}
        map={map}
        side={BackSide}
        onBeforeCompile={project}
      />
    </mesh>
  )
}
