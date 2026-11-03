import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../lib/api'
import { useApp } from '../lib/AppContext'
import { FLAGS, SORT_OPTIONS } from '../lib/constants'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'

export default function Home() {
  const { search, setSearch, showDetails } = useApp()
  const [orderBy, setOrderBy] = useState('created_at')
  const [flag, setFlag] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    // Small debounce so we don't query on every keystroke.
    const t = setTimeout(() => {
      getPosts({ orderBy, search, flag })
        .then((data) => active && setPosts(data))
        .catch((err) => active && setError(err.message))
        .finally(() => active && setLoading(false))
    }, search ? 250 : 0)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [orderBy, search, flag])

  const filtersActive = search || flag

  return (
    <div className="page">
      <section className="hero">
        <h1>
          Fresh from the <span className="accent">grinder</span>
        </h1>
        <p>Recipes, gear talk, latte-art wins and hot takes from fellow home brewers.</p>
      </section>

      <div className="toolbar">
        <div className="toolbar__group">
          <span className="toolbar__label">Order by</span>
          <div className="segmented">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                className={orderBy === o.id ? 'is-active' : ''}
                aria-pressed={orderBy === o.id}
                onClick={() => setOrderBy(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar__group">
          <span className="toolbar__label">Filter</span>
          <div className="chips">
            <button type="button" className={`chip ${!flag ? 'is-active' : ''}`} onClick={() => setFlag('')}>
              All
            </button>
            {FLAGS.map((f) => (
              <button
                key={f}
                type="button"
                className={`chip chip--${f.toLowerCase()} ${flag === f ? 'is-active' : ''}`}
                aria-pressed={flag === f}
                onClick={() => setFlag(flag === f ? '' : f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {search && (
        <p className="muted results-note">
          Showing posts with titles matching “{search}”.{' '}
          <button type="button" className="link-btn" onClick={() => setSearch('')}>
            Clear search
          </button>
        </p>
      )}

      {loading ? (
        <Loader label="Brewing your feed…" />
      ) : error ? (
        <div className="card empty">
          <h3>Couldn't load posts</h3>
          <p className="error">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="card empty">
          <h3>{filtersActive ? 'No posts match' : 'No posts yet'}</h3>
          <p className="muted">
            {filtersActive ? 'Try a different search or filter.' : 'Be the first to start a discussion.'}
          </p>
          <Link to="/create" className="btn btn--primary">
            Create a post
          </Link>
        </div>
      ) : (
        <div className={`feed ${showDetails ? 'feed--detailed' : ''}`}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} detailed={showDetails} />
          ))}
        </div>
      )}
    </div>
  )
}
