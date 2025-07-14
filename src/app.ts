import { Hono } from 'hono/quick'
import routes from './routes'

const app = new Hono<{ Bindings: CloudflareBindings }>({
  strict: false,
})

app.get('/', (c) =>
  c.json({
    route: 'raiu | Root',
    endpoints: [
      '/health',
      '/rest/valorant/v1/rank/:region/:name/:tag',
      '/rest/valorant/v1/record/:region/:name/:tag',
    ],
  })
)

app.get('/health', (c) =>
  c.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
)

app.route('/rest', routes)

export default app

export type AppType = typeof app
