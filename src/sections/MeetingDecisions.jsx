import { useMemo, useState } from 'react'
import Section from '../components/Section.jsx'
import { Badge, ProgressBar } from '../components/ui.jsx'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useCollection } from '../lib/useFirestore.js'
import { setDocData } from '../lib/mutations.js'
import { meetingInfo, decisions } from '../data/meeting.js'
import styles from './Meeting.module.css'

const PATH = 'meeting'
const GROUPS = [
  { key: 'all',  label: '전체 논의', desc: '1~3부 — 일정·예산·조사, 틀을 먼저 확정' },
  { key: 'team', label: '팀별 논의', desc: '분임 — 확정된 틀 안에서 팀별 실행 계획' },
]

// 확정할 안건 — 안건 정의는 정적(meeting.js), 체크·결정 메모만 meeting/{id} 오버레이.
// 회의 끝에 '결정사항 복사'로 그대로 회의록(단톡방 공유)이 된다.
export default function MeetingDecisions() {
  const { can, name } = useEditMode()
  const editable = can('team')
  const { items } = useCollection(PATH)
  const state = useMemo(() => Object.fromEntries(items.map((d) => [d.id, d])), [items])
  const doneCount = decisions.filter((d) => state[d.id]?.done).length
  const who = () => name || '익명'
  const [copied, setCopied] = useState(false)

  const toggle = (d) => setDocData(`${PATH}/${d.id}`, { done: !state[d.id]?.done, by: who() })
  const saveNote = (d, note) => setDocData(`${PATH}/${d.id}`, { note, by: who() })

  const copy = async () => {
    const lines = [`📋 ${meetingInfo.title} 결정사항 — ${meetingInfo.date}`]
    GROUPS.forEach((g) => {
      lines.push('', `[${g.label}]`)
      decisions.filter((d) => d.scope === g.key).forEach((d) => {
        const s = state[d.id]
        lines.push(`${s?.done ? '✅' : '⬜'} ${d.title}${s?.note ? ` — ${s.note}` : s?.done ? '' : ' (미확정)'}`)
      })
    })
    lines.push('', `확정 ${doneCount} / ${decisions.length}`)
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('아래 내용을 복사해 공유하세요', lines.join('\n'))
    }
  }

  return (
    <Section id="meeting-decisions" eyebrow="Decisions" title="확정할 안건"
      desc="체크 = 확정 · 메모 = 결정 내용 — 그대로 회의록이 됩니다">
      <div className={`${styles.boardHead} reveal`}>
        {editable
          ? <Badge tone="success">편집 모드 · {name || '이름 미설정'}</Badge>
          : <Badge tone="muted">실시간</Badge>}
        <span className={`${styles.count} tnum`}>{doneCount} / {decisions.length} 확정</span>
        <button type="button" className={`${styles.copyBtn} pressable`} onClick={copy}>
          {copied ? '복사됨 ✓' : '📄 결정사항 복사'}
        </button>
      </div>
      <ProgressBar value={doneCount} max={decisions.length} tone="success" label="안건 확정 진행률" />

      {GROUPS.map((g) => (
        <div key={g.key} className={styles.group}>
          <h3 className={styles.groupTitle}>{g.label}</h3>
          <p className={styles.groupDesc}>{g.desc}</p>
          <ul className={`${styles.decisions} stagger`}>
            {decisions.filter((d) => d.scope === g.key).map((d) => (
              <DecisionRow key={d.id} d={d} s={state[d.id]} editable={editable}
                onToggle={() => toggle(d)} onSave={(note) => saveNote(d, note)} />
            ))}
          </ul>
        </div>
      ))}

      <p className={styles.hintText}>
        {editable
          ? '✏️ 체크·메모가 모든 기기에 실시간 저장됩니다. 회의 끝에 "결정사항 복사"로 단톡방에 공유하세요.'
          : '읽기 전용 — 확정·기록은 우하단 편집 모드(팀장)에서 할 수 있어요.'}
      </p>
    </Section>
  )
}

function DecisionRow({ d, s, editable, onToggle, onSave }) {
  const done = !!s?.done
  const note = s?.note || ''
  const submit = (e) => {
    e.preventDefault()
    const v = String(new FormData(e.currentTarget).get('note') || '').trim()
    if (v !== note) onSave(v)
  }
  return (
    <li className={`${styles.dec} ${done ? styles.decDone : ''}`}>
      <button type="button" className={`${styles.decCheck} ${editable ? 'pressable' : ''}`}
        onClick={onToggle} disabled={!editable} aria-pressed={done} aria-label={`확정: ${d.title}`}>
        {done ? '✓' : ''}
      </button>
      <div className={styles.decBody}>
        <div className={styles.decTop}>
          <span className={styles.decTitle}>{d.title}</span>
          <span className={styles.decTag}>{d.tag}</span>
        </div>
        <p className={styles.decHint}>{d.hint}</p>
        <p className={styles.decOwner}>담당 · {d.owner}{done && s?.by ? ` — 확정: ${s.by}` : ''}</p>
        {!editable && note && <p className={styles.decNote}>“{note}”</p>}
        {editable && (
          <form className={styles.noteForm} onSubmit={submit}>
            {/* 원격 저장값이 바뀌면 key 로 재시드 (비제어 입력) */}
            <input key={note} name="note" className={styles.noteInput} defaultValue={note}
              placeholder="결정 내용 메모 — 예: 금 16:00–17:30 확정" maxLength={500}
              aria-label={`결정 메모: ${d.title}`} />
            <button type="submit" className={`${styles.noteSave} pressable`}>저장</button>
          </form>
        )}
      </div>
    </li>
  )
}
