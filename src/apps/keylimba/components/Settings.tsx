import { Dialog } from '@base-ui/react/dialog'
import clsx from 'clsx'

import { ArrowDown } from 'src/icons'

import {
  colors,
  getInstrument,
  instruments,
  labels,
  optionConfig,
  tunings,
  useInstrument,
  useOptions,
} from '../lib'
import { MenuButton } from './Buttons'
import { Control } from './Control'
import { IconPicker } from './IconPicker'
import { NumberPicker } from './NumberPicker'
import { StylePicker } from './StylePicker'
import { TextPicker } from './TextPicker'

export function Settings() {
  const { options } = useOptions()

  return (
    <Dialog.Root>
      <Dialog.Trigger render={<MenuButton />} />
      <Dialog.Portal>
        <Dialog.Viewport>
          <Dialog.Popup
            className={clsx(
              'fixed inset-0',
              'flex flex-col',
              'font-quicksand text-white',
              'outline-none',
              'data-open:animate-slide-up',
              'data-closed:animate-slide-down',
              colors[options.color].bg,
              colors[options.color].img,
              'init:bg-cover',
            )}>
            <header className='relative flex items-center bg-[#111]/90'>
              <Dialog.Close
                className='absolute inset-0 cursor-pointer outline-none'
                aria-label='Close settings'
                title='Close'
              />
              <ArrowDown
                className='size-13 mx-2.5 my-3 fill-white'
                aria-hidden
              />
              <Dialog.Title className='text-3xl font-semibold'>
                Settings
              </Dialog.Title>
            </header>
            <Dialog.Description className='sr-only'>
              Edit sound and interface preferences.
            </Dialog.Description>
            <section className='bg-[#111]/98 flex h-full grow flex-col overflow-y-auto text-2xl tracking-wide outline-none'>
              <Controls />
              <footer className='mb-4 flex grow items-end justify-center text-lg'>
                <p>
                  Designed by{' '}
                  <a
                    className='underline-offset-3 underline decoration-white/60'
                    href='https://dvdfu.net'
                    target='_blank'
                    rel='noopener noreferrer'>
                    dvdfu
                  </a>
                </p>
              </footer>
            </section>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Controls() {
  const { options, setOption } = useOptions()
  const { playNote } = useInstrument()

  return (
    <ul className='flex flex-col text-white'>
      <li>
        <StylePicker
          name='Background'
          options={colors}
          value={options.color}
          onValueChange={(value) => {
            setOption({ option: 'color', value: Number(value) })
          }}
        />
      </li>
      <li>
        <TextPicker
          name='label type'
          options={labels}
          value={options.labelType}
          onValueChange={(value) => {
            setOption({ option: 'labelType', value: Number(value) })
          }}
        />
      </li>
      <li>
        <IconPicker
          name='instrument sound'
          options={instruments}
          value={options.instrumentSound}
          onValueChange={(value) => {
            const index = Number(value)
            const instrument = getInstrument(index)
            setOption({ option: 'instrumentSound', value: index })
            void instrument.ready.then(() =>
              instrument.play(
                `${tunings[options.tuning]}${options.tuning < 4 ? 3 : 4}`,
              ),
            )
          }}
        />
      </li>
      <li>
        <NumberPicker
          name='tines'
          min={optionConfig.tines.min}
          max={optionConfig.tines.max}
          value={options.tines}
          onValueChange={(value) => setOption({ option: 'tines', value })}
        />
      </li>
      <li>
        <NumberPicker
          name='tuning'
          min={optionConfig.tuning.min}
          max={optionConfig.tuning.max}
          value={options.tuning}
          formatValue={(value) => tunings[value]}
          onValueChange={(value) => {
            const octave = value < 4 ? 3 : 4
            playNote({ note: tunings[value], index: -1, octave })
            setOption({ option: 'tuning', value })
          }}
        />
      </li>
      <li>
        <NumberPicker
          name='reverb'
          min={optionConfig.reverb.min}
          max={optionConfig.reverb.max}
          step={0.1}
          value={options.reverb}
          formatValue={(value) => `${value * 100}%`}
          onValueChange={(value) => setOption({ option: 'reverb', value })}
        />
      </li>
      <li>
        <Control name='Keyboard Shortcuts'>
          <p className='text-2xl'>
            From <Shortcut value='X' /> to <Shortcut value=',' /> → base octave.
            <br />
            From <Shortcut value='D' /> to <Shortcut value='L' /> → higher
            octave.
            <br />
            From <Shortcut value='E' /> to <Shortcut value='O' /> → highest
            octave.
          </p>
        </Control>
      </li>
    </ul>
  )
}

function Shortcut({ value }: { value: string }) {
  return (
    <kbd className='rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-lg text-white'>
      {value}
    </kbd>
  )
}
