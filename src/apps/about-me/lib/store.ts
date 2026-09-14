import { createRef } from 'react'

import { createStore } from 'src/lib/react'

import { type Choice, dialogue, type NodeId } from './dialogue'
import { voice } from './voice'

/**
 * `fresh`: the node is being performed, not merely shown.
 * `ready`: the renderer is warm. Owned by Preload — `enter` must not touch
 * it, or arriving on an already-mounted canvas strands the splash.
 * `entered`: the entry camera flight has finished.
 */
export const store = createStore({
  node: null as NodeId | null,
  speaking: false,
  fresh: false,
  ready: false,
  entered: false,
})

/** Rows are real links, so they live in the DOM; Scene projects the position. */
export const panel = createRef<HTMLDivElement>()

/**
 * Pointer in NDC; 0,0 means nothing is being pointed at. Not r3f's
 * `state.pointer`, which stops updating under the DOM rows.
 */
export const cursor = { x: 0, y: 0, onRow: false }

/** Whether this session has been through the room before. */
let visited = false

/** The store outlives the route; these three flags belong to one visit. */
export const enter = () => {
  store.set({ entered: visited, fresh: false, speaking: false })
  visited = true
}

/** Nodes already said out loud. */
const heard = new Set<NodeId>()

/** A node is performed once; revisiting shows it without replaying it. */
function goto(target: NodeId) {
  const line = dialogue[target]
  const sprite = heard.has(target) ? undefined : line.sprite

  store.set({ node: target, speaking: sprite != null, fresh: sprite != null })

  if (!sprite) return void (line.auto && goto(line.auto))

  heard.add(target)
  voice.play(sprite, () => {
    if (store.get().node !== target) return // superseded by a newer goto
    store.set({ speaking: false })
    if (line.auto) goto(line.auto)
  })
}

export const api = { goto }

export function useChoices(): Choice[] | null {
  const { node, speaking } = store.use()

  if (!node || speaking) return null
  return dialogue[node].choices ?? null
}
