import { createTexture, svgToURL } from 'src/lib/graphics'

import doorSVG from '/images/door.svg?raw'

const door = createTexture(async (canvas, ctx) => {
  const img = new Image()
  img.src = svgToURL(doorSVG)
  await img.decode()

  // Firefox reports 0 for an SVG with no width/height of its own, which would
  // leave a 0x0 canvas and upload a black texture.
  canvas.width = img.width || 46
  canvas.height = img.height || 174
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
})

/** Radial shadow to have under walking characters */
const radial = createTexture((canvas, ctx) => {
  const size = 128
  const half = size / 2
  canvas.width = canvas.height = size

  const g = ctx.createRadialGradient(half, half, 0, half, half, half)

  g.addColorStop(0, 'rgba(0,0,0,0.4)')
  g.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
})

/** Gradient shadow that fades out */
const gradient = createTexture((canvas, ctx) => {
  const size = 64
  canvas.width = canvas.height = size

  // Horizontal:
  const gx = ctx.createLinearGradient(size, 0, 0, 0)
  gx.addColorStop(0.0, 'rgba(0,0,0,0.9)')
  gx.addColorStop(0.5, 'rgba(0,0,0,0.4)')
  gx.addColorStop(1.0, 'rgba(0,0,0,0.02)')
  ctx.fillStyle = gx
  ctx.fillRect(0, 0, size, size)

  // Vertical:
  const gy = ctx.createLinearGradient(0, 0, 0, size * 0.55)
  gy.addColorStop(0, 'rgba(0,0,0,0.1)')
  gy.addColorStop(1, 'rgba(0,0,0,0.05)')
  ctx.fillStyle = gy
  ctx.fillRect(0, 0, size, size)
})

export const textures = {
  door,
  radial,
  gradient,
}

export type Textures = keyof typeof textures
