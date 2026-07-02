import Section from '../components/Section.jsx'
import { Badge, ProgressBar, CountUp, won } from '../components/ui.jsx'
import { sponsorshipFallback, account } from '../data/sponsorship.js'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useDoc } from '../lib/useFirestore.js'
import { useInView } from '../lib/useInView.js'
import { setDocData } from '../lib/mutations.js'
import styles from './Sponsorship.module.css'

const DOC = 'config/sponsorship'

export default function Sponsorship() {
  const { can } = useEditMode()
  const editable = can('admin')
  const { data } = useDoc(DOC)
  const s = data || sponsorshipFallback
  const { goalAmount, currentAmount, note } = s
  const hasAccount = account.bank && account.number
  const [viewRef, plays] = useInView()  // 스크롤로 재등장할 때마다 +1 → 수치·그래프 재생

  const save = (e) => {
    e.preventDefault()
    const goal = Math.max(0, Number(e.target.goal.value) || 0)
    const cur = Math.max(0, Number(e.target.cur.value) || 0)
    if (!window.confirm(`목표 ${won(goal)} / 누적 ${won(cur)} 으로 저장할까요?`)) return
    setDocData(DOC, { goalAmount: goal, currentAmount: cur })
  }

  return (
    <Section id="sponsorship" eyebrow="Support · 선교헌금" title="함께 채우는 오병이어" desc="회비와 별도로 모으는 선교헌금입니다" tone="violet">
      <div ref={viewRef} className={`${styles.card} reveal`}>
        <div className={styles.top}>
          <Badge tone="accent">모금중</Badge>
          <span className={styles.note}>{note}</span>
        </div>

        <div className={styles.amounts}>
          <div>
            <span className={styles.lbl}>누적</span>
            <strong className={`${styles.cur} tnum`}>
              <CountUp key={plays} value={currentAmount} play={plays > 0} format={won} />
            </strong>
          </div>
          <div className={styles.goalWrap}>
            <span className={styles.lbl}>목표</span>
            <strong className={`${styles.goal} tnum`}>{won(goalAmount)}</strong>
          </div>
        </div>

        <ProgressBar key={plays} value={currentAmount} max={goalAmount || 1} tone="accent" label="선교헌금 모금률" valueText={`목표 ${won(goalAmount)} 중 ${won(currentAmount)} 모금`} />

        {editable && (
          <form className={styles.editRow} onSubmit={save}>
            <label>누적 <input name="cur" type="number" min="0" step="10000" defaultValue={currentAmount} key={'c' + currentAmount} /></label>
            <label>목표 <input name="goal" type="number" min="0" step="100000" defaultValue={goalAmount} key={'g' + goalAmount} /></label>
            <button type="submit" className={`${styles.saveBtn} pressable`}>저장</button>
          </form>
        )}

        <p className={styles.ref}>우리 상황과 마음에 맞게 함께 채워갑니다.</p>
      </div>

      <div className={`${styles.account} reveal`}>
        <span className={styles.accLbl}>후원계좌</span>
        {hasAccount
          ? <span className={styles.accNum}>{account.bank} {account.number} ({account.holder})</span>
          : <span className={styles.accPlaceholder}>계좌 정보는 곧 등록됩니다</span>}
        {hasAccount && (
          <button
            className={`${styles.copyBtn} pressable`}
            onClick={() => navigator.clipboard?.writeText(`${account.bank} ${account.number} ${account.holder}`)}
            aria-label="계좌번호 복사"
          >복사</button>
        )}
      </div>

      <p className={styles.pending}>
        {editable ? '✏️ 누적·목표를 입력하면 모든 기기에 실시간 반영됩니다.' : '모금 현황은 관리자가 업데이트합니다.'}
      </p>
    </Section>
  )
}
