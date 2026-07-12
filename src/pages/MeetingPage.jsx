import { useEffect } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Link, useRouteParam, useRouteSub } from '../lib/router.jsx'
import { meetingById } from '../data/meetings.js'
import { minutesFor } from '../data/minutes.js'
import MeetingList from '../sections/MeetingList.jsx'
import MeetingFlow from '../sections/MeetingFlow.jsx'
import MeetingDecisions from '../sections/MeetingDecisions.jsx'
import MeetingPrep from '../sections/MeetingPrep.jsx'
import MeetingMinutes from '../sections/MeetingMinutes.jsx'
import styles from '../sections/Meeting.module.css'

// #/meeting = 회의 목록 · #/meeting/{id} = 진행 보드 · #/meeting/{id}/minutes = 회의록 (미등록은 폴백).
// 목록↔보드↔회의록은 같은 라우트 key(meeting)라 App의 라우트 전환 처리(스크롤·title)가 안 돌므로 여기서 직접.
export default function MeetingPage() {
  const id = useRouteParam()
  const sub = useRouteSub()
  const meeting = meetingById(id)
  const minutes = meeting ? minutesFor(meeting.id) : null
  const showMinutes = !!(meeting && minutes && sub === 'minutes')

  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'instant' }) } catch { window.scrollTo(0, 0) }
    document.title = meeting
      ? `팀장 모임 ${meeting.seq}차${showMinutes ? ' 회의록' : ''} (${meeting.date}) · 21MG 국내선교`
      : '팀장 모임 · 21MG 국내선교' // 목록·미등록 id — 다른 라우트로 나가면 App effect가 다시 설정
  }, [id, meeting, showMinutes])

  if (!meeting) {
    return (
      <>
        <PageHeader title="팀장 모임" />
        <MeetingList />
      </>
    )
  }
  if (showMinutes) {
    return (
      // key — 보드↔회의록 전환 시 리마운트로 리빌 애니메이션 재생
      <div key={meeting.id + '-minutes'}>
        <PageHeader title={`${meeting.seq}차 회의록 · ${meeting.date}`} backTo="meeting" backLabel="목록" />
        <MeetingMinutes meeting={meeting} minutes={minutes} />
      </div>
    )
  }
  return (
    // key={meeting.id} — 회의 전환 시 보드 리마운트로 Firestore 재구독 + 리빌 애니메이션 재생
    <div key={meeting.id}>
      <PageHeader title={`팀장 모임 ${meeting.seq}차 · ${meeting.date}`} backTo="meeting" backLabel="목록" />
      {minutes && (
        <div className="container">
          <Link to={`meeting/${meeting.id}/minutes`} className={`${styles.minutesBanner} pressable`}>
            📝 이 회의의 <strong>회의록</strong>이 정리되어 있어요 — 확정 결과·최종 팀 구성 보기 <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
      <MeetingFlow meeting={meeting} />
      <MeetingDecisions meeting={meeting} />
      <MeetingPrep meeting={meeting} />
    </div>
  )
}
