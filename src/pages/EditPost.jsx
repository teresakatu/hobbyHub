import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPost, updatePost } from '../lib/api'
import { useApp } from '../lib/AppContext'
import PostForm from '../components/PostForm'
import Loader from '../components/Loader'

export default function EditPost() {
  const { id } = useParams()
  const { userId } = useApp()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    getPost(id)
      .then((p) => active && setPost(p))
      .catch(() => active && setPost(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <Loader label="Loading post…" />
  if (!post) {
    return (
      <div className="page page--narrow card empty">
        <h2>Post not found</h2>
        <Link to="/" className="btn btn--primary">Back to feed</Link>
      </div>
    )
  }
  if (post.author_id !== userId) {
    return (
      <div className="page page--narrow card empty">
        <h2>🔒 Only the author can edit this post</h2>
        <p className="muted">
          This post belongs to @{post.author_id || 'anonymous'}. You're browsing as @{userId}.
        </p>
        <Link to={`/post/${id}`} className="btn btn--primary">Back to post</Link>
      </div>
    )
  }

  const onSubmit = async (form) => {
    await updatePost(id, form)
    navigate(`/post/${id}`)
  }

  const onDelete = async () => {
    if (!confirm('Delete this post and all of its comments? This cannot be undone.')) return
    setDeleting(true)
    await deletePost(id)
    navigate('/')
  }

  return (
    <div className="page page--narrow">
      <Link to={`/post/${id}`} className="back-link">← Back to post</Link>
      <h1>Update post</h1>
      <PostForm
        initial={post}
        submitLabel="Update Post"
        onSubmit={onSubmit}
        excludeRepostId={post.id}
        extraActions={
          <button type="button" className="btn btn--danger" onClick={onDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete Post'}
          </button>
        }
      />
    </div>
  )
}
