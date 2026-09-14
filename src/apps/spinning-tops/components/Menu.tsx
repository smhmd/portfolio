import { memo, useEffect } from 'react'

import { shallowEqual, useSelector } from '@xstate/react'
import clsx from 'clsx'

import {
  actor,
  difficulties,
  hostGame,
  joinGame,
  leaveGame,
  type Mode,
  type PlayerID,
} from '../lib'
import { Countdown } from './Countdown'
import { Lobby } from './Lobby'

const playerTitles: Record<Mode, Record<PlayerID, string>> = {
  local: { p1: 'You', cpu: 'CPU' },
  host: { p1: 'You', cpu: 'Your Friend' },
  guest: { p1: 'Your Friend', cpu: 'You' },
}

export const Menu = memo(() => {
  // The selector returns a fresh object; without shallowEqual every
  // machine event re-rendered Menu and defeated memo().
  const {
    difficulty,
    winner,
    mode,
    roomCode,
    friendPaused,
    isGameOver,
    isMainMenu,
    isPlaying,
    isCountdown,
    isLobby,
  } = useSelector(
    actor,
    (state) => ({
      ...state.context,
      isGameOver: state.matches('GAME_OVER'),
      isMainMenu: state.matches('MAIN_MENU'),
      isPlaying: state.matches('PLAYING'),
      isCountdown: state.matches('COUNTDOWN'),
      isLobby: state.matches('LOBBY'),
    }),
    shallowEqual,
  )

  const isOnline = mode !== 'local'

  // Opened through an invite link → consume the `?join` param (so
  // reloads and back-to-menu don't rejoin a stale room) and join.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('join')
    if (!code) return

    params.delete('join')
    const query = params.toString()
    history.replaceState(
      null,
      '',
      window.location.pathname + (query ? `?${query}` : ''),
    )

    void joinGame(code)
  }, [])

  function handleGameMenu() {
    // Online, leaving the match and leaving the room are the same thing;
    // leaveGame() tears the room down and dispatches net.disconnect.
    if (isOnline) leaveGame()
    else actor.send({ type: 'game.menu' })
  }
  function handleGameCountdown() {
    // Online, the host's COUNTDOWN transition is relayed to the guest
    // by the start relay in lib/net.ts — no extra wiring needed here.
    actor.send({ type: 'game.countdown' })
  }
  function handleDifficultyCycle() {
    actor.send({ type: 'difficulty.cycle' })
  }
  function handleHostGame() {
    void hostGame()
  }

  const options = [
    {
      show: isGameOver,
      title: 'Main Menu',
      action: handleGameMenu,
    },
    {
      // Rematches are host-driven; the guest just waits for the relay.
      show: isMainMenu || (isGameOver && mode !== 'guest'),
      title: isMainMenu ? 'Start Game' : 'Play Again',
      action: handleGameCountdown,
    },
    {
      show: isMainMenu,
      title: 'Difficulty',
      value: difficulties[difficulty],
      action: handleDifficultyCycle,
    },
    {
      // Set apart from the local (vs CPU) options above.
      show: isMainMenu,
      title: 'Host Game',
      action: handleHostGame,
      className: 'mt-6',
    },
  ]

  if (isPlaying) {
    return friendPaused ? (
      <div className='pointer-events-none absolute inset-x-0 top-[18vh] flex justify-center'>
        <span aria-live='polite' className='animate-pulse text-xl'>
          Paused — your friend tabbed away…
        </span>
      </div>
    ) : null
  }

  if (isCountdown) return <Countdown />

  if (isLobby) return <Lobby mode={mode} roomCode={roomCode} />

  return (
    <div
      className={clsx(
        'init:opacity-0 pointer-events-none',
        'animate-fade-in anim-duration-1000 anim-delay-1000',
      )}>
      <section
        aria-hidden={!isGameOver}
        className={clsx(
          isGameOver ? 'block' : 'hidden',
          'absolute inset-x-0 flex flex-col items-center justify-center',
          'vsm:top-[8vh] vlg:top-[12vh] vxl:top-[18vh] v2xl:top-[20vh] top-[6vh]',
        )}>
        <img
          alt=''
          aria-hidden
          className='l:vsm:size-28 l:vmd:size-44 l:size-20 size-28 sm:size-44'
          src='/images/winner.png'
        />
        <span className='text-shadow-cyan-glow l:vsm:text-3xl l:vmd:text-5xl l:text-xl text-3xl sm:text-5xl'>
          {winner && playerTitles[mode][winner]} Won
        </span>
      </section>

      <section
        className={clsx(
          'absolute inset-0 flex flex-col items-center justify-center gap-y-2',
          'mb-4 text-xl',
        )}>
        <ul className='w-full max-w-xs px-4'>
          {options.map(({ show = true, title, value, action, className }, i) =>
            show ? (
              <li key={i} className={className}>
                <button
                  className={clsx(
                    'pointer-events-auto flex w-full cursor-none justify-between',
                    'outline-none transition-[text-shadow] duration-100 ease-in',
                    'hover:text-shadow-cyan-glow focus:text-shadow-cyan-glow',
                    'corner-bevel supports-squircle:hover:bg-cyan-200/10 rounded-full',
                    value || 'mb-4 justify-center',
                  )}
                  onClick={action}>
                  <span>{title}</span>
                  <span className='capitalize' aria-live='polite'>
                    {value}
                  </span>
                </button>
              </li>
            ) : null,
          )}
        </ul>

        {isGameOver && mode === 'guest' ? (
          <span aria-live='polite' className='animate-pulse text-sm opacity-70'>
            Waiting for the host to restart…
          </span>
        ) : null}
      </section>
    </div>
  )
})

Menu.displayName = 'Menu'
