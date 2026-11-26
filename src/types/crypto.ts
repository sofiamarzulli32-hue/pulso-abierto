export type SortOption = 'market_cap_desc' | 'price_desc' | 'price_asc'

export interface CryptoMarket {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number | null
  total_volume: number | null
  price_change_percentage_24h: number | null
}

export interface SearchFormValues {
  query: string
  sort: SortOption
}
