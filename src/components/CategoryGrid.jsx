import { Link } from '../lib/router.jsx'
import { totalHeadcount } from '../data/cells.js'
import { meetingInfo } from '../data/meeting.js'
import styles from './CategoryGrid.module.css'

// 5색 대분류 — 홈 메뉴 (인원·모임 날짜는 각 데이터 단일출처에서 — 하드코딩 금지)
const CATS = [
  { to: 'ministry', label: '사역·나눔',  sub: '먹거리 · 오병이어 장터', cls: 'coral',  icon: '🍞' },
  { to: 'people',   label: '참가자·팀',  sub: `${totalHeadcount()}명 · 팀 체크리스트`,  cls: 'violet', icon: '👥' },
  { to: 'schedule', label: '일정·장소',  sub: '타임테이블 · 숙소',     cls: 'sunny',  icon: '📅' },
  { to: 'finance',  label: '재정',       sub: '회비 · 후원 계좌',      cls: 'mint',   icon: '💳' },
  { to: 'meeting',  label: '팀장 모임',  sub: `${meetingInfo.date} · 회의 진행 보드`, cls: 'plain', icon: '📋', wide: true },
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
