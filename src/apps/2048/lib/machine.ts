import { assign, setup } from 'xstate'

import type { Direction } from 'src/lib/types'

import { APP_ID, type State } from './common'
import {
  addTile,
  checkLost,
  checkWon,
  initializeState,
  mergeTiles,
  moveTiles,
  persistState,
  reset,
} from './utils'

export type Events =
  | { type: 'game.start' }
  | { type: 'game.reset' }
  | { type: 'game.continue' }
  | { type: 'move.start'; payload: Direction }
  | { type: 'move.end' }

const initialState = {
  board: [],
  score: 0,
  best: 0,
  updated: true,
  won: false,
} satisfies State

export const machine = setup({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  actions: {
    persist: ({ context }) => persistState(context),
    init: assign(initializeState),
    win: assign({ won: true }),
    merge: assign(({ context }) => mergeTiles(context)),
    reset: assign(({ context }) => reset(context)),
    add: assign(({ context }) => ({ board: addTile(context.board) })),
    move: assign(({ context, event }) => {
      if (event.type !== 'move.start')
        throw new Error('Impossible. Type-narrowing.')
      return moveTiles({
        board: context.board,
        direction: event.payload,
      })
    }),
  },
  guards: {
    isWon: ({ context }) => checkWon(context),
    isLost: ({ context }) => checkLost(context.board),
    isNotUpdated: ({ context }) => !context.updated,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYinVTADoAnOMAFwG0AGAXUVAAcB7WXBrh75OIAB6IAjADZJAdioAmAKwAWFqtUAOOYrlaAnFoA0IAJ6JlWrVWVy7qxdOV2tyxQF8PptFjyEiKgBJABEAGQBRMgpqWAZ0GmZ2UV5+QWFRCQQAZi1FKg1JbOlFSWtlZwNTCwRrSSoDeWlGuQNlbOzdLx8MHAJiKgBhAAkIwYBpIIA5AHESVg4kEFSBIRElrPtVAvt3OsllSQM5asRdBUkj0ulpLVk5fW6QXz6AodGJ6bmmSUXuPlWGQ2ZzUOxccjKh2ULCMp1qqmUtjaBhUqgM2i0kieL38AxGY0ms3mij+ywB6XWoE2oJYuwhbgOMJM5kQBhKVC0aIMMKs2hUWmxvVxgQACmEAIIATS+JFQPAAbrF4okFilyWtMohrNIqM5MTpSqobu04ZodQZctl2iw3Ddsp5vM8hf1AgBZADyADUZXLFVQwPgIKqlisKZqcnkCqoiiUyrbpHCnPk7opstybfZJIpVIK-C6qB7vUTg-80hrgQgip0qBC45o09GDonjhzco1pLSSiU1LnXgMAMoi8UAdSmMpLZLLQKplmzDSMHSODzk0gecJuCkUTlu6MxsmaveFVGH7qm0UoVEwwkE+AArmAJ6HyzPK9kYVRF-ZnFt7QmWQh7BYD9mi3ZQjFKTpsi8R18B4CA4FEHEXTVKdKXERBs22O5JHUDoVGheRmRqIogJTVQV0aI17TsQ981CSIUMBNCskUFEOVkXDqIIojWTfD90VTSQWBkN9hNot58U+WZGLDCtoWyD9DBYDQ7GkTRyLhQDgJRFRwKKOQc0dJC3jFKUvhk590MrI1EQMY4NBso59PXasWHcRR9RXAy8nEgZC3MkN1WnKyhJYfI1DRaFMxYe04XteobUMdR5GUvIBSM503kHEcx2kwLUPDbRbI0WQszkXIdEkOF3CA1jjkxCo7k5LEMrzN4TymCzgqyS59AabI0QhWlrGE5RNKcdiUXURxFzuXzAjCd1+wAFS65ipEUFgdXke00ysTpWJ42pbg5BFGitG5yMMaCPCAA */ context:
    initialState,
  id: APP_ID,
  description: 'The state machine for the game 2048.',
  initial: 'IDLE',
  states: {
    IDLE: {
      on: {
        'game.start': {
          description:
            'We start the machine manually because SSR prevents persisting to localstorage.',
          target: 'CHECKING',
          actions: 'init',
        },
      },
    },
    CHECKING: {
      always: [
        {
          description:
            'If the persisted game is already won, we transition to the WON state.',
          target: 'WON',
          guard: 'isWon',
        },
        {
          description:
            'If the persisted game is already lost, we transition to the LOST state.',
          target: 'LOST',
          guard: 'isLost',
        },
        {
          description:
            'If the board is neither won or lost, we transition to the PLAYING state.',
          target: 'PLAYING',
        },
      ],
    },
    PLAYING: {
      on: {
        'move.start': {
          description: 'While playing, the player can move tiles around.',
          target: 'MOVING',
          actions: 'move',
        },
      },
    },
    MOVING: {
      always: {
        description:
          'Transition to PLAYING state unless the board was updated.',
        target: 'PLAYING',
        guard: 'isNotUpdated',
      },
      on: {
        'move.end': {
          description:
            'Once tiles animation ends, then we merge overlapping tiles and transition to the SPAWNING state.',
          target: 'SPAWNING',
          actions: 'merge',
        },
      },
    },
    SPAWNING: {
      entry: ['add', 'persist'],
      always: {
        target: 'CHECKING',
      },
    },
    WON: {
      entry: 'win',
      on: {
        'game.continue': {
          target: 'PLAYING',
        },
      },
    },
    LOST: {},
  },
  on: {
    'game.reset': {
      description:
        'Transition directly to the playing state with 2 starting tiles.',
      target: '.PLAYING',
      actions: 'reset',
    },
  },
})
