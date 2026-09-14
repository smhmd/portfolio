import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

import { type Cue, DURATION, recue, VISEMES } from '../lib/lipsync'
import data from '../lib/visemes.json'
import { voice } from '../lib/voice'
import { SHEET_URL } from '../lib/voice'

/**
 * DEV(visemes) — the editor's own transport, not `voice`. An <audio> element
 * because `preservesPitch` time-stretches where `playbackRate` resamples, and
 * at 0.25x a resampled take drops two octaves. The playhead is raw
 * `currentTime`: cues name where a sound sits in the file, uncorrected.
 */

let el: HTMLAudioElement | null = null
let rate = 1

function element() {
  if (!el) {
    el = new Audio(SHEET_URL)
    el.preload = 'auto'
    el.preservesPitch = true // the whole reason this file exists
  }
  return el
}

const transport = {
  play(from: number, onended: () => void) {
    const a = element()
    a.playbackRate = rate
    a.currentTime = from
    a.onended = onended
    void a.play()
  },
  stop() {
    if (!el) return
    el.onended = null
    el.pause()
  },
  head() {
    return el && !el.paused ? el.currentTime : null
  },
  /** `currentTime` stays authoritative, so nothing needs re-anchoring. */
  setRate(r: number) {
    rate = r
    if (el) el.playbackRate = r
  },
}

/**
 * DEV(visemes) — scrub the take, edit the shape under the playhead, copy the
 * file out. Two seams only: `recue` in lipsync.ts and `seek` in voice.ts,
 * both marked; drop the import in route.tsx and it is gone.
 */

const PPS = 140 // pixels per second of timeline
const STEP = 0.01 // the nudge on an arrow key: 10 ms, the analysis grid
const KEYS = '123456789abcdef' // one per viseme, in the file's own order
const SPEEDS = [0.25, 0.5, 1] as const // slow enough to place a cue by ear
const hue = (i: number) => `hsl(${(i * 137) % 360} 65% 42%)`

const clamp = (lo: number, v: number, hi: number) =>
  Math.max(lo, Math.min(hi, v))
const indexAt = (cues: Cue[], t: number) => {
  for (let i = 0; i < cues.length; i++) if (t < cues[i].end) return i
  return cues.length - 1
}

/** Times are stored to the millisecond. */
const ms = (t: number) => Math.round(t * 1000) / 1000

/** One cue per line, so retiming is a one-line diff. */
function toJSON(cues: Cue[]) {
  const head = Object.entries(data)
    .filter(([k]) => k !== 'cues')
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n')

  const rows = cues
    .map(
      (c) =>
        `    { "start": ${ms(c.start)}, "end": ${ms(c.end)}, ` +
        `"viseme": ${JSON.stringify(c.viseme)}, "amp": ${c.amp} }`,
    )
    .join(',\n')

  return `{\n${head}\n  "cues": [\n${rows}\n  ]\n}\n`
}

export function VisemeEditor() {
  const [open, setOpen] = useState(false)
  const [cues, setCues] = useState<Cue[]>(data.cues)
  const [cur, setCur] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [speed, setSpeed] = useState<number>(1)

  const time = useRef(0) // the playhead, in sheet seconds
  const at = useRef(0) // index of the cue under it
  const live = useRef(cues) // cues, readable from callbacks that never rerun
  const rolling = useRef(false)
  const boundary = useRef<number | null>(null) // which edge a drag is moving

  const head = useRef<HTMLDivElement>(null)
  const clock = useRef<HTMLSpanElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  live.current = cues
  rolling.current = playing

  const edit = (next: Cue[]) => {
    live.current = next
    setCues(next)
    recue(next)
  }

  const seek = (t: number) => {
    time.current = clamp(0, t, DURATION)
    transport.stop()
    setPlaying(false)
  }

  const roll = (from: number) => {
    transport.play(from, () => setPlaying(false))
    setPlaying(true)
  }

  const toggle = () => (playing ? seek(time.current) : roll(time.current))

  const changeSpeed = (r: number) => {
    setSpeed(r)
    transport.setRate(r) // live; no restart, no blip
  }

  const assign = (viseme: string) =>
    edit(live.current.map((c, i) => (i === at.current ? { ...c, viseme } : c)))

  const split = () => {
    const t = time.current
    const i = at.current
    const c = live.current[i]
    if (!c || t < c.start + STEP || t > c.end - STEP) return
    edit([
      ...live.current.slice(0, i),
      { ...c, end: t },
      { ...c, start: t },
      ...live.current.slice(i + 1),
    ])
  }

  const mergeLeft = () => {
    const i = at.current
    if (i < 1) return
    const [a, b] = [live.current[i - 1], live.current[i]]
    edit([
      ...live.current.slice(0, i - 1),
      { ...a, end: b.end, amp: Math.max(a.amp, b.amp) },
      ...live.current.slice(i + 1),
    ])
  }

  const move = (i: number, t: number) => {
    const [a, b] = [live.current[i], live.current[i + 1]]
    if (!a || !b) return

    // Crossed bounds would invert a cue.
    const [lo, hi] = [a.start + STEP, b.end - STEP]
    if (lo > hi) return
    const to = clamp(lo, t, hi)
    edit(
      live.current.map((c, k) =>
        k === i ? { ...c, end: to } : k === i + 1 ? { ...c, start: to } : c,
      ),
    )
  }

  const copy = () => {
    void navigator.clipboard.writeText(toJSON(live.current)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  // ` toggles the panel; everything else only listens while it is up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault()
        return setOpen((o) => !o)
      }
      if (!open || e.metaKey || e.ctrlKey) return

      const k = KEYS.indexOf(e.key.toLowerCase())
      if (k >= 0 && k < VISEMES.length) return assign(VISEMES[k])

      const step = e.shiftKey ? STEP * 10 : STEP
      switch (e.key) {
        case ' ':
          e.preventDefault()
          return toggle()
        case 'ArrowLeft':
          e.preventDefault()
          return seek(time.current - step)
        case 'ArrowRight':
          e.preventDefault()
          return seek(time.current + step)
        case '[':
          return seek(live.current[Math.max(0, at.current - 1)].start)
        case ']':
          return seek(
            live.current[Math.min(live.current.length - 1, at.current + 1)]
              .start,
          )
        case 's':
          return split()
        case 'm':
          return mergeLeft()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    if (!open) return
    voice.stop() // the editor drives the sound from here on

    // A held viseme stacks on the idle clip, which already moves the jaw.

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)

      const t = transport.head() ?? time.current
      time.current = t
      voice.seek(t) // park the app's playhead so the face follows the editor

      if (head.current)
        head.current.style.transform = `translateX(${t * PPS}px)`
      if (clock.current) clock.current.textContent = t.toFixed(2)

      const i = indexAt(live.current, t)
      if (i !== at.current) {
        at.current = i
        setCur(i)
      }

      // Follow the playhead, but only while it is the one moving.
      const el = scroller.current
      if (el && rolling.current) {
        const x = t * PPS
        if (x < el.scrollLeft + 80 || x > el.scrollLeft + el.clientWidth - 80)
          el.scrollLeft = x - el.clientWidth / 2
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      transport.stop()
      voice.seek(null) // hand the playhead back to the audio clock
    }
  }, [open])

  const xToTime = (clientX: number) => {
    const r = track.current!.getBoundingClientRect()
    return clamp(0, (clientX - r.left) / PPS, DURATION)
  }

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className='z-100 text-xxs fixed bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-white/30 hover:text-white/80'>
        ` visemes
      </button>
    )

  const c = cues[cur]

  return (
    <div className='z-100 fixed inset-x-0 bottom-0 border-t border-white/15 bg-neutral-950/95 font-mono text-xs text-white/80 backdrop-blur'>
      <div className='flex items-center gap-3 px-3 py-2'>
        <button
          onClick={toggle}
          className='w-14 rounded bg-white/10 py-1 hover:bg-white/20'>
          {playing ? '❚❚' : '▶'}
        </button>

        <span className='tabular-nums text-white/50'>
          <span ref={clock}>0.00</span> / {DURATION.toFixed(2)}s
        </span>

        <div className='flex gap-1'>
          {SPEEDS.map((r) => (
            <button
              key={r}
              onClick={() => changeSpeed(r)}
              className={clsx(
                'rounded px-1.5 py-1 tabular-nums',
                r === speed
                  ? 'bg-white/25 font-bold text-white'
                  : 'bg-white/10 hover:bg-white/20',
              )}>
              {r}&times;
            </button>
          ))}
        </div>

        <span
          className='ml-2 rounded px-2 py-1 text-base font-bold'
          style={{ background: hue(VISEMES.indexOf(c.viseme)) }}>
          {c.viseme}
        </span>
        <span className='text-white/40'>
          cue {cur + 1}/{cues.length} · {c.start.toFixed(2)}–{c.end.toFixed(2)}s
          · amp {c.amp}
        </span>

        <div className='ml-auto flex gap-1.5'>
          <button
            onClick={split}
            className='rounded bg-white/10 px-2 py-1 hover:bg-white/20'>
            split <b className='text-white/40'>s</b>
          </button>
          <button
            onClick={mergeLeft}
            className='rounded bg-white/10 px-2 py-1 hover:bg-white/20'>
            merge ← <b className='text-white/40'>m</b>
          </button>
          <button
            onClick={() => edit(data.cues)}
            className='rounded bg-white/10 px-2 py-1 hover:bg-white/20'>
            reset
          </button>
          <button
            onClick={copy}
            className='rounded bg-amber-500/80 px-2 py-1 font-bold text-black hover:bg-amber-400'>
            {copied ? 'copied ✓' : 'copy visemes.json'}
          </button>
          <button
            onClick={() => setOpen(false)}
            className='rounded bg-white/10 px-2 py-1 hover:bg-white/20'>
            ✕
          </button>
        </div>
      </div>

      {/* The fifteen shapes. Clicking one retags the cue under the playhead. */}
      <div className='flex flex-wrap gap-1 px-3 pb-2'>
        {VISEMES.map((v, i) => (
          <button
            key={v}
            onClick={() => assign(v)}
            style={{ background: v === c.viseme ? hue(i) : undefined }}
            className={clsx(
              'rounded px-2 py-1 tabular-nums',
              v === c.viseme
                ? 'font-bold text-white'
                : 'bg-white/10 hover:bg-white/20',
            )}>
            {v} <b className='text-white/40'>{KEYS[i]}</b>
          </button>
        ))}
        <span className='self-center pl-2 text-white/30'>
          ␣ play · ←→ 10 ms (⇧ ×10) · [ ] cue · drag an edge to retime
        </span>
      </div>

      <div ref={scroller} className='overflow-x-auto border-t border-white/10'>
        <div
          ref={track}
          style={{ width: DURATION * PPS }}
          onPointerDown={(e) => {
            track.current?.setPointerCapture(e.pointerId)
            if (boundary.current === null) seek(xToTime(e.clientX))
          }}
          onPointerMove={(e) => {
            if (!e.buttons) return
            if (boundary.current !== null)
              move(boundary.current, xToTime(e.clientX))
            else seek(xToTime(e.clientX))
          }}
          onPointerUp={() => (boundary.current = null)}
          className='relative h-14 cursor-crosshair select-none'>
          {cues.map((cue, i) => (
            <div
              key={i}
              style={{
                left: cue.start * PPS,
                width: (cue.end - cue.start) * PPS,
                background: hue(VISEMES.indexOf(cue.viseme)),
                opacity: 0.35 + (cue.amp / 100) * 0.65,
              }}
              className={clsx(
                'text-xxs absolute inset-y-2 overflow-hidden rounded-sm leading-none text-white',
                i === cur && 'inset-y-0 ring-2 ring-white',
              )}>
              <span className='pl-1'>{cue.viseme}</span>
              {/* Only where there is room for it: at this zoom a brief cue
                  is a few pixels wide, and a handle across all of them would
                  turn every click on it into a drag. */}
              {i < cues.length - 1 && (cue.end - cue.start) * PPS > 14 && (
                <span
                  onPointerDown={() => (boundary.current = i)}
                  className='absolute inset-y-0 right-0 w-1.5 cursor-ew-resize bg-black/40 hover:bg-white'
                />
              )}
            </div>
          ))}

          <div
            ref={head}
            className='pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_6px_white]'
          />
        </div>
      </div>
    </div>
  )
}
