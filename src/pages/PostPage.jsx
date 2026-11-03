import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPost, getReposts, upvotePost } from '../lib/api'
import { useApp } from '../lib/AppContext'
import { fullDate, timeAgo } from '../lib/format'
import FlagBadge from '../components/FlagBadge'
import SafeImage from '../components/SafeImage'
import VideoEmbed from '../components/VideoEmbed'
import Comments from '../components/Comments'
import Loader from '../components/Loader'
import PostCard from '../components/PostCard'

export default function PostPage() {
  const { id } = useParams()
  const { userId } = useApp()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [original, setOriginal] = useState(null)
  const [reposts, setReposts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bump, setBump] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setOriginal(null)
    ;(async () => {
      try {
        const p = await getPost(id)
        if (!active) return
        setPost(p)
        if (p) {
          const [orig, children] = await Promise.all([
            p.repost_of ? getPost(p.repost_of) : null,
            getReposts(p.id),
          ])
          if (!active) return
          setOriginal(orig)
          setReposts(children)
        }
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const upvote = async () => {
    setPost((p) => ({ ...p, upvotes: p.upvotes + 1 }))
    setBump((b) => b + 1)
    try {
      const count = await upvotePost(post.id, post.upvotes)
      setPost((p) => ({ ...p, upvotes: Math.max(p.upvotes, count) }))
    } catch (err) {
      setPost((p) => ({ ...p, upvotes: p.upvotes - 1 }))
      setError(err.message)
    }
  }

  const remove = async () => {
    if (!confirm('Delete this post and all of its comments? This cannot be undone.')) return
    try {
      await deletePost(post.id)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loader label="Pouring this post…" />
  if (!post) {
    return (
      <div className="page page--narrow card empty">
        <h2>Post not found</h2>
        <p className="muted">{error || 'It may have been deleted.'}</p>
        <Link to="/" className="btn btn--primary">Back to feed</Link>
      </div>
    )
  }

  const isOwner = post.author_id === userId

  return (
    <div className="page page--narrow">
      <Link to="/" className="back-link">← Back to feed</Link>

      <article className="card post">
        <header className="post__header">
          <p className="post__meta">
            <span className="post__id">#{post.id}</span>
            <time dateTime={post.created_at} title={fullDate(post.created_at)}>
              Posted {timeAgo(post.created_at)}
            </time>
            <span className={`author ${isOwner ? 'author--me' : ''}`}>
              by @{post.author_id || 'anonymous'}
              {isOwner && ' (you)'}
            </span>
            <FlagBadge flag={post.flag} />
          </p>
          <h1 className="post__title">{post.title}</h1>
        </header>

        {post.repost_of && (
          <div className="thread-ref">
            <span className="thread-ref__label">↪ Reposted from #{post.repost_of}</span>
            {original ? (
              <PostCard post={original} compact />
            ) : (
              <p className="muted small">The original post was deleted.</p>
            )}
          </div>
        )}

        {post.content && <p className="post__content">{post.content}</p>}
        <SafeImage src={post.image_url} alt={post.title} className="post__image" />
        <VideoEmbed url={post.video_url} />

        <footer className="post__actions">
          <button type="button" className="upvote" onClick={upvote} aria-label="Upvote this post">
            <span key={bump} className={`upvote__icon ${bump ? 'pop' : ''}`} aria-hidden="true">▲</span>
            <span className="upvote__count">{post.upvotes}</span>
            <span className="upvote__label">upvote{post.upvotes === 1 ? '' : 's'}</span>
          </button>
          <div className="post__actions-right">
            <Link to={`/create?repost=${post.id}`} className="btn btn--ghost btn--sm">↪ Repost</Link>
            {isOwner ? (
              <>
                <Link to={`/post/${post.id}/edit`} className="btn btn--ghost btn--sm">✎ Edit</Link>
                <button type="button" className="btn btn--danger btn--sm" onClick={remove}>🗑 Delete</button>
              </>
            ) : (
              <span className="muted small" title="Only the author can edit or delete">🔒 Author-only edit</span>
            )}
          </div>
        </footer>
        {error && <p className="error">{error}</p>}
      </article>

      {reposts.length > 0 && (
        <section className="thread">
          <h2>Thread · {reposts.length} repost{reposts.length === 1 ? '' : 's'}</h2>
          <div className="feed">
            {reposts.map((r) => (
              <PostCard key={r.id} post={r} compact />
            ))}
          </div>
        </section>
      )}

      <Comments postId={post.id} />
    </div>
  )
}
