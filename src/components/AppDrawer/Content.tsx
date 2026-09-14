import { useRef } from 'react'

import { Dialog } from '@base-ui/react/dialog'
import clsx from 'clsx'

import { appIDs } from 'src/apps'
import { Search } from 'src/icons'
import { useFuzzySearch } from 'src/hooks'
import type { Props } from 'src/lib/types'

import { Grid } from './Grid'

type ContentProps = { onAppClick(): void }

export function Content({ onAppClick }: ContentProps) {
  const { query, filter, setQuery } = useFuzzySearch(appIDs)
  const popup = useRef<HTMLDivElement>(null)

  return (
    <Dialog.Popup
      // force focus the whole group instead of first element.
      ref={popup}
      initialFocus={popup}
      className={clsx(
        'pointer-events-none fixed inset-0 flex cursor-auto flex-col items-center p-2 sm:p-8',
        'data-open:animate-fade-scale-up data-closed:animate-fade-scale-down',
      )}>
      <Dialog.Title className='sr-only'>Applications</Dialog.Title>
      <Dialog.Description className='sr-only'>
        Navigate all applications
      </Dialog.Description>

      <SearchInput
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
      <Grid filter={query ? filter : undefined} onAppClick={onAppClick} />
    </Dialog.Popup>
  )
}

type SearchInputProps = Props<'input'>

function SearchInput({ value, onChange, ...props }: SearchInputProps) {
  /* Allows us to clear input without dismissing dialog */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape' && value) {
      e.stopPropagation()
    }
  }

  return (
    <form
      // onClick={(e) => e.stopPropagation()}
      role='search'
      aria-label='Search Applications'>
      <label
        className={clsx(
          'pointer-events-auto',
          'relative mb-4 flex w-full rounded-lg',
          'border border-white/20 bg-white/10 backdrop-blur-xl transition-colors',
          'focus-within:border-white/40 sm:mb-8',
        )}>
        <span className='sr-only'>Search</span>
        <input
          id='app-search'
          type='search'
          placeholder='Search...'
          autoComplete='off'
          autoCorrect='off'
          spellCheck='false'
          aria-controls='applications-navigation-list'
          className='text-xxs h-6 w-full px-2 py-1 capitalize text-white placeholder-white/50 focus:outline-none'
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
        <span className='mr-1 mt-px flex items-center justify-center'>
          <Search aria-hidden className='size-4 fill-white/50' />
        </span>
      </label>
    </form>
  )
}
