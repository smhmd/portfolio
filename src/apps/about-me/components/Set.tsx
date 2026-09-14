import { useLayoutEffect, useMemo } from 'react'

import { useGLTF } from '@react-three/drei'
import { FrontSide, type Mesh, type Object3D } from 'three'

import { PI } from 'src/lib/math'

import { type ModelProps, MODELS } from '../lib/models'

const PROPS = '/models/props.glb'

/** Mounting a node moves it out of the glTF scene, so a second
 * `getObjectByName` finds nothing. */
const NODES = new WeakMap<Object3D, Record<string, Object3D>>()

function useProps(scene: Object3D) {
  return useMemo(() => {
    let found = NODES.get(scene)
    if (!found) {
      found = Object.fromEntries(
        MODELS.flatMap(({ key }) => {
          const node = scene.getObjectByName(key)
          return node ? [[key, node] as const] : []
        }),
      )
      NODES.set(scene, found)
    }
    return found
  }, [scene])
}

export function Set() {
  const { scene } = useGLTF(PROPS)
  const nodes = useProps(scene)

  return (
    <group rotation-y={PI} position={[-2.22, 0, 1.38]} scale={1.4}>
      {MODELS.map(({ key, ...model }) => {
        const node = nodes[key]
        return node ? <Model key={key} node={node} {...model} /> : null
      })}
    </group>
  )
}

function Model({
  node,
  castShadow,
  receiveShadow,
  ...props
}: ModelProps & { node: Object3D }) {
  useLayoutEffect(() => {
    node.traverse((o) => {
      o.castShadow = castShadow ?? true
      o.receiveShadow = receiveShadow ?? true

      // Open shells, and three defaults `shadowSide` to the missing side.
      const mesh = o as Mesh
      if (mesh.isMesh)
        for (const material of [mesh.material].flat())
          material.shadowSide = FrontSide

      o.updateMatrix()
      o.matrixAutoUpdate = false
    })
  }, [node, castShadow, receiveShadow])

  // The node carries a quantization transform of its own, so it is placed by
  // wrapping rather than by writing a position onto it.
  return (
    <group {...props}>
      <primitive object={node} />
    </group>
  )
}
