import { Axiom } from '@axiomhq/js'
import type { Context } from 'hono'

export const createAxiomClient = (
  c: Context<{ Bindings: CloudflareBindings }>
) =>
  new Axiom({
    token: c.env.AXIOM_TOKEN,
  })
