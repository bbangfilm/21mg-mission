import { useEffect, useState } from 'react'
import Section from '../components/Section.jsx'
import { Chip, Badge } from '../components/ui.jsx'
import { useEditMode } from '../context/EditModeContext.jsx'
import { useDoc } from '../lib/useFirestore.js'
import { setDocData, serverTimestamp } from '../lib/mutations.js'
import { meetingPaths } from '../data/meetings.js'
import styles from './Meeting.module.css'

const KIND = { all: '전체', team: '팀별' }

// 진행 보드 — 사회자가 단계를 넘기면 stateDoc.phase 로 전원 화면 실시간 동기화.
// phase: -1(시작 전) → 0..N-1(진행) → N(종료). phaseAt 으로 현재 단계 경과 분 표시.
export default function MeetingFlow({ meeting }) {
  const { attendees, phases } = meeting
  const { stateDoc } = meetingPaths(meeting)
  const { can } = useEditMode()
  const editable = can('team')
  const { data } = useDoc(stateDoc)
  const phase = typeof data?.phase === 'number' ? data.phase : -1
  const running = phase >= 0 && phase < phases.length
  const finished = phase >= phases.length

  // 경과 분 갱신용 30초 틱 (진행 중일 때만)
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setTick((n) => n + 1), 30_000)
    return () => clearInterval(id)
  }, [running])

  const go = (idx) => setDocData(stateDoc, { phase: idx, phaseAt: serverTimestamp() })

  // serverTimestamp 는 서버 확정 전 스냅샷에서 null — toMillis 가드
  let elapsed = null
  if (running && typeof data?.phaseAt?.toMillis === 'function') {
    elapsed = Math.max(0, Math.floor((Date.now() - data.phaseAt.toMillis()) / 60_000))
  }

  return (
    <Section id="meeting-flow" eyebrow="Meeting" title="진행 보드" desc={meeting.goal}>
      <div className={`${styles.overview} reveal`}>
        <div className={styles.meta}>
          <span className={styles.metaItem}><strong>{meeting.date}</strong></span>
          <span className={styles.metaItem}>{meeting.duration}</span>
          <span className={`${styles.metaItem} tnum`}>참석 {attendees.length}명{meeting.attendeesNote ? ` — ${meeting.attendeesNote}` : ''}</span>
        </div>
        <div className={styles.chips}>
          {attendees.map((a) => (
            <Chip key={a.name} tone={a.role.includes('MG리더') ? 'leader' : 'default'} title={a.role}>{a.name}</Chip>
          ))}
        </div>
      </div>

      <div className={`${styles.controls} reveal`}>
        {finished
          ? <Badge tone="success">회의 종료</Badge>
          : running
            ? <Badge tone="primary">{phase + 1}단계 진행 중</Badge>
            : <Badge tone="muted">시작 전</Badge>}
        {editable && (
          <>
            <button type="button" className={`${styles.ctrlBtn} pressable`}
              onClick={() => go(phase - 1)} disabled={phase <= -1}>◀ 이전</button>
            <button type="button" className={`${styles.ctrlBtn} ${styles.ctrlPrimary} pressable`}
              onClick={() => go(phase + 1)} disabled={finished}>
              {phase === -1 ? '회의 시작 ▶' : phase === phases.length - 1 ? '회의 종료 ✓' : '다음 단계 ▶'}
            </button>
          </>
        )}
      </div>

      <ol className={`${styles.phases} stagger`}>
        {phases.map((p, i) => {
          const isDone = finished || i < phase
          const isActive = i === phase
          const cls = [
            styles.phase,
            isDone ? styles.phaseDone : '',
            isActive ? styles.phaseActive : '',
            editable ? 'pressable' : '',
          ].join(' ')
          const body = (
            <>
              <span className={styles.phaseIdx} aria-hidden="true">{isDone ? '✓' : i + 1}</span>
              <span className={styles.phaseBody}>
                <span className={styles.phaseTop}>
                  <span className={styles.phaseTitle}>{p.title}</span>
                  <span className={`${styles.phaseTime} tnum`}>{p.time} · {p.min}분</span>
                  <span className={`${styles.kind} ${p.kind === 'team' ? styles.kindTeam : styles.kindAll}`}>{KIND[p.kind]}</span>
                  {isActive && elapsed != null && (
                    <span className={`${styles.elapsed} ${elapsed > p.min ? styles.elapsedOver : ''} tnum`}>{elapsed}분 경과</span>
                  )}
                </span>
                <span className={styles.phaseDetail}>{p.detail}</span>
              </span>
            </>
          )
          return (
            <li key={p.id} aria-current={isActive ? 'step' : undefined}>
              {editable
                ? <button type="button" className={cls} onClick={() => go(i)} aria-label={`${i + 1}단계로 이동: ${p.title}`}>{body}</button>
                : <div className={cls}>{body}</div>}
            </li>
          )
        })}
      </ol>

      <p className={styles.hintText}>
        {editable
          ? '단계를 탭하면 바로 이동합니다. 진행 상태는 모든 참석자 화면에 실시간 동기화돼요.'
          : '사회자가 단계를 넘기면 현재 위치가 모두의 화면에 실시간 표시됩니다. 진행·기록은 우하단 편집 모드(팀장)에서.'}
      </p>
    </Section>
  )
}
