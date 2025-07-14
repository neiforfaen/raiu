import type {
  AggregatedValorantRecord,
  ValorantRecord,
} from '../types/types.global'

export const isToday = (timestamp: number): boolean => {
  const now = new Date()
  const startOfToday =
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000
  const endOfToday = startOfToday + 24 * 60 * 60 - 1

  return timestamp >= startOfToday && timestamp <= endOfToday
}

export const aggregateValorantRecords = (
  history: ValorantRecord[]
): AggregatedValorantRecord => {
  const { rr, totalWins, totalLosses } = history.reduce(
    (acc, record) => {
      if (isToday(record.date_raw)) {
        acc.rr += record.mmr_change_to_last_game
        if (record.mmr_change_to_last_game > 0) {
          acc.totalWins++
        } else if (record.mmr_change_to_last_game < 0) {
          acc.totalLosses++
        }
      }
      return acc
    },
    { rr: 0, totalWins: 0, totalLosses: 0 }
  )

  return {
    rr,
    totalWins,
    totalLosses,
  }
}
