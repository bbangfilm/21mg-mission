import Section from '../components/Section.jsx'
import { Badge } from '../components/ui.jsx'
import { Link } from '../lib/router.jsx'
import { meetings, meetingStatus } from '../data/meetings.js'
import { minutesFor } from '../data/minutes.js'
import styles from './Meeting.module.css'

const STATUS = {
  today:    { label: '오늘',       tone: 'primary' },
  upcoming: { label: '예정',       tone: 'success' },
  past:     { label: '종료 · 기록', tone: 'muted' },
}

// 회의 목록 — 항목을 누르면 해당 회의의 진행 보드(#/meeting/{id})로 들어간다.
export default function MeetingList() {
  return (
    <Section id="meeting-list" eyebrow="Meetings" title="회의 목록"
      desc="회의를 선택하면 진행 보드 · 회의록으로 들어갑니다">
      <ul className={`${styles.mList} stagger`}>
        {meetings.map((m) => {
          const st = STATUS[meetingStatus(m)]
          const minutes = minutesFor(m.id)
          return (
            <li key={m.id}>
              {/* aria-label 없이 내용 전체를 링크 이름으로 — 상태 배지·메타까지 스크린리더에 전달 */}
              <Link to={`meeting/${m.id}`} className={`${styles.mCard} lift pressable`}>
                <span className={`${styles.mSeq} tnum`}>{m.seq}차</span>
                <span className={styles.mBody}>
                  <span className={styles.mTop}>
                    <span className={styles.mDate}>{m.date}</span>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </span>
                  <span className={styles.mTitle}>{m.title}</span>
                  <span className={`${styles.mMeta} tnum`}>
                    참석 {m.attendees.length}명 · 안건 {m.decisions.length}건 · {m.duration}
                  </span>
                </span>
                <span className={styles.mChev} aria-hidden="true">→</span>
              </Link>
              {/* 하부 트리 — 회의록이 정리된 회의만 노출 */}
              {minutes && (
                <Link to={`meeting/${m.id}/minutes`} className={`${styles.mSub} lift pressable`}>
                  <span className={styles.mSubBranch} aria-hidden="true">└</span>
                  <span aria-hidden="true">📝</span>
                  <span className={styles.mSubBody}>
                    <span className={styles.mSubTitle}>회의록</span>
                    <span className={`${styles.mSubMeta} tnum`}>
                      결정 {minutes.items.length} · 액션 {minutes.actions.length} · 회의 후 최종 확정 반영
                    </span>
                  </span>
                  <span className={styles.mChev} aria-hidden="true">→</span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
      <p className={styles.hintText}>지난 회의도 그대로 보존돼요 — 결정사항·메모는 언제든 다시 볼 수 있습니다.</p>
    </Section>
  )
}
