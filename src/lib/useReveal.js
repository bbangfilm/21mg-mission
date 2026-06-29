import { useEffect, useRef } from 'react'

/**
 * 요소가 뷰포트에 들어오면 'is-in' 클래스를 부여(1회).
 * reduced-motion 사용자는 즉시 is-in → 애니메이션 없이 바로 표시.
 */
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.unobserve(el)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
