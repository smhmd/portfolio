import clsx from 'clsx'
import type { LoaderFunction } from 'react-router'

import { Container } from 'src/components'
import { getCookie } from 'src/lib/cookies'
import { SAMPLES_PREFETCH } from 'src/lib/samples'
import { generateHead } from 'src/lib/server'

import {
  InstrumentProvider,
  OptionsProvider,
  Panel,
  RecorderProvider,
  Stage,
  Tines,
} from './components'
import { colors, useOptions } from './lib'
import { AppIcon, metadata } from './metadata'

export const { meta, links } = generateHead({
  metadata,
  icon: <AppIcon padding={8} />,
  font: 'Quicksand:wght@300..700',
  links: SAMPLES_PREFETCH,
})

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('Cookie') ?? ''
  return getCookie('keylimba.options', cookie)
}

export default function App() {
  return (
    <OptionsProvider>
      <RecorderProvider>
        <InstrumentProvider>
          <Content />
        </InstrumentProvider>
      </RecorderProvider>
    </OptionsProvider>
  )
}

function Content() {
  const { options } = useOptions()

  return (
    <Container
      id={metadata.id}
      className={clsx(
        'font-quicksand scrollbar-white font-bold',
        colors[options.color].img,
        'init:bg-cover',
      )}>
      <div
        className={clsx(
          'relative flex h-full flex-col items-center justify-between',
          'max-w-440 mx-auto',
          'overflow-hidden',
        )}>
        <Tines className='h-3/5' />
        <Stage className='h-2/5 grow' />
        <Panel className='absolute bottom-0' />
      </div>
    </Container>
  )
}
