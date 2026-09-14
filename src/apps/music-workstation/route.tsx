import { Container } from 'src/components'
import {
  ArrowLeft,
  ArrowRight,
  Backspace,
  Circle,
  Download,
  Grid,
  Hexagon,
  Pattern,
  Play,
  SpaceBar,
  Square,
} from 'src/icons'
import { SAMPLES_PREFETCH } from 'src/lib/samples'
import { generateHead } from 'src/lib/server'

import {
  Button,
  Frame,
  Keyboard,
  Parameter,
  Screen,
  Speaker,
  Volume,
} from './components'
import { api } from './lib'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export const { meta, links } = generateHead({
  metadata,
  icon: <AppIcon fill='transparent' padding={13} wip={false} />,
  styles,
  links: SAMPLES_PREFETCH,
})

export default function App() {
  return (
    <Container
      id={metadata.id}
      className='bg-linear-to-br relative from-zinc-700 to-zinc-950 text-black'>
      <div className='wp-[noise.png] pointer-events-none absolute inset-0 bg-repeat opacity-30 mix-blend-overlay' />

      <Frame>
        <Speaker />

        <Volume onChange={api.changeVolume} onMute={api.muteVolume} />
        <Screen />
        <Parameter
          variant='blue'
          onChange={(delta) => api.changeParameter({ id: 'blue', delta })}
        />
        <Parameter
          variant='brown'
          onChange={(delta) => api.changeParameter({ id: 'brown', delta })}
        />
        <Parameter
          variant='gray'
          onChange={(delta) => api.changeParameter({ id: 'gray', delta })}
        />
        <Parameter
          variant='orange'
          onChange={(delta) => api.changeParameter({ id: 'orange', delta })}
        />

        <Button
          text='Tombola Sequencer'
          icon={Hexagon}
          onClick={() => api.show('TOMBOLA')}
        />
        <Button
          text='Endless Sequencer'
          icon={Pattern}
          onClick={() => api.show('ENDLESS')}
        />
        <Button
          text='Pattern Sequencer'
          icon={Grid}
          onClick={() => api.show('PATTERN')}
        />
        <Button
          text='Left'
          icon={ArrowLeft}
          onClick={() => api.control('left')}
        />
        <Button
          text='Right'
          icon={ArrowRight}
          onClick={() => api.control('right')}
        />
        <Button text='Play' icon={Play} onClick={() => api.control('play')} />
        <Button text='Record' icon={Circle} onClick={api.record} />
        <Button text='Stop' icon={Square} onClick={api.stopRecording} />
        <Button text='Download' icon={Download} onClick={api.download} />
        <Button
          text='Space'
          icon={SpaceBar}
          onClick={() => api.control('space')}
        />
        <Button
          text='Delete'
          icon={Backspace}
          onClick={() => api.control('delete')}
        />
        <Button text='1' onClick={() => api.setSound('piano')} />
        <Button text='2' onClick={() => api.setSound('synth')} />
        <Button text='3' onClick={() => api.setSound('musicbox')} />
        <Keyboard />
        <Button
          text='4'
          className='row-start-9'
          onClick={() => api.setSound('triangle')}
        />
        <Button
          text='5'
          className='row-start-9'
          onClick={() => api.setSound('sine')}
        />
        <Button
          text='6'
          className='row-start-9'
          onClick={() => api.setSound('marimba')}
        />
        <Button text='7' onClick={() => api.setSound('kalimba')} />
        <Button text='8' onClick={() => api.setSound('harp')} />
        <Button text='9' onClick={() => api.setSound('recorder')} />
      </Frame>
    </Container>
  )
}
