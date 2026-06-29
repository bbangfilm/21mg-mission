import Section from '../components/Section.jsx'
import { venue } from '../data/venue.js'
import { asset } from '../lib/asset.js'
import styles from './Venue.module.css'

const PHOTO = {
  church: 'img/worship.jpg',
  hostel: 'img/room.jpg',
  pool: 'img/festival.jpg',
}

export default function Venue() {
  return (
    <Section id="venue" eyebrow="Place & Stay" title="머무는 곳">
      <div className={`${styles.grid} stagger`}>
        {venue.places.map((p) => (
          <article key={p.id} className={`${styles.card} lift`}>
            <div className={styles.photo}>
              {PHOTO[p.id]
                ? <img src={asset(PHOTO[p.id])} alt={p.name} loading="lazy" />
                : <span aria-hidden="true">{p.emoji}</span>}
              <span className={styles.tag}>{p.emoji} {p.meta}</span>
            </div>
            <div className={styles.body}>
              <h3 className={styles.name}>{p.name}</h3>
              <p className={styles.desc}>{p.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
