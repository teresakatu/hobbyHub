import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FLAGS } from '../lib/constants'
import { getPost, uploadImage } from '../lib/api'
import { toVideoEmbed } from '../lib/format'
import SafeImage from './SafeImage'
import Loader from './Loader'

const EMPTY = { title: '', content: '', image_url: '', video_url: '', flag: '', repost_of: '' }

export default function PostForm({ initial, submitLabel, onSubmit, excludeRepostId, extraActions }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...clean(initial) }))
  const [imageMode, setImageMode] = useState(form.image_url.startsWith('data:') ? 'upload' : 'url')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [repostPreview, setRepostPreview] = useState({ status: 'idle', post: null })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  // Look up the referenced post as the user types its ID.
  useEffect(() => {
    const id = String(form.repost_of).trim()
    if (!id) {
      setRepostPreview({ status: 'idle', post: null })
      return
    }
    if (!/^\d+$/.test(id) || Number(id) === Number(excludeRepostId)) {
      setRepostPreview({ status: 'invalid', post: null })
      return
    }
    let active = true
    setRepostPreview({ status: 'loading', post: null })
    const t = setTimeout(async () => {
      try {
        const post = await getPost(id)
        if (active) setRepostPreview({ status: post ? 'found' : 'missing', post })
      } catch {
        if (active) setRepostPreview({ status: 'missing', post: null })
      }
    }, 300)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [form.repost_of, excludeRepostId])

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, image_url: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) return setError('Every post needs a title.')
    if (form.video_url.trim() && !toVideoEmbed(form.video_url)) {
      return setError('Video links must be YouTube, Vimeo, or a direct .mp4/.webm file.')
    }
    const repostId = String(form.repost_of).trim()
    if (repostId && Number(repostId) === Number(excludeRepostId)) {
      return setError("A post can't repost itself.")
    }
    setSaving(true)
    try {
      // Verify directly so a still-running preview lookup can't block submit.
      if (repostId && repostPreview.status !== 'found') {
        const exists = /^\d+$/.test(repostId) && (await getPost(repostId))
        if (!exists) {
          setSaving(false)
          return setError("The post ID you're reposting doesn't exist.")
        }
      }
      await onSubmit(form)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <label className="field">
        <span className="field__label">
          Title <span className="required">*</span>
        </span>
        <input
          type="text"
          value={form.title}
          onChange={set('title')}
          placeholder="What's brewing?"
          maxLength={150}
          required
          autoFocus
        />
      </label>

      <label className="field">
        <span className="field__label">Content <span className="optional">(optional)</span></span>
        <textarea
          rows={6}
          value={form.content}
          onChange={set('content')}
          placeholder="Share your recipe, question, or hot take…"
        />
      </label>

      <fieldset className="field">
        <legend className="field__label">Flag <span className="optional">(optional)</span></legend>
        <div className="chips">
          <button type="button" className={`chip ${!form.flag ? 'is-active' : ''}`} onClick={() => setForm((f) => ({ ...f, flag: '' }))}>
            None
          </button>
          {FLAGS.map((flag) => (
            <button
              key={flag}
              type="button"
              className={`chip chip--${flag.toLowerCase()} ${form.flag === flag ? 'is-active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, flag }))}
            >
              {flag}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <div className="field__label-row">
          <span className="field__label">Image <span className="optional">(optional)</span></span>
          <div className="segmented" role="tablist">
            <button type="button" role="tab" aria-selected={imageMode === 'url'} className={imageMode === 'url' ? 'is-active' : ''} onClick={() => setImageMode('url')}>
              Image URL
            </button>
            <button type="button" role="tab" aria-selected={imageMode === 'upload'} className={imageMode === 'upload' ? 'is-active' : ''} onClick={() => setImageMode('upload')}>
              Upload file
            </button>
          </div>
        </div>
        {imageMode === 'url' ? (
          <input
            key="url"
            type="url"
            value={form.image_url.startsWith('data:') ? '' : form.image_url}
            onChange={set('image_url')}
            placeholder="https://example.com/latte-art.jpg"
            aria-label="Image URL"
          />
        ) : (
          <input key="file" type="file" accept="image/*" onChange={onFile} aria-label="Upload image" />
        )}
        {uploading && <Loader small label="Uploading image…" />}
        {form.image_url && !uploading && (
          <div className="image-preview">
            <SafeImage key={form.image_url} src={form.image_url} alt="Preview" />
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setForm((f) => ({ ...f, image_url: '' }))}>
              Remove image
            </button>
          </div>
        )}
      </div>

      <label className="field">
        <span className="field__label">Video URL <span className="optional">(YouTube, Vimeo, or .mp4 — optional)</span></span>
        <input type="url" value={form.video_url} onChange={set('video_url')} placeholder="https://www.youtube.com/watch?v=…" />
      </label>

      <label className="field">
        <span className="field__label">Repost / reply to post ID <span className="optional">(optional)</span></span>
        <input
          type="text"
          inputMode="numeric"
          value={form.repost_of}
          onChange={set('repost_of')}
          placeholder="e.g. 4"
          className="input--short"
        />
        {repostPreview.status === 'loading' && <span className="muted small">Looking up post…</span>}
        {repostPreview.status === 'invalid' && <span className="error small">Enter the numeric ID of another post.</span>}
        {repostPreview.status === 'missing' && <span className="error small">No post with that ID.</span>}
        {repostPreview.status === 'found' && (
          <span className="small success">
            ↪ Threading onto <Link to={`/post/${repostPreview.post.id}`} target="_blank">#{repostPreview.post.id} “{repostPreview.post.title}”</Link>
          </span>
        )}
      </label>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="form__actions">
        {extraActions}
        <button type="submit" className="btn btn--primary" disabled={saving || uploading}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

function clean(initial = {}) {
  const out = {}
  for (const key of Object.keys(EMPTY)) {
    if (initial[key] !== null && initial[key] !== undefined) out[key] = String(initial[key])
  }
  return out
}
