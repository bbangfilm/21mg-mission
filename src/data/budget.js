// 부록 C — 통합 예산(수입 / 지출 / 잔액). 정적 단일 출처.
// 2026-08-05 회계(전선희) 확정본.
//   구조 변경: 회비만 다루던 '회비 지갑'에서 → 회비 + 후원을 한 예산으로 통합하고
//   홍산은혜교회 오병이어 후원(250만)을 지출 항목으로 내렸다.
//   목표 300만 → 250만 확정으로 50만 절감 · 물놀이 계약 확정 · 참가 53명 회비 반영.
// ⚠️ 합계는 하드코딩하지 않는다 — sum() 런타임 합산(행 수정 시 오타가 즉시 드러난다).
//   확정 총액과의 대조는 validate.js 의 EXPECTED_INCOME / EXPECTED_EXPENSE 가 담당.

const sum = (rows) => rows.reduce((t, r) => t + r.amount, 0)

/** 수입 — 회비(인원 회비 + 숙박비) · 개인 후원 · 교회 후원 */
const income = [
  { label: '회비', amount: 4290000, people: 53, note: '인원 회비 3,000,000 + 숙박비 1,290,000' },
  { label: '개인 후원', amount: 1040000, note: '성도 개인 후원' },
  { label: '교회 후원', amount: 2200000, note: '더행복한교회' },
]

/** 지출 — 회계 확정 순서 그대로 유지(대조 편의) */
const expense = [
  { label: '오병이어 후원', amount: 2500000, note: '홍산은혜교회 일괄 위임 · 목표 300만 → 250만 확정' },
  { label: '숙박 · 조식', amount: 2513500, note: '부여군유스호스텔 2박 · 정정 견적서 최종액' },
  { label: '물놀이', amount: 480000, note: '어른 22 · 아이 15 + 평상 2개 14만 — 계약 확정' },
  { label: '석식 (금)', amount: 500000, note: '홍산 현지' },
  { label: '피씨방', amount: 100000, note: '' },
  { label: '간식', amount: 300000, note: '' },
  { label: '현수막', amount: 30000, note: '' },
]

export const budget = {
  income,
  incomeTotal: { people: 53, amount: sum(income) },

  expense,
  expenseTotal: sum(expense),

  balance: sum(income) - sum(expense), // 예비비

  headcountNote:
    '회비는 참가 53명 기준 (성인 28 · 취학 19 · 미취학 6) — 인원 회비 300만에 숙박비 129만이 더해진 금액입니다.',
  notes: [
    '유스호스텔 숙박·조식은 가정별로 걷은 회비에서 일괄 납부합니다.',
    '오병이어 후원 250만원은 홍산은혜교회에 일괄 위임 — 현지에서 음식·판매 물품을 구매합니다.',
    '물놀이는 계약 확정 금액입니다 (어른 22명 · 아이 15명 · 평상 2개).',
    '잔액은 예비비로 남겨 현장 상황에 따라 사용합니다.',
  ],
}
