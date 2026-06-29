import { useEffect, useRef, useState } from 'react'
import styles from './AnchorNav.module.css'

// 섹션 앵커 정의 — App 렌더 순서와 일치
export const NAV = [
  { id: 'notices', label: '공지' },
  { id: 'ministry', label: '메인사역' },
  { id: 'schedule', label: '일정' },
  { id: 'cells', label: '참가현황' },
  { id: 'teams', label: '팀보드' },
  { id: 'bazaar', label: '바자회' },
  { id: 'todos', label: '이번주' },
  { id: 'sponsorship', label: '후원' },
  { id: 'budget', label: '회비' },
  { id: 'venue', label: '장소' },
  { id: 'prayers', label: '기도' },
]

export default function AnchorNav() {
  const [active, setActive] = useState(NAV[0].id)
  const listRef = useRef(null)

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    // 화면 중앙 통과 기준으로 단일 active 보장
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.1, 0.5, 1] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // 활성 칩을 가로 스크롤로 가운데 정렬
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-id='${active}']`)
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [active])

  return (
    <nav className={styles.nav} aria-label="섹션 이동">
      <ul className={styles.list} ref={listRef}>
        {NAV.map((n) => (
          <li key={n.id}>
            <a
              href={`#${n.id}`}
              data-id={n.id}
              className={`${styles.item} pressable ${active === n.id ? styles.active : ''}`}
              aria-current={active === n.id ? 'true' : undefined}
            >
              {n.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
