import { memo, useRef, useState } from 'react'

import clsx from 'clsx'

import { Close, FilePresent, Upload } from 'src/icons'

import { fileToArrayBuffer, type TorrentObject } from '../lib'

const variants = {
  idle: 'border-orange-100/40 hover:border-orange-300/60',
  dragging: 'scale-102 animate-pulse-glow border-orange-300 bg-orange-300/10',
  error: 'scale-102 animate-pulse-glow border-red-400 bg-red-400/10 ',
}

type DropZoneProps = {
  torrentObject?: TorrentObject
  onUploadFile(payload: ArrayBuffer): void
  onReset(): void
}

export const DropZone = memo(
  ({ torrentObject, onUploadFile, onReset }: DropZoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragStatus, setDragStatus] = useState<keyof typeof variants>('idle')

    async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]
      if (file?.name.endsWith('.torrent')) {
        const arrayBuffer = await fileToArrayBuffer(file)
        onUploadFile(arrayBuffer)
      }
    }

    function handleReset() {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
        onReset()
      }
    }

    function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
      const files = [...e.dataTransfer.items]

      if (files.length === 1) {
        const { kind, type } = files[0]
        if (kind === 'file' && type === 'application/x-bittorrent') {
          return setDragStatus('dragging')
        }
      }
      setDragStatus('error')
    }

    function handleDragLeave() {
      setDragStatus('idle')
    }

    function handleDrop() {
      setDragStatus('idle')
    }

    return (
      <section
        aria-labelledby='dropzone-title'
        aria-describedby='dropzone-instructions'
        className={clsx(
          'group relative rounded-xl border-2 border-dashed transition duration-500',
          'focus-within:border-orange-300/40',
          variants[dragStatus],
          torrentObject && 'bg-orange-900/10',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <label>
          <span id='dropzone-title' className='sr-only'>
            Upload a torrent file
          </span>
          <input
            ref={fileInputRef}
            type='file'
            accept='.torrent'
            onChange={handleUploadFile}
            className='absolute inset-0 cursor-pointer opacity-0'
          />
        </label>

        <div
          className={clsx(
            'pointer-events-none text-center',
            torrentObject ? 'p-8' : 'px-8 py-14',
          )}>
          {!torrentObject ? (
            <div
              id='dropzone-instructions'
              className='animate-fade-in text-orange-300'>
              <Upload
                aria-hidden
                className={clsx(
                  'mx-auto mb-4 size-16 fill-current',
                  'transition-transform duration-300 group-hover:scale-110',
                )}
              />
              <h2 className='mb-2 text-lg font-medium text-white'>
                Drop your torrent file here
              </h2>
              <p className='text-sm'>or click to browse your files</p>
            </div>
          ) : (
            <div className='animate-fade-in flex gap-x-4'>
              <div
                aria-live='polite'
                className='flex min-w-0 flex-1 items-center gap-x-3'>
                <FilePresent
                  aria-hidden
                  className='size-8 shrink-0 fill-orange-300'
                />
                <span className='truncate text-orange-100'>
                  {torrentObject.info.name}
                </span>
              </div>
              <button
                onClick={handleReset}
                className={clsx(
                  'pointer-events-auto cursor-pointer outline-none',
                  'hocus:rotate-90 hocus:bg-white/10',
                  'shrink-0 rounded-full p-2 transition-all duration-300',
                )}
                aria-label='Clear selected file'>
                <Close aria-hidden className='size-5 fill-orange-200' />
              </button>
            </div>
          )}
        </div>
      </section>
    )
  },
)

DropZone.displayName = 'DropZone'
