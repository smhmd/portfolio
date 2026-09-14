import { IconFrame } from 'src/components'
import type { AppMetadata } from 'src/lib/types'

export const metadata: AppMetadata = {
  id: 'spinning-tops',
  name: 'Spinning Tops',
  summary: 'Battle spinning tops, last one wins',
  description:
    'Battle your spinning top against your friend. The last one standing in the ring wins. Fight against the AI or invite a friend.',
  type: 'game',
  Icon: AppIcon,
  dark: true,
}

export function AppIcon(props: React.ComponentProps<typeof IconFrame>) {
  return (
    <IconFrame fill='black' {...props}>
      <defs>
        <path
          id='spinning-tops-icon'
          d='M24.4 61.1a194.2 194.2 0 0 0 48.3.4l2.6-.3-13.5 5c-4.6 1.8-8 5.3-10 9.7l-2 3.8-1.8-3.8a19.7 19.7 0 0 0-10.2-9.7l-13.4-5.1ZM51.3 41.2c.4 0 .8.2 1.2.4L79 53.8a3.2 3.2 0 0 1 2 3.2c-1 .4-3.4 1.3-9.8 2a188 188 0 0 1-42.4 0c-6.5-.7-8.9-1.6-9.8-2a3.2 3.2 0 0 1 2-3.2l26.3-12.2.8-.3V31h-2v-6.5c0-2 1.5-3.5 3.4-3.5h.5c2 0 3.5 1.6 3.5 3.5V31h-2.2v10.2Z'
        />
      </defs>

      <g className='*:animate-paused *:animate-spin-wobble group-act/icon:*:animate-running *:origin-bottom'>
        <g style={{ animationDelay: '-0.13s' }}>
          <use
            href='#spinning-tops-icon'
            x='10'
            y='25'
            transform='rotate(-15 50 50) scale(0.55)'
            fill='#FE2C55'
          />
        </g>
        <g>
          <use
            href='#spinning-tops-icon'
            x='25'
            y='5'
            transform='rotate(15 50 50) scale(0.8)'
            fill='#A2F4FD'
          />
        </g>
      </g>
    </IconFrame>
  )
}
