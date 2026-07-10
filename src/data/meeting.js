// 팀장 모임 — 회의 진행 보드 (정적 단일 출처)
// 참석자는 teams.js(팀장 6)·editors.js(MG리더 6)에서 파생 — 겸임(이하나)은 자동 병합돼 총 11명.
// 진행 상태는 Firestore: config/meeting { phase, phaseAt } + meeting/{안건id} { done, note, by }.
import { teams } from './teams.js'
import { adminEditors } from './editors.js'

export const meetingInfo = {
  title: '단기선교 팀장 모임',
  date: '7/12 (토)', // 모임 날짜 변경 시 여기만 수정 (홈 카드 문구에도 반영됨)
  duration: '약 90분',
  goal: '전체 → 팀별 → 전체 — 일정·예산 틀을 먼저 확정하고, 그 틀 안에서 팀별 실행 계획을 짠다',
}

/** 참석자 — 팀장 6 + MG리더(셀리더 부부) 6, 겸임은 역할 병기 */
export const attendees = (() => {
  const map = new Map()
  teams.forEach((t) => map.set(t.leader, [`${t.name}장`]))
  adminEditors.forEach((n) => map.set(n, [...(map.get(n) || []), 'MG리더']))
  return [...map.entries()].map(([name, roles]) => ({ name, role: roles.join(' · ') }))
})()

/** 진행 순서 — kind: 'all'(전체) | 'team'(분임). time = 시작 시점(0:00 기준), min = 배정 분 */
export const phases = [
  { id: 'p1', time: '0:00', min: 5,  kind: 'all',  title: '오프닝 · 기도',   detail: '오늘 확정할 안건 공지 — 일정제안표 화면에 띄우기' },
  { id: 'p2', time: '0:05', min: 15, kind: 'all',  title: '일정 확정',       detail: '노방전도 토→금 · 금요 저녁 MG모임 → 금요일 타임라인 잠금' },
  { id: 'p3', time: '0:20', min: 15, kind: 'all',  title: '예산 점검',       detail: '회계 보고 · 팀별 한도 · 구매 프로세스(요청→판매팀 취합→회계 승인)' },
  { id: 'p4', time: '0:35', min: 5,  kind: 'all',  title: '조사 · 배정 확정', detail: '1박 가정 조사 · 금요 찬양인도 · 특송 곡/연습' },
  { id: 'p5', time: '0:40', min: 25, kind: 'team', title: '팀별 분임',       detail: '4개 코너 — 실행 계획 + 물품·예산 요청서 작성' },
  { id: 'p6', time: '1:05', min: 20, kind: 'all',  title: '발표 · 취합',     detail: '팀당 3분 발표 · 구매 리스트 통합 · 예산 확정' },
  { id: 'p7', time: '1:25', min: 5,  kind: 'all',  title: '마무리',          detail: '결정사항 낭독 · 다음 점검일 · 마무리 기도' },
]

/** 확정할 안건 — scope: 'all'(전체 논의) | 'team'(팀별 논의). 체크·메모는 Firestore 오버레이 */
export const decisions = [
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
]

/** 분임 4코너 (25분) — 참석자 소속 기준 배치 */
export const corners = [
  { id: 'c-food',  emoji: '🍜', name: '음식 코너',      people: ['정재선', '박용림', '전덕인'], task: '금·토 메뉴 확정 · 식자재 리스트 · 푸드트럭 연계' },
  { id: 'c-goods', emoji: '🛍️', name: '물품·광고 코너', people: ['이하나', '신나희', '전선희'], task: '구매 리스트 · 현수막/포스터 문구 · 예산 대조' },
  { id: 'c-prog',  emoji: '🎉', name: '프로그램 코너',  people: ['이성근', '김성태', '김하연'], task: '레크 확정 · 노방 동선 · 토요일 재배치표 갱신' },
  { id: 'c-fac',   emoji: '🔧', name: '설비 코너',      people: ['이인현', '이영천'], task: '수요 조사 문항 · 현지 교회 소통 채널' },
]

/** 회의 전 준비 체크 — 상태는 meeting/{id} 오버레이 (안건과 같은 컬렉션) */
export const prepItems = [
  { id: 'prep-notice', text: '안건 + 대시보드 링크 공지 — 팀 체크리스트·일정제안표 보고 오기' },
  { id: 'prep-draft',  text: '팀장별 필요 물품·예상 비용 초안 1장' },
  { id: 'prep-fund',   text: '회계: 선교헌금 모금 현황 정리 (목표 300만 대비)' },
  { id: 'prep-church', text: '디렉터: 현지 교회 문의 — 노방 시간대 · 금요 식사 인원 · 수리 조사 협조' },
]

/** D-Day(8/14 금) 역산 마감 */
export const milestones = [
  { date: '이번 주',   text: '현지 교회 협조 요청 발송 (수리 조사 · 노방 시간대 · 금요 식사 인원)' },
  { date: '7월 중순',  text: '1박 가정 파악 · 유스호스텔 4인실 배정 확정' },
  { date: '7월 말',    text: '현수막·포스터 발주 · 수리 수요 회신 마감' },
  { date: '8월 첫 주', text: '물품 구매 완료 (배송 여유 확보)' },
  { date: '매주 1회',  text: '특송 연습 (총 4회) · 팀별 진행 점검' },
  { date: '8/14 (금)', text: '국내단기선교 출발 — D-Day' },
]
