// ──────────────────────────────────────────────────────────────
//  Firebase 초기화 (가드 포함)
//  핵심: env 가 비어 있어도 앱이 죽지 않는다.
//   - config 누락 → db/auth = null, isFirebaseConfigured = false
//   - 정적 9섹션은 src/data 로만 렌더되므로 Firebase 없이도 100% 동작
//   - 동적 5섹션은 isFirebaseConfigured 를 보고 '연결 대기' 폴백 표시
//  → 나중에 .env.local 만 채우면 추가 리팩터 없이 실시간 레이어가 켜진다.
// ──────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// 필수 6키 중 하나라도 비면 미설정으로 간주
const REQUIRED = ['apiKey', 'authDomain', 'projectId', 'appId']
export const isFirebaseConfigured = REQUIRED.every((k) => Boolean(cfg[k]))

let app = null
let db = null
let auth = null

if (isFirebaseConfigured) {
  app = initializeApp(cfg)
  db = getFirestore(app)
  auth = getAuth(app)
} else {
  // 개발 중 자주 보게 될 안내 — 정상 동작(정적은 살아있음)
  console.warn(
    '[firebase] config 미설정 → 동적(실시간) 섹션은 비활성, 정적 섹션만 표시됩니다.\n' +
      '.env.local 에 VITE_FIREBASE_* 6키를 채우면 실시간 레이어가 켜집니다.'
  )
}

/**
 * 익명 로그인 보장. 미설정이면 즉시 null 반환(호출측은 정적 폴백 유지).
 * @returns {Promise<import('firebase/auth').User | null>}
 */
export async function ensureAnonAuth() {
  if (!auth) return null
  if (auth.currentUser) return auth.currentUser
  const cred = await signInAnonymously(auth)
  return cred.user
}

export { app, db, auth }
