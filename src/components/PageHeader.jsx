import { Link } from '../lib/router.jsx'
import styles from './PageHeader.module.css'

// 서브페이지 상단 고정 헤더 — '← 홈' + 페이지 제목. 노치 회피(safe-area).
export default function PageHeader({ title }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="" className={`${styles.back} pressable`} aria-label="홈으로">
          <span aria-hidden="true">←</span> 홈
        </Link>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  )
}
