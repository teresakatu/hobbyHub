import { useEffect, useState } from 'react'
import { addComment, deleteComment, getComments } from '../lib/api'
import { useApp } from '../lib/AppContext'
import { fullDate, timeAgo } from '../lib/format'
import Loader from './Loader'

export default function Comments({ postId }) {
  const { userId } = useApp()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    getComments(postId)
      .then((data) => active && setComments(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [postId])

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    setError('')
    try {
      const comment = await addComment(postId, text, userId)
      setComments((c) => [...c, comment])
      setText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setPosting(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
      await deleteComment(id)
      setComments((c) => c.filter((x) => x.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="comments" aria-labelledby="comments-heading">
      <h2 id="comments-heading">
        Comments {!loading && <span className="count">{comments.length}</span>}
      </h2>

      {loading ? (
        <Loader small label="Loading comments…" />
      ) : comments.length === 0 ? (
        <p className="muted">No comments yet. Start the conversation!</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <div className="comment__meta">
                <span className={`author ${c.author_id === userId ? 'author--me' : ''}`}>
                  @{c.author_id || 'anonymous'}
                  {c.author_id === userId && ' (you)'}
                </span>
                <time dateTime={c.created_at} title={fullDate(c.created_at)}>
                  {timeAgo(c.created_at)}
                </time>
                {c.author_id === userId && (
                  <button type="button" className="link-btn danger" onClick={() => remove(c.id)}>
                    Delete
                  </button>
                )}
              </div>
              <p className="comment__text">{c.content}</p>
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="new-comment">Leave a comment</label>
        <input
          id="new-comment"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Leave a comment…"
          maxLength={1000}
        />
        <button type="submit" className="btn btn--primary" disabled={posting || !text.trim()}>
          {posting ? 'Posting…' : 'Comment'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  )
}
