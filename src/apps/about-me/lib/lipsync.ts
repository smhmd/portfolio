import { MathUtils, type Mesh, type Object3D } from 'three'

import data from './visemes.json'

/**
 * Oculus visemes from visemes.json. Each cue is drawn as a trapezoid whose
 * ramps straddle its boundaries, so every boundary is a crossfade.
 *
 *   sil  silence          DD  t, d      RR  r            oh  toe
 *   PP   p, b, m          kk  k, g      aa  car          ou  boot
 *   FF   f, v             CH  ch, j, sh  E  bed
 *   TH   think            SS  s, z      ih  tip
 *                         nn  n, l
 */

export type Cue = (typeof data.cues)[number]

export const VISEMES = data.visemes

export const DURATION = data.cues[data.cues.length - 1].end

const EYES = ['eyeBlinkLeft', 'eyeBlinkRight']

/** Half a crossfade — the ramp either side of every boundary. */
const HALF = data.transitionMs / 2000

type Span = {
  v: number
  amp: number
  t0: number
  t1: number
  t2: number
  t3: number
}

/** Adjacent cues naming the same shape are joined, or their shared boundary
 * would ramp one out and the other in. */
function spans(cues: Cue[]): Span[] {
  const merged: Cue[] = []
  for (const cue of cues) {
    const prev = merged[merged.length - 1]
    if (prev && prev.viseme === cue.viseme && prev.end >= cue.start - 1e-6) {
      prev.end = cue.end
      prev.amp = Math.max(prev.amp, cue.amp)
    } else merged.push({ ...cue })
  }

  return merged.map(({ start, end, viseme, amp }) => {
    const mid = (start + end) / 2
    return {
      v: VISEMES.indexOf(viseme),
      amp: amp / data.scale,
      // Too short for both ramps becomes a triangle, not a squashed trapezoid.
      t0: start - HALF,
      t1: Math.min(start + HALF, mid),
      t2: Math.max(end - HALF, mid),
      t3: end + HALF,
    }
  })
}

let SPANS = spans(data.cues)

/** DEV(visemes): play an edited timeline in place of the shipped one. */
export function recue(cues: Cue[]) {
  SPANS = spans(cues)
  cursor = 0 // it indexes the timeline that just went away
}

/** How fast the mouth closes when the audio stops mid-sprite. */
const RELEASE = 14

const weights = new Float32Array(VISEMES.length)
let cursor = 0

function height({ amp, t0, t1, t2, t3 }: Span, t: number) {
  if (t <= t0 || t >= t3) return 0
  if (t < t1) return (amp * (t - t0)) / (t1 - t0)
  if (t <= t2) return amp
  return (amp * (t3 - t)) / (t3 - t2)
}

/** Spans are ordered, so one cursor serves all fifteen visemes. */
function sampleAt(time: number) {
  while (cursor > 0 && time <= SPANS[cursor - 1].t3) cursor--
  while (cursor < SPANS.length - 1 && time > SPANS[cursor].t3) cursor++

  weights.fill(0)
  for (let i = cursor; i < SPANS.length; i++) {
    const span = SPANS[i]
    if (span.t0 > time) break
    // The louder of the two, never their sum.
    weights[span.v] = Math.max(weights[span.v], height(span, time))
  }

  // Morph targets add, so weights past 1 break the mesh. Normalising keeps
  // the mix; clipping would not.
  let total = 0
  for (const w of weights) total += w
  if (total > 1) for (let v = 0; v < weights.length; v++) weights[v] /= total
}

type Face = {
  influences: number[]
  visemes: [track: number, index: number][]
  eyes: number[]
}

export function collectFaces(root: Object3D) {
  const faces: Face[] = []

  root.traverse((object) => {
    const { morphTargetDictionary: dict, morphTargetInfluences: influences } =
      object as Mesh
    if (!dict || !influences) return

    faces.push({
      influences,
      visemes: VISEMES.flatMap((name, v) =>
        name in dict ? [[v, dict[name]] as [number, number]] : [],
      ),
      eyes: EYES.filter((n) => n in dict).map((n) => dict[n]),
    })
  })

  return faces
}

/** `time` of null rests the mouth. */
export function applyFace(
  faces: Face[],
  time: number | null,
  blink: number,
  delta: number,
) {
  if (time === null)
    for (let v = 0; v < weights.length; v++)
      weights[v] = MathUtils.damp(weights[v], 0, RELEASE, delta)
  else sampleAt(time)

  for (const { influences, visemes, eyes } of faces) {
    for (const [v, i] of visemes) influences[i] = weights[v]
    for (const i of eyes) influences[i] = blink
  }
}
