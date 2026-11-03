import { toVideoEmbed } from '../lib/format'

export default function VideoEmbed({ url }) {
  const embed = toVideoEmbed(url)
  if (!url) return null
  if (!embed) {
    return (
      <p className="muted">
        Video: <a href={url} target="_blank" rel="noreferrer">{url}</a>
      </p>
    )
  }
  return (
    <div className="video">
      {embed.type === 'iframe' ? (
        <iframe
          src={embed.src}
          title="Embedded video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={embed.src} controls />
      )}
    </div>
  )
}
