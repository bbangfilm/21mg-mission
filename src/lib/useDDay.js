// D-Day 계산 — KST(+09:00) 고정.
// ⚠️ new Date('2026-08-14') 는 UTC 자정 파싱이라 KST에서 하루 어긋남 → 명시 오프셋 파싱.
// 규칙: 시작 전 'D-n' / 행사 기간(start~end) 'D-DAY' / 종료 후 보관 문구.
import { useEffect, useState } from 'react'

/** 'YYYY-MM-DD' → KST 자정 기준 Date */
function kstMidnight(ymd) {
  const [y, m, d] = ymd.split('-').map(Number)
  // UTC 기준 15:00 == KST 다음날 00:00 → KST 자정의 UTC 표현
  return new Date(Date.UTC(y, m - 1, d) - 9 * 3600 * 1000)
}

/** 사용자 '오늘'(로컬)을 KST 날짜 자정으로 정규화 */
function todayKstMidnight(now = new Date()) {
  // 현재 시각을 KST 로 옮긴 뒤 날짜만 취함
  const kst = new Date(now.getTime() + 9 * 3600 * 1000)
  return kstMidnight(
    `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}-${String(kst.getUTCDate()).padStart(2, '0')}`
  )
}

const DAY = 86400000

/**
 * @param {string} dateStart 'YYYY-MM-DD'
 * @param {string} [dateEnd]  'YYYY-MM-DD'
 * @returns {{ label: string, sub: string, phase: 'before'|'during'|'after', days: number }}
 */
export function computeDDay(dateStart, dateEnd = dateStart, now = new Date()) {
  const start = kstMidnight(dateStart)
  const end = kstMidnight(dateEnd)
  const today = todayKstMidnight(now)
  const diff = Math.round((start - today) / DAY)

  if (today < start) return { label: `D-${diff}`, sub: '행사까지', phase: 'before', days: diff }
  if (today <= end) {
    const dn = Math.round((today - start) / DAY)
    return { label: dn === 0 ? 'D-DAY' : `행사 ${dn + 1}일차`, sub: '진행 중', phase: 'during', days: 0 }
  }
  return { label: '행사 종료', sub: '함께한 은혜에 감사', phase: 'after', days: Math.round((today - end) / DAY) }
}

/**
 * D-Day 구독 훅 — 렌더 1회 계산이 아니라 시간 경과·앱 복귀에 반응한다.
 * iOS 홈 화면 앱은 리로드 없이 메모리 복원되므로, 자정을 넘겨 다시 열면
 * 1분 인터벌 + visibilitychange 재계산이 없을 경우 전날 'D-1'이 그대로 남는다.
 */
export function useDDay(dateStart, dateEnd = dateStart) {
  const [dday, setDday] = useState(() => computeDDay(dateStart, dateEnd))
  useEffect(() => {
    const update = () => setDday((prev) => {
      const next = computeDDay(dateStart, dateEnd)
      return prev.label === next.label && prev.sub === next.sub ? prev : next // 불변이면 리렌더 생략
    })
    const id = setInterval(update, 60_000)
    const onVis = () => { if (document.visibilityState === 'visible') update() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [dateStart, dateEnd])
  return dday
}
