import Section from '../components/Section.jsx'
import { Badge, ProgressBar, won } from '../components/ui.jsx'
import { sponsorshipFallback } from '../data/sponsorship.js'
import styles from './Sponsorship.module.css'

// S5에서 config/sponsorship 실시간 구독 + 관리자 편집으로 교체.
export default function Sponsorship({ data = sponsorshipFallback }) {
  const { goalAmount, currentAmount, accountBank, accountNumber, accountHolder, note } = data
  const hasAccount = accountBank && accountNumber

  return (
    <Section id="sponsorship" eyebrow="Support · 선교헌금" title="함께 채우는 오병이어" desc="회비와 별도로 모으는 선교헌금입니다" tone="violet">
      <div className={`${styles.card} reveal`}>
        <div className={styles.top}>
          <Badge tone="accent">모금중</Badge>
          <span className={styles.note}>{note}</span>
        </div>

        <div className={styles.amounts}>
          <div>
            <span className={styles.lbl}>누적</span>
            <strong className={`${styles.cur} tnum`}>{won(currentAmount)}</strong>
          </div>
          <div className={styles.goalWrap}>
            <span className={styles.lbl}>목표</span>
            <strong className={`${styles.goal} tnum`}>{won(goalAmount)}</strong>
          </div>
        </div>

        <ProgressBar value={currentAmount} max={goalAmount} tone="accent" />

        <p className={styles.ref}>참고: 작년 약 300만원 규모 · 우리 상황과 마음에 맞게 함께 채워갑니다.</p>
      </div>

      {/* 후원계좌 — 추후 추가(11장). 플레이스홀더 + 복사버튼 자리. */}
      <div className={`${styles.account} reveal`}>
        <span className={styles.accLbl}>후원계좌</span>
        {hasAccount ? (
          <span className={styles.accNum}>{accountBank} {accountNumber} ({accountHolder})</span>
        ) : (
          <span className={styles.accPlaceholder}>계좌 정보는 곧 등록됩니다</span>
        )}
        <button className={`${styles.copyBtn} pressable`} disabled aria-label="계좌 복사">복사</button>
      </div>

      <p className={styles.pending}>실시간 모금현황·물품후원 리스트는 곧 공개됩니다 (관리자 입력).</p>
    </Section>
  )
}
