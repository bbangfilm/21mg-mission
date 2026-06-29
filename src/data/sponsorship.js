// 08. 후원 현황 — config/sponsorship 정적 폴백 shape (Firebase 미연결/미설정 시 표시).
// 실제 값은 S5에서 관리자가 Firestore 에서 편집(목표·누적). 계좌는 추후 입력(11장).
export const sponsorshipFallback = {
  goalAmount: 3000000,   // 목표 (작년 약 300만원 규모 참고)
  currentAmount: 0,      // 누적 (관리자 수동 입력 단일 출처)
  accountBank: '',
  accountNumber: '',
  accountHolder: '',
  note: '회비와 별도 / 작년 약 300만원 규모',
}

// 물품/현금 후원 내역(sponsorships) 정적 폴백 — 초기 빈 리스트.
export const sponsorshipItemsFallback = []
