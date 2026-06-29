// 부록 A — 사역 팀 구성 (오병이어 행사 운영)
// teams/{teamId} 메타와 동일 shape. (체크리스트·메모는 S4에서 Firestore 서브컬렉션)
// ※ 셀(참가)과 팀(사역)은 별개. 한 사람이 여러 팀/역할에 동시 소속될 수 있음(중복 정상).
//   노방 재배치는 '데이터 분기'가 아니라 안내 텍스트(reassignNote)로만 둔다 — 집계 중복 방지.
//   checklist = 팀별 준비 항목 시드(부록 A). 편집 모드(팀장)에서 체크/추가 미리보기.

export const teams = [
  {
    id: 'team-evangel', order: 1, emoji: '📣',
    name: '노방전도팀', role: '아이들과 거리 전도',
    leader: '김하연', members: ['전선희', '함대희'],
    note: '',
    reassignNote: '노방 종료(14:00) 후 재배치 → 김하연: 음식 / 전선희: 판매 / 함대희: 레크',
    checklist: [
      { id: 'ev1', text: '전도 동선·구역 정하기' },
      { id: 'ev2', text: '전도용 소품·전단 준비' },
    ],
  },
  {
    id: 'team-rec', order: 2, emoji: '🎉',
    name: '레크레이션팀', role: '실내 행사 진행',
    leader: '이성근', members: ['김성태', '홍석일', '한상원'],
    note: '',
    checklist: [
      { id: 'rec1', text: '실내 레크 프로그램 확정' },
      { id: 'rec2', text: '음향·도구·상품 준비' },
    ],
  },
  {
    id: 'team-food', order: 3, emoji: '🍜',
    name: '음식팀', role: '금 저녁 · 토 점심 준비',
    leader: '정재선', members: ['이정수', '정연설', '공미혜'],
    note: '',
    checklist: [
      { id: 'fd1', text: '메뉴 선정 문의 / 확정' },
      { id: 'fd2', text: '식자재 구매 리스트 작성' },
    ],
  },
  {
    id: 'team-sales', order: 4, emoji: '🛍️',
    name: '판매팀', role: '물품 구매 · 후원 · 판매',
    leader: '이하나', members: ['은정원', '최경연', '송혜란', '신나희'],
    note: '',
    checklist: [
      { id: 'sl1', text: '물품 구입 리스트(예: 냉감요)' },
      { id: 'sl2', text: '물품후원·헌금모금 포스터 제작' },
    ],
  },
  {
    id: 'team-foodtruck', order: 5, emoji: '🚚',
    name: '푸드트럭팀', role: '푸드트럭 운영',
    leader: '박용림', members: ['전덕인', '이민지'],
    note: '',
    checklist: [
      { id: 'ft1', text: '푸드트럭 섭외 · 메뉴 확정' },
    ],
  },
  {
    id: 'team-facility', order: 6, emoji: '🔧',
    name: '설비팀', role: '교회 시설 점검 · 수리',
    leader: '이인현', members: ['정표수', '권옥경', '최성곤'],
    note: '',
    checklist: [
      { id: 'fc1', text: '교회 필요 가정 조사(방충망·전등·콘센트)' },
      { id: 'fc2', text: '간단 수리 도구 준비' },
    ],
  },
]

// 지원 역할 (셀·팀과 별개 — 한 사람이 팀+지원역할 겸임 가능)
export const supportRoles = [
  { role: '디렉터 & 드론', people: ['이영천'] },
  { role: '회계', people: ['전선희'] },
  { role: '특송', people: ['전덕인 (전체)', '이민지 (어린이)'] },
  { role: '중보기도', people: ['전체'] },
  { role: '영상', people: ['(담당)'] },
]

/** 한 팀의 전체 명단(팀장 + 팀원) */
export const teamRoster = (team) => [team.leader, ...team.members]
