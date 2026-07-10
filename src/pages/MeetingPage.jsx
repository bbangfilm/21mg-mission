import PageHeader from '../components/PageHeader.jsx'
import MeetingFlow from '../sections/MeetingFlow.jsx'
import MeetingDecisions from '../sections/MeetingDecisions.jsx'
import MeetingPrep from '../sections/MeetingPrep.jsx'

export default function MeetingPage() {
  return (
    <>
      <PageHeader title="팀장 모임" />
      <MeetingFlow />
      <MeetingDecisions />
      <MeetingPrep />
    </>
  )
}
