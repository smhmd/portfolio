/**
 * Sprites out of one pre-rendered sheet. `playhead` is in sheet-seconds and
 * drives the lip-sync, so the mouth cannot drift from the audio.
 */

import { LIPSYNC_DELAY_S } from './common'

export type Sprite = readonly [start: number, end: number]

export const SHEET_URL = '/sounds/about-me.mp3'

// Lazy, so this module is safe to import during SSR.
let ctx: AudioContext | null = null
const context = () => (ctx ??= new AudioContext())

let sheet: AudioBuffer | null = null
let loading: Promise<AudioBuffer> | undefined
let source: AudioBufferSourceNode | null = null
let origin = 0 // ctx time whose *audible* output is sheet position 0
let epoch = 0 // invalidates in-flight plays and stale onended callbacks

/** Idempotent; call early so the first line starts instantly. */
function load() {
  return (loading ??= fetch(SHEET_URL)
    .then((r) => r.arrayBuffer())
    .then((data) => context().decodeAudioData(data))
    .then((buffer) => (sheet = buffer)))
}

/** `onended` fires on `stop()` too; the epoch token tells them apart. */
function play([start, end]: Sprite, onended?: () => void) {
  const token = ++epoch
  halt()
  void context().resume() // the click that got us here is our user gesture

  void load().then(() => {
    if (token !== epoch) return
    source = context().createBufferSource()
    source.buffer = sheet
    source.connect(context().destination)
    source.onended = () => {
      if (token !== epoch) return
      source = null
      onended?.()
    }
    // Anchor on the scheduled time, not the clock read back after —
    // `currentTime` only advances a quantum at a time. LIPSYNC_DELAY_S
    // covers the render pipeline, which nothing can report.
    const when = context().currentTime
    source.start(when, start, end - start)
    origin = when - start + latency() - LIPSYNC_DELAY_S
  })
}

function stop() {
  epoch++
  halt()
}

/** DEV(visemes): parked playhead, so the editor can scrub with nothing playing. */
let scrub: number | null = null
const seek = (to: number | null) => void (scrub = to)

/** Over 100ms on a headset. Safari has no `outputLatency`; `baseLatency` is
 * only a floor. */
function latency() {
  const c = context()
  return c.outputLatency || c.baseLatency || 0
}

const playhead = () => scrub ?? (source ? context().currentTime - origin : null) // DEV(visemes): scrub

function halt() {
  try {
    source?.stop()
  } catch {
    /* already stopped */
  }
  source = null
}

export const voice = { load, play, stop, playhead, seek /* DEV(visemes) */ }
