import { useLayoutEffect } from 'react'

import { useEnvironment, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { NoColorSpace, RepeatWrapping } from 'three'

import { ROTATION } from '../lib/projection'
import { Room } from './Room'

/**
 * Two assets, not one 4K EXR doing both jobs at 7 MB and a few hundred ms of
 * main-thread decode. LIGHT is 512x256 — irradiance within 0.015% of the 4K
 * original, sized for the sharpest reflections in the room.
 */

const LIGHT = '/images/studio.exr'
const TEXTURE = '/images/studio.avif'
const INTENSITY = 0.6

export default function World() {
  const light = useEnvironment({ files: LIGHT })
  const map = useTexture(TEXTURE)
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)

  useLayoutEffect(() => {
    // The encoding is undone in `projection`.
    map.colorSpace = NoColorSpace

    // Not the EXR's row order — matching that comes out upside down.
    map.flipY = true

    // The panorama meets itself at uv.x 0 and 1.
    map.wrapS = RepeatWrapping

    // This generates mipmaps, unlike the old DataTexture, so grazing angles
    // need anisotropy to stay sharp.
    map.anisotropy = gl.capabilities.getMaxAnisotropy()

    map.needsUpdate = true
  }, [map, gl])

  // Layout, not passive: a passive effect can paint a frame with no IBL.
  useLayoutEffect(() => {
    scene.environment = light
    scene.environmentRotation.y = ROTATION
    scene.environmentIntensity = INTENSITY
    return () => {
      scene.environment = null
    }
  }, [scene, light])

  return <Room map={map} />
}
