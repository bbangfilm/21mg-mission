import { useState, useMemo } from 'react'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { addItem, bumpField, removeItem } from '../lib/mutations.js'
import styles from './PrayerWall.module.css'

// 한 줄 기도 방명록 — 로그인 없이 누구나 작성(익명인증). amen='함께 기도' 카운트.
const PATH = 'guestPrayers'
const AMEN_KEY = '21mg-amen'         // 이미 '함께 기도'한 기도 id (localStorage, 중복 방지)
const COOLDOWN_KEY = '21mg-prayer-last' // 마지막 제출 {t, text} (경량 도배 방지)
const COOLDOWN_MS = 8000
const MAX = 150

// 최신순 정렬키. 방금 쓴 글(서버시각 도착 전 createdAt=null)은 맨 위로.
const tsOf = (x) => x.createdAt?.seconds ?? Infinity

// Firestore Timestamp → 'M/D HH:MM' (pending 이면 '방금')
const fmt = (ts) => {
  if (!ts?.toDate) return '방금'
  const d = ts.toDate()
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
const loadAmen = () => {
  try { return new Set(JSON.parse(localStorage.getItem(AMEN_KEY)) || []) } catch { return new Set() }
}

export default function PrayerWall() {
  const { can } = useEditMode()
  const editable = can('team')              // 삭제(모더레이션)는 팀장·관리자만
  const { items, loading } = useCollection(PATH)
  const [text, setText] = useState('')
  const [nm, setNm] = useState('')
  const [anon, setAnon] = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')
  const [amened, setAmened] = useState(loadAmen)

  const sorted = useMemo(() => [...items].sort((a, b) => tsOf(b) - tsOf(a)), [items])

  const submit = async (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t || sending) return
    // 경량 도배 방지(우발적 연타·직전 동일문구) — 스크립트 스팸은 막지 못하나 일상 오남용 차단
    let last = {}
    try { last = JSON.parse(localStorage.getItem(COOLDOWN_KEY)) || {} } catch { /* private mode */ }
    const now = Date.now()
    if (last.t && now - last.t < COOLDOWN_MS) {
      setErr(`잠시 후 다시 남겨주세요 (${Math.ceil((COOLDOWN_MS - (now - last.t)) / 1000)}초 후).`); return
    }
    if (last.text && last.text === t) { setErr('방금 같은 기도를 남기셨어요.'); return }
    const by = ((anon ? '' : nm).trim() || '익명').slice(0, 40)
    setSending(true); setErr('')
    try {
      await addItem(PATH, { text: t.slice(0, MAX), by, amen: 0 })
      setText('')                            // 이름은 유지(연속 작성 편의)
      try { localStorage.setItem(COOLDOWN_KEY, JSON.stringify({ t: Date.now(), text: t })) } catch { /* private mode */ }
    } catch {
      setErr('기도를 남기지 못했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSending(false)
    }
  }

  const persistAmen = (set) => { try { localStorage.setItem(AMEN_KEY, JSON.stringify([...set])) } catch { /* private mode */ } }
  const pray = (p) => {
    if (amened.has(p.id)) return
    const next = new Set(amened).add(p.id) // 낙관적 표시
    setAmened(next); persistAmen(next)
    bumpField(PATH, p.id, 'amen')?.catch(() => {   // 원자적 +1 (규칙에서 +1 만 허용). 실패 시 표시 되돌림
      setAmened((prev) => { const s = new Set(prev); s.delete(p.id); persistAmen(s); return s })
    })
  }

  const remove = (id) => {
    if (window.confirm('이 기도를 삭제할까요?')) removeItem(PATH, id)?.catch(() => setErr('삭제하지 못했어요. 다시 시도해 주세요.'))
  }

  return (
    <div className={`${styles.wall} reveal`}>
      <div className={styles.head}>
        <p className={`eyebrow ${styles.eyebrow}`}>Prayer Wall</p>
        <h3 className={styles.title}>함께 드리는 한 줄 기도</h3>
        <p className={styles.sub}>로그인 없이 누구나 한 줄 기도를 남길 수 있어요.</p>
        <p className={styles.notice}>남긴 글은 모두에게 공개돼요 · 전화번호 등 개인정보는 적지 말아주세요.</p>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.textWrap}>
          <textarea
            className={styles.text}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            placeholder="한 줄 기도를 남겨주세요…"
            rows={2}
            maxLength={MAX}
            aria-label="한 줄 기도 입력"
          />
          <span className={`${styles.counter} tnum`} aria-hidden="true">{MAX - text.length}</span>
        </div>
        <div className={styles.controls}>
          <input
            className={styles.name}
            value={anon ? '' : nm}
            onChange={(e) => setNm(e.target.value)}
            placeholder="이름 (선택)"
            disabled={anon}
            maxLength={40}
            aria-label="이름"
          />
          <label className={styles.anon}>
            <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} aria-label="익명으로 작성" />
            익명
          </label>
          <button type="submit" className={`${styles.submit} pressable`} disabled={!text.trim() || sending}>
            {sending ? '남기는 중…' : '기도 남기기'}
          </button>
        </div>
        {err && <p className={styles.err} role="alert">{err}</p>}
      </form>

      {!loading && items.length > 0 && (
        <p className={styles.count}><span className="tnum">{items.length}</span>개의 기도</p>
      )}

      {loading ? (
        <p className={styles.empty}>불러오는 중…</p>
      ) : sorted.length === 0 ? (
        <p className={styles.empty}>아직 남겨진 기도가 없어요 — 첫 기도를 남겨보세요.</p>
      ) : (
        <ul className={styles.list}>
          {sorted.map((p) => {
            const done = amened.has(p.id)
            return (
              <li key={p.id} className={styles.item}>
                <span className={styles.bullet} aria-hidden="true">🙏</span>
                <div className={styles.body}>
                  <p className={styles.ptext}>{p.text}</p>
                  <span className={styles.meta}>— {p.by || '익명'} · {fmt(p.createdAt)}</span>
                </div>
                <div className={styles.acts}>
                  <button
                    type="button"
                    className={`${styles.amen} ${done ? styles.amenOn : ''} pressable`}
                    onClick={() => pray(p)}
                    disabled={done}
                    aria-pressed={done}
                    aria-label={`${done ? '함께 기도함' : '함께 기도하기'}${p.amen > 0 ? `, 현재 ${p.amen}명` : ''}`}
                  >
                    <span aria-hidden="true">🙏</span>
                    {done ? '기도했어요' : '함께 기도'}
                    {p.amen > 0 && <b className="tnum">{p.amen}</b>}
                  </button>
                  {editable && (
                    <button type="button" className={`${styles.del} pressable`} onClick={() => remove(p.id)} aria-label="기도 삭제">✕</button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <p className={styles.foot}>부적절한 글은 팀에서 정리할 수 있어요.</p>
    </div>
  )
}
