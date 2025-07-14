export type StyleType = 'minimal' | 'rank' | 'peak' | undefined

export type FormatType = 'text' | undefined

export type FormattedRankResponse = {
  currentRank: string
  rr: number
  peakRank: string
  peakRankSeason: string
}

export type ValorantRankResponse = {
  data: {
    current_data: {
      currenttier: number
      currenttierpatched: string
      images: {
        small: string
        large: string
        triangle_down: string
        triangle_up: string
      }
      ranking_in_tier: number
      mmr_change_to_last_game: number
      elo: number
      games_needed_for_rating: number
      old: boolean
    }
    highest_rank: {
      old: boolean
      tier: number
      patched_tier: string
      season: string
    }
  }
}

export type ValorantRecord = {
  currenttier: number
  currenttierpatched: string
  images: {
    small: string
    large: string
    triangle_down: string
    triangle_up: string
  }
  map: {
    id: string
    name: string
  }
  match_id: string
  season_id: string
  ranking_in_tier: number
  mmr_change_to_last_game: number
  elo: number
  date: string
  date_raw: number
}

export type ValorantRecordResponse = {
  data: ValorantRecord[]
}

export type AggregatedValorantRecord = {
  rr: number
  totalWins: number
  totalLosses: number
}
