import { useMemo } from 'react'

import clsx from 'clsx'

import { useGlobals } from 'src/contexts'
import { interpolate } from 'src/lib/math'
import type { Props } from 'src/lib/types'

import { getTines, MAX_COUNT, MIN_COUNT, tunings, useOptions } from '../lib'
import { Tine } from './Tine'

type TinesProps = Props<
  'div',
  {
    count?: number
    height?: number
    diff?: number
  }
>

export function Tines({ className, ...props }: TinesProps) {
  const { options } = useOptions()
  const { width } = useGlobals()

  const { tines, padding } = useMemo(() => {
    // calculate padding based on both the tines count and the screen width
    const padding = interpolate(
      options.tines,
      [MIN_COUNT, MAX_COUNT],
      [1, 0.2],
      'ease-out',
    ).toFixed(1)

    const key = tunings[options.tuning]
    // start with octave 3, unless we're above C major
    const octave = options.tuning < 4 ? 3 : 4

    const min = interpolate(width, [400, 1800], [84, 60])

    const tines = getTines(key, octave)
      .slice(0, options.tines)
      .map((tine, i) => {
        const height = interpolate(
          i,
          [options.tines, 0],
          [min, 100],
          (t) => Math.pow(t, 3) + Math.sin(i * 0.2) * 0.1,
        )
        return { ...tine, height }
      })

    return { tines, padding }
  }, [options.tuning, options.tines, width])

  return (
    <div
      role='group'
      aria-label='Kalimba keys'
      className={clsx('flex size-full justify-around', className)}
      {...props}>
      {tines.map((info, i) => (
        <Tine
          index={i}
          key={`${options.tuning}-${info.note}-${info.octave}`}
          padding={padding}
          {...info}
        />
      ))}
    </div>
  )
}
