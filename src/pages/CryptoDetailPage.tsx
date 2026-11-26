import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OperationStatus from '../components/OperationStatus'
import { fetchCryptoById } from '../services/cryptoService'
import { useFavoritesStore } from '../store/favoritesStore'
import type { CryptoMarket } from '../types/crypto'
import { usdCurrency } from '../utils/formatters'

export default function CryptoDetailPage() {
  const { id = '' } = useParams()
  const [crypto, setCrypto] = useState<CryptoMarket | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'not-found' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDetail() {
      setStatus('loading')
      setErrorMessage('')

      try {
        const data = await fetchCryptoById(id, controller.signal)
        if (!data) {
          setCrypto(null)
          setStatus('not-found')
          return
        }
        setCrypto(data)
        setStatus('success')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado')
      }
    }

    void loadDetail()
    return () => controller.abort()
  }, [id, requestVersion])

  if (status === 'loading') return <OperationStatus kind="loading" />

  if (status === 'error') {
    return (
      <OperationStatus
        kind="error"
        message={errorMessage}
        onRetry={() => setRequestVersion((previous) => previous + 1)}
      />
    )
  }

  if (status === 'not-found' || !crypto) {
    return (
      <section className="status-card">
        <h1>Criptomoneda no disponible</h1>
        <p>El identificador de la URL no corresponde con uno de los registros admitidos.</p>
        <Link className="text-link" to="/">Volver a la consulta</Link>
      </section>
    )
  }

  return (
    <article className="detail-card">
      <Link className="text-link" to="/">← Volver a resultados</Link>
      <div className="detail-title">
        <img src={crypto.image} alt="" width="64" height="64" />
        <div>
          <p className="eyebrow">Detalle</p>
          <h1>{crypto.name}</h1>
          <p>{crypto.symbol.toUpperCase()}</p>
        </div>
      </div>

      <button
        className="secondary-button detail-favorite"
        type="button"
        aria-pressed={isFavorite}
        onClick={() => toggleFavorite(crypto.id)}
      >
        {isFavorite ? '★ Quitar de favoritos' : '☆ Agregar a favoritos'}
      </button>

      <dl className="detail-grid">
        <div><dt>Precio actual</dt><dd>{usdCurrency.format(crypto.current_price)}</dd></div>
        <div><dt>Capitalización</dt><dd>{crypto.market_cap === null ? 'Sin dato' : usdCurrency.format(crypto.market_cap)}</dd></div>
        <div><dt>Volumen 24 h</dt><dd>{crypto.total_volume === null ? 'Sin dato' : usdCurrency.format(crypto.total_volume)}</dd></div>
        <div><dt>Cambio 24 h</dt><dd>{crypto.price_change_percentage_24h === null ? 'Sin dato' : `${crypto.price_change_percentage_24h.toFixed(2)}%`}</dd></div>
      </dl>
    </article>
  )
}
