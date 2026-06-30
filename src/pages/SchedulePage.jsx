import PageHeader from '../components/PageHeader.jsx'
import Schedule from '../sections/Schedule.jsx'
import Venue from '../sections/Venue.jsx'

export default function SchedulePage() {
  return (
    <>
      <PageHeader title="일정·장소" />
      <Schedule />
      <Venue />
    </>
  )
}
