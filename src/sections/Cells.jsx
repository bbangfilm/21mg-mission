import Section from '../components/Section.jsx'
import { Chip } from '../components/ui.jsx'
import { cells, ministers, cellTotal, totalHeadcount } from '../data/cells.js'
import styles from './Cells.module.css'

export default function Cells() {
  const total = totalHeadcount()
  const desc = `${cells.length}개 셀 · 사역자 ${ministers.length}명 · 총 ${total}명`
  return (
    <Section id="cells" eyebrow="Who's Coming" title="함께 가는 사람들" desc={desc}>
      <div className={`${styles.grid} stagger`}>
        {cells.map((cell) => (
          <article key={cell.id} className={`${styles.card} lift`}>
            <header className={styles.head}>
              <h3 className={styles.name}>{cell.name}</h3>
              <span className={`${styles.count} tnum`}>{cellTotal(cell)}<small>명</small></span>
            </header>
            <p className={styles.leaders}>셀리더 · {cell.leaders.join(' · ')}</p>
            <div className={styles.chips}>
              {cell.leaders.map((n) => <Chip key={n} tone="leader">{n}</Chip>)}
              {cell.members.map((n) => <Chip key={n}>{n}</Chip>)}
            </div>
          </article>
        ))}

        {ministers.length > 0 && (
          <article className={`${styles.card} lift`}>
            <header className={styles.head}>
              <h3 className={styles.name}>사역자</h3>
              <span className={`${styles.count} tnum`}>{ministers.length}<small>명</small></span>
            </header>
            <p className={styles.leaders}>{ministers[0].role}</p>
            <div className={styles.chips}>
              {ministers.map((m) => <Chip key={m.name} tone="leader">{m.name}</Chip>)}
            </div>
          </article>
        )}
      </div>

      <div className={`${styles.totalBar} reveal`}>
        <span>총 참가</span>
        <strong className="tnum">{total}명</strong>
      </div>
    </Section>
  )
}
