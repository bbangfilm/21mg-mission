import { useEffect, useState } from 'react'
import styles from './ui.module.css'

/** 이름/태그 칩 */
export function Chip({ children, tone = 'default', title }) {
  return <span className={`${styles.chip} ${styles['chip_' + tone] || ''}`} title={title}>{children}</span>
}

/** 상태 뱃지 — 준비중/진행중/완료/모금중 */
export function Badge({ children, tone = 'muted' }) {
  return <span className={`${styles.badge} ${styles['badge_' + tone] || ''}`}>{children}</span>
}

/** 진행률 바 (value/max → %) — rAF 로 막대+숫자 동시 카운트업. key 를 바꾸면 재생. */
export function ProgressBar({ value, max = 100, tone = 'primary', showPct = true, label, valueText, duration = 850 }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const [disp, setDisp] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisp(pct); return }
    let raf, start
    const tick = (t) => {
      if (start == null) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisp(Math.round(pct * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pct, duration])
  return (
    <div className={styles.progress}>
      <div className={styles.track} role="progressbar" aria-label={label} aria-valuenow={disp} aria-valuemin={0} aria-valuemax={100} aria-valuetext={valueText || disp + '%'}>
        <div className={`${styles.fill} ${styles['fill_' + tone] || ''}`} style={{ width: disp + '%' }} />
      </div>
      {showPct && <span className={`${styles.pct} tnum`}>{disp}%</span>}
    </div>
  )
}

/** 숫자 카운트업 — play=true 일 때 0→value (rAF). key 를 바꾸면 재생. format 으로 표시(예: won). */
export function CountUp({ value, play = true, duration = 950, format = (n) => n }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!play) { setN(0); return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return }
    let raf, start
    const tick = (t) => {
      if (start == null) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [play, value, duration])
  return <>{format(play ? n : 0)}</>
}

/** 원화 포맷 */
export const won = (n) => '₩' + Number(n || 0).toLocaleString('ko-KR')
