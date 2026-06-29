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

/** 진행률 바 (value/max → %) — 마운트 시 0에서 차오름 */
export function ProgressBar({ value, max = 100, tone = 'primary', showPct = true }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const [w, setW] = useState(0)
  useEffect(() => {
    const r = requestAnimationFrame(() => setW(pct))
    return () => cancelAnimationFrame(r)
  }, [pct])
  return (
    <div className={styles.progress}>
      <div className={styles.track} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={`${styles.fill} ${styles['fill_' + tone] || ''}`} style={{ width: w + '%' }} />
      </div>
      {showPct && <span className={`${styles.pct} tnum`}>{pct}%</span>}
    </div>
  )
}

/** 원화 포맷 */
export const won = (n) => '₩' + Number(n || 0).toLocaleString('ko-KR')
