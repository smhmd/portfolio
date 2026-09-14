import { useMemo } from 'react'

import { useThree } from '@react-three/fiber'

import { clamp } from 'src/lib/math'

import {
  BASE_ASPECT,
  BASE_DISTANCE,
  BASE_FOV,
  CAMERA_POSITION,
  DOLLY,
  MAX_FOV,
  MIN_FOV,
  PANEL_OFFSET,
  ROOT_POSITION,
  ROOT_SCALE,
} from './common'

type Position = [number, number, number]

const DEG = 180 / Math.PI

const halfTan = (fov: number) => Math.tan(fov / (2 * DEG))

/**
 * Two rules: hold the *horizontal* FOV constant (three's `fov` is vertical,
 * so pinning it crops the sides away as the frame narrows), and hold the
 * avatar's share of the frame by dollying him in as the FOV widens. Apparent
 * size goes as 1 / (distance · tan(fov/2)); DOLLY blends toward no dolly.
 */
function framing(aspect: number) {
  const fov = clamp(
    MIN_FOV,
    2 * DEG * Math.atan((halfTan(BASE_FOV) * BASE_ASPECT) / aspect),
    MAX_FOV,
  )

  const fit = (BASE_DISTANCE * halfTan(BASE_FOV)) / halfTan(fov)
  const distance = BASE_DISTANCE + (fit - BASE_DISTANCE) * DOLLY

  // Into Scene's root group's local space.
  const z = (CAMERA_POSITION[2] + distance - ROOT_POSITION[2]) / ROOT_SCALE

  const avatar: Position = [0, 0, z]
  const panel: Position = [
    PANEL_OFFSET[0],
    PANEL_OFFSET[1],
    z + PANEL_OFFSET[2],
  ]

  // Half the frame in metres at the avatar's distance, so the gaze turns by
  // the cursor's own angle in frame.
  const reach = distance * halfTan(fov)
  const gaze: [x: number, y: number] = [reach * aspect, reach]

  return { fov, distance, avatar, panel, gaze }
}

/** Tracks the canvas, not the window. */
export function useFraming() {
  const { width, height } = useThree((s) => s.size)

  return useMemo(
    () => framing(height > 0 ? width / height : BASE_ASPECT),
    [width, height],
  )
}
