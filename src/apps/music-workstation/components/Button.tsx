import clsx from 'clsx'

import type { SVGIcon } from 'src/lib/types'

import { Base } from './Base'

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'middle' | 'vertical' | 'right' | 'left' | 'horizontal'
  black?: boolean
  text?: string
  /** An SVG glyph drawn with `currentColor` and sized in `em`, so it
   * inherits the label's color and scale (see icons.tsx). */
  icon?: SVGIcon
}

const variants = {
  base: {
    middle: 'col-span-2 row-span-2 aspect-square',
    right: 'col-span-3 row-span-2',
    left: 'col-span-3 row-span-2',
    vertical: 'col-span-2 row-span-4',
    horizontal: 'col-span-4 row-span-2',
  },
  bump: {
    middle: 'bg-bump inset-x-1.25 aspect-square',
    right: 'bg-bump right-1.25 aspect-square',
    left: 'bg-bump left-1.25 aspect-square',
    vertical: 'bg-bump-lg inset-x-1.25',
    horizontal: 'bg-bump-lg inset-x-1.25',
  },
  top: {
    middle: 'bg-radial-border inset-x-2.5 aspect-square',
    right: 'bg-radial-border right-2.5 aspect-square',
    left: 'bg-radial-border left-2.5 aspect-square',
    vertical: 'bg-radial-lg-border inset-x-2.5',
    horizontal: 'bg-radial-lg-border inset-x-2.5',
  },
  label: {
    middle: undefined,
    right: 'justify-end pr-7',
    left: 'justify-start pl-7',
    vertical: undefined,
    horizontal: undefined,
  },
} as const

export function Button({
  variant = 'middle',
  black,
  text,
  icon: Icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <Base className={clsx(variants.base[variant], className)}>
      <button
        className={clsx(
          'z-2 init:justify-center inline-flex cursor-pointer items-center',
          variants.label[variant],
        )}
        {...props}>
        {Icon ? <Icon aria-hidden /> : null}
        <span className={clsx(Icon && 'sr-only')}>{text}</span>
      </button>
      <div
        data-name='button-bump'
        className={clsx(
          'blur-px inset-y-1.25 absolute rounded-full',
          variants.bump[variant],
        )}
      />
      <div
        className={clsx(
          'bg-radial-border rounded-full p-px',
          'shadow-button z-1 absolute inset-y-2.5',
          variants.top[variant],
        )}>
        <div className='bg-button size-full rounded-full p-0.5'>
          {black ? (
            <div className='bg-button-top size-full rounded-full' />
          ) : null}
        </div>
      </div>
    </Base>
  )
}
