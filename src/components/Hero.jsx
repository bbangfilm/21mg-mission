import { event } from '../data/event.js'
import { computeDDay } from '../lib/useDDay.js'
import { asset } from '../lib/asset.js'
import styles from './Hero.module.css'

export default function Hero() {
  const dday = computeDDay(event.dateStart, event.dateEnd)

  return (
    <header id="hero" className={styles.hero}>
      <img className={styles.photo} src={asset('img/hero.jpg')} alt="홍산은혜교회 앞에서 손하트 하는 21MG 팀" />
      <div className={styles.scrim} aria-hidden="true" />

      <span className={`${styles.dday} tnum`} data-phase={dday.phase}>
        <b>{dday.label}</b>
        <i>{dday.sub}</i>
      </span>

      <div className={`container ${styles.content}`}>
        <p className={styles.kicker}>2026 더행복한교회 · 국내단기선교</p>
        <h1 className={styles.title}>
          21<span>MG</span>
        </h1>
        <p className={styles.lead}>마을 속 나눔 잔치 — 충남 부여 <b>홍산은혜교회</b></p>

        <div className={styles.meta}>
          <span className={`${styles.chip} tnum`}>8.14<i>–</i>16</span>
          <span className={styles.chip}>2박 3일</span>
          <span className={styles.chip}>오병이어 나눔축제</span>
        </div>

        <p className={styles.verse}>“오직 성령이 너희에게 임하시면 … 내 증인이 되리라” · {event.verse}</p>
      </div>
    </header>
  )
}
