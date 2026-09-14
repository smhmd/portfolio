import { Slider } from '@base-ui/react/slider'
import clsx from 'clsx'

import type { Props } from 'src/lib/types'

import { Control } from './Control'

type NumberPickerProps = Props<
  typeof Slider.Root,
  {
    value: number
    name: string
    formatValue?(value: number): number | string
    onValueChange?(value: number): void
  }
>

export function NumberPicker({
  name,
  value,
  formatValue = (v) => v,
  onValueChange,
  ...props
}: NumberPickerProps) {
  return (
    <Control name={name} value={formatValue(value)}>
      <Slider.Root
        value={value}
        className='group flex w-full items-center justify-center gap-x-5 pl-3'
        onValueChange={(v) => {
          if (typeof v !== 'number') return
          onValueChange?.(v)
        }}
        {...props}>
        <Slider.Control className='flex grow items-center'>
          <Slider.Track className='h-6.5 w-full rounded-full bg-white/30'>
            <Slider.Thumb
              aria-label={name}
              className={clsx(
                'size-13 rounded-full bg-white',
                'shadow-inner-xl shadow-neutral-400',
                'cursor-grab active:cursor-grabbing',
                'hocus-within:shadow-none focus:outline-none',
              )}
            />
          </Slider.Track>
        </Slider.Control>
        <Slider.Value className='mb-0.75 min-w-[5ch] text-right font-semibold tabular-nums'>
          {([value]) => formatValue(Number(value))}
        </Slider.Value>
      </Slider.Root>
    </Control>
  )
}
