import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CryptoCard from '../components/CryptoCard'
import { useFavoritesStore } from '../store/favoritesStore'
import type { CryptoMarket } from '../types/crypto'

const bitcoin: CryptoMarket = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: '',
  current_price: 100,
  market_cap: 1000,
  total_volume: 50,
  price_change_percentage_24h: 2.5,
}

test('permite marcar y desmarcar una criptomoneda como favorita', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><CryptoCard crypto={bitcoin} /></MemoryRouter>)

  const addButton = screen.getByRole('button', { name: /agregar a favoritos: bitcoin/i })
  await user.click(addButton)

  expect(useFavoritesStore.getState().favoriteIds).toContain('bitcoin')
  expect(screen.getByRole('button', { name: /quitar de favoritos: bitcoin/i })).toHaveAttribute('aria-pressed', 'true')

  await user.click(screen.getByRole('button', { name: /quitar de favoritos: bitcoin/i }))
  expect(useFavoritesStore.getState().favoriteIds).not.toContain('bitcoin')
})
