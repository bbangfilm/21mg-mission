// 부록 C — 회비(수입) / 예산(지출) / 잔액. 정적 단일 출처.
// 회비(수입)는 참가 45명 기준. 지출 일부는 식사 인원(≈44) 기준 — 행별 note 참조.
export const budget = {
  income: [
    { label: '성인', people: 24, unit: 60000, amount: 1440000 },
    { label: '취학', people: 16, unit: 60000, amount: 960000 },
    { label: '미취학', people: 5, unit: 30000, amount: 150000 },
  ],
  incomeTotal: { people: 45, amount: 2550000 },

  expense: [
    { label: '조식 2회', unit: 14000, people: 44, amount: 616000, note: '전원 성인 계산' },
    { label: '석식 (금)', unit: 10000, people: 40, amount: 400000, note: '40인분 계산' },
    { label: '석식 (토)', unit: 7000, people: 44, amount: 308000, note: '전원 성인 계산' },
    { label: '수영장', unit: 10000, people: 44, amount: 440000, note: '전원 성인 계산' },
    { label: '평상', unit: 70000, people: 3, amount: 210000, note: '7만원 × 3개' },
    { label: '현수막', unit: null, people: null, amount: 30000, note: '' },
    { label: '라면', unit: 1500, people: 44, amount: 66000, note: '' },
  ],
  expenseTotal: 2070000,

  balance: 480000, // 예비비 = 2,550,000 − 2,070,000

  headcountNote:
    '회비는 참가 45명 기준 (성인 24 · 취학 16 · 미취학 5).',
  notes: [
    '회비는 식사·수영장·시설 등 공동 운영비. 숙소(유스호스텔)는 별도로 각자 부담.',
    '오병이어 음식·판매 물품은 회비에 미포함 — 별도 선교헌금(목표 300만)으로 준비.',
    '선교헌금 300만 중 220만 확보(교회 100 · 안수집사 20 · 추가 지원 100) — 부족 80만 자체 모금 중.',
    '회비 납부: 가정별 일괄 입금(입금자명 정확히) · 마감 7월 말.',
  ],
}
