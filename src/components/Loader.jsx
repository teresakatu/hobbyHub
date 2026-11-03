export default function Loader({ label = 'Brewing…', small = false }) {
  return (
    <div className={`loader ${small ? 'loader--small' : ''}`} role="status" aria-live="polite">
      <svg className="loader__cup" viewBox="0 0 64 64" aria-hidden="true">
        <path className="loader__steam" d="M24 6c-4 5 4 8 0 13" />
        <path className="loader__steam loader__steam--2" d="M32 4c-4 5 4 8 0 13" />
        <path className="loader__steam loader__steam--3" d="M40 6c-4 5 4 8 0 13" />
        <clipPath id="cup-clip">
          <path d="M12 24h36v14a16 16 0 0 1-16 16h-4a16 16 0 0 1-16-16z" />
        </clipPath>
        <path className="loader__cup-body" d="M12 24h36v14a16 16 0 0 1-16 16h-4a16 16 0 0 1-16-16z" />
        <rect className="loader__fill" x="10" y="24" width="40" height="32" clipPath="url(#cup-clip)" />
        <path className="loader__handle" d="M48 29h3a7 7 0 0 1 0 14h-4" />
      </svg>
      <span className="loader__label">{label}</span>
    </div>
  )
}
