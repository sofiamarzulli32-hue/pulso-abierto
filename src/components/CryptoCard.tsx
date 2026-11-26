import { Link } from 'react-router-dom'
import { useFavoritesStore } from '../store/favoritesStore'
import type { CryptoMarket } from '../types/crypto'
import { usdCurrency } from '../utils/formatters'

interface CryptoCardProps {
  crypto: CryptoMarket
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(crypto.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const change = crypto.price_change_percentage_24h

  return (
    <article className={`crypto-card${isFavorite ? ' is-highlighted' : ''}`}>
      <div className="crypto-card-heading">
        <img src={crypto.image} alt="" width="48" height="48" />
        <div>
          <h2>{crypto.name}</h2>
          <p className="symbol">{crypto.symbol.toUpperCase()}</p>
        </div>
      </div>

      <dl className="crypto-data">
        <div>
          <dt>Precio</dt>
          <dd>{usdCurrency.format(crypto.current_price)}</dd>
        </div>
        <div>
          <dt>Cambio 24 h</dt>
          <dd className={(change ?? 0) >= 0 ? 'positive' : 'negative'}>
            {change === null ? 'Sin dato' : `${change.toFixed(2)}%`}
          </dd>
        </div>
      </dl>

      <div className="card-actions">
        <Link className="text-link" to={`/criptomonedas/${crypto.id}`}>
          Ver detalle
        </Link>
        <button
          className="secondary-button"
          type="button"
          aria-pressed={isFavorite}
          aria-label={`${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}: ${crypto.name}`}
          onClick={() => toggleFavorite(crypto.id)}
        >
          {isFavorite ? '★ Favorito' : '☆ Agregar a favoritos'}
        </button>
      </div>
    </article>
  )
}
