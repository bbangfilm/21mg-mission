import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase.js'

/**
 * 컬렉션 실시간 구독. Firestore 미설정/오류 시 빈 배열(정적 폴백).
 * @returns {{ items: any[], loading: boolean, ready: boolean }}
 */
export function useCollection(path, orderField) {
  const [items, setItems] = useState(null) // null = 로딩 전
  useEffect(() => {
    if (!isFirebaseConfigured || !db) { setItems([]); return }
    const ref = collection(db, path)
    const q = orderField ? query(ref, orderBy(orderField)) : ref
    const unsub = onSnapshot(
      q,
      (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => { console.warn('[firestore]', path, err.code || err.message); setItems([]) }
    )
    return unsub
  }, [path, orderField])
  return { items: items || [], loading: items === null, ready: isFirebaseConfigured }
}

/**
 * 단일 문서 실시간 구독.
 * @returns {{ data: any|null, loading: boolean, ready: boolean }}
 */
export function useDoc(path) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!isFirebaseConfigured || !db) { setLoading(false); return }
    const unsub = onSnapshot(
      doc(db, path),
      (snap) => { setData(snap.exists() ? { id: snap.id, ...snap.data() } : null); setLoading(false) },
      (err) => { console.warn('[firestore]', path, err.code || err.message); setLoading(false) }
    )
    return unsub
  }, [path])
  return { data, loading, ready: isFirebaseConfigured }
}
