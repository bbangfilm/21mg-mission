import Section from '../components/Section.jsx'
import styles from './Meeting.module.css'

// 안건 카테고리 색 — 대시보드 컬러 분담과 동일 (일정=sunny · 예산=mint · 배정/조사=violet · 사역=coral)
const TONE = {
  sunny: styles.tSunny, mint: styles.tMint, violet: styles.tViolet,
  coral: styles.tCoral, ink: styles.tInk,
}

// 회의록 — 정적 확정 기록 뷰 (#/meeting/{id}/minutes). 데이터: data/minutes.js
export default function MeetingMinutes({ meeting, minutes }) {
  const { finalNotice: fn, items, actions, questions, pending, checks } = minutes
  return (
    <>
      <Section id="minutes-final" eyebrow="Final Notice" title="★ 회의 후 최종 확정" tone="ink"
        desc="회의 중 보류됐던 안건의 확정 공지(7/12) — 팀 구성은 이 안이 최종입니다">
        <div className={`${styles.fnCard} reveal`}>
          <h3 className={styles.fnTitle}>{fn.title}</h3>
          <p className={styles.fnLead}>{fn.lead}</p>
          <p className={styles.fnReason}>{fn.reason}</p>
        </div>
        <div className={`${styles.fnTeams} stagger`}>
          {fn.teams.map((t) => (
            <div key={t.name} className={styles.fnTeam}>
              <p className={styles.fnTeamHead}>
                <span aria-hidden="true">{t.emoji}</span> {t.name}
                <span className={styles.fnRole}>{t.role}</span>
              </p>
              <p className={styles.fnPeople}>
                {t.people.map((p, i) => (
                  <span key={p}>
                    {i > 0 && ' · '}
                    {i === 0 ? <span className={styles.fnLeader}>{p}</span> : p}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <p className={`${styles.fnNote} reveal`}>
          <strong>{fn.note}</strong><br />
          {fn.changes}<br />
          <strong>{fn.next}</strong>
        </p>
      </Section>

      <Section id="minutes-items" eyebrow="Decisions" title={`안건별 결정 ${items.length}`}
        desc={`${meeting.date} 회의 확정 기록 — ${minutes.sources}`}>
        <ol className={`${styles.mnList} stagger`}>
          {items.map((it) => (
            <li key={it.no} className={`${styles.mnItem} ${TONE[it.tone] || ''}`}>
              <div className={styles.mnHead}>
                <span className={`${styles.mnNo} tnum`}>{it.no}</span>
                <span className={styles.mnTag}>{it.tag}</span>
                <h3 className={styles.mnTitle}>{it.title}</h3>
              </div>
              {it.verdict && <p className={styles.mnVerdict}>{it.verdict}</p>}
              {it.timeline && (
                <ul className={styles.mnTl}>
                  {it.timeline.map((t) => (
                    <li key={t.time + t.title}>
                      <span className={`${styles.mnTlTime} tnum`}>{t.time}</span>
                      <span className={styles.mnTlEv}>
                        <b>{t.title}</b>
                        {t.sub && <small>{t.sub}</small>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <ul className={styles.mnPoints}>
                {it.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="minutes-follow" eyebrow="Follow-up" title="액션 · 질문 · 미결"
        desc="회의에서 나온 후속 작업 — 진행 체크는 팀별 체크리스트·To-Do에서">
        <h3 className={styles.subhead}>액션 아이템 <span className={`${styles.subheadSub} tnum`}>{actions.length}건</span></h3>
        <ul className={`${styles.actRows} stagger`}>
          {actions.map((a) => (
            <li key={a.who + a.what} className={styles.actRow}>
              <span className={styles.actWho}>{a.who}{a.note && <small>{a.note}</small>}</span>
              <span className={styles.actWhat}>{a.what}</span>
              <span className={`${styles.actDue} tnum`}>{a.due}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.subhead}>현지 교회 확인·질문 <span className={`${styles.subheadSub} tnum`}>{questions.length}건 · 창구 일원화해 발송</span></h3>
        <ol className={`${styles.qRows} stagger`}>
          {questions.map((q) => <li key={q} className={styles.qRow}>{q}</li>)}
        </ol>

        <h3 className={styles.subhead}>미결 <span className={styles.subheadSub}>다음 회의(8월 둘째 주)까지</span></h3>
        <div className={`${styles.pendCard} reveal`}>
          <ul>{pending.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>

        {checks?.length > 0 && (
          <div className={`${styles.checkCard} reveal`}>
            <h3 className={styles.checkTitle}>⚠ 확인 필요 — 녹취 불명확</h3>
            <ol>{checks.map((c) => <li key={c}>{c}</li>)}</ol>
          </div>
        )}

        <p className={styles.hintText}>
          이 회의록은 회의(+직후 공지) 시점의 확정 기록이에요. 이후 변경사항은 다음 회의록에 쌓입니다.
        </p>
      </Section>
    </>
  )
}
