// 나눔 장터 매대 시드 — src/data/bazaar.js 의 bazaarPlan 을 Firestore 'bazaarItems' 에 반영.
// 실행: npm run seed:bazaar          (미리보기: npm run seed:bazaar -- --dry)
//
// 병합 원칙 — 기존 후원물품 문서(existing:true)는 name 을 절대 덮어쓰지 않는다.
//   후원자 이름이 붙어 있고 되살릴 수 없는 기록이라 category/order 만 옮긴다.
// 멱등: 같은 문서 ID 로 merge — 다시 돌려도 중복이 생기지 않고 done 체크 상태도 보존된다.
// ★ order 필드 필수 — Bazaar.jsx 가 orderBy('order') 로 읽으므로 없으면 화면에서 누락된다.
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore'
import { bazaarPlan, validateBazaar } from '../src/data/bazaar.js'

const DRY = process.argv.includes('--dry')

// .env.local 파싱
const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
  if (m) env[m[1]] = m[2]
}
const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

// 데이터 검증 먼저 — 오타가 있으면 Firestore 를 건드리지 않는다.
const errors = validateBazaar()
if (errors.length) {
  console.error('⛔ 시드 중단 — 데이터 오류:')
  errors.forEach((e) => console.error('   ', e))
  process.exit(1)
}

const app = initializeApp(cfg)
const db = getFirestore(app)
await signInAnonymously(getAuth(app))
console.log('✓ 익명 로그인')

// 현재 상태 — existing:true 로 선언한 문서가 실제로 있는지 확인(없으면 이름이 빈 채로 생성될 뻔한다).
const snap = await getDocs(collection(db, 'bazaarItems'))
const live = new Map(snap.docs.map((d) => [d.id, d.data()]))

const missing = bazaarPlan.filter((i) => i.existing && !live.has(i.id))
if (missing.length) {
  console.error('⛔ 시드 중단 — existing 으로 선언했으나 Firestore 에 없는 문서:')
  missing.forEach((i) => console.error(`    ${i.id}`))
  console.error('   bazaar.js 에서 existing 을 떼고 name 을 채우거나, ID 를 확인하세요.')
  process.exit(1)
}

const planned = new Set(bazaarPlan.map((i) => i.id))
const untouched = snap.docs.filter((d) => !planned.has(d.id))

console.log(`\n${DRY ? '[미리보기] ' : ''}반영 계획 — 총 ${bazaarPlan.length}건`)
for (const [i, it] of bazaarPlan.entries()) {
  const label = it.existing
    ? (it.rename ? `개명 ${live.get(it.id).name} → ${it.rename}` : `유지 ${live.get(it.id).name}`)
    : `신규 ${it.name}`
  const moved = it.existing && live.get(it.id).category !== it.category
    ? `  (${live.get(it.id).category} → ${it.category})` : ''
  console.log(`  [${String(i).padStart(2)}] ${it.category.padEnd(5)} ${label}${moved}`)

  if (DRY) continue
  // existing 은 name 을 넘기지 않는다 — merge 라 기존 name·후원자 표기가 그대로 남는다.
  // 예외: rename 이 명시된 경우만 이름을 덮어쓴다(후원자 확인 등).
  const payload = it.existing
    ? { category: it.category, order: i, ...(it.rename ? { name: it.rename } : {}) }
    : { name: it.name, category: it.category, order: i, done: false, addedBy: '이하나' }
  await setDoc(doc(db, 'bazaarItems', it.id), payload, { merge: true })
}

if (untouched.length) {
  console.log(`\n⚠️  계획에 없는 기존 문서 ${untouched.length}건 — 손대지 않았습니다:`)
  untouched.forEach((d) => console.log(`     ${d.id}: [${d.data().category}] ${d.data().name}`))
}

console.log(DRY ? '\n🔍 미리보기만 했습니다 (--dry). 실제 반영은 npm run seed:bazaar' : '\n🌱 시드 완료')
process.exit(0)
