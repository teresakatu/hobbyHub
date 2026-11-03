import { Link } from 'react-router-dom'
import { timeAgo } from '../lib/format'
import FlagBadge from './FlagBadge'
import SafeImage from './SafeImage'

/**
 * Feed card. By default it shows only the creation time, title and upvotes.
 * When "show details" is enabled in settings it also shows flag, author,
 * a content preview and the image.
 */
export default function PostCard({ post, detailed = false, compact = false }) {
  return (
    <Link to={`/post/${post.id}`} className={`card post-card ${compact ? 'post-card--compact' : ''}`}>
      <div className="post-card__body">
        <p className="post-card__meta">
          Posted {timeAgo(post.created_at)}
          {detailed && post.author_id && <> · @{post.author_id}</>}
        </p>
        <h3 className="post-card__title">{post.title}</h3>
        {detailed && (
          <>
            {(post.flag || post.repost_of) && (
              <div className="post-card__tags">
                <FlagBadge flag={post.flag} />
                {post.repost_of && <span className="tag">↪ Repost of #{post.repost_of}</span>}
              </div>
            )}
            {post.content && <p className="post-card__excerpt">{post.content}</p>}
          </>
        )}
        <p className="post-card__votes">
          <span aria-hidden="true">▲</span> {post.upvotes} upvote{post.upvotes === 1 ? '' : 's'}
        </p>
      </div>
      {detailed && post.image_url && (
        <SafeImage src={post.image_url} alt="" className="post-card__image" note={false} />
      )}
    </Link>
  )
}
