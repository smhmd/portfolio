import { IconFrame } from 'src/components'
import type { AppMetadata } from 'src/lib/types'

export const metadata: AppMetadata = {
  id: '2048',
  name: '2048',
  summary: 'Merge tiles and reach 2048',
  description:
    'Play the classic 2048 game! Swipe or use arrow keys to merge tiles and make 2048.',
  type: 'game',
  Icon: AppIcon,
  dark: false,
}

export function AppIcon(props: React.ComponentProps<typeof IconFrame>) {
  return (
    <IconFrame fill='#E9C54C' {...props}>
      <g className='*:transition-transform'>
        <path
          className='group-act/icon:-translate-y-0.5'
          fill='#fff'
          d='M29.5 59.5H15V56c2.6-2.7 9.8-8.1 9-11.5-1-3.2-4.8-1.4-5.5 0L15 42c3.3-5 13.2-4 13.5 2.5 0 5.2-4.5 8.6-7.5 11.5h8.5z'
        />
        <path
          className='group-act/icon:-translate-y-0.5 delay-75'
          fill='#fff'
          d='M48 49.5c0 6-2.1 10.4-8 10.5-6.4 0-8-4.6-8-10.5S33.7 39 40 39c6 0 8 4.6 8 10.5m-11.5 0c0 2.3.2 6.9 3.5 7s3.5-4.8 3.5-7-.2-7-3.5-7-3.5 4.7-3.5 7'
        />
        <path
          className='group-act/icon:-translate-y-0.5 delay-150'
          fill='#fff'
          d='M66.5 56.5H64v3h-3.5v-3H50v-4l10-13h4V53h2.5zm-6-11.5L54 53h6.5z'
        />
        <path
          className='group-act/icon:-translate-y-0.5 delay-200'
          fill='#fff'
          d='M76.5 39c3 0 7 1.5 7 5 0 3-1.2 3.7-3.5 5q4 1 4 5.5c0 4-3.5 5.5-7.5 5.5S69 58.5 69 54.5q0-2.1 1-3.5 1.2-1.4 3-2c-2.1-1.3-3.5-2-3.5-5 0-3.5 4-5 7-5M73 54c0 2 1.5 2.5 3.5 2.5S80 56 80 54c0-2.5-3.5-3.5-3.5-3.5S73 51.5 73 54m3.5-11.5c-1.5 0-3 .5-3 2 0 2 3 3 3 3s3-1 3-3c0-1.5-1.5-2-3-2'
        />
      </g>
    </IconFrame>
  )
}
