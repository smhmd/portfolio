import { memo, useId, useMemo } from 'react'

import { Accordion } from '@base-ui/react/accordion'
import clsx from 'clsx'

import { ArrowDown, Settings } from 'src/icons'

import { type Options, type TorrentObject } from '../lib'
import { FileSelector } from './FileSelector'
import { Toggle } from './Toggle'

interface AdvancedOptionsProps {
  torrentObject: TorrentObject
  options: Options
  onSetOption(payload: { option: keyof Options; value: boolean }): void
  onSelectFiles(payload: Set<number>): void
}

export const AdvancedOptions = memo(
  ({
    torrentObject,
    options,
    onSetOption,
    onSelectFiles,
  }: AdvancedOptionsProps) => {
    const id = useId()

    const {
      isNameDisabled,
      isLengthDisabled,
      isTrackerDisabled,
      isMultiTrackerDisabled,
    } = useMemo(() => {
      return {
        isNameDisabled: !torrentObject.info.name,
        isLengthDisabled:
          !('length' in torrentObject.info) && !('files' in torrentObject.info),
        isTrackerDisabled: !torrentObject.announce,
        isMultiTrackerDisabled: !torrentObject['announce-list']?.length,
      }
    }, [torrentObject])

    return (
      <section aria-labelledby={id} className='animate-fade-in'>
        <Accordion.Root>
          <Accordion.Item
            value='advanced-options'
            className='flex flex-col gap-1'>
            <Accordion.Header>
              <Accordion.Trigger
                className={clsx(
                  'group flex w-full items-center justify-between py-1.5 transition-all duration-75',
                  'text-orange-200 hover:text-orange-50',
                  'cursor-pointer outline-none',
                )}>
                <div className='flex items-center gap-1.5'>
                  <Settings
                    aria-hidden
                    className='size-3.5 fill-orange-200 transition duration-300 group-hover:rotate-180 group-hover:fill-orange-50'
                  />
                  <h3 id={id} className='text-xs font-medium'>
                    Advanced Options
                  </h3>
                </div>
                <ArrowDown
                  aria-hidden
                  className={clsx(
                    'size-3.5 fill-current transition duration-300',
                    'group-hocus:bg-white/10 rounded-full',
                    'group-data-panel-open:rotate-180',
                    'ease-[cubic-bezier(.85,0,.15,1)]',
                  )}
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel
              className={clsx('animate-accordion overflow-hidden')}>
              <div
                className={clsx(
                  'animate-fade-in rounded-lg bg-white/5 px-3 py-2',
                  'flex flex-col gap-2',
                )}>
                <fieldset className='space-y-2'>
                  <legend className='text-xs font-medium text-orange-100'>
                    <h4>Components</h4>
                    <span className='sr-only'>
                      {' '}
                      to include in the magnet URL
                    </span>
                  </legend>

                  <div className='flex flex-wrap justify-between gap-1.5 *:min-w-[140px] sm:grid sm:grid-cols-2 sm:grid-rows-2'>
                    <Toggle
                      label='Include Name'
                      checked={options.includeName}
                      onChange={(value) =>
                        onSetOption({ option: 'includeName', value })
                      }
                      disabled={isNameDisabled}
                    />
                    <Toggle
                      className='order-1'
                      label='Include Tracker'
                      checked={options.includeTracker}
                      onChange={(value) =>
                        onSetOption({ option: 'includeTracker', value })
                      }
                      disabled={isTrackerDisabled}
                    />
                    <Toggle
                      label='Include Length'
                      checked={options.includeLength}
                      onChange={(value) =>
                        onSetOption({ option: 'includeLength', value })
                      }
                      disabled={isLengthDisabled}
                    />
                    {options.includeTracker && (
                      <Toggle
                        className='order-2'
                        label='Multiple Trackers'
                        checked={options.includeMultiTrackers}
                        onChange={(value) =>
                          onSetOption({
                            option: 'includeMultiTrackers',
                            value,
                          })
                        }
                        disabled={isMultiTrackerDisabled}
                      />
                    )}
                  </div>
                </fieldset>

                {'files' in torrentObject.info && (
                  <FileSelector
                    key={torrentObject.info.name}
                    files={torrentObject.info.files}
                    onChange={onSelectFiles}
                  />
                )}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </section>
    )
  },
)

AdvancedOptions.displayName = 'AdvancedOptions'
