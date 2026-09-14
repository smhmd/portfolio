type Position = [number, number, number]

export const ROOT_SCALE = 1.1
export const ROOT_POSITION: Position = [0, 0.01, -0.5]

export const CAMERA_POSITION: Position = [0, 1.9, -5.65]
export const CAMERA_TARGET: Position = [0, 1.6, 0]

/** The one shot every other aspect ratio is solved against. See framing.ts. */
export const BASE_ASPECT = 16 / 9
export const BASE_FOV = 60
export const BASE_DISTANCE = 4

export const MIN_FOV = 45
export const MAX_FOV = 95

/** 0..1 — how much of the FOV widening is bought back by dollying the avatar. */
export const DOLLY = 0.7
export const DRAG_SLOP = 6 // px of travel before a press stops being a click
export const TOUCH_LINGER = 0.8 // seconds a lifted finger keeps the room

/** Offset from CAMERA_POSITION, which the camera dollies in from on entry. */
export const CAM_ENTRY_OFFSET: Position = [-0.5, -0.2, -1.2]
export const CAM_ENTRY_SECONDS = 2.5

export const PEEK_X = 0.1
export const PEEK_Y = 0.025
export const PEEK_TAU = 0.3

export const AVATAR_SCALE = 1.1
export const GESTURE_FADE = 0.4
export const ADDITIVE_ANIMS = ['talking-1', 'talking-2'] // layered with idle

export const GAZE_FOLLOW = true
export const GAZE_HEAD = 0.5 // 0..1 — how far each is pulled off its animated pose toward the target
export const GAZE_EYE = 0.15
export const GAZE_TAU = 0.25
export const GAZE_DEPTH = 2.5 // multiplayer against the camera distance
export const GAZE_PANEL_DEPTH = 0.5 // multiplayer against the camera distance

export const PANEL_OFFSET: Position = [-1, 1.5, -0.2]
export const LIPSYNC_DELAY_S = 0.15
