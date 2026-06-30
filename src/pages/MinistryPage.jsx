import PageHeader from '../components/PageHeader.jsx'
import PhotoBand from '../components/PhotoBand.jsx'
import Ministry from '../sections/Ministry.jsx'
import Bazaar from '../sections/Bazaar.jsx'

export default function MinistryPage() {
  return (
    <>
      <PageHeader title="사역·나눔" />
      <PhotoBand
        img="img/market.jpg"
        alt="오병이어 나눔 장터 — 천막과 좌판"
        tag="작년 오병이어"
        caption="천막을 펴고, 마을을 초대합니다"
      />
      <Ministry />
      <Bazaar />
    </>
  )
}
