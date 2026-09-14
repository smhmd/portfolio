import { memo, useEffect, useReducer, useState } from 'react'

import { Checkbox } from '@base-ui/react/checkbox'
import { CheckboxGroup } from '@base-ui/react/checkbox-group'
import clsx from 'clsx'

import { Check } from 'src/icons'

import { FILE_LIMIT, formatBytes } from '../lib'
import { Alert } from './Alert'

type File = {
  length: number
  path: string[]
}

type FileSelectorProps = {
  files: File[]
  onChange(indexes: Set<number>): void
}

export const FileSelector = memo(({ files, onChange }: FileSelectorProps) => {
  const [selectedIndexes, setSelectedIndexes] = useState(new Set<number>())
  const [isOverLimit, bypassLimit] = useReducer(
    () => false,
    files.length > FILE_LIMIT,
  )

  useEffect(() => {
    onChange(selectedIndexes)
  }, [selectedIndexes])

  const isFullySelected = selectedIndexes.size === files.length

  function toggleFile(index: number) {
    if (isOverLimit) return

    setSelectedIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function toggleAll() {
    if (isOverLimit) return

    setSelectedIndexes((prev) =>
      prev.size === files.length ? new Set() : new Set(files.map((_, i) => i)),
    )
  }

  const filesCount = files.length.toLocaleString()

  return (
    <fieldset
      className={clsx(
        'animate-fade-in flex flex-col',
        isOverLimit && 'gap-y-2',
      )}>
      <div className='flex items-center justify-between gap-y-1'>
        <legend>
          <h4 className='inline text-xs font-medium text-orange-100'>Files </h4>
          <p
            className='text-xxs inline text-orange-200'
            aria-label={`${filesCount} files`}>
            ({filesCount} files)
          </p>
        </legend>
        {!isOverLimit && (
          <button
            onClick={toggleAll}
            className={clsx(
              'cursor-pointer text-xs text-orange-200 transition-colors hover:text-orange-100',
              '-mr-2 rounded-xl px-2 py-1 outline-none focus-visible:ring',
            )}>
            {isFullySelected ? 'Deselect All' : 'Select All'}
            <span className='sr-only'> files</span>
          </button>
        )}
      </div>
      {isOverLimit ? (
        <Alert
          severity='warning'
          message={`File selection is disabled for torrents with more than ${FILE_LIMIT.toLocaleString()} files.`}
          action={{
            label: 'Open Anyway',
            handler: bypassLimit,
          }}
        />
      ) : (
        <CheckboxGroup
          className='max-h-24 space-y-1 overflow-y-auto text-orange-300'
          aria-label='Select files to include in the magnet link'>
          {files.map((file, index) => {
            const isSelected = selectedIndexes.has(index)
            if (!file.path) return null
            const filePath = file.path.join('/')
            const bytes = formatBytes(file.length)

            return (
              <label
                key={index}
                className={clsx(
                  'relative flex w-full items-center gap-2 overflow-hidden',
                  'cursor-pointer rounded border px-2 py-1.5',
                  'transition-all duration-300',
                  isSelected
                    ? 'border-orange-300/30 bg-orange-300/10 text-orange-50'
                    : 'border-transparent text-orange-200 hover:bg-white/5',
                )}
                aria-label={`${filePath} of ${bytes} in size`}>
                {isSelected && (
                  <span className='shimmer pointer-events-none absolute inset-0' />
                )}
                <Checkbox.Root
                  checked={isSelected}
                  onCheckedChange={() => {
                    toggleFile(index)
                  }}
                  className={clsx(
                    'flex size-3.5 items-center justify-center',
                    'rounded border',
                    'transition-all duration-300',
                    'outline-none focus-visible:ring focus-visible:ring-offset-1 focus-visible:ring-offset-orange-800',
                    'rotate-90 border-orange-200',
                    'data-checked:rotate-0 data-checked:border-orange-300 data-checked:bg-orange-300',
                  )}>
                  <Checkbox.Indicator>
                    <Check aria-hidden className='size-2.5 fill-orange-800' />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div className='w-0 flex-1 text-left' aria-hidden>
                  <div className='truncate text-xs'>{filePath}</div>
                  <div className='text-xxs opacity-60'>{bytes}</div>
                </div>
              </label>
            )
          })}
        </CheckboxGroup>
      )}
    </fieldset>
  )
})

FileSelector.displayName = 'FileSelector'
