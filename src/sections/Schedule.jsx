import Section from '../components/Section.jsx'
import { schedule } from '../data/schedule.js'
import { asset } from '../lib/asset.js'
import styles from './Schedule.module.css'

export default function Schedule() {
  return (
    <Section id="schedule" eyebrow="2박 3일 · Timeline" title="이렇게 움직입니다">
      <div className={`${styles.grid} stagger`}>
        {schedule.map((day) => (
          <article key={day.id} className={`${styles.day} lift`}>
            <header className={styles.dayHead}>
              <span className={`${styles.date} tnum`}>{day.date}</span>
              <span className={styles.dow}>({day.dow})</span>
              <span className={styles.dayLabel}>{day.label}</span>
            </header>
            <ul className={styles.items}>
              {day.items.map((it, i) => (
                <li key={i} className={`${styles.item} ${it.highlight ? styles.highlight : ''}`}>
                  <span className={`${styles.time} tnum`}>{it.time}</span>
                  <span className={styles.body}>
                    <b>{it.title}</b>
                    {it.sub && <em>{it.sub}</em>}
                    {it.doc && (
                      <a className={`${styles.docBtn} pressable`} href={asset(it.doc.href)}
                        target="_blank" rel="noreferrer">
                        <span aria-hidden="true">🎼</span> {it.doc.label}
                      </a>
                    )}
                  </span>
                  {it.highlight && <span className={styles.star} aria-hidden="true">⭐</span>}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}
