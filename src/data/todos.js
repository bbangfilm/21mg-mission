// 07. 이번 주 할 일 — todos 시드 5개 (정적 폴백 shape).
// 실제로는 S4에서 Firestore 로 토글·담당자 편집(팀장 PIN).
export const todosSeed = [
  { id: 't1', order: 1, text: '오병이어 포스터(물품후원·헌금모금) 제작', done: false, assignee: '판매팀' },
  { id: 't2', order: 2, text: '음식 메뉴 선정 문의 / 확정', done: false, assignee: '음식팀' },
  { id: 't3', order: 3, text: '설비 가정조사(방충망·전등·콘센트 등 간단 수리 가능 여부)', done: false, assignee: '설비팀' },
  { id: 't4', order: 4, text: '물품 구입 리스트 작성(예: 냉감요)', done: false, assignee: '판매팀' },
  { id: 't5', order: 5, text: '팀장 채팅방 개설', done: false, assignee: '전체' },
]

// 06. 오병이어 바자회 품목 — 초기 리스트 미정(11장). 아래는 카테고리 예시 시드(편집 모드 미리보기용).
export const bazaarSeed = [
  { id: 'bz1', category: '의류', name: '여름 의류 (성인·아동)', done: false },
  { id: 'bz2', category: '의류', name: '신발·가방', done: false },
  { id: 'bz3', category: '생활용품', name: '수건·주방용품', done: false },
  { id: 'bz4', category: '생활용품', name: '냉감요·여름 침구', done: false },
  { id: 'bz5', category: '먹거리', name: '김밥 재료', done: false },
  { id: 'bz6', category: '먹거리', name: '떡볶이·어묵 재료', done: false },
]
export const bazaarCategories = ['의류', '생활용품', '먹거리']
