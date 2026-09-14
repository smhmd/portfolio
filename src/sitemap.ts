import { appIDs } from 'src/apps'
import { DOMAIN } from 'src/lib/env'

/** Generated from the app registry, so a new app indexes itself. */
export async function loader() {
  const paths = ['', ...appIDs]
  const lastmod = new Date().toISOString().slice(0, 10)

  const urls = paths
    .map((path) => {
      const isHome = path === ''
      return [
        '  <url>',
        `    <loc>${DOMAIN}/${path}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${isHome ? 'weekly' : 'monthly'}</changefreq>`,
        `    <priority>${isHome ? '1.0' : '0.8'}</priority>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
