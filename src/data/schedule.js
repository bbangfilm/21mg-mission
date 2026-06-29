// 부록 D — 일정 (2박 3일). schedule/{dayId} 와 동일 shape.
// d2 10:00–14:00 오병이어 행 highlight:true (메인 사역일).
export const schedule = [
  {
    id: 'd1', order: 1, date: '8/14', dow: '금', label: '도착 · 첫날',
    items: [
      { time: '15:00', title: '도착 · 식사 준비' },
      { time: '17:00', title: '저녁식사', sub: '성도들과 함께' },
      { time: '20:00', title: '금요저녁예배' },
    ],
  },
  {
    id: 'd2', order: 2, date: '8/15', dow: '토', label: '메인 사역일',
    items: [
      { time: '08:00', title: '조식' },
      { time: '09:00', title: '행사 준비', sub: '음식 · 물품 셋팅' },
      { time: '10:00–14:00', title: '오병이어 행사', sub: '실내 레크레이션 · 노방전도', highlight: true },
      { time: '15:00', title: '수영장 이동 & 놀이' },
      { time: '18:30', title: '석식' },
      { time: '19:00', title: '셀별 자유시간' },
    ],
  },
  {
    id: 'd3', order: 3, date: '8/16', dow: '일', label: '마무리',
    items: [
      { time: '08:00', title: '조식' },
      { time: '10:00', title: '교회 도착' },
      { time: '11:00', title: '주일예배', sub: '특송' },
      { time: '13:00', title: '점심 후 종료' },
    ],
  },
]
