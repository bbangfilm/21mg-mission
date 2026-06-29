import Section from '../components/Section.jsx'
import { Chip } from '../components/ui.jsx'
import { teams, supportRoles } from '../data/teams.js'
import { useEditMode } from '../context/EditModeContext.jsx'
import TeamCard from './TeamCard.jsx'
import styles from './Teams.module.css'

export default function Teams() {
  const { can, name } = useEditMode()
  const editable = can('team')

  return (
    <Section id="teams" eyebrow="Serving Teams" title="여섯 팀, 한 사역" desc="6팀 + 지원역할 · 오병이어 운영">
      <div className={`${styles.grid} stagger`}>
        {teams.map((t) => (
          <TeamCard key={t.id} team={t} editable={editable} name={name} />
        ))}
      </div>

      <div className={`${styles.support} reveal`}>
        <h3 className={styles.supportTitle}>지원 역할</h3>
        <div className={styles.supportChips}>
          {supportRoles.map((r) => (
            <span key={r.role} className={styles.supportItem}>
              <Chip tone="role">{r.role}</Chip>
              <span className={styles.supportPeople}>{r.people.join(' · ')}</span>
            </span>
          ))}
        </div>
        <p className={styles.note}>※ 셀(참가)과 팀(사역)은 별개 — 한 사람이 여러 셀·팀·역할에 속할 수 있습니다.</p>
      </div>
    </Section>
  )
}
