import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, test, vi } from 'vitest'
import HomePage from '../pages/HomePage'
import * as service from '../services/cryptoService'
import type { CryptoMarket } from '../types/crypto'

const data: CryptoMarket[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: '', current_price: 100, market_cap: 1000, total_volume: 10, price_change_percentage_24h: 1 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: '', current_price: 50, market_cap: 500, total_volume: 8, price_change_percentage_24h: -1 },
  { id: 'solana', name: 'Solana', symbol: 'sol', image: '', current_price: 20, market_cap: 200, total_volume: 5, price_change_percentage_24h: 2 },
]

beforeEach(() => vi.restoreAllMocks())

test('muestra carga y luego resultados cuando la consulta es exitosa', async () => {
  vi.spyOn(service, 'fetchCryptos').mockResolvedValue(data)
  render(<MemoryRouter><HomePage /></MemoryRouter>)

  expect(screen.getByRole('status')).toHaveTextContent(/cargando datos/i)
  expect(await screen.findByRole('heading', { name: 'Resultados' })).toBeInTheDocument()
})

test('muestra error y permite reintentar la consulta', async () => {
  const fetchMock = vi.spyOn(service, 'fetchCryptos')
    .mockRejectedValueOnce(new Error('Fallo controlado'))
    .mockResolvedValueOnce(data)

  const user = userEvent.setup()
  render(<MemoryRouter><HomePage /></MemoryRouter>)

  expect(await screen.findByRole('alert')).toHaveTextContent('Fallo controlado')
  await user.click(screen.getByRole('button', { name: /reintentar consulta/i }))

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  expect(await screen.findByRole('heading', { name: 'Resultados' })).toBeInTheDocument()
})
