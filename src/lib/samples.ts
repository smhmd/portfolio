import type { InstrumentOptions } from './instrument'

export const SAMPLES = {
  kalimba: {
    samples: { 261.1: '/sounds/music/Kalimba262.ogg' },
  },
  marimba: {
    samples: {
      262: '/sounds/music/Marimba262.ogg',
      521: '/sounds/music/Marimba521.ogg',
      1047: '/sounds/music/Marimba1047.ogg',
    },
  },
  piano: {
    samples: {
      262: '/sounds/music/Piano262.ogg',
      523: '/sounds/music/Piano523.ogg',
      1048: '/sounds/music/Piano1048.ogg',
    },
  },
  xylophone: {
    samples: {
      527: '/sounds/music/Xylophone527.ogg',
      1056: '/sounds/music/Xylophone1056.ogg',
      2113: '/sounds/music/Xylophone2113.ogg',
    },
    shift: 1,
  },
  musicbox: {
    samples: {
      519: '/sounds/music/MusicBox519.ogg',
      1034: '/sounds/music/MusicBox1034.ogg',
      2082: '/sounds/music/MusicBox2082.ogg',
    },
    shift: 1,
  },
  harp: {
    samples: {
      260: '/sounds/music/Harp260.ogg',
      520: '/sounds/music/Harp520.ogg',
      1042: '/sounds/music/Harp1042.ogg',
    },
  },
  recorder: {
    samples: {
      588: '/sounds/music/Recorder588.ogg',
      1050: '/sounds/music/Recorder1050.ogg',
      1573: '/sounds/music/Recorder1573.ogg',
    },
    shift: 1,
  },
  triangle: {
    samples: {
      261: '/sounds/music/Triangle261.ogg',
      523: '/sounds/music/Triangle523.ogg',
      1046: '/sounds/music/Triangle1046.ogg',
    },
  },
  sine: {
    samples: {
      261: '/sounds/music/Sine261.ogg',
      524: '/sounds/music/Sine524.ogg',
      1046: '/sounds/music/Sine1046.ogg',
    },
  },
  synth: {
    samples: {
      264: '/sounds/music/Synth264.ogg',
      527: '/sounds/music/Synth527.ogg',
      1047: '/sounds/music/Synth1047.ogg',
    },
  },
} satisfies Record<string, InstrumentOptions>

export const SAMPLES_PREFETCH = Object.values(SAMPLES).flatMap(({ samples }) =>
  Object.values(samples).map((href) => ({
    rel: 'prefetch',
    as: 'audio',
    href,
  })),
)
