import { type ErrorResponse } from 'react-router'

import clsx from 'clsx'

import { GITHUB_REPO, REPO_LINK } from 'src/lib/env'

type ErrorBoundaryProps = {
  error: ErrorResponse
}

function BSOD({ error }: ErrorBoundaryProps) {
  function handleCopy(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    navigator.clipboard.writeText(e.currentTarget.innerText)
  }

  return (
    <main
      role='alert'
      aria-labelledby='error-heading'
      className={clsx(
        'h-svh bg-purple-700 font-sans font-normal text-white',
        'flex items-center justify-center',
      )}>
      <div
        className={clsx(
          'flex flex-col justify-between px-4 sm:px-20',
          'max-h-180 h-[65vh] w-full max-w-7xl',
        )}>
        <section className='flex flex-col gap-y-8'>
          <span aria-hidden className='text-8xl sm:text-[12rem]'>
            {':('}
          </span>
          <div className='contents text-2xl sm:text-4xl'>
            <h1 id='error-heading'>
              We ran into a problem and need to reload.
            </h1>
            <p>{error.status}% complete.</p>
          </div>
        </section>

        <section
          aria-labelledby='support-paragraph'
          className='flex select-text gap-4 sm:gap-6'>
          <div className='text-xxs flex flex-col justify-around whitespace-pre sm:text-sm'>
            <p id='support-paragraph'>
              {
                'For more information about this issue and possible fixes, visit '
              }
              <a
                href={REPO_LINK + 'issues'}
                className='focus:outline-none focus-visible:underline'>
                github.com/{GITHUB_REPO}/issues
              </a>
            </p>

            <div aria-hidden>
              If you call a support person, give them this info:
              <br />
              Stop code: 0x{error.status} ({error.statusText})
            </div>
          </div>

          <figure
            className='-order-1 shrink-0'
            role='img'
            aria-label='QR code leading to help page'>
            <img
              src='/images/qr-code.svg'
              alt='QR code that links to help page'
              className='size-28 sm:size-36'
            />
            <figcaption className='sr-only'>
              A QR code that takes you somewhere.
            </figcaption>
          </figure>
        </section>

        <dialog
          aria-label='Developer error details'
          role='button'
          open={import.meta.env.DEV}
          onClick={(e) => {
            e.currentTarget.close()
          }}
          className='fixed inset-0 size-full cursor-pointer'>
          <div className='container mx-auto px-4 pt-16'>
            <p onClick={handleCopy}>
              {error.status}: {error.statusText}
            </p>
            {error.data && (
              <pre className='mt-4 h-[30lh] max-h-[70vh] w-full overflow-x-auto px-2'>
                <code onClick={handleCopy}>{error.data}</code>
              </pre>
            )}
          </div>
        </dialog>
      </div>
    </main>
  )
}

export default BSOD
