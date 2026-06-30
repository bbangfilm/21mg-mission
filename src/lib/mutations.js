import {
  collection, doc, addDoc, updateDoc, deleteDoc, setDoc, serverTimestamp, increment,
} from 'firebase/firestore'
import { db, auth, ensureAnonAuth, isFirebaseConfigured } from './firebase.js'

// 모든 쓰기는 익명 로그인 보장 후 실행. doneBy/createdAt 등은 호출측 data 에 포함하거나 여기서 보강.
const uid = () => auth?.currentUser?.uid || null

// Firebase 미설정(로컬 미리보기 등)에서 쓰기 시도 시 collection(null,…)이 throw → unhandled rejection.
// 읽기층(useFirestore)과 동일하게 가드해 조용히 no-op 한다(편집 UI는 떠 있어도 저장만 무시).
function ready() {
  if (isFirebaseConfigured && db) return true
  console.warn('[mutations] Firebase 미설정 — 쓰기 무시(no-op). .env.local VITE_FIREBASE_* 를 채우면 저장됩니다.')
  return false
}

export async function addItem(path, data) {
  if (!ready()) return null
  await ensureAnonAuth()
  return addDoc(collection(db, path), { ...data, createdAt: serverTimestamp(), createdByUid: uid() })
}

export async function updateItem(path, id, data) {
  if (!ready()) return null
  await ensureAnonAuth()
  return updateDoc(doc(db, path, id), data)
}

export async function removeItem(path, id) {
  if (!ready()) return null
  await ensureAnonAuth()
  return deleteDoc(doc(db, path, id))
}

/** 숫자 필드 원자적 증가(예: 방명록 amen +1). 규칙에서 정확히 +1 만 허용. */
export async function bumpField(path, id, field, by = 1) {
  if (!ready()) return null
  await ensureAnonAuth()
  return updateDoc(doc(db, path, id), { [field]: increment(by) })
}

/** 단일 문서 set(merge). docPath 는 'config/sponsorship' 처럼 짝수 세그먼트. */
export async function setDocData(docPath, data) {
  if (!ready()) return null
  await ensureAnonAuth()
  return setDoc(doc(db, docPath), { ...data, updatedAt: serverTimestamp(), updatedByUid: uid() }, { merge: true })
}

export { serverTimestamp }
