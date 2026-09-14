import { useEffect } from 'react'
import { Link } from 'react-router'

import clsx from 'clsx'

import { Chat, LinkExternal } from 'src/icons'
import type { SVGIcon } from 'src/lib/types'

import { type Choice } from '../lib/dialogue'
import { api, cursor } from '../lib/store'

/** Fixed-height, so the panel is the same shape at every node. */
const ROW = clsx(
  'cursor-[unset]',
  'pointer-events-auto flex h-11 w-full items-center gap-2.5 px-3',
  'bg-linear-to-r border-l-2 to-transparent text-left outline-none',
  'border-white/25 from-black/40 text-white/90 transition-colors duration-150',
  'hover:border-amber-400 hover:from-black/70 hover:text-amber-300',
  'focus-visible:border-amber-400 focus-visible:from-black/70 focus-visible:text-amber-300',
  'active:border-amber-400 active:text-amber-300',
)

/** Pulls the gaze's focal plane in while the pointer is over a choice. */
const hover = {
  onPointerEnter: () => void (cursor.onRow = true),
  onPointerLeave: () => void (cursor.onRow = false),
}

function Body({ text, icon: Icon = Chat }: { text: string; icon?: SVGIcon }) {
  return (
    <>
      <Icon aria-hidden className='size-4 shrink-0 fill-current opacity-60' />
      <span className='text-sm leading-snug'>{text}</span>
    </>
  )
}

export function Rows({
  choices,
  className,
}: {
  choices: Choice[]
  className?: string
}) {
  // Nothing fires a leave for an element that unmounts, and these do.
  useEffect(() => () => void (cursor.onRow = false), [])

  return (
    <ul
      className={clsx(
        'select-none font-serif transition-all duration-300 ease-out',
        'starting:translate-y-2 starting:opacity-0',
        className,
      )}>
      {choices.map((choice) => (
        <li key={choice.text} className='mb-1.5'>
          {'href' in choice ? (
            <a
              href={choice.href}
              target='_blank'
              rel='noopener noreferrer'
              className={ROW}
              {...hover}>
              <Body text={choice.text} icon={choice.icon ?? LinkExternal} />
            </a>
          ) : 'app' in choice ? (
            <Link
              to={`/${choice.app}`}
              prefetch='intent'
              className={ROW}
              {...hover}>
              <Body text={choice.text} icon={choice.icon} />
            </Link>
          ) : (
            <button
              type='button'
              onClick={() => api.goto(choice.node)}
              className={ROW}
              {...hover}>
              <Body text={choice.text} icon={choice.icon} />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
