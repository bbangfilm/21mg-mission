import { Link } from '../lib/router.jsx'
import styles from './QuickNav.module.css'

// 히어로 바로 아래 빠른 메뉴 — 스크롤 없이 5개 페이지로 바로 이동.
// 공지·기도·큰 메뉴 카드는 그대로 아래에 유지된다.
const ITEMS = [
  { to: 'ministry', label: '사역·나눔', icon: '🍞' },
  { to: 'people',   label: '참가자·팀', icon: '👥' },
  { to: 'schedule', label: '일정·장소', icon: '📅' },
  { to: 'finance',  label: '재정',      icon: '💳' },
  { to: 'todo',     label: '준비',      icon: '✅' },
]

export default function QuickNav() {
  return (
    <nav className={styles.bar} aria-label="빠른 메뉴">
      <ul className={styles.row}>
        {ITEMS.map((it) => (
          <li key={it.to}>
            <Link to={it.to} className={`${styles.chip} pressable`}>
              <span className={styles.icon} aria-hidden="true">{it.icon}</span>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
