import { useSyncExternalStore } from 'react'

// 라우트 레지스트리 — key, 표시 제목. 홈은 key ''(빈 문자열).
export const ROUTES = {
  '':       { title: '21MG 국내선교' },
  ministry: { title: '사역·나눔' },
  people:   { title: '참가자·팀' },
  schedule: { title: '일정·장소' },
  finance:  { title: '재정' },
  todo:     { title: '준비 To-Do' },
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

// 프로그램적 이동
export function navigate(key) {
  const next = key ? `#/${key}` : '#/'
  if (window.location.hash !== next) window.location.hash = next
}

// 라우트별 스크롤 위치 기억(홈 복원용)
const scrollPositions = new Map()
export function saveScroll(key) { scrollPositions.set(key, window.scrollY) }
export function getScroll(key) { return scrollPositions.get(key) }

// 접근성/공유용 링크 — 실제 <a href>라 미들클릭·새탭·스크린리더 OK
export function Link({ to = '', className, children, ...rest }) {
  return <a href={to ? `#/${to}` : '#/'} className={className} {...rest}>{children}</a>
}
