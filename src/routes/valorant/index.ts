import type {
  StyleType,
  ValorantRankResponse,
  ValorantRecordResponse,
} from '../../types/types.global'
import { createAxiomClient } from '../../utils/axiom'
import { aggregateValorantRecords } from '../../utils/elo-aggregator'
import { formatRankMessage } from '../../utils/format-message'
import {
  validateFormat,
  validateRegion,
  validateString,
  validateStyle,
} from '../../utils/input-validation'
import { createRouter } from '../../utils/router'

const valorantRouter = createRouter()

// GET: /rest/valorant/v1/rank/:region/:name/:tag
// Fetches the current Valorant rank for a given player
valorantRouter.get('/v1/rank/:region/:name/:tag', async (c) => {
  const axiom = createAxiomClient(c)

  const { name, tag, region } = c.req.param()
  const { style, format } = c.req.query()
  const VALORANT_API_KEY = c.env.VALORANT_API_KEY

  if (!VALORANT_API_KEY) {
    return c.json({ error: 'Unauthorized.' }, 401)
  }

  if (!validateRegion(region)) {
    axiom.ingest('raiu-requests', {
      timestamp: new Date().toISOString(),
      request_id: c.get('requestId'),
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      user_agent: c.req.header('user-agent'),
      ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
      event_type: 'bad_request_error',
      error_message: `Bad Request: Invalid region: ${region}.`,
    })

    return c.json(
      {
        error: `Bad Request: Invalid region: ${region}. Valid regions are: eu, na, ap, kr, br, latam.`,
      },
      400
    )
  }

  if (!(validateString(name) && validateString(tag))) {
    axiom.ingest('raiu-requests', {
      timestamp: new Date().toISOString(),
      request_id: c.get('requestId'),
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      user_agent: c.req.header('user-agent'),
      ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
      event_type: 'bad_request_error',
      error_message: 'Bad Request: Incorrect name and/or tag value.',
    })

    return c.json(
      {
        error:
          'Bad Request: Incorrect name and/or tag value. Must contain only letters and numbers.',
      },
      400
    )
  }

  if (!validateStyle(style)) {
    return c.json(
      {
        error: `Bad Request: Invalid style: ${style}. Valid styles are: minimal, rank, peak.`,
      },
      400
    )
  }

  if (!validateFormat(format)) {
    return c.json(
      {
        error: `Bad Request: Invalid format: ${format}. Valid formats are: text.`,
      },
      400
    )
  }

  try {
    const res = await fetch(
      `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${name}/${tag}?api_key=${VALORANT_API_KEY}`
    )

    const {
      data: { current_data, highest_rank },
    }: ValorantRankResponse = await res.json()

    if (!(current_data && highest_rank)) {
      axiom.ingest('raiu-requests', {
        timestamp: new Date().toISOString(),
        request_id: c.get('requestId'),
        method: c.req.method,
        path: c.req.path,
        url: c.req.url,
        user_agent: c.req.header('user-agent'),
        ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
        event_type: 'not_found_error',
        error_message: `No data found for: ${name}#${tag}`,
      })

      return c.json(
        { error: `Not Found: No data found for: ${name}#${tag}` },
        404
      )
    }

    const { currenttierpatched: currentRank, ranking_in_tier: rr } =
      current_data
    const { patched_tier: peakRank, season: peakRankSeason } = highest_rank

    const messageStr = formatRankMessage(style as StyleType, {
      currentRank,
      rr,
      peakRank,
      peakRankSeason,
    })

    return format === 'text'
      ? c.text(messageStr, 200)
      : c.json({ message: messageStr }, 200)
  } catch (error) {
    const { message } = error as Error

    axiom.ingest('raiu-requests', {
      timestamp: new Date().toISOString(),
      request_id: c.get('requestId'),
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      user_agent: c.req.header('user-agent'),
      ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
      event_type: 'internal_server_error',
      error_message: message,
    })

    return c.json(
      { error: 'Internal Server Error: External API call failed.' },
      500
    )
  }
})

// GET: /rest/valorant/v1/record/:region/:name/:tag
// Fetches the current Valorant record for a given player in the past 24 hours (max: 14 games)
valorantRouter.get('/v1/record/:region/:name/:tag', async (c) => {
  const axiom = createAxiomClient(c)

  const { name, tag, region } = c.req.param()
  const { format } = c.req.query()
  const VALORANT_API_KEY = c.env.VALORANT_API_KEY

  if (!VALORANT_API_KEY) {
    return c.json({ error: 'Unauthorized.' }, 401)
  }

  if (!validateRegion(region)) {
    axiom.ingest('raiu-requests', {
      timestamp: new Date().toISOString(),
      request_id: c.get('requestId'),
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      user_agent: c.req.header('user-agent'),
      ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
      event_type: 'bad_request_error',
      error_message: `Bad Request: Invalid region: ${region}.`,
    })

    return c.json(
      {
        error: `Bad Request: Invalid region: ${region}. Valid regions are: eu, na, ap, kr, br, latam.`,
      },
      400
    )
  }

  if (!(validateString(name) && validateString(tag))) {
    axiom.ingest('raiu-requests', {
      timestamp: new Date().toISOString(),
      request_id: c.get('requestId'),
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      user_agent: c.req.header('user-agent'),
      ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
      event_type: 'bad_request_error',
      error_message: 'Bad Request: Incorrect name and/or tag value.',
    })

    return c.json(
      {
        error:
          'Bad Request: Incorrect name and/or tag value. Must contain only letters and numbers.',
      },
      400
    )
  }

  if (!validateFormat(format)) {
    return c.json(
      {
        error: `Bad Request: Invalid format: ${format}. Valid formats are: text.`,
      },
      400
    )
  }

  try {
    const res = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${name}/${tag}?api_key=${VALORANT_API_KEY}`
    )

    const { data: valorantGameHistory }: ValorantRecordResponse =
      await res.json()

    if (!valorantGameHistory) {
      axiom.ingest('raiu-requests', {
        timestamp: new Date().toISOString(),
        request_id: c.get('requestId'),
        method: c.req.method,
        path: c.req.path,
        url: c.req.url,
        user_agent: c.req.header('user-agent'),
        ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
        event_type: 'not_found_error',
        error_message: `No data found for: ${name}#${tag}`,
      })

      return c.json(
        { error: `Not Found: No data found for: ${name}#${tag}` },
        404
      )
    }

    const history = valorantGameHistory.filter(({ map: { id } }) => id !== '')

    const { rr, totalWins, totalLosses } = aggregateValorantRecords(history)
    const rrPrefix = rr > 0 ? '+' : ''

    const messageStr = `${totalWins}W / ${totalLosses}L | ${rrPrefix}${rr}RR`

    return format === 'text'
      ? c.text(messageStr, 200)
      : c.json({ message: messageStr }, 200)
  } catch (error) {
    const { message } = error as Error

    axiom.ingest('raiu-requests', {
      timestamp: new Date().toISOString(),
      request_id: c.get('requestId'),
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      user_agent: c.req.header('user-agent'),
      ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
      event_type: 'internal_server_error',
      error_message: message,
    })

    return c.json(
      { error: 'Internal Server Error: External API call failed.' },
      500
    )
  }
})

export default valorantRouter
