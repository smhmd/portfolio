import { IconFrame } from 'src/components'
import type { AppMetadata } from 'src/lib/types'

export const metadata: AppMetadata = {
  id: 'monument-valley',
  name: 'Monument Valley',
  summary: 'Meditative puzzle through impossible geometry',
  description:
    'A Monument Valley game tribute. A meditative puzzle through optical illusions and impossible geometry.',
  type: 'game',
  Icon: AppIcon,
  dark: true,
}

export function AppIcon(props: React.ComponentProps<typeof IconFrame>) {
  return (
    <IconFrame fill='url(#night)' {...props}>
      <defs>
        <linearGradient id='night' x2='0' y2='1'>
          <stop stopColor='#050510' />
          <stop offset='1' stopColor='#18233c' />
        </linearGradient>
      </defs>
      <g id='stars'>
        <path
          fill='#fff'
          d='M18.75 36a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-9-13a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9-3a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-3-10a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm35-6a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm10 9a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm15 3a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm4-9a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9 10a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-15 20a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z'
        />
        <path
          fill='#fff'
          fillOpacity='.5'
          d='M37.75 9a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm29-1a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm11 21a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-49 13a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z'
        />
        <path
          fill='#fff'
          fillOpacity='.3'
          d='M83.75 36a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-14 18a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm26-8a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-87 1a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z'
        />
      </g>

      <g id='platform'>
        <path fill='#586D82' d='M80 75 50 92 20 75l30-17z' />
        <path fill='#839498' d='M20 109V75l30 17v17z' />
        <path fill='#2C536B' d='M80 109V75L50 92v17z' />
      </g>

      <g id='ida'>
        <path
          stroke='#fdfbf9'
          strokeLinecap='round'
          strokeWidth='2.832'
          d='M49.297 59.738c.054 7.255-1.411 14.913 1.768 14.659m2.929-17.401c.053 7.254-1.411 14.912 1.768 14.658'
        />
        <path
          fill='#fdfbf9'
          d='M55.896 40.512c.149-1.386-4.653-2.622-5.21.246-.212 1.086-6.509 4.783-10.85 9.84-1.74 2.028-1.349 5.06.869 6.553 6.029 4.06 12.784 3.991 17.884 1.814 2.17-.926 2.767-3.546 1.827-5.711-2.309-5.323-4.64-11.632-4.52-12.742'
        />
        <path
          fill='#251805'
          d='M55.88 40.762c-.053 1.157-.702 1.332-2.685 1.257-1.982-.076-2.26-.916-2.508-1.257-.162-5.379 1.222-6.298 2.696-6.298s2.612 3.853 2.498 6.298'
        />
        <g className='group-act/icon:-rotate-20 origin-[52%_35%] transition-transform duration-500 ease-out'>
          <path
            fill='#251805'
            d='M53.674 39.261a7.567 7.567 0 1 0 0-15.134 7.567 7.567 0 0 0 0 15.134'
          />
          <path
            fill='#fdfbf9'
            d='M56.266 38.41c2.747 0 4.975-3.006 4.975-6.716s-2.228-6.716-4.975-6.716c-2.748 0-4.976 3.007-4.976 6.716s2.228 6.717 4.976 6.717'
          />
          <path
            fill='#fdfbf9'
            d='M55.464 24.337C53.922 23.697 37.79 23.327 31 23c0 0 9.413 9.37 16.787 13.448.182-8.034 4.599-12.242 7.677-12.111'
          />
        </g>
      </g>
    </IconFrame>
  )
}
