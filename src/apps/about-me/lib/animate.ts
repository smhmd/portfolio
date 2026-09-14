import { useEffect } from 'react'

import {
  AdditiveAnimationBlendMode,
  type AnimationAction,
  type AnimationMixer,
  LoopOnce,
} from 'three'

import { GESTURE_FADE } from './common'
import { dialogue, type NodeId } from './dialogue'

/**
 * Idle is the base layer and never stops; a node's `animations` play once
 * each on top of it. Additive clips add to idle, normal clips replace it —
 * `owner` is the one action posing the body, which additive clips never are.
 */

type Actions = Record<string, AnimationAction | null>

/** Also asked by Avatar's gaze: an additive gesture has no claim on the head. */
export const isAdditive = (a: AnimationAction) =>
  a.blendMode === AdditiveAnimationBlendMode

export function useAnimate(
  node: NodeId | null,
  fresh: boolean,
  actions: Actions,
  mixer: AnimationMixer,
) {
  useEffect(() => {
    const idle = actions.idle
    if (!node || !idle || !fresh) return

    const queue = (dialogue[node].animations ?? [])
      .map((name) => actions[name])
      .filter((a): a is AnimationAction => !!a && a !== idle)
    if (!queue.length) return

    let owner = idle
    let at = -1

    const enter = (a: AnimationAction) => {
      a.reset().setLoop(LoopOnce, 1)
      // Unclamped, a finished action is disabled outright and `leave` has
      // nothing left to fade.
      a.clampWhenFinished = true

      if (isAdditive(a)) a.fadeIn(GESTURE_FADE)
      else {
        a.crossFadeFrom(owner, GESTURE_FADE, false)
        owner = a
      }
      a.play()
    }

    const leave = (a: AnimationAction) => {
      if (isAdditive(a)) a.fadeOut(GESTURE_FADE)
      else if (owner === a) {
        idle.reset().crossFadeFrom(a, GESTURE_FADE, false).play()
        owner = idle
      }
    }

    // Normal-to-normal is left running, since `enter` crossfades from it.
    const advance = () => {
      const prev = queue[at]
      const next = queue[++at]
      if (prev && (isAdditive(prev) || !next || isAdditive(next))) leave(prev)
      if (next) enter(next)
    }

    advance()

    const finished = ({ action }: { action: AnimationAction }) =>
      void (action === queue[at] && advance())

    mixer.addEventListener('finished', finished)
    return () => {
      mixer.removeEventListener('finished', finished)
      const current = queue[at]
      if (current?.isRunning()) leave(current) // superseded mid-sequence
    }
  }, [node, fresh, actions, mixer])
}
