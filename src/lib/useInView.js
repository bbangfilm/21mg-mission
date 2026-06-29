import { useEffect, useRef, useState } from 'react'

/**
 * 요소가 뷰포트에 들어올 때마다 plays 카운터를 +1 (스크롤로 다시 보일 때마다 재생용 키).
 * 컴포넌트에 key={plays} 로 주면 재등장할 때마다 리마운트 → 애니메이션 재생.
 * reduced-motion: plays=1 고정(애니메이션 없이 한 번만).
 * @returns {[React.RefObject, number]} [ref, plays]
 */
export function useInView({ threshold = 0.3, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const [plays, setPlays] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlays(1)
      return
    }
    let inside = false
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !inside) { inside = true; setPlays((p) => p + 1) }
          else if (!e.isIntersecting && inside) { inside = false }
        }
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin])
  return [ref, plays]
}
