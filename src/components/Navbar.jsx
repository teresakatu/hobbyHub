import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import { THEMES } from '../lib/constants'
import { isDemoMode } from '../lib/client'
import { resetDemoData } from '../lib/api'

export default function Navbar() {
  const { search, setSearch, userId, newUserId, theme, setTheme, showDetails, setShowDetails } = useApp()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onSearch = (value) => {
    setSearch(value)
    if (pathname !== '/') navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand" onClick={() => setSearch('')}>
          <img src="/favicon.svg" alt="" width="32" height="32" />
          <span>
            Grounds<span className="brand__rest"> <em>for</em> Discussion</span>
          </span>
        </Link>

        <label className="search">
          <span className="sr-only">Search posts by title</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search posts by title…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>

        <nav className="navbar__links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/create" className="btn btn--primary btn--sm">
            + New Post
          </NavLink>
          <div className="settings" ref={panelRef}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Customize"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                <circle cx="16" cy="7" r="2" />
                <circle cx="10" cy="17" r="2" />
              </svg>
            </button>
            {open && (
              <div className="settings__panel card">
                <h4>Color scheme</h4>
                <div className="theme-picker">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`theme-option ${theme === t.id ? 'is-active' : ''}`}
                      onClick={() => setTheme(t.id)}
                    >
                      <span
                        className="theme-option__swatch"
                        style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)` }}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showDetails}
                    onChange={(e) => setShowDetails(e.target.checked)}
                  />
                  <span className="switch__track" />
                  Show content &amp; images on the home feed
                </label>

                <h4>Your brewer ID</h4>
                <p className="user-id">@{userId}</p>
                <p className="muted small">
                  Only this ID can edit or delete the posts and comments you make.
                </p>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    if (confirm('Switch to a new brewer ID? You will lose edit access to your current posts.')) newUserId()
                  }}
                >
                  Get a new ID
                </button>

                {isDemoMode && (
                  <>
                    <h4>Demo mode</h4>
                    <p className="muted small">Data is saved in this browser only.</p>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => {
                        if (confirm('Reset all demo posts and comments?')) {
                          resetDemoData()
                          window.location.assign('/')
                        }
                      }}
                    >
                      Reset demo data
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
