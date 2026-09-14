import { IconFrame } from 'src/components'
import type { AppMetadata } from 'src/lib/types'

export const metadata: AppMetadata = {
  id: 'keylimba',
  name: 'Keylimba',
  summary: 'Play the kalimba in any key',
  description:
    'A playable kalimba in the browser. Choose a key and an instrument, play with the keyboard or the mouse, and record the result.',
  type: 'music',
  Icon: AppIcon,
  dark: true,
}

export function AppIcon(props: React.ComponentProps<typeof IconFrame>) {
  return (
    <IconFrame fill='#111' {...props}>
      <g>
        <path
          fill='#ea5659'
          d='M17.5 49c-2.1-1.2-2.2-3.8 0-5.5q3.4-2.4 7 0c2.1 1.4 1.7 3.4-1 5q-3.2 2.1-6 .5M75 44.5c-2.3 2.5 1.9 6.3 6 5.5 8.8-1.7-.8-11.2-6-5.5'
        />
        <path
          fill='#fff'
          d='M70 36.5c-2.7 0-4.8-4.6-3-6.5 1.4-1.5 3.4-1.2 5 .5 2.3 2.4 1 6-2 6M29 35c-1.4-1.2-1.5-3.5 0-5q2.3-2.2 4.5 0c2.8 2.8-1.5 7.7-4.5 5'
        />
        <path
          className='group-act/icon:scale-60 origin-center transform-gpu transition-transform duration-500'
          fill='#fff'
          d='M48.5 41c-5 1.2-9.5 5.5-10.5 9.5C36.2 57.6 41.7 71 50.5 71c18 0 17.1-34.6-2-30'
        />
      </g>
    </IconFrame>
  )
}
