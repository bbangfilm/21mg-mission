import { event } from '../data/event.js'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.team}>{event.team}</p>
        <p className={styles.meta}>{event.title} · {event.subtitle}</p>
        <p className={styles.credit}>제작 21MG (이영천 · 신나희) · 2026 국내단기선교</p>
      </div>
    </footer>
  )
}
