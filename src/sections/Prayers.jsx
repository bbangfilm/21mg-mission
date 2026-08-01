import Section from '../components/Section.jsx'
import PrayerWall from '../components/PrayerWall.jsx'
import { verse, prayerGroups, prayerClosing } from '../data/prayers.js'
import styles from './Prayers.module.css'

export default function Prayers({ wallLimit }) {
  return (
    <Section id="prayers" eyebrow="Prayer & Word" title="이 마음으로 기도합니다" tone="ink">
      <blockquote className={`${styles.verse} reveal`}>
        <p>“{verse.text}”</p>
        <cite>— {verse.ref}</cite>
      </blockquote>
      <ol className={`${styles.groups} stagger`}>
        {prayerGroups.map((g) => (
          <li key={g.id} className={styles.groupCard} data-tone={g.tone}>
            <div className={styles.groupHead}>
              <span className={`${styles.groupNo} tnum`} aria-hidden="true">{g.no}</span>
              <h3 className={styles.groupTitle}>{g.title}</h3>
              <span className={styles.groupIcon} aria-hidden="true">{g.icon}</span>
            </div>
            <ul className={styles.groupItems}>
              {g.items.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className={`${styles.closing} reveal`}>“{prayerClosing}”</p>
      <PrayerWall limit={wallLimit} />
    </Section>
  )
}
