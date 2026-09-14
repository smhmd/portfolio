import { IconFrame } from 'src/components'
import type { AppMetadata } from 'src/lib/types'

export const metadata: AppMetadata = {
  id: 'magnetize',
  name: 'Magnetize',
  summary: 'Turn torrent files into magnet links',
  description:
    'Convert a .torrent file into a magnet link. Entirely in the browser. Nothing is uploaded or leaves your machine.',
  type: 'utility',
  Icon: AppIcon,
  dark: false,
}

export function AppIcon(props: React.ComponentProps<typeof IconFrame>) {
  return (
    <IconFrame fill='url(#magnet-waves)' {...props}>
      <defs>
        <pattern
          id='magnet-waves'
          patternUnits='userSpaceOnUse'
          width='100'
          height='100'>
          <circle cx='65.5' cy='33.5' r='78' fill='#4b0000' />
          <circle cx='65.5' cy='33.5' r='64' fill='#5a0003' />
          <circle cx='65.5' cy='33.5' r='48' fill='#6b0014' />
          <circle cx='65.5' cy='33.5' r='32' fill='#7c0020' />
          <circle cx='65.5' cy='33.5' r='16' fill='#8d052c' />
        </pattern>
      </defs>
      <path
        fill='#BE1931'
        d='m66.68 60.17-9-7.42s-3.46 4.52-7.23 8.88c-2.87 3.32-8.8 3.2-12.14-.14-3.34-3.34-3.46-9.27-.14-12.14 4.36-3.77 8.88-7.23 8.88-7.23l-7.42-9s-7.4 5.68-9.55 7.85a20.38 20.38 0 0 0 0 28.75 20.38 20.38 0 0 0 28.76 0c2.17-2.15 7.84-9.55 7.84-9.55Z'
      />
      <path
        fill='#CCD6DD'
        d='m46.61 29.32 5.5 6.7a1.5 1.5 0 0 1-.2 2.1l-4.86 4.01-7.42-9 4.86-4a1.5 1.5 0 0 1 2.11.2h.01Zm17.2 18.37 6.68 5.53a1.5 1.5 0 0 1 .2 2.11l-4 4.86-9-7.44 4.01-4.86a1.5 1.5 0 0 1 2.11-.2Z'
      />
      <path
        className='group-act/icon:scale-115 group-act/icon:brightness-115 origin-center duration-300'
        fill='#FFAC33'
        d='M58.5 24.76c.17-.18 0-.48-.24-.42l-7.4 1.81a.3.3 0 0 0-.14.5l2.42 2.55-2.68 2.75c-.18.18 0 .48.24.42l7.4-1.8a.3.3 0 0 0 .13-.5l-2.42-2.56 2.7-2.75ZM75 40.53c.13-.2-.09-.47-.32-.37l-6.92 3.17a.3.3 0 0 0-.05.51l2.86 2.05-2.12 3.21c-.14.21.08.47.31.37l6.92-3.17a.3.3 0 0 0 .05-.5l-2.85-2.06 2.12-3.2Z'
      />
    </IconFrame>
  )
}
