import Section from '../components/Section.jsx'
import { venue } from '../data/venue.js'
import { asset } from '../lib/asset.js'
import styles from './Venue.module.css'

const PHOTO = {
  church: 'img/worship.jpg',
  hostel: 'img/room.jpg',
  pool: 'img/pool.jpg',
}

export default function Venue() {
  return (
    <Section id="venue" eyebrow="Place & Stay" title="머무는 곳">
      <div className={`${styles.grid} stagger`}>
        {venue.places.map((p) => (
          <article key={p.id} className={`${styles.card} lift`}>
            <div className={styles.photo}>
              {/* 이모지는 항상 폴백으로 깔고, 사진이 있으면 위에 덮음. 사진 로드 실패 시 onError 로 숨겨 이모지 노출 */}
              <span aria-hidden="true">{p.emoji}</span>
              {PHOTO[p.id] && (
                <img src={asset(PHOTO[p.id])} alt={p.name} loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  onLoad={(e) => { if (!e.currentTarget.naturalWidth) e.currentTarget.style.display = 'none' }} />
              )}
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
