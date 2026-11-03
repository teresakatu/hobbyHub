import { useNavigate, useSearchParams } from 'react-router-dom'
import { createPost } from '../lib/api'
import { useApp } from '../lib/AppContext'
import PostForm from '../components/PostForm'

export default function CreatePost() {
  const { userId } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const repostOf = params.get('repost') || ''

  const onSubmit = async (form) => {
    const post = await createPost(form, userId)
    navigate(`/post/${post.id}`)
  }

  return (
    <div className="page page--narrow">
      <h1>{repostOf ? `Repost #${repostOf}` : 'Start a discussion'}</h1>
      <p className="muted lead">Posting as <strong>@{userId}</strong></p>
      <PostForm
        key={repostOf}
        initial={{ repost_of: repostOf }}
        submitLabel="Create Post"
        onSubmit={onSubmit}
      />
    </div>
  )
}
