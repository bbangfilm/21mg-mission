import { useEffect } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { useRouteParam } from '../lib/router.jsx'
import { meetingById } from '../data/meetings.js'
import MeetingList from '../sections/MeetingList.jsx'
import MeetingFlow from '../sections/MeetingFlow.jsx'
import MeetingDecisions from '../sections/MeetingDecisions.jsx'
import MeetingPrep from '../sections/MeetingPrep.jsx'

// #/meeting = 회의 목록 · #/meeting/{id} = 해당 회의 진행 보드 (미등록 id는 목록 폴백).
// 목록↔보드는 같은 라우트 key(meeting)라 App의 라우트 전환 처리(스크롤·title)가 안 돌므로 여기서 직접.
export default function MeetingPage() {
  const id = useRouteParam()
  const meeting = meetingById(id)

  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'instant' }) } catch { window.scrollTo(0, 0) }
    document.title = meeting
      ? `팀장 모임 ${meeting.seq}차 (${meeting.date}) · 21MG 국내선교`
      : '팀장 모임 · 21MG 국내선교' // 목록·미등록 id — 다른 라우트로 나가면 App effect가 다시 설정
  }, [id, meeting])

  if (!meeting) {
    return (
      <>
        <PageHeader title="팀장 모임" />
        <MeetingList />
      </>
    )
  }
  return (
    // key={meeting.id} — 회의 전환 시 보드 리마운트로 Firestore 재구독 + 리빌 애니메이션 재생
    <div key={meeting.id}>
      <PageHeader title={`팀장 모임 ${meeting.seq}차 · ${meeting.date}`} backTo="meeting" backLabel="목록" />
      <MeetingFlow meeting={meeting} />
      <MeetingDecisions meeting={meeting} />
      <MeetingPrep meeting={meeting} />
    </div>
  )
}
