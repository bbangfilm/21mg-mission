// 팀장 모임 — 회의 목록 + 회의별 진행 보드 데이터 (정적 단일 출처)
// ★각 회의 항목은 그 회의 당시의 '기록' — 이후 팀 개편(푸드트럭팀 해체 등)을 소급 반영하지 않는다.
//   참석자도 파생이 아닌 회의 당시 고정 스냅샷으로 둔다.
// 진행 상태는 Firestore: stateDoc { phase, phaseAt } + itemsCol/{안건·준비id} { done, note, by }.
//
// ★새 회의 추가 방법 — 배열 끝에 객체 하나 추가하면 목록·보드·홈 카드에 자동 반영:
//   { id: 'm2', seq: 2, title: '…', date: '7/26 (토)', dateISO: '2026-07-26', duration: '…',
//     goal: '…', attendees: […], phases: […], decisions: […], corners: […], prepItems: […], milestones: […] }
//   - stateDoc/itemsCol 은 생략 — meetings/m2 · meetings/m2/items 규약이 자동 적용(1차만 레거시 경로)
//   - 단, firestore.rules 의 meetings/{mid} 두 블록이 Firebase 콘솔에 게시돼 있어야 함(최초 1회)

export const meetings = [
  {
    id: 'm1', seq: 1,
    title: '단기선교 팀장 모임',
    date: '7/12 (토)', dateISO: '2026-07-12',
    duration: '약 90분',
    goal: '전체 → 팀별 → 전체 — 일정·예산 틀을 먼저 확정하고, 그 틀 안에서 팀별 실행 계획을 짠다',

    // 1차 회의는 배포 당시의 레거시 Firestore 경로 유지 — 라이브 기록(단계·확정·메모) 보존
    stateDoc: 'config/meeting',
    itemsCol: 'meeting',

    /** 참석자 — 회의(7/12) 당시 스냅샷: 팀장 6 + MG리더(셀리더 부부) 6, 겸임은 역할 병기 */
    attendeesNote: '팀장 + MG리더 (겸임 병기)', // 보드 메타에 인원수 뒤 표기 — 회차별 구성 설명
    attendees: [
      { name: '김하연', role: '노방전도팀장' },
      { name: '이성근', role: '레크레이션팀장' },
      { name: '정재선', role: '음식팀장' },
      { name: '이하나', role: '판매팀장 · MG리더' },
      { name: '박용림', role: '푸드트럭팀장' },
      { name: '이인현', role: '설비팀장' },
      { name: '이영천', role: 'MG리더' },
      { name: '신나희', role: 'MG리더' },
      { name: '김성태', role: 'MG리더' },
      { name: '전덕인', role: 'MG리더' },
      { name: '전선희', role: 'MG리더' },
    ],

    /** 진행 순서 — kind: 'all'(전체) | 'team'(분임). time = 시작 시점(0:00 기준), min = 배정 분 */
    phases: [
      { id: 'p1', time: '0:00', min: 5,  kind: 'all',  title: '오프닝 · 기도',   detail: '오늘 확정할 안건 공지 — 일정제안표 화면에 띄우기' },
      { id: 'p2', time: '0:05', min: 15, kind: 'all',  title: '일정 확정',       detail: '노방전도 토→금 · 금요 저녁 MG모임 → 금요일 타임라인 잠금' },
      { id: 'p3', time: '0:20', min: 15, kind: 'all',  title: '예산 점검',       detail: '회계 보고 · 팀별 한도 · 구매 프로세스(요청→판매팀 취합→회계 승인)' },
      { id: 'p4', time: '0:35', min: 5,  kind: 'all',  title: '조사 · 배정 확정', detail: '1박 가정 조사 · 금요 찬양인도 · 특송 곡/연습' },
      { id: 'p5', time: '0:40', min: 25, kind: 'team', title: '팀별 분임',       detail: '4개 코너 — 실행 계획 + 물품·예산 요청서 작성' },
      { id: 'p6', time: '1:05', min: 20, kind: 'all',  title: '발표 · 취합',     detail: '팀당 3분 발표 · 구매 리스트 통합 · 예산 확정' },
      { id: 'p7', time: '1:25', min: 5,  kind: 'all',  title: '마무리',          detail: '결정사항 낭독 · 다음 점검일 · 마무리 기도' },
    ],

    /** 확정할 안건 — scope: 'all'(전체 논의) | 'team'(팀별 논의). 체크·메모는 Firestore 오버레이 */
    decisions: [
      { id: 'd-evangel-move',  scope: 'all',  tag: '일정', title: '노방전도 토→금 이동',
        hint: '시간대·우천 대안 — 이동 시 토요일 재배치표(김하연→음식 · 전선희→판매 · 함대희→레크) 갱신',
        owner: '전체 + 노방 김하연' },
      { id: 'd-fri-mg',        scope: 'all',  tag: '일정', title: '금요 저녁 MG모임',
        hint: '식당 여부·장소 · 비용 출처(예비비 41만?) · 20:00 금요예배와 순서 조정',
        owner: '전체' },
      { id: 'd-budget-cap',    scope: 'all',  tag: '예산', title: '팀별 예산 한도',
        hint: '회비 지갑(예비 41만)과 선교헌금 지갑(목표 300만 — 오병이어 음식·물품) 구분해서 배분',
        owner: '회계 전선희' },
      { id: 'd-purchase-flow', scope: 'all',  tag: '예산', title: '물품 구매 프로세스',
        hint: '팀 요청 → 판매팀 취합 → 회계 승인 (중복 구매 방지)',
        owner: '판매 이하나' },
      { id: 'd-onenight',      scope: 'all',  tag: '조사', title: '1박 가정 조사',
        hint: '셀리더 3쌍이 셀별 조사 · 마감일 확정 (유스호스텔 4인실 배정에 필요)',
        owner: '셀리더 3쌍' },
      { id: 'd-fri-praise',    scope: 'all',  tag: '배정', title: '금요일 찬양인도자',
        hint: '금요저녁예배 20:00 — 현재 담당자 없음, 회의에서 지명',
        owner: '전체 지명' },
      { id: 'd-special-song',  scope: 'all',  tag: '배정', title: '특송 곡 · 연습 일정',
        hint: "'축복의 시간'? · 주 1회 × 4회 — 첫 연습일까지 확정",
        owner: '전덕인(전체) · 이민지(어린이)' },
      { id: 'd-goods-ad',      scope: 'team', tag: '분임', title: '행사 물품 · 광고',
        hint: '구매 리스트(냉감요 등) · 현수막/포스터 문구 — 7월 말 발주',
        owner: '판매팀' },
      { id: 'd-event-food',    scope: 'team', tag: '분임', title: '행사 식사 (토 먹거리)',
        hint: '메뉴·식자재 리스트 · 푸드트럭 메뉴와 연계',
        owner: '음식팀 · 푸드트럭팀' },
      { id: 'd-fri-food',      scope: 'team', tag: '분임', title: '금요일 음식 준비',
        hint: '석식(금) 40만 책정 — 일정·MG모임 결정에 맞춰 조정',
        owner: '음식팀' },
      { id: 'd-repair',        scope: 'team', tag: '분임', title: '수리 수요 조사',
        hint: '방충망·전등·콘센트 문항 · 현지 교회 협조 요청(이번 주 발송)',
        owner: '설비 이인현 + 디렉터 이영천' },
    ],

    /** 분임 4코너 (25분) — 참석자 소속 기준 배치 */
    corners: [
      { id: 'c-food',  emoji: '🍜', name: '음식 코너',      people: ['정재선', '박용림', '전덕인'], task: '금·토 메뉴 확정 · 식자재 리스트 · 푸드트럭 연계' },
      { id: 'c-goods', emoji: '🛍️', name: '물품·광고 코너', people: ['이하나', '신나희', '전선희'], task: '구매 리스트 · 현수막/포스터 문구 · 예산 대조' },
      { id: 'c-prog',  emoji: '🎉', name: '프로그램 코너',  people: ['이성근', '김성태', '김하연'], task: '레크 확정 · 노방 동선 · 토요일 재배치표 갱신' },
      { id: 'c-fac',   emoji: '🔧', name: '설비 코너',      people: ['이인현', '이영천'], task: '수요 조사 문항 · 현지 교회 소통 채널' },
    ],

    /** 회의 전 준비 체크 — 상태는 itemsCol/{id} 오버레이 (안건과 같은 컬렉션) */
    prepItems: [
      { id: 'prep-notice', text: '안건 + 대시보드 링크 공지 — 팀 체크리스트·일정제안표 보고 오기' },
      { id: 'prep-draft',  text: '팀장별 필요 물품·예상 비용 초안 1장' },
      { id: 'prep-fund',   text: '회계: 선교헌금 모금 현황 정리 (목표 300만 대비)' },
      { id: 'prep-church', text: '디렉터: 현지 교회 문의 — 노방 시간대 · 금요 식사 인원 · 수리 조사 협조' },
    ],

    /** D-Day(8/14 금) 역산 마감 */
    milestones: [
      { date: '이번 주',   text: '현지 교회 협조 요청 발송 (수리 조사 · 노방 시간대 · 금요 식사 인원)' },
      { date: '7월 중순',  text: '1박 가정 파악 · 유스호스텔 4인실 배정 확정' },
      { date: '7월 말',    text: '현수막·포스터 발주 · 수리 수요 회신 마감' },
      { date: '8월 첫 주', text: '물품 구매 완료 (배송 여유 확보)' },
      { date: '매주 1회',  text: '특송 연습 (총 4회) · 팀별 진행 점검' },
      { date: '8/14 (금)', text: '국내단기선교 출발 — D-Day' },
    ],
  },

  // 2차 — 예정(일정 미정). 회의 후 공지: "다음 팀장 회의는 8월 둘째 주 MG 전체모임 후".
  // ★placeholder: 안건은 1차 '미결 6건'을 이월. 일정 확정 시 date/dateISO 만 갱신.
  // ⚠️ meetings/m2 규약 사용 — 편집(진행 저장)은 firestore.rules 의 meetings/{mid} 두 블록을
  //    Firebase 콘솔에 게시해야 동작(미게시면 읽기 전용 정적 폴백으로만 표시).
  {
    id: 'm2', seq: 2,
    title: '단기선교 팀장 모임 (2차)',
    date: '8월 둘째 주', dateISO: '2026-08-09',
    duration: '미정',
    goal: '8월 둘째 주 MG 전체모임 후 잠깐 — 1차 미결 안건 점검 + 팀별 준비 현황 공유. 일정 확정 시 다시 안내합니다.',

    attendeesNote: '팀장 + MG리더 (일정 확정 후 최종)',
    attendees: [
      { name: '이영천', role: '디렉터 · MG리더' },
      { name: '신나희', role: '디렉터 · MG리더' },
      { name: '김하연', role: '전도·돌봄팀장' },
      { name: '이성근', role: '레크팀장' },
      { name: '정재선', role: '음식팀장' },
      { name: '이하나', role: '판매팀장 · MG리더' },
      { name: '이인현', role: '수리팀장' },
      { name: '김성태', role: 'MG리더' },
      { name: '전덕인', role: 'MG리더' },
      { name: '전선희', role: 'MG리더 · 회계' },
    ],

    phases: [
      { id: 'p1', time: '0:00', min: 5,  kind: 'all',  title: '오프닝 · 기도',     detail: 'MG 전체모임 직후 — 짧게' },
      { id: 'p2', time: '0:05', min: 15, kind: 'all',  title: '1차 미결 점검',     detail: '홍보 활동 · 찬양 인도자 · 특송/축복송 · 경품 · 나눔 · 우천 대안' },
      { id: 'p3', time: '0:20', min: 15, kind: 'team', title: '팀별 준비 현황',    detail: '팀별 진행률 공유 + 남은 구매·발주 확인' },
      { id: 'p4', time: '0:35', min: 5,  kind: 'all',  title: '마무리',            detail: '역할 재확인 · 마무리 기도' },
    ],

    decisions: [
      { id: 'd2-promo',  scope: 'all',  tag: '일정', title: '금요 홍보 활동 실행 여부',
        hint: '현장 판단 · 홍보물(현지 제작/자체) 확보 경로', owner: '전도·돌봄팀 · 디렉터' },
      { id: 'd2-praise', scope: 'all',  tag: '배정', title: '금요 찬양 인도자 · 세션 최종 구성',
        hint: '드럼 김예준 확정 · 인도자/세션 미정 · 드럼 작동 확인', owner: '찬양팀' },
      { id: 'd2-song',   scope: 'all',  tag: '배정', title: '특송 · 축복송 곡 · 반주 방식',
        hint: 'MR/건반 · 8/2 MG모임 연습 반영', owner: '전덕인 · 이민지' },
      { id: 'd2-prize',  scope: 'team', tag: '분임', title: '경품 품목 · 재원',
        hint: '선교헌금 잔여(~50만) 내 배분 · 후원 새 물건 활용', owner: '레크팀' },
      { id: 'd2-share',  scope: 'all',  tag: '일정', title: '토 저녁 전체 나눔 진행 방식',
        hint: '개인/그룹 · 식후 30분', owner: '인도자' },
      { id: 'd2-rain',   scope: 'team', tag: '분임', title: '우천 시 수영장 대안',
        hint: '주변 대체 시설 조사', owner: '디렉터' },
    ],

    corners: [
      { id: 'c2-food',  emoji: '🍜', name: '음식·식사 코너',   people: ['정재선', '전덕인'], task: '금 고기 수량 · 토 분식 일손 · 불판·부탄가스 지참 안내' },
      { id: 'c2-sales', emoji: '🛍️', name: '판매·후원 코너',   people: ['이하나'], task: '후원품 리스트 · 경품 선별 · 현지 물품 위임(250만) 확인' },
      { id: 'c2-prog',  emoji: '🎉', name: '프로그램·전도 코너', people: ['이성근', '김하연'], task: '10~11시 홀딩 프로그램 · 경품 추첨 · 홍보 동선' },
      { id: 'c2-fac',   emoji: '🔧', name: '수리·현장 코너',   people: ['이인현', '이영천'], task: '수리 대상 가정 회신 · 현수막 · 팀별 영상 기록' },
    ],

    prepItems: [
      { id: 'prep2-status', text: '각 팀 준비 현황(진행률·남은 구매·발주) 정리해 오기' },
      { id: 'prep2-survey', text: '1박 가정 · 금요 도착시간 조사 결과 취합' },
    ],

    milestones: [
      { date: '7월 말',    text: '회비 마감 · 수리 회신 · 현수막 발주' },
      { date: '8월 첫 주', text: '물품 구매 완료 · 후원 새 물건 취합' },
      { date: '8/2 (일)',  text: '특송 · 축복송 연습 (MG 전체모임)' },
      { date: '8/9 (일)',  text: '2차 팀장 모임 예정 (MG 전체모임 후)' },
      { date: '8/14 (금)', text: '국내단기선교 출발 — D-Day' },
    ],
  },
]

export const meetingById = (id) => meetings.find((m) => m.id === id)

/** 회의별 Firestore 경로 — 명시가 없으면 meetings/{id} 규약(2차 회의부터) */
export const meetingPaths = (m) => ({
  stateDoc: m.stateDoc || `meetings/${m.id}`,
  itemsCol: m.itemsCol || `meetings/${m.id}/items`,
})

const localISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 오늘 기준 회의 상태 — 목록 배지·홈 카드 문구용 */
export const meetingStatus = (m) => {
  const today = localISO()
  return m.dateISO === today ? 'today' : m.dateISO > today ? 'upcoming' : 'past'
}

/** 홈 카드용 — 다가오는(오늘 포함) 회의가 있으면 그것, 없으면 마지막 회의 */
export const upcomingOrLatest = () => {
  const today = localISO()
  return meetings.find((m) => m.dateISO >= today) || meetings[meetings.length - 1]
}
