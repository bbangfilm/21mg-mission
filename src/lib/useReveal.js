import { useEffect, useRef } from 'react'

/**
 * 요소가 뷰포트에 들어올 때마다 'is-in' 토글 → 스크롤을 올리고 내릴 때마다 재생.
 * reduced-motion 사용자는 항상 is-in(애니메이션 없이 바로 표시).
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
          // 들어오면 재생, 완전히 벗어나면 리셋 → 다음 진입 때 다시 재생
          el.classList.toggle('is-in', e.isIntersecting)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
