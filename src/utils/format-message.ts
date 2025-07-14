import type { FormattedRankResponse, StyleType } from '../types/types.global'

export const formatRankMessage = (
  style: StyleType,
  data: FormattedRankResponse
) => {
  const { currentRank, rr, peakRank, peakRankSeason } = data
  switch (style) {
    case 'minimal':
      return `${currentRank} [${rr}RR]`
    case 'rank':
      return currentRank
    case 'peak':
      return `${peakRank} @ ${peakRankSeason}`
    default:
      return `${currentRank} [${rr}RR] | Peak: ${peakRank} @ ${peakRankSeason}`
  }
}
