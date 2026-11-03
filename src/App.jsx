import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
import EditPost from './pages/EditPost'
import { isDemoMode } from './lib/client'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Navbar />
      {isDemoMode && (
        <div className="demo-banner">
          Demo mode: posts are saved in this browser. Add your Supabase keys to <code>.env</code> to go live.
        </div>
      )}
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
          <Route
            path="*"
            element={
              <div className="page page--narrow card empty">
                <h2>404: this cup is empty</h2>
                <Link to="/" className="btn btn--primary">Back to feed</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">☕ Grounds for Discussion · a HobbyHub forum for home brewers</footer>
    </>
  )
}
