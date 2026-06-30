import Section from '../components/Section.jsx'
import PrayerWall from '../components/PrayerWall.jsx'
import { verse, prayers } from '../data/prayers.js'
import styles from './Prayers.module.css'

export default function Prayers({ wallLimit }) {
  return (
    <Section id="prayers" eyebrow="Prayer & Word" title="이 마음으로 기도합니다" tone="ink">
      <blockquote className={`${styles.verse} reveal`}>
        <p>“{verse.text}”</p>
        <cite>— {verse.ref}</cite>
      </blockquote>
      <ul className={`${styles.list} stagger`}>
        {prayers.map((p) => (
          <li key={p.id} className={styles.item}>
            <span className={styles.bullet} aria-hidden="true">🙏</span>
            <span>{p.text}</span>
          </li>
        ))}
      </ul>
      <PrayerWall limit={wallLimit} />
    </Section>
  )
}
