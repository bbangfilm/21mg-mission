import Section from '../components/Section.jsx'
import { ministry } from '../data/ministry.js'
import styles from './Ministry.module.css'

export default function Ministry() {
  return (
    <Section id="ministry" eyebrow="The Heart · 오병이어" title="마을이 모이는 나눔 잔치" desc={ministry.intro} tone="ink">
      <div className={`${styles.grid} stagger`}>
        {ministry.pillars.map((p, i) => (
          <article key={p.no} className={`${styles.card} ${styles['c' + i]} lift`}>
            <span className={styles.emoji} aria-hidden="true">{p.emoji}</span>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardDesc}>{p.desc}</p>
          </article>
        ))}
      </div>

      <p className={`${styles.fruit} reveal`}>
        <span className={styles.fruitMark}>🌱 열매</span>
        <span><strong>{ministry.fruit.highlight}</strong>{ministry.fruit.desc}</span>
      </p>
    </Section>
  )
}
