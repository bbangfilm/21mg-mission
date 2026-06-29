// 01. 공지사항 — notices/{id} shape. 관리자(PIN)만 등록·고정·삭제.
// 아래는 예시 시드(편집 모드 미리보기용). 실제로는 비어서 시작하거나 관리자가 작성.
export const noticesSeed = [
  { id: 'nt1', text: '8/14(금) 오전 9시 교회 앞 집합입니다. 늦지 않게 와주세요! 🙏', pinned: true, by: '이영천', at: '6/20 10:00' },
  { id: 'nt2', text: '오병이어 물품후원 받습니다 — 판매팀에게 문의해 주세요.', pinned: false, by: '신나희', at: '6/18 21:30' },
]
