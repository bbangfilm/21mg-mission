import Section from '../components/Section.jsx'
import { won } from '../components/ui.jsx'
import { budget } from '../data/budget.js'
import styles from './Budget.module.css'

export default function Budget() {
  return (
    <Section id="budget" eyebrow="Budget" title="회비, 이렇게 씁니다" desc="수입 · 지출 · 잔액">
      <div className={`${styles.grid} stagger`}>
        {/* 수입 */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>수입 (회비)</h3>
          <table className={styles.table}>
            <tbody>
              {budget.income.map((r) => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  <td className="tnum">{r.people}명 × {won(r.unit)}</td>
                  <td className={`tnum ${styles.amt}`}>{won(r.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>합계</td>
                <td className="tnum">{budget.incomeTotal.people}명</td>
                <td className={`tnum ${styles.amt}`}>{won(budget.incomeTotal.amount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 지출 */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>지출 (예산)</h3>
          <table className={styles.table}>
            <tbody>
              {budget.expense.map((r) => (
                <tr key={r.label}>
                  <td>{r.label}{r.note && <em className={styles.note}>{r.note}</em>}</td>
                  <td className={`tnum ${styles.amt}`}>{won(r.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>합계</td>
                <td className={`tnum ${styles.amt}`}>{won(budget.expenseTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className={`${styles.balance} reveal`}>
        <span>잔액 (예비비)</span>
        <strong className="tnum">{won(budget.balance)}</strong>
      </div>

      <ul className={styles.notes}>
        <li>📌 {budget.headcountNote}</li>
        {budget.notes.map((n, i) => <li key={i}>· {n}</li>)}
      </ul>
    </Section>
  )
}
