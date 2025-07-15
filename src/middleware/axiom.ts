import { createMiddleware } from 'hono/factory'
import { createAxiomClient } from '../utils/axiom'

export const logRequests = createMiddleware(async (c, next) => {
  const axiom = createAxiomClient(c)

  axiom.ingest('raiu-requests', {
    timestamp: new Date().toISOString(),
    request_id: c.get('requestId'),
    method: c.req.method,
    path: c.req.path,
    url: c.req.url,
    user_agent: c.req.header('user-agent'),
    ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
    event_type: 'request_log',
  })

  await next()
  await axiom.flush()
})
