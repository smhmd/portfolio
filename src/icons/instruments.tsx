import { SAMPLES } from 'src/lib/samples'
import type { SVGIcon } from 'src/lib/types'

/** Sprite glyphs — fetched once, nothing in the JS bundle. */
const icon = (id: string): SVGIcon =>
  function InstrumentIcon(props) {
    return (
      <svg viewBox='0 0 256 256' width='1em' height='1em' {...props}>
        <use href={`/images/instruments.svg#${id}`} />
      </svg>
    )
  }

export const instrumentIcons = Object.fromEntries(
  Object.keys(SAMPLES).map((name) => [name, icon(name)]),
) as Record<keyof typeof SAMPLES, SVGIcon>
