import Section from '../components/Section.jsx'
import { Chip } from '../components/ui.jsx'
import { cells, cellTotal, totalHeadcount } from '../data/cells.js'
import styles from './Cells.module.css'

export default function Cells() {
  const total = totalHeadcount()
  return (
    <Section id="cells" eyebrow="Who's Coming" title="함께 가는 사람들" desc={`3개 셀 · 총 ${total}명`}>
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
      </div>

      <div className={`${styles.totalBar} reveal`}>
        <span>총 참가</span>
        <strong className="tnum">{total}명</strong>
        <em>덕인셀 1명은 회비 재산정 미반영 (표시 45 · 회비 산정 44)</em>
      </div>
    </Section>
  )
}
