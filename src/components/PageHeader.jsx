import { Link } from '../lib/router.jsx'
import styles from './PageHeader.module.css'

// 서브페이지 상단 고정 헤더 — '← 홈'(기본) + 페이지 제목. 노치 회피(safe-area).
// backTo/backLabel 로 상위 목록 등 다른 곳으로도 돌아갈 수 있다(예: 회의 보드 → 회의 목록).
export default function PageHeader({ title, backTo = '', backLabel = '홈' }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to={backTo} className={`${styles.back} pressable`} aria-label={`${backLabel}으로`}>
          <span aria-hidden="true">←</span> {backLabel}
        </Link>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  )
}
