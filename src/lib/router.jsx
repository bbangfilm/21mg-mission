import { useSyncExternalStore } from 'react'

// 라우트 레지스트리 — key, 표시 제목. 홈은 key ''(빈 문자열).
export const ROUTES = {
  '':       { title: '21MG 국내선교' },
  ministry: { title: '사역·나눔' },
  people:   { title: '참가자·팀' },
  schedule: { title: '일정·장소' },
  finance:  { title: '재정' },
  todo:     { title: '준비 To-Do' },
  meeting:  { title: '팀장 모임' },
}

// '#/ministry' → 'ministry' / '#/','','#hero' 등 미등록 → ''(홈 폴백)
export function parseHash(hash) {
  const m = (hash || '').replace(/^#\/?/, '').split(/[/?]/)[0]
  return Object.prototype.hasOwnProperty.call(ROUTES, m) ? m : ''
}

function subscribe(cb) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getSnapshot = () => window.location.hash

// 현재 라우트 key 구독
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, getSnapshot, () => '')
  return parseHash(hash)
}

// 두 번째 세그먼트 구독 — '#/meeting/m1' → 'm1', 없으면 ''.
// 같은 라우트 key 안의 서브 뷰(목록↔상세) 전환용 — App의 key={route} 리마운트는 발생하지 않는다.
export function useRouteParam() {
  const hash = useSyncExternalStore(subscribe, getSnapshot, () => '')
  return (hash || '').replace(/^#\/?/, '').split('?')[0].split('/')[1] || ''
}

// 프로그램적 이동
export function navigate(key) {
  const next = key ? `#/${key}` : '#/'
  if (window.location.hash !== next) window.location.hash = next
}

// 라우트별 스크롤 위치 기억(홈 복원용)
const scrollPositions = new Map()
export function saveScroll(key) { scrollPositions.set(key, window.scrollY) }
export function getScroll(key) { return scrollPositions.get(key) }

// 떠나는 라우트의 스크롤은 hashchange 시점(React 리렌더 전, 이전 DOM 그대로일 때)에 저장.
// 렌더 후 저장하면 새 페이지가 더 짧을 때 브라우저가 scrollY를 클램프한 값이 저장돼 복원이 틀어진다.
// 이 리스너는 모듈 로드 시 등록되어 React 구독(cb)보다 먼저 실행된다.
let departing = parseHash(typeof window !== 'undefined' ? window.location.hash : '')
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    saveScroll(departing)
    departing = parseHash(window.location.hash)
  })
}

// 접근성/공유용 링크 — 실제 <a href>라 미들클릭·새탭·스크린리더 OK
export function Link({ to = '', className, children, ...rest }) {
  return <a href={to ? `#/${to}` : '#/'} className={className} {...rest}>{children}</a>
}
