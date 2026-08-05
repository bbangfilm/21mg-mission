// 06. 오병이어 나눔 장터 — 매대 구성 단일 출처(정적).
//
// 두 개의 기록을 합친 결과다.
//   (1) Firestore 에 이미 등록된 후원물품 12건 — 후원자 이름이 붙어 있다(2026-07-30 등록).
//   (2) 2026-08-04 이하나 분류(사진 기준) — 경품/판매 구분. 경품은 확정, 잡화는 근사치.
// 같은 물품이 양쪽에 있으면 (1)을 살린다 — 후원자 기록이 더 귀하고 되살릴 수 없기 때문.
// existing:true 인 항목은 name 을 건드리지 않고 category/order 만 옮긴다.
//
// ★ 화면(Bazaar.jsx)은 Firestore 'bazaarItems' 를 읽는다. 이 파일은 시드 입력값이자 기록용
//   단일 출처 — 목록을 고치면 `npm run seed:bazaar` 로 다시 밀어넣는다.
// ★ order 필드 필수 — useCollection(path,'order') 가 orderBy('order') 라 order 없는 문서는
//   쓰기에 성공해도 화면에서 통째로 빠진다.
// ★ 카테고리 문자열은 Firestore 저장값과 정확히 일치해야 한다. 이름을 바꾸면 옛 값을 가진
//   문서가 어느 매대에도 안 잡혀 조용히 사라진다('의류'→'의류·잡화'로 바꿨다가 sp-01 푸마
//   반팔티가 사라졌던 자리). 그래도 뚫리면 Bazaar.jsx 가 '미분류' 매대로 흡수한다.

export const bazaarCategories = ['경품', '생활용품', '의류', '먹거리']

/**
 * 매대 배치 계획 — 배열 순서가 곧 order.
 *   existing:true → 기존 문서. category/order 만 갱신(name·후원자 보존). name 은 참고용 주석.
 *   그 외          → 신규 추가.
 */
export const bazaarPlan = [
  // ── 경품 (16) — 추첨용. 상태 양호, 판매하지 않는다.
  { id: 'sp-02', category: '경품', existing: true }, // 파세코 전기그릴 1개 (장병태)
  { id: 'sp-03', category: '경품', existing: true }, // 바이마르 쉐프멀티쿠커 1개 (장병태)
  { id: 'sp-08', category: '경품', existing: true }, // 보조배터리 1개 (이동규) ※이하나 집계는 2개 — 현장 확인
  { id: 'sp-10', category: '경품', existing: true }, // 올리고당 2개 (이은진)
  { id: 'sp-11', category: '경품', existing: true }, // 맥심 믹스커피 (정희섭·이소라)
  { id: 'bz-massager', category: '경품', name: '목·어깨 마사지기 2개' },
  { id: 'bz-neckfan',  category: '경품', name: '넥선풍기 1개' },
  { id: 'bz-deskfan',  category: '경품', name: '탁상선풍기 1개' },
  { id: 'bz-humid',    category: '경품', name: '미니가습기 2개' },
  { id: 'bz-wok',      category: '경품', name: '웍 1개' },
  { id: 'bz-kitchen',  category: '경품', name: '키친툴 1개' },
  { id: 'bz-diffuser', category: '경품', name: '디퓨저 세트 1개' },
  { id: 'bz-wagon',    category: '경품', name: '휴대용 웨건 1개' },
  { id: 'bz-chair',    category: '경품', name: '캠핑(간이)의자 2개' },
  // 썬크림 3종 중 유통기한이 짧은 2종은 판매 대신 경품으로 나눔(이하나 제안)
  { id: 'bz-suncr-m',  category: '경품', name: '비건 모이스트 썬크림 40개 (유통기한 9/18)' },
  { id: 'bz-suncr-p',  category: '경품', name: '비건 핑크톤업 썬크림 40개 (유통기한 9/25)' },

  // ── 생활용품 (12) — 판매
  // 후원자(이영천)가 뒤늦게 확인돼 이름만 보강 — rename 이 있을 때만 name 을 덮어쓴다.
  { id: 'HhxZL7BLOdVVqdXmMGID', category: '생활용품', existing: true, rename: '커블 허리받침대-의자용 8개 (이영천)' },
  { id: 'sp-04', category: '생활용품', existing: true }, // 바디워시 1개 · 칫솔세트 1개 (엄다해)
  { id: 'sp-05', category: '생활용품', existing: true }, // 욕실선반 4 · 풋케어 5 · 세안클리너 4 (정표수)
  { id: 'sp-06', category: '생활용품', existing: true }, // 치약칫솔세트 · 데일리머그 · 협립우산 (이철규·이소아)
  { id: 'sp-07', category: '생활용품', existing: true }, // 뚜껑 머그컵 · 실내용 13L 휴지통 (이은진)
  { id: 'bz-mask',     category: '생활용품', name: '마스크' },
  { id: 'bz-febreze',  category: '생활용품', name: '페브리즈 · 홈키퍼' },
  { id: 'bz-stain',    category: '생활용품', name: '얼룩제거제' },
  { id: 'bz-lotion',   category: '생활용품', name: '로션 (토너)' },
  { id: 'bz-nail',     category: '생활용품', name: '고급 손톱깎이 5개' },
  { id: 'bz-sunstick', category: '생활용품', name: '비건 썬스틱 40개 (유통기한 12/18)' },
  { id: 'bz-maskpack', category: '생활용품', name: '마스크팩 (수량 확인 중)' },

  // ── 의류 (5) — 판매
  { id: 'sp-01', category: '의류', existing: true }, // 푸마 반팔티 2개 (조세민)
  // 후원자 명단 없이 여러 벌 들어온 의류 — 한 줄로 묶어 표시(사용자 확인 2026-08-05)
  { id: 'bz-clothes', category: '의류', name: '의류 여러 벌' },
  { id: 'bz-bag',    category: '의류', name: '가방 3개' },
  { id: 'bz-shoes',  category: '의류', name: '신발 · 벨트' },
  { id: 'bz-socks',  category: '의류', name: '등산양말 약 100개' },
  { id: 'bz-cooler', category: '의류', name: '쿨토시 약 40개' },

  // ── 먹거리 (1) — 판매
  { id: 'sp-09', category: '먹거리', existing: true }, // 동원 밥 130g 1박스(24개) (이철규·이소아)
]

// 기존 문서가 이미 커버해 이하나 리스트에서 뺀 항목 — 중복 표시 방지.
// (되살리려면 bazaarPlan 에 신규로 추가하면 된다)
export const mergedAway = [
  ['전기그릴 1개', 'sp-02 파세코 전기그릴 (장병태)'],
  ['멀티쿠커 1개', 'sp-03 바이마르 쉐프멀티쿠커 (장병태)'],
  ['보조배터리 2개', 'sp-08 보조배터리 1개 (이동규) — 수량 차이, 현장 확인'],
  ['올리고당 2개', 'sp-10 올리고당 2개 (이은진)'],
  ['맥심 커피믹스 100개입 2개', 'sp-11 맥심 믹스커피 (정희섭·이소라)'],
  ['햇반 24개 세트', 'sp-09 동원 밥 130g 1박스(24개) (이철규·이소아)'],
  ['치약 · 칫솔', 'sp-06 치약칫솔세트 · sp-04 칫솔세트'],
  ['물병 · 머그컵', 'sp-06 데일리머그 · sp-07 뚜껑 머그컵'],
  ['우산', 'sp-06 협립우산 (이철규·이소아)'],
  ['쓰레기통', 'sp-07 실내용 13L 휴지통 (이은진)'],
  // '의류 (10개 미만)'은 되살렸다 — 후원자 명단 없는 의류가 여러 벌 따로 있음(bz-clothes)
]

/** 카테고리 오타·중복 ID 탐지 — validate.js / 시드 스크립트에서 호출 */
export function validateBazaar() {
  const errors = []
  const cats = new Set(bazaarCategories)

  const bad = bazaarPlan.filter((i) => !cats.has(i.category))
  if (bad.length) errors.push(`알 수 없는 장터 카테고리: ${bad.map((i) => `${i.id}(${i.category})`).join(', ')}`)

  const noName = bazaarPlan.filter((i) => !i.existing && !i.name)
  if (noName.length) errors.push(`신규 장터 품목에 이름 없음: ${noName.map((i) => i.id).join(', ')}`)

  const ids = bazaarPlan.map((i) => i.id)
  const dups = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))]
  if (dups.length) errors.push(`장터 품목 ID 중복: ${dups.join(', ')}`)

  return errors
}
