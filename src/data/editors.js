import { teams } from './teams.js'

// 편집 모드 진입 시 "누구신가요?" 빠른 선택 목록 (오타 방지 · 한 번 탭).
// 자유 입력 폴백은 모달에서 별도 제공.
export const teamEditors = teams.map((t) => t.leader) // 6 팀장
export const adminEditors = ['이영천', '신나희', '김성태', '이하나', '전덕인', '전선희'] // MG리더 = 셀리더 3쌍(부부)

export const editorsFor = (role) => (role === 'admin' ? adminEditors : teamEditors)
