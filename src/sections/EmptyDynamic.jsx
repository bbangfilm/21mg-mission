import Section from '../components/Section.jsx'
import { Badge } from '../components/ui.jsx'
import styles from './EmptyDynamic.module.css'

// 첫 배포 시 빈 컬렉션인 동적 섹션의 읽기 placeholder.
// ⚠️ loading(스켈레톤) / empty / error 3-상태 중 여기서는 'empty(준비중)'만 표현.
//    S3 연결 후엔 useCollection.loading 으로 첫 스냅샷 전 empty 카피를 막는다.
export default function EmptyDynamic({ id, no, title, desc, emoji, emptyText, hint, tone }) {
  return (
    <Section id={id} no={no} title={title} desc={desc} tone={tone}>
      <div className={`${styles.empty} reveal`}>
        <span className={styles.emoji} aria-hidden="true">{emoji}</span>
        <Badge tone="muted">실시간 준비중</Badge>
        <p className={styles.text}>{emptyText}</p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </Section>
  )
}
