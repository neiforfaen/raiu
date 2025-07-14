import { Hono } from 'hono'
import valorantRouter from './valorant'

const routes = new Hono()

routes.route('/valorant', valorantRouter)

export default routes
