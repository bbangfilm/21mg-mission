import { useReveal } from '../lib/useReveal.js'
import styles from './Section.module.css'

/**
 * 에디토리얼 섹션 래퍼 — 영문 eyebrow + 볼드 타이틀 + 컬러모드 + 스크롤 리빌.
 * 헤더는 .reveal, 본문 그리드는 .stagger 를 붙이면 진입 시 staggered 로 떠오른다.
 * @param {{ id:string, eyebrow?:string, title:string, desc?:string,
 *           tone?:'paper'|'ink'|'violet'|'sunny', children:any }} props
 */
export default function Section({ id, eyebrow, title, desc, tone = 'paper', children }) {
  const ref = useReveal()
  return (
    <section ref={ref} id={id} data-reveal className={`${styles.section} ${styles[tone]}`}>
      <div className="container">
        <header className={`${styles.head} reveal`}>
          {eyebrow && <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
          {desc && <p className={styles.desc}>{desc}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
