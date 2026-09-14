import { Link } from 'react-router'

import { type AppID, apps } from 'src/apps'
import type { Props } from 'src/lib/types'

import { GridIcon, iconClassName } from './GridIcon'

type GridItemProps = Props<
  typeof Link,
  {
    id: AppID
    to?: undefined
    // important to keep for animation stability with motion library
    ref?: React.Ref<HTMLLIElement>
  }
>

export function GridItem({ id, ref, ...props }: GridItemProps) {
  const { name, Icon, summary } = apps[id]
  return (
    <GridIcon ref={ref} name={name} title={summary}>
      <Link
        className='absolute inset-0 z-50 cursor-pointer outline-none'
        tabIndex={0}
        prefetch='intent'
        to={`/${id}`}
        {...props}
      />
      <Icon aria-hidden className={iconClassName} />
    </GridIcon>
  )
}
