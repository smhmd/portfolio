import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLoaderData } from 'react-router'

import { animate } from 'motion/react'
import type * as THREE from 'three'

import { useGlobals } from 'src/contexts'
import { useDebounced } from 'src/hooks'
import { setCookie } from 'src/lib/cookies'
import { interpolate, isEven } from 'src/lib/math'
import { gpuTier } from 'src/lib/utils'

import {
  getInstrument,
  InstrumentContext,
  type InstrumentContextType,
  optionConfig,
  type Options,
  OptionsContext,
  parseOptions,
  Recorder,
  RecorderContext,
  reverb,
  ROTATION_X,
  ROTATION_Y,
  ROTATION_Z,
  serializeOptions,
  useOptions,
  useRecorder,
} from '../lib'

// preload the default instrument
getInstrument(optionConfig.instrumentSound.init)

const recorder = new Recorder()

type OptionsProviderProps = React.PropsWithChildren

export function OptionsProvider({ children }: OptionsProviderProps) {
  const data = useLoaderData<string>()

  const [options, setOptions] = useState<Options>(() => parseOptions(data))

  useEffect(() => {
    setCookie('keylimba.options', serializeOptions(options))
  }, [options])

  useEffect(() => {
    reverb.setValue(options.reverb)
  }, [options.reverb])

  return (
    <OptionsContext.Provider
      value={{
        options,
        setOption({ option, value }) {
          setOptions((prev) => ({ ...prev, [option]: value }))
        },
      }}>
      {children}
    </OptionsContext.Provider>
  )
}

export function RecorderProvider({ children }: React.PropsWithChildren) {
  const recordingRef = useRef(false)

  function record() {
    recordingRef.current = true
    // recorder.start will be executed on the next playNote
    // to avoid having silence at the start
  }

  async function play() {
    recordingRef.current = false
    return await recorder.play()
  }

  function reset() {
    recordingRef.current = false
    recorder.reset()
  }

  useEffect(() => reset, [])

  return (
    <RecorderContext.Provider
      value={{
        recordingRef,
        record,
        play,
        reset,
        recorder,
      }}>
      {children}
    </RecorderContext.Provider>
  )
}

export function InstrumentProvider({ children }: React.PropsWithChildren) {
  const { options } = useOptions()
  const { recordingRef, recorder } = useRecorder()
  const [animation, setAnimation] = useState('1')
  const { isReducedMotion } = useGlobals()

  const mascotRef = useRef<THREE.Mesh>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // start loading samples as soon as the instrument is selected,
  // rather than on the first played note
  useEffect(() => {
    getInstrument(options.instrumentSound)
  }, [options.instrumentSound])

  const resetAnim = useDebounced(() => setAnimation('1'), 1000)
  const resetRotation = useDebounced(() => {
    if (!mascotRef.current) return
    animate(mascotRef.current.rotation, { x: 0, y: 0, z: 0 }, { duration: 0.4 })
  }, 1400)

  const playNote = useCallback<InstrumentContextType['playNote']>(
    ({ index, note, octave }) => {
      if (recordingRef.current) {
        recorder.record()
        recordingRef.current = false
      }
      getInstrument(options.instrumentSound).play(`${note}${octave}`)
      if (index < 0) return

      if (!mascotRef.current || !containerRef.current) return

      let rotation = interpolate(index, [0, options.tines - 1], [0, 1])
      rotation = isEven(index) ? rotation : -rotation

      animate(
        mascotRef.current.rotation,
        {
          x: -Math.abs(rotation * ROTATION_X),
          y: rotation * ROTATION_Y,
          z: rotation * ROTATION_Z,
        },
        { duration: 0.4 },
      )

      const bounce = animate(
        containerRef.current,
        { scaleY: [0.9, 1], scaleX: [1.1, 1] },
        {
          type: 'spring',
          stiffness: 200,
          damping: 4,
          mass: 0.4,
        },
      )
      if (gpuTier < 1 || isReducedMotion.current) bounce.complete()

      const newAnim = Math.min(
        6,
        Math.max(2, Math.floor(Math.abs(rotation) * 8)),
      ).toString()
      setAnimation(newAnim)

      resetAnim()
      resetRotation()
    },
    [options.tines, options.instrumentSound],
  )

  return (
    <InstrumentContext.Provider
      value={{
        mascotRef,
        containerRef,
        animation,
        playNote,
      }}>
      {children}
    </InstrumentContext.Provider>
  )
}
