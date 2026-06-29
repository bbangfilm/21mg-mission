// 탭 파티클 버스트 — Ministry 카드 터치 시 물방울 링 + 컨페티가 터지는 효과.
// DOM 직접 생성(라이브러리 없음). 전역 고정 레이어에 그려 카드 overflow:hidden 에도 안 잘림.
const COLORS = ['#5B3DF5', '#FFCE2E', '#15C6A0', '#FF5A6E', '#7C63FF', '#2BD4AE']

function getLayer() {
  let layer = document.getElementById('__burst_layer__')
  if (!layer) {
    layer = document.createElement('div')
    layer.id = '__burst_layer__'
    layer.className = 'burst-layer'
    document.body.appendChild(layer)
  }
  return layer
}

/** 화면 좌표 (x, y) 에서 파티클을 터뜨린다. */
export function burst(x, y, { count = 16 } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const layer = getLayer()

  // 물방울 링
  const ring = document.createElement('span')
  ring.className = 'burst-ring'
  ring.style.left = x + 'px'
  ring.style.top = y + 'px'
  ring.addEventListener('animationend', () => ring.remove())
  layer.appendChild(ring)

  // 컨페티 입자 (방사형)
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span')
    p.className = 'burst-particle'
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6
    const dist = 36 + Math.random() * 66
    const size = 6 + Math.random() * 9
    p.style.left = x + 'px'
    p.style.top = y + 'px'
    p.style.width = size + 'px'
    p.style.height = size + 'px'
    p.style.background = COLORS[i % COLORS.length]
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px')
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px')
    p.addEventListener('animationend', () => p.remove())
    layer.appendChild(p)
  }
}
