import type React from 'react'

import type { IconFrame } from 'src/components'

export type AppMetadata = {
  id: string
  name: string
  summary: string
  description: string
  type: 'demo' | 'game' | 'music' | 'utility'
  Icon(props: Props<typeof IconFrame>): React.JSX.Element
  dark: boolean
  wip?: boolean
}

export type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * Merges a React component's props with custom props, overriding conflicts.
 */
export type Props<C extends React.ElementType, P = object> = Omit<
  React.ComponentProps<C>,
  keyof P
> &
  P

/**
 * 'game.option.add.lazy' to "lazyAddOptionGame"
 */
type EventToFuncName<S extends string> = S extends `${infer H}.${infer T}`
  ? `${EventToFuncName<T>}${Capitalize<H>}`
  : S

/**
 * Generates a strongly-typed API object from an `Events` union.
 */
export type API<E extends { type: string; payload?: unknown }> = {
  [K in E['type'] as EventToFuncName<K>]: Extract<E, { type: K }> extends {
    payload: infer P
  }
    ? (payload: P) => void
    : () => void
}

/**
 * For accessibility-reasons,
 * imported SVGs require either aria-label or aria-labelledby
 * unless you pass role='presentation' or aria-hidden='true'
 */
type SVGPropsOverrides =
  | {
      'aria-label': string
    }
  | {
      'aria-labelledby': string
    }
  | {
      role: 'presentation'
    }
  | {
      'aria-hidden': true | 'true'
    }

export type SVGIcon = React.FunctionComponent<
  React.ComponentProps<'svg'> & {
    title?: string
    titleId?: string
    desc?: string
    descId?: string
  } & SVGPropsOverrides
>
