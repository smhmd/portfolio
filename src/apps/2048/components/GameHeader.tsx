import { memo } from 'react'

import clsx from 'clsx'

import { Replay } from 'src/icons'

import { Score } from './Score'

type GameHeaderProps = {
  onReset(): void
  score: number
  best: number
} & React.ComponentProps<'header'>

export const GameHeader = memo(
  ({ score, best, onReset, className, ...rest }: GameHeaderProps) => (
    <header
      className={clsx(
        'max-w-440 w-full',
        'l:grid-rows-1 grid grid-cols-3 grid-rows-2 items-center',
        'vlg:px-8 l:lg:pt-4 gap-y-2 px-2 py-2 lg:xl:p-10',
        className,
      )}
      {...rest}>
      <h1
        className={clsx(
          'text-5xl font-black',
          'p:col-start-2 p:place-self-center vlg:place-self-auto vlg:col-start-1 col-start-1 place-self-auto',
        )}>
        2048
      </h1>

      <Score className='p:col-span-3' score={score} best={best} />

      <button
        aria-label='New Game'
        className={clsx(
          'justify-self-end rounded-lg',
          'col-start-3 row-start-1',
        )}
        onClick={onReset}>
        <Replay aria-hidden className='fill-current sm:hidden' />
        <span
          aria-hidden
          className={clsx(
            'hidden rounded-lg sm:block',
            'bg-board text-base text-white',
            'shadow-lg shadow-yellow-900/10',
            'cursor-pointer whitespace-nowrap',
            'px-4 py-2',
          )}>
          New Game
        </span>
      </button>
    </header>
  ),
)

GameHeader.displayName = 'GameHeader'
