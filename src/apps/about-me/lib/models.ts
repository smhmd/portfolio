import type { ThreeElements } from '@react-three/fiber'

export type ModelProps = ThreeElements['group'] & {
  'rotation-y'?: number
}
type ModelEntry = ModelProps & { key: string }

/**
 * Every prop is a node in props.glb, named by its `key` and modelled at the
 * origin. castShadow is on for three of them — every caster is geometry the
 * shadow pass redraws from the light each frame.
 */
export const MODELS: ModelEntry[] = [
  {
    key: 'lamp',
    castShadow: false,
    position: [-3.8403, 0, -1.296],
  },
  {
    key: 'table',
    position: [-2.8406, 0, 0.2882],
    'rotation-y': -0.8552,
  },
  {
    key: 'chair',
    position: [-2.3887, 0, -0.7767],
    'rotation-y': -0.4363,
  },
  {
    key: 'pad',
    castShadow: false,
    position: [-2.7169, 0.4438, 0.1233],
    'rotation-y': -2.1642,
  },
  {
    key: 'rug-white',
    position: [0.7307, 0, 0.7],
    scale: [2.1, 1, 1.6],
    castShadow: false,
  },
  {
    key: 'plant',
    castShadow: false,
    position: [1.0216, 0, -1.1996],
    'rotation-y': 2.9681,
  },
  {
    key: 'clock',
    castShadow: false,
    position: [0.9, 2, -1.5638],
    'rotation-y': 0,
  },
  {
    key: 'rug-grey',
    position: [-2.5976, 0, 0.3367],
    'rotation-y': 1.5761,
    castShadow: false,
  },
  {
    key: 'art',
    castShadow: false,
    position: [-3.2, 1.2, -4.9717],
    'rotation-y': 0,
  },
  {
    key: 'unit',
    castShadow: false,
    position: [-4.2687, 0, 0.3424],
    'rotation-y': 1.5708,
  },
  {
    key: 'tv',
    castShadow: false,
    position: [-4.25, 0.6496, 0.3],
    'rotation-y': 1.5708,
  },
  {
    key: 'sofa',
    position: [0.4132, 0, 0.6176],
    'rotation-y': -1.5709,
  },
]
