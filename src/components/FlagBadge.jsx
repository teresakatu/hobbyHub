export default function FlagBadge({ flag }) {
  if (!flag) return null
  return <span className={`flag flag--${flag.toLowerCase()}`}>{flag}</span>
}
