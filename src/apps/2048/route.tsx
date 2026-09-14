import { useEffect, useMemo } from 'react'

import { useMachine, useSelector } from '@xstate/react'
import clsx from 'clsx'

import { Container } from 'src/components'
import { Info } from 'src/icons'
import { generateHead } from 'src/lib/server'
import type { API } from 'src/lib/types'

import { GameBoard, GameHeader } from './components'
import { type Events, machine } from './lib'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export const { meta, links } = generateHead({
  metadata,
  icon: <AppIcon padding={13} />,
  styles,
})

export default function App() {
  const [_, send, actor] = useMachine(machine)
  const { board, score, best, isWon, isLost } = useSelector(
    actor,
    (state) => ({
      ...state.context,
      isWon: state.matches('WON'),
      isLost: state.matches('LOST'),
    }),
    // if `updated` is not true, don't return new values for `board`, `score`, and `best`
    // saves us from unnecessary re-renders
    (_, next) => !next.updated,
  )

  const handle = useMemo<API<Events>>(() => {
    return {
      startGame: () => send({ type: 'game.start' }),
      continueGame: () => send({ type: 'game.continue' }),
      resetGame: () => send({ type: 'game.reset' }),
      startMove: (payload) => send({ type: 'move.start', payload }),
      endMove: () => send({ type: 'move.end' }),
    }
  }, [])

  useEffect(() => {
    // Avoid SSR `window` is undefined behavior (cause we're using localStorage)
    handle.startGame()
  }, [])

  return (
    <Container
      id={metadata.id}
      className='isolate flex flex-col items-center justify-between bg-[#F9F7EF] text-[#756452]'>
      <GameHeader
        onReset={handle.resetGame}
        className='z-1'
        score={score}
        best={best}
      />
      <GameBoard
        className='vsm:absolute inset-0 grow'
        board={board}
        onContinue={handle.continueGame}
        onReset={handle.resetGame}
        onStartMove={handle.startMove}
        onEndMove={handle.endMove}
        isWon={isWon}
        isLost={isLost}
      />
      <footer
        className={clsx(
          'vmd:block hidden h-[24svh]',
          'py-18 vxl:py-24 px-2',
          'text-center text-xs opacity-70',
        )}>
        <p>
          <Info
            aria-hidden
            className='mb-0.75 mr-1 inline size-4 fill-current'
          />
          <b>Swipe</b> or use <b>arrow keys</b> to merge tiles and make{' '}
          <b
            className={clsx(
              'inline-grid aspect-square place-items-center',
              'corner-squircle supports-squircle:rounded-full rounded-lg p-0.5',
              'bg-yellow-500 text-white',
            )}>
            2048
          </b>
        </p>
      </footer>
    </Container>
  )
}
