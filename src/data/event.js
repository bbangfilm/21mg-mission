// config/event 와 동일 shape (정적 단일 출처).
// D-Day 는 dateStart 로 클라에서 계산 — 서버 카운트다운 필드 없음(시계 드리프트 차단).
export const event = {
  title: '2026 더행복한교회 국내단기선교',
  team: '21MG',
  subtitle: '충남 부여 · 홍산은혜교회',
  church: '홍산은혜(감리)교회',
  churchNote: '창립 9주년',
  location: '충남 부여',
  accommodation: '부여군유스호스텔 (4인실)',
  accommodationNote: '숙소비 별도 · 각자 부담',
  mainMinistry: '오병이어 나눔축제',
  dateStart: '2026-08-14', // 금
  dateEnd: '2026-08-16',   // 일
  durationLabel: '2박 3일',
  verse: '사도행전 1:8',
  headcount: 45, // 참가 표시 인원 (회비 산정은 44명 — budget.js headcountNote 참조)
}
