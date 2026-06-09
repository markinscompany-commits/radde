// GET /api/admin/netcheck-reports — просмотр накопленных отчётов netcheck
// и обращений к /api/health. Доступ закрыт Basic Auth на уровне Nginx
// (location /api/admin), как и остальная админка.
// Временный эндпоинт для диагностики июня 2026, удалить после закрытия.
import { getNetcheckData } from '../../utils/netcheck-store'

export default defineEventHandler(() => {
  return getNetcheckData()
})
