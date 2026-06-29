import styles from './CheckRow.module.css'

/**
 * 공용 체크 행 — 체크(토글) + 텍스트 + 이름 귀속 + (편집 모드) 삭제.
 * 중첩 버튼 방지: 본문 토글 버튼과 삭제 버튼은 형제로 둔다.
 * @param {{ text:string, done:boolean, doneBy?:string|null,
 *           editable:boolean, onToggle:()=>void, onRemove?:()=>void }} props
 */
export default function CheckRow({ text, done, doneBy, editable, onToggle, onRemove }) {
  return (
    <div className={`${styles.row} ${done ? styles.done : ''} ${editable ? styles.editable : ''}`}>
      <button
        type="button" className={`${styles.main} ${editable ? 'pressable' : ''}`}
        onClick={onToggle} disabled={!editable} aria-pressed={done}
      >
        <span className={styles.check} aria-hidden="true">{done ? '✓' : ''}</span>
        <span className={styles.text}>{text}</span>
        {done && doneBy && <span className={styles.by}>{doneBy}</span>}
      </button>
      {editable && onRemove && (
        <button type="button" className={`${styles.del} pressable`} onClick={onRemove} aria-label={`삭제: ${text}`}>✕</button>
      )}
    </div>
  )
}
