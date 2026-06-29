// public/ 자산 경로 헬퍼 — dev('/')·prod('/21mg-mission/') 양쪽에서 안전.
export const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '')
