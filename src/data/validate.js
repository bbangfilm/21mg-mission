// 데이터 정합성 검증 (개발 모드 전용 — main.jsx 에서 dev 일 때만 실행)
// 적대적 검토 반영:
//   - 단순 'subset' 검증은 거짓 안심 → 양방향으로.
//   (1) 팀 이름 ⊆ 셀 명단 단일출처 (오타 탐지)
//   (2) 미배정 인원 리스트 출력 (어린이·가족 ~20명, 실패 아님 — 의도된 상태)
//   (3) 다중 팀/역할 소속자 출력 (전선희·전덕인·이민지 등, 중복은 의도)
import { cells, cellTotal, totalHeadcount, allRoster } from './cells.js'
import { teams, teamRoster, supportRoles } from './teams.js'

export function runValidation() {
  const report = { ok: true, errors: [], info: [] }
  const roster = allRoster()
  const rosterSet = new Set(roster)

  // (0) 참가 합계
  const total = totalHeadcount()
  if (total !== 45) {
    report.ok = false
    report.errors.push(`참가 합계가 45가 아님: ${total} (셀별 인원 확인 필요)`)
  }
  report.info.push(`참가 합계 ${total}명 (영천 ${cellTotal(cells[0])} · 성태 ${cellTotal(cells[1])} · 덕인 ${cellTotal(cells[2])})`)

  // 명단 내 중복 이름(동명이인 주의)
  if (rosterSet.size !== roster.length) {
    const dups = roster.filter((n, i) => roster.indexOf(n) !== i)
    report.info.push(`명단 중복 이름(동명이인?): ${[...new Set(dups)].join(', ')}`)
  }

  // (1) 팀/지원역할 이름이 셀 명단에 존재하는가 (오타 탐지)
  const teamPeople = teams.flatMap(teamRoster)
  const unknown = [...new Set(teamPeople)].filter((n) => !rosterSet.has(n))
  if (unknown.length) {
    report.ok = false
    report.errors.push(`셀 명단에 없는 팀 멤버(오타?): ${unknown.join(', ')}`)
  }

  // (2) 미배정 인원 (팀에도 지원역할에도 없는 사람) — 정보성(어린이/가족, 정상)
  const supportPeople = supportRoles.flatMap((r) =>
    r.people.flatMap((p) => p.replace(/\s*\(.*?\)\s*/g, '').trim()).filter((p) => p && p !== '전체' && p !== '(담당)')
  )
  const assigned = new Set([...teamPeople, ...supportPeople])
  const unassigned = roster.filter((n) => !assigned.has(n))
  report.info.push(`사역팀 미배정 ${unassigned.length}명(의도된 상태 — 어린이·가족): ${unassigned.join(', ')}`)

  // (3) 다중 소속자 (여러 팀/역할 카드에 동시 노출 — 중복은 의도)
  const count = {}
  ;[...teamPeople, ...supportPeople].forEach((n) => (count[n] = (count[n] || 0) + 1))
  const multi = Object.entries(count).filter(([, c]) => c > 1).map(([n, c]) => `${n}(${c})`)
  if (multi.length) report.info.push(`다중 팀/역할 소속(의도): ${multi.join(', ')}`)

  return report
}

/** 콘솔에 보기 좋게 출력 */
export function logValidation() {
  const r = runValidation()
  const tag = r.ok ? '✅' : '⛔'
  console.groupCollapsed(`${tag} [데이터 검증] errors:${r.errors.length} info:${r.info.length}`)
  r.errors.forEach((e) => console.error('  ⛔', e))
  r.info.forEach((i) => console.info('  ·', i))
  console.groupEnd()
  return r
}
