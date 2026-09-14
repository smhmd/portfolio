import { assign, createActor, setup } from 'xstate'

import {
  APP_ID,
  difficulties,
  eliminatedToWinner,
  type Mode,
  type State,
} from './common'

type Events =
  | { type: 'game.countdown' }
  | { type: 'game.start' }
  | { type: 'game.menu' }
  | { type: 'difficulty.cycle' }
  | { type: 'player.lose'; payload: keyof typeof eliminatedToWinner }
  | { type: 'player.winner.clear' }
  | { type: 'lobby.host'; payload: string }
  | { type: 'lobby.join'; payload: string }
  | { type: 'friend.pause'; payload: boolean }
  | { type: 'net.disconnect' }

const initialContext = {
  difficulty: 0,
  winner: null,
  mode: 'local',
  roomCode: null,
  friendPaused: false,
} satisfies State

const machine = setup({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  actions: {
    cycleDifficulty: assign(({ context }) => ({
      difficulty: (context.difficulty + 1) % difficulties.length,
    })),
    setWinner: assign(({ event }) => {
      if (event.type !== 'player.lose') return {}
      return { winner: eliminatedToWinner[event.payload] }
    }),
    clearWinner: assign({ winner: null }),
    enterLobby: assign(({ event }) => {
      if (event.type === 'lobby.host')
        return { mode: 'host' as Mode, roomCode: event.payload }
      if (event.type === 'lobby.join')
        return { mode: 'guest' as Mode, roomCode: event.payload }
      return {}
    }),
    setFriendPaused: assign(({ event }) => {
      if (event.type !== 'friend.pause') return {}
      return { friendPaused: event.payload }
    }),
    resetNet: assign({
      mode: 'local' as Mode,
      roomCode: null,
      friendPaused: false,
    }),
  },
}).createMachine({
  id: APP_ID,
  initial: 'MAIN_MENU',
  context: initialContext,
  // The opponent can tab out (or back in) at any point in the flow.
  on: {
    'friend.pause': { actions: 'setFriendPaused' },
    'net.disconnect': { target: '.MAIN_MENU', actions: 'resetNet' },
  },
  states: {
    MAIN_MENU: {
      on: {
        'game.countdown': { target: 'COUNTDOWN' },
        'difficulty.cycle': { actions: 'cycleDifficulty' },
        'lobby.host': { target: 'LOBBY', actions: 'enterLobby' },
        'lobby.join': { target: 'LOBBY', actions: 'enterLobby' },
      },
    },
    LOBBY: {
      on: {
        'game.countdown': { target: 'COUNTDOWN' },
      },
    },
    COUNTDOWN: {
      entry: 'clearWinner',
      on: {
        'game.start': { target: 'PLAYING' },
      },
    },
    PLAYING: {
      on: {
        // Online, this fires on both peers off the same authoritative
        // elimination (the host's verdict), so no special net handling
        // is needed here — one path serves local, host, and guest.
        'player.lose': { actions: 'setWinner', target: 'GAME_OVER' },
      },
    },
    GAME_OVER: {
      on: {
        'game.menu': { target: 'MAIN_MENU' },
        'game.countdown': { target: 'COUNTDOWN' },
      },
    },
  },
})

export let actor = createActor(machine).start()
