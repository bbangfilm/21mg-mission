import PageHeader from '../components/PageHeader.jsx'
import Cells from '../sections/Cells.jsx'
import Teams from '../sections/Teams.jsx'

export default function PeoplePage() {
  return (
    <>
      <PageHeader title="참가자·팀" />
      <Cells />
      <Teams />
    </>
  )
}
