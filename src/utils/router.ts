import { Hono } from 'hono'

export const createRouter = () =>
  new Hono<{ Bindings: CloudflareBindings }>({ strict: false })

export type RouterType = ReturnType<typeof createRouter>
