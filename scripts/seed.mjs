// 초기 데이터 시드 — 클라이언트 SDK + 익명 로그인으로 1회 입력(멱등: 같은 ID로 merge).
// 실행: node scripts/seed.mjs   (선행: 익명 인증 활성화 + 보안규칙 배포)
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

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

const todos = [
  { id: 't1', text: '오병이어 포스터(물품후원·헌금모금) 제작', assignee: '판매팀' },
  { id: 't2', text: '음식 메뉴 선정 문의 / 확정', assignee: '음식팀' },
  { id: 't3', text: '설비 가정조사(방충망·전등·콘센트 등)', assignee: '설비팀' },
  { id: 't4', text: '물품 구입 리스트 작성(예: 냉감요)', assignee: '판매팀' },
  { id: 't5', text: '팀장 채팅방 개설', assignee: '전체' },
]
const teamChecklists = {
  'team-evangel': [{ id: 'ev1', text: '전도 동선·구역 정하기' }, { id: 'ev2', text: '전도용 소품·전단 준비' }],
  'team-rec': [{ id: 'rec1', text: '실내 레크 프로그램 확정' }, { id: 'rec2', text: '음향·도구·상품 준비' }],
  'team-food': [{ id: 'fd1', text: '메뉴 선정 문의 / 확정' }, { id: 'fd2', text: '식자재 구매 리스트 작성' }],
  'team-sales': [{ id: 'sl1', text: '물품 구입 리스트(예: 냉감요)' }, { id: 'sl2', text: '물품후원·헌금모금 포스터 제작' }],
  'team-facility': [{ id: 'fc1', text: '교회 필요 가정 조사(방충망·전등·콘센트)' }, { id: 'fc2', text: '간단 수리 도구 준비' }],
}

const app = initializeApp(cfg)
const db = getFirestore(app)
await signInAnonymously(getAuth(app))
console.log('✓ 익명 로그인')

await setDoc(doc(db, 'config/sponsorship'), {
  goalAmount: 3000000, currentAmount: 0,
  accountBank: '', accountNumber: '', accountHolder: '',
  note: '회비와 별도 / 작년 약 300만원 규모', updatedAt: serverTimestamp(),
}, { merge: true })
console.log('✓ config/sponsorship')

for (const [i, t] of todos.entries()) {
  await setDoc(doc(db, 'todos', t.id), { text: t.text, done: false, order: i, assignee: t.assignee }, { merge: true })
}
console.log(`✓ todos (${todos.length})`)

let clN = 0
for (const [teamId, items] of Object.entries(teamChecklists)) {
  for (const [i, it] of items.entries()) {
    await setDoc(doc(db, `teams/${teamId}/checklists`, it.id), { text: it.text, done: false, order: i }, { merge: true })
    clN++
  }
}
console.log(`✓ team checklists (${clN})`)

console.log('🌱 시드 완료')
process.exit(0)
