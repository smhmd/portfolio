import { instrumentIcons as icons } from 'src/icons'
import { Instrument, type InstrumentOptions } from 'src/lib/instrument'
import { SAMPLES } from 'src/lib/samples'
import type { SVGIcon } from 'src/lib/types'

type InstrumentConfig = InstrumentOptions & {
  label: string
  Icon: SVGIcon
}

/**
 * Indexed by the `instrumentSound` option.
 */
export const instruments: InstrumentConfig[] = Object.entries(SAMPLES).map(
  ([label, sample]) => ({
    label,
    Icon: icons[label as keyof typeof SAMPLES],
    ...sample,
  }),
)
/**
 * Instruments are created (and their samples loaded) lazily,
 * on first selection, then cached.
 * Indexed by the `instrumentSound` option.
 */
const cache = new Map<number, Instrument>()

export function getInstrument(index: number) {
  let instrument = cache.get(index)
  if (!instrument) {
    instrument = new Instrument(instruments[index])
    cache.set(index, instrument)
  }
  return instrument
}
