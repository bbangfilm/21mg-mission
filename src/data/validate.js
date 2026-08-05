// 데이터 정합성 검증 (개발 모드 전용 — main.jsx 에서 dev 일 때만 실행)
// 적대적 검토 반영:
//   - 단순 'subset' 검증은 거짓 안심 → 양방향으로.
//   (1) 팀 이름 ⊆ 셀 명단 단일출처 (오타 탐지)
//   (2) 미배정 인원 리스트 출력 (어린이·가족 ~20명, 실패 아님 — 의도된 상태)
//   (3) 다중 팀/역할 소속자 출력 (전선희·전덕인·이민지 등, 중복은 의도)
import { cells, ministers, cellTotal, totalHeadcount, allRoster } from './cells.js'
import { teams, teamRoster, supportRoles } from './teams.js'
import { budget } from './budget.js'
import { bazaarPlan, validateBazaar } from './bazaar.js'

// 참가 확정 인원 — 명단이 바뀌면 이 값도 같이 바꾼다(오타로 인원이 흔들리면 즉시 실패).
const EXPECTED_TOTAL = 53

// 예산 확정 총액(2026-08-05 회계 확정) — budget.js 는 행에서 런타임 합산하므로
// 여기서 확정액과 대조해야 행 하나를 잘못 고쳤을 때 즉시 드러난다.
const EXPECTED_INCOME = 7530000
const EXPECTED_EXPENSE = 6423500

export function runValidation() {
  const report = { ok: true, errors: [], info: [] }
  const roster = allRoster()
  const rosterSet = new Set(roster)

  // (0) 참가 합계
  const total = totalHeadcount()
  if (total !== EXPECTED_TOTAL) {
    report.ok = false
    report.errors.push(`참가 합계가 ${EXPECTED_TOTAL}이 아님: ${total} (셀별 인원 확인 필요)`)
  }
  report.info.push(
    `참가 합계 ${total}명 (영천 ${cellTotal(cells[0])} · 성태 ${cellTotal(cells[1])} · 덕인 ${cellTotal(cells[2])} · 사역자 ${ministers.length})`
  )

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

  // (4) 예산 — 행 합산이 회계 확정 총액과 일치하는가
  const inc = budget.incomeTotal.amount
  const exp = budget.expenseTotal
  if (inc !== EXPECTED_INCOME) {
    report.ok = false
    report.errors.push(`수입 합계 불일치: ${inc.toLocaleString()} ≠ 확정 ${EXPECTED_INCOME.toLocaleString()}`)
  }
  if (exp !== EXPECTED_EXPENSE) {
    report.ok = false
    report.errors.push(`지출 합계 불일치: ${exp.toLocaleString()} ≠ 확정 ${EXPECTED_EXPENSE.toLocaleString()}`)
  }
  if (budget.balance !== inc - exp) {
    report.ok = false
    report.errors.push(`잔액이 수입−지출과 다름: ${budget.balance.toLocaleString()}`)
  }
  if (budget.incomeTotal.people !== EXPECTED_TOTAL) {
    report.ok = false
    report.errors.push(`회비 기준 인원(${budget.incomeTotal.people})이 참가 합계(${EXPECTED_TOTAL})와 다름`)
  }
  report.info.push(
    `예산 수입 ${inc.toLocaleString()} − 지출 ${exp.toLocaleString()} = 잔액 ${budget.balance.toLocaleString()}`
  )

  // (5) 나눔 장터 품목 — 카테고리 오타 / ID 중복
  const bzErrors = validateBazaar()
  if (bzErrors.length) {
    report.ok = false
    report.errors.push(...bzErrors)
  }
  const prizes = bazaarPlan.filter((i) => i.category === '경품').length
  const kept = bazaarPlan.filter((i) => i.existing).length
  report.info.push(
    `장터 품목 ${bazaarPlan.length}건 (경품 ${prizes} · 판매 ${bazaarPlan.length - prizes}) — 기존 후원 기록 ${kept}건 보존`
  )

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
