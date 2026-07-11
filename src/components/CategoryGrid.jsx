import { Link } from '../lib/router.jsx'
import { totalHeadcount } from '../data/cells.js'
import { upcomingOrLatest } from '../data/meetings.js'
import styles from './CategoryGrid.module.css'

// 5색 대분류 — 홈 메뉴 (인원·모임 날짜는 각 데이터 단일출처에서 — 하드코딩 금지)
// 팀장 모임 날짜 = 다가오는 회의(없으면 최근 회의) — meetings.js 배열에 회의 추가만 하면 반영.
// upcomingOrLatest()는 '오늘' 기준 판정이라 렌더 시점에 계산(모듈 스코프면 로드 시점 날짜로 고정됨).
const cats = () => [
  { to: 'ministry', label: '사역·나눔',  sub: '먹거리 · 오병이어 장터', cls: 'coral',  icon: '🍞' },
  { to: 'people',   label: '참가자·팀',  sub: `${totalHeadcount()}명 · 팀 체크리스트`,  cls: 'violet', icon: '👥' },
  { to: 'schedule', label: '일정·장소',  sub: '타임테이블 · 숙소',     cls: 'sunny',  icon: '📅' },
  { to: 'finance',  label: '재정',       sub: '회비 · 후원 계좌',      cls: 'mint',   icon: '💳' },
  { to: 'meeting',  label: '팀장 모임',  sub: `${upcomingOrLatest().date} · 회의 목록·보드`, cls: 'plain', icon: '📋', wide: true },
  { to: 'todo',     label: '준비 To-Do', sub: '이번주 함께 챙길 일',   cls: 'ink',    icon: '✅', wide: true },
]

export default function CategoryGrid() {
  const CATS = cats()
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
