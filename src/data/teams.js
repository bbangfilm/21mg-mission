// 부록 A — 사역 팀 구성 (오병이어 행사 운영)
// teams/{teamId} 메타와 동일 shape. (체크리스트·메모는 S4에서 Firestore 서브컬렉션)
// ※ 셀(참가)과 팀(사역)은 별개. 한 사람이 여러 팀/역할에 동시 소속될 수 있음(중복 정상).
//   checklist = 팀별 준비 항목 시드(부록 A). 편집 모드(팀장)에서 체크/추가 미리보기.
// ★2026-07-12 회의 후 최종 확정(공지)으로 팀 구성 갱신:
//   푸드트럭팀 해체(3명→음식팀) · 이정수 음식→레크 · 신나희 판매→디렉터 ·
//   노방전도팀→전도·돌봄팀(노방 후 개별 재배치안 폐기, 행사 중 아이들 케어 겸) · 설비팀→수리팀.
//   ⚠️ id 는 유지 — Firestore 서브컬렉션 경로(teams/{id}/checklists) 보존.

export const teams = [
  {
    id: 'team-evangel', order: 1, emoji: '📣',
    name: '전도·돌봄팀', role: '마을 홍보 · 행사 중 아이들 케어',
    leader: '김하연', members: ['전선희', '함대희'],
    note: '금요 공식 전도 대신 현장 인원으로 유연한 홍보 활동(본 홍보는 토 오전). 행사 중에는 아이들 케어를 맡습니다.',
    checklist: [
      { id: 'ev1', text: '홍보 동선·구역 정하기 (금 도착 후 · 토 오전)' },
      { id: 'ev2', text: '홍보용 소품·전단 준비' },
    ],
  },
  {
    id: 'team-rec', order: 2, emoji: '🎉',
    name: '레크리에이션팀', role: '실내 행사 · 경품',
    leader: '이성근', members: ['이정수', '김성태', '홍석일', '한상원'],
    note: '(김성태) 미취학 아이들 케어 겸임.',
    checklist: [
      { id: 'rec1', text: '10~11시 붙잡는 프로그램 + 실내 레크 확정' },
      { id: 'rec2', text: '경품 기획 — 입장 번호표 · 중간중간 추첨' },
    ],
  },
  {
    id: 'team-food', order: 3, emoji: '🍜',
    name: '음식팀', role: '금 저녁(고기) · 토 분식 일손',
    leader: '정재선', members: ['정연설', '공미혜', '이민지', '박용림', '전덕인'],
    note: '토 점심 분식은 재료까지 현지 준비 — 음식팀은 일손으로 투입. (PM 전덕인)',
    checklist: [
      { id: 'fd1', text: '금 저녁 고기 세부 계획 — 도착 조사로 수량 확정' },
      { id: 'fd2', text: '가정당 불판 + 부탄가스 1개씩 지참(셀별 공지)' },
    ],
  },
  {
    id: 'team-sales', order: 4, emoji: '🛍️',
    name: '판매팀', role: '물품 · 후원 · 장터',
    leader: '이하나', members: ['은정원', '최경연', '송혜란'],
    note: '큰 구매는 현지 일괄 위임(250만) — 우리는 품목당 5개 내외 + 새 물건 후원 보강.',
    checklist: [
      { id: 'sl1', text: '‘새 물건’ 물품 후원 광고(주일 공지 후 ~3주) · 후원품 리스트' },
      { id: 'sl2', text: '경품 전환 선별 · 회계와 예산 대조' },
    ],
  },
  {
    id: 'team-facility', order: 5, emoji: '🔧',
    name: '수리팀', role: '가정·교회 시설 수리',
    leader: '이인현', members: ['정표수', '권옥경', '최성곤'],
    note: '범위·대상 가정은 현지 질의 후 확정 — 장판·전등(LED) 교체 유력.',
    checklist: [
      { id: 'fc1', text: '현지 회신 후 대상 가정·수리 범위 확인 (금요일 사전 답사)' },
      { id: 'fc2', text: '수리 도구·자재 준비 (전등·장판 중심)' },
    ],
  },
]

// 지원 역할 (셀·팀과 별개 — 한 사람이 팀+지원역할 겸임 가능)
export const supportRoles = [
  { role: '디렉터 & 드론', people: ['이영천', '신나희'] },
  { role: '회계', people: ['전선희'] },
  { role: '특송 · 축복송', people: ['전덕인 (전체)', '이민지 (어린이)'] },
  { role: '금요 찬양 · 드럼', people: ['김예준'] },
  { role: '미취학 아이들 케어', people: ['신나희', '김성태'] },
  { role: '중보기도', people: ['전체'] },
  { role: '영상 기록', people: ['팀별 1인 (가로 16:9)'] },
]

/** 한 팀의 전체 명단(팀장 + 팀원) */
export const teamRoster = (team) => [team.leader, ...team.members]
