import {
  collection, doc, addDoc, updateDoc, deleteDoc, setDoc, serverTimestamp,
} from 'firebase/firestore'
import { db, auth, ensureAnonAuth } from './firebase.js'

// 모든 쓰기는 익명 로그인 보장 후 실행. doneBy/createdAt 등은 호출측 data 에 포함하거나 여기서 보강.
const uid = () => auth?.currentUser?.uid || null

export async function addItem(path, data) {
  await ensureAnonAuth()
  return addDoc(collection(db, path), { ...data, createdAt: serverTimestamp(), createdByUid: uid() })
}

export async function updateItem(path, id, data) {
  await ensureAnonAuth()
  return updateDoc(doc(db, path, id), data)
}

export async function removeItem(path, id) {
  await ensureAnonAuth()
  return deleteDoc(doc(db, path, id))
}

/** 단일 문서 set(merge). docPath 는 'config/sponsorship' 처럼 짝수 세그먼트. */
export async function setDocData(docPath, data) {
  await ensureAnonAuth()
  return setDoc(doc(db, docPath), { ...data, updatedAt: serverTimestamp(), updatedByUid: uid() }, { merge: true })
}

export { serverTimestamp }
