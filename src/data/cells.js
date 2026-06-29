// 부록 B — 참가 명단 / 셀 매핑 (45명)
// 명단 순서 기준: 셀리더 아래부터 다음 셀리더 전까지가 그 셀.
// cells/{cellId} 와 동일 shape. count.total = leaders.length + members.length.
// ⚠️ 참가 합계(45)는 어디에도 하드코딩하지 않는다 — cellTotal()로 런타임 합산(오타 즉시 노출).

export const cells = [
  {
    id: 'cell-yc',
    name: '영천셀',
    leaders: ['이영천', '신나희'], // 신나희 = MG리더 겸임
    order: 1,
    members: [
      '함대희', '송혜란', '박용림', '김하연', '홍석일', '이민지', '이지예',
      '이지아', '함세은', '함유안', '박새은', '박새힘', '홍찬영', '홍준영',
    ],
  },
  {
    id: 'cell-st',
    name: '성태셀',
    leaders: ['김성태', '이하나'],
    order: 2,
    members: [
      '이인현', '권옥경', '정표수', '정재선', '이정수', '은정원', '최경연',
      '김예준', '김예온', '이수현', '이선유', '이유안', '박시온',
    ],
  },
  {
    id: 'cell-di',
    name: '덕인셀',
    leaders: ['전덕인', '전선희'],
    order: 3,
    members: [
      '이성근', '정연설', '최성곤', '한상원', '공미혜', '전유은',
      '이지유', '이지민', '최민준', '한사랑', '한소망', '한믿음',
    ],
  },
]

/** 셀 1개의 총원 (리더 + 셀원) */
export const cellTotal = (cell) => cell.leaders.length + cell.members.length

/** 전체 참가 인원 — 세 셀 합산(하드코딩 금지) */
export const totalHeadcount = () => cells.reduce((sum, c) => sum + cellTotal(c), 0)

/** 전체 명단(리더+셀원) 평면 집합 — 팀 명단 정합 검증의 단일 출처 */
export const allRoster = () =>
  cells.flatMap((c) => [...c.leaders, ...c.members])
