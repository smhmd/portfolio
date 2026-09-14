import { useLayoutEffect, useRef } from 'react'

import { Base, Geometry, Subtraction } from '@react-three/csg'
import { type ThreeElements } from '@react-three/fiber'
import { animate, type AnimationOptions } from 'motion/react'
import { BoxGeometry, Group, PlaneGeometry } from 'three'

import { HALF_PI } from 'src/lib/math'

import { materials } from '../lib/materials'
import { Dome } from './Dome'

type DoorProps = ThreeElements['group'] & {
  open: boolean
}

const anim: AnimationOptions = {
  duration: 2,
  ease: 'backInOut',
}

const baseGeo = new BoxGeometry(1, 2, 1)
const doorGeo = new PlaneGeometry(0.36, 1.7)

const subtractions = [
  [[0, -0.4, 0.1], new BoxGeometry(0.7, 1.6, 0.8)],
  [[0, -0.3, 0.1], new BoxGeometry(0.45, 1.7, 0.8)],
  [[0, -0.2, 0.1], new BoxGeometry(0.15, 1.8, 0.8)],
  [[0, -0.2, 0], new BoxGeometry(0.8, 1.8, 0.8)],
] as const

const doors = [
  {
    angle: HALF_PI,
    position: [0, 0, 0],
    offset: 0.2,
    scaleX: 1,
  },
  {
    angle: -HALF_PI,
    position: [0.76, 0, 0],
    offset: -0.2,
    scaleX: -1,
  },
] as const

const shadows = [
  {
    position: [-0.89, 0.85, 0.5],
    rotation: [0, HALF_PI, 0],
    geometry: new PlaneGeometry(1, 1.7),
    material: materials.gradient,
  },
  {
    position: [-0.48, 0.01, 0.46],
    rotation: [HALF_PI, 0, -HALF_PI],
    geometry: new PlaneGeometry(0.9, 0.8),
    material: materials.gradient,
  },
] as const

export function Door({ open, layers, ...props }: DoorProps) {
  const doorRefs = useRef<Group[]>([])

  useLayoutEffect(() => {
    const animations = doors.map(({ angle }, i) =>
      animate(doorRefs.current[i].rotation, { y: open ? angle : 0 }, anim),
    )

    return () => animations.forEach((a) => a.stop())
  }, [open])

  return (
    <group {...props}>
      <group position={[-0.86, 0.85, 0.92]}>
        {doors.map(({ position, offset, scaleX }, i) => (
          <group
            key={i}
            ref={(ref) => {
              if (ref) doorRefs.current[i] = ref
            }}
            position={position}>
            <mesh
              layers={layers}
              geometry={doorGeo}
              material={materials.door}
              position-x={offset}
              scale-x={scaleX}
            />
          </group>
        ))}
      </group>

      <mesh layers={layers} position={[-0.5, 1, 0.5]} material={materials.base}>
        <Geometry>
          <Base geometry={baseGeo} />
          {subtractions.map(([position, geometry], i) => (
            <Subtraction key={i} position={position} geometry={geometry} />
          ))}
        </Geometry>
      </mesh>

      <Dome layers={layers} position={[0, 2, 0]} />

      {shadows.map((shadow, i) => (
        <mesh layers={layers} key={i} {...shadow} />
      ))}
    </group>
  )
}
