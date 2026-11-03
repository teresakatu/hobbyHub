import { useState } from 'react'

export default function SafeImage({ src, alt, className, note = true }) {
  const [failed, setFailed] = useState(false)
  if (!src) return null
  if (failed) {
    return note ? <p className="muted image-error">Image couldn't be loaded.</p> : null
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
}
