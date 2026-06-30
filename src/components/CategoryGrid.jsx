import { Link } from '../lib/router.jsx'
import styles from './CategoryGrid.module.css'

// 5색 대분류 — 홈 메뉴
const CATS = [
  { to: 'ministry', label: '사역·나눔',  sub: '먹거리 · 오병이어 장터', cls: 'coral',  icon: '🍞' },
  { to: 'people',   label: '참가자·팀',  sub: '45명 · 팀 체크리스트',  cls: 'violet', icon: '👥' },
  { to: 'schedule', label: '일정·장소',  sub: '타임테이블 · 숙소',     cls: 'sunny',  icon: '📅' },
  { to: 'finance',  label: '재정',       sub: '회비 · 후원 계좌',      cls: 'mint',   icon: '💳' },
  { to: 'todo',     label: '준비 To-Do', sub: '이번주 함께 챙길 일',   cls: 'ink',    icon: '✅', wide: true },
]

export default function CategoryGrid() {
  return (
    <nav className={styles.grid} aria-label="메뉴">
      {CATS.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className={`${styles.card} ${styles[c.cls]}${c.wide ? ` ${styles.wide}` : ''} lift pressable`}
        >
          <span className={styles.icon} aria-hidden="true">{c.icon}</span>
          <span className={styles.text}>
            <span className={styles.label}>{c.label}</span>
            <span className={styles.sub}>{c.sub}</span>
          </span>
          {c.wide && <span className={styles.chev} aria-hidden="true">→</span>}
        </Link>
      ))}
    </nav>
  )
}
