// 08. 후원 현황 — config/sponsorship 정적 폴백 shape (Firebase 미연결/미설정 시 표시).
// 목표·누적(동적)은 관리자가 Firestore 에서 편집. 계좌(정적)는 아래 account 단일 출처.
export const sponsorshipFallback = {
  goalAmount: 3000000,   // 목표 (작년 약 300만원 규모 참고)
  currentAmount: 0,      // 누적 (관리자 수동 입력 단일 출처)
  note: '회비와 별도 / 작년 약 300만원 규모',
}

// 후원계좌 — 정적 단일 출처(행사 중 불변). Firestore 의존 없이 항상 표시·복사.
export const account = {
  bank: '카카오뱅크',
  number: '7979-80-60692',
  holder: '전선희',
}

// 물품/현금 후원 내역(sponsorships) 정적 폴백 — 초기 빈 리스트.
export const sponsorshipItemsFallback = []
