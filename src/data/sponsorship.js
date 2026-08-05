// 08. 후원 현황 — config/sponsorship 정적 폴백 shape (Firebase 미연결/미설정 시 표시).
export const sponsorshipFallback = {
  goalAmount: 3000000,
  currentAmount: 3240000,
  note: '회비와 별도 / 오병이어 음식·판매 물품',
}

// 후원 확정 — 2026-08-05 회계 확정. closed:true 면 모금률 진행바 대신 확정 결과를 보여준다.
// ★ Firestore config/sponsorship 문서가 있으면 위 fallback 은 통째로 무시되므로,
//   '확정' 상태는 문서와 무관하게 항상 적용되도록 여기(정적)에 둔다.
export const sponsorshipStatus = {
  closed: true,
  raisedTotal: 3240000,  // 교회 후원 2,200,000 + 개인 후원 1,040,000
  committed: 2500000,    // 홍산은혜교회 오병이어 후원 확정 전달액 (목표 300만 → 250만)
  breakdown: [
    { label: '교회 후원', amount: 2200000 },
    { label: '개인 후원', amount: 1040000 },
  ],
  note: '모금 마감 · 오병이어 후원 250만원 확정',
}

// 후원계좌 — 정적 단일 출처(행사 중 불변). Firestore 의존 없이 항상 표시·복사.
export const account = {
  bank: '카카오뱅크',
  number: '7979-80-60692',
  holder: '전선희',
}

// 물품/현금 후원 내역(sponsorships) 정적 폴백 — 초기 빈 리스트.
export const sponsorshipItemsFallback = []
