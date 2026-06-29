import { asset } from '../lib/asset.js'
import styles from './PhotoBand.module.css'

/**
 * 풀블리드 에디토리얼 사진 밴드 (섹션 사이 리듬 + 실사진 활용).
 * @param {{ img:string, alt:string, caption?:string, tag?:string }} props
 */
export default function PhotoBand({ img, alt, caption, tag }) {
  return (
    <figure className={styles.band}>
      <img className={styles.img} src={asset(img)} alt={alt} loading="lazy" />
      <div className={styles.scrim} aria-hidden="true" />
      {(caption || tag) && (
        <figcaption className={styles.cap}>
          {tag && <span className={styles.tag}>{tag}</span>}
          {caption && <span className={styles.text}>{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}
