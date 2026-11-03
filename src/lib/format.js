const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

export function timeAgo(iso) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  for (const [unit, size] of UNITS) {
    const n = Math.floor(seconds / size)
    if (n >= 1) return `${n} ${unit}${n > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export function fullDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/** Turns a YouTube / Vimeo / direct video link into something we can embed. */
export function toVideoEmbed(raw) {
  if (!raw) return null
  let url
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\.|^m\./, '')
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id =
      url.searchParams.get('v') ||
      url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)?.[1]
    if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` }
  }
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1)
    if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` }
  }
  if (host === 'vimeo.com') {
    const id = url.pathname.match(/^\/(\d+)/)?.[1]
    if (id) return { type: 'iframe', src: `https://player.vimeo.com/video/${id}` }
  }
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) return { type: 'file', src: url.href }
  return null
}
