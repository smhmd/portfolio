import { useCallback, useEffect, useRef } from 'react'

import clsx from 'clsx'

import { type Tally, useDice, useScore } from '../lib'
import { BACKGROUNDS, type Variant } from '../lib'
import { DiceButton } from './DiceButton'

const BACK_IN = 'cubic-bezier(0.36, 0, 0.66, -0.56)' // motion's "backIn"

type Point = { x: number; y: number }

type ScoreProps = {
  tally: Tally
  target(): Point
  onComplete(): void
}

function Score({ tally, target, onComplete }: ScoreProps) {
  const ref = useRef<HTMLSpanElement>(null!)

  // Runs once: the number spawns at the die and flies to the counter.
  useEffect(() => {
    const el = ref.current
    const { x, y } = target()
    const dx = x - tally.x
    const dy = y - tally.y

    const anim = el.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        {
          transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0.5)`,
          opacity: 0.2,
        },
      ],
      { duration: 500, easing: BACK_IN, fill: 'forwards' },
    )

    anim.addEventListener('finish', onComplete, { once: true })
    return () => anim.cancel()
  }, [])

  return (
    <span
      aria-hidden
      ref={ref}
      className='font-unifraktur fixed text-5xl text-red-50 will-change-transform'
      style={{ left: tally.x, top: tally.y }}>
      {tally.value}
    </span>
  )
}

export function Controls() {
  const { dice, add, clear, reroll } = useDice()
  const { results, tally } = useScore()

  const counterRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<Point | null>(null)

  const target = useCallback((): Point => {
    if (!targetRef.current && counterRef.current) {
      const r = counterRef.current.getBoundingClientRect()
      targetRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    return targetRef.current ?? { x: 0, y: 0 }
  }, [])

  useEffect(() => {
    const invalidate = () => (targetRef.current = null)
    window.addEventListener('resize', invalidate)
    return () => window.removeEventListener('resize', invalidate)
  }, [])

  let total = 0
  const tallies: Tally[] = []

  for (const id in results) {
    const r = results[id]
    if (r.landed) total += r.value
    else tallies.push({ id, ...r })
  }

  const visible = tallies.length > 0 || total > 0
  const hasDice = dice.length > 0

  return (
    <section
      className={clsx(
        'font-unifraktur isolate',
        'pointer-events-none fixed inset-0',
        'flex flex-col justify-between',
        'p:pb-16 px-4 pb-8 pt-6 sm:px-10',
      )}>
      <div
        ref={counterRef}
        className={clsx(
          'text-center text-5xl text-red-50',
          'transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0',
        )}>
        <span
          aria-live='polite'
          className={clsx(
            'bg-black/50 px-10',
            'mask-x-from-70% mask-x-to-90%',
          )}>
          <span className='sr-only'>Total: </span>
          {total}
        </span>
      </div>

      <div
        className={clsx(
          'mx-auto grid w-full gap-4',
          'max-w-lg',
          'grid-cols-5',
          // A compact tier of its own: the wider grid arrives early, but
          // tighter and narrower, so the row stops eating the screen.
          'xs:max-w-md xs:grid-cols-7 xs:gap-2',
          'sm:max-w-lg sm:gap-4',
          'md:max-w-2xl md:grid-cols-11',
        )}>
        <DiceButton
          className='xs:col-span-2'
          label='Clear'
          color='#ffffff'
          onClick={clear}
          disabled={!hasDice}
        />

        {Object.entries(BACKGROUNDS).map(([sides, color]) => (
          <DiceButton
            key={sides}
            className='xs:row-start-2 aspect-square md:row-auto'
            label={`D${sides}`}
            color={color}
            onClick={() => add(Number(sides) as Variant)}
          />
        ))}

        <DiceButton
          className='col-span-2 -col-end-1'
          label='Roll'
          color='#2f6f3f'
          onClick={reroll}
          disabled={!hasDice}
        />
      </div>

      {/* Fixed → ignores flex layout; sibling of the counter so the counter's
          opacity transition doesn't group/repaint the flying numbers. */}
      {tallies.map((t) => (
        <Score
          key={t.id}
          tally={t}
          target={target}
          onComplete={() => tally(t.id)}
        />
      ))}
    </section>
  )
}
