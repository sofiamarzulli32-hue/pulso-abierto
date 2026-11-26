import { afterEach, describe, expect, test, vi } from 'vitest'
import { fetchCryptos } from '../services/cryptoService'

afterEach(() => vi.restoreAllMocks())

describe('cryptoService', () => {
  test('transforma una respuesta HTTP exitosa al formato de la aplicación', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        bitcoin: { usd: 90000, usd_market_cap: 10, usd_24h_vol: 2, usd_24h_change: 1.2 },
        ethereum: { usd: 3000, usd_market_cap: 8, usd_24h_vol: 1, usd_24h_change: -0.4 },
        solana: { usd: 200, usd_market_cap: 5, usd_24h_vol: 0.5, usd_24h_change: 3.1 },
      }),
    } as Response)

    const result = await fetchCryptos()
    expect(result).toHaveLength(3)
    expect(result[0]).toMatchObject({ id: 'bitcoin', name: 'Bitcoin', current_price: 90000 })
  })

  test('lanza un error cuando response.ok es false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 503 } as Response)
    await expect(fetchCryptos()).rejects.toThrow('La API respondió con estado 503')
  })
})
