import type { CryptoMarket } from '../types/crypto'

const API_URL = 'https://api.coingecko.com/api/v3/simple/price'

export const SUPPORTED_CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana'] as const
export type SupportedCryptoId = (typeof SUPPORTED_CRYPTO_IDS)[number]

type CoinGeckoSimplePriceItem = {
  usd?: number
  usd_market_cap?: number
  usd_24h_vol?: number
  usd_24h_change?: number
}

type CoinGeckoSimplePriceResponse = Record<string, CoinGeckoSimplePriceItem>

const metadata: Record<SupportedCryptoId, Pick<CryptoMarket, 'name' | 'symbol' | 'image'>> = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'eth',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  solana: {
    name: 'Solana',
    symbol: 'sol',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  },
}

export function isSupportedCryptoId(id: string): id is SupportedCryptoId {
  return SUPPORTED_CRYPTO_IDS.includes(id as SupportedCryptoId)
}

export function mapSimplePriceResponse(data: CoinGeckoSimplePriceResponse): CryptoMarket[] {
  return SUPPORTED_CRYPTO_IDS.flatMap((id) => {
    const external = data[id]
    if (!external || typeof external.usd !== 'number') return []

    return [{
      id,
      ...metadata[id],
      current_price: external.usd,
      market_cap: typeof external.usd_market_cap === 'number' ? external.usd_market_cap : null,
      total_volume: typeof external.usd_24h_vol === 'number' ? external.usd_24h_vol : null,
      price_change_percentage_24h:
        typeof external.usd_24h_change === 'number' ? external.usd_24h_change : null,
    }]
  })
}

export async function fetchCryptos(signal?: AbortSignal): Promise<CryptoMarket[]> {
  const params = new URLSearchParams({
    ids: SUPPORTED_CRYPTO_IDS.join(','),
    vs_currencies: 'usd',
    include_market_cap: 'true',
    include_24hr_vol: 'true',
    include_24hr_change: 'true',
  })

  const response = await fetch(`${API_URL}?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`)
  }

  const data = (await response.json()) as CoinGeckoSimplePriceResponse

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('La respuesta recibida no tiene el formato esperado')
  }

  return mapSimplePriceResponse(data)
}

export async function fetchCryptoById(id: string, signal?: AbortSignal): Promise<CryptoMarket | null> {
  if (!isSupportedCryptoId(id)) return null
  const items = await fetchCryptos(signal)
  return items.find((item) => item.id === id) ?? null
}
