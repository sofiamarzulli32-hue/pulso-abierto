import { useEffect, useMemo, useState } from 'react'
import CryptoList from '../components/CryptoList'
import OperationStatus from '../components/OperationStatus'
import SearchForm from '../components/SearchForm'
import { fetchCryptos } from '../services/cryptoService'
import { useFavoritesStore } from '../store/favoritesStore'
import type { CryptoMarket, SearchFormValues } from '../types/crypto'

type LoadState = 'initial' | 'loading' | 'success' | 'error'

const defaultForm: SearchFormValues = {
  query: '',
  sort: 'market_cap_desc',
}

export default function HomePage() {
  const [cryptos, setCryptos] = useState<CryptoMarket[]>([])
  const [loadState, setLoadState] = useState<LoadState>('initial')
  const [errorMessage, setErrorMessage] = useState('')
  const [filters, setFilters] = useState<SearchFormValues>(defaultForm)
  const [requestVersion, setRequestVersion] = useState(0)
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadData() {
      setLoadState('loading')
      setErrorMessage('')

      try {
        const data = await fetchCryptos(controller.signal)
        if (!active) return
        setCryptos(data)
        setLoadState('success')
      } catch (error) {
        if (!active || (error instanceof DOMException && error.name === 'AbortError')) return
        setLoadState('error')
        setErrorMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado')
      }
    }

    void loadData()
    return () => {
      active = false
      controller.abort()
    }
  }, [requestVersion])

  const visibleCryptos = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase()
    const filtered = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(normalizedQuery) ||
      crypto.symbol.toLowerCase().includes(normalizedQuery),
    )

    return [...filtered].sort((a, b) => {
      if (filters.sort === 'price_desc') return b.current_price - a.current_price
      if (filters.sort === 'price_asc') return a.current_price - b.current_price
      return (b.market_cap ?? 0) - (a.market_cap ?? 0)
    })
  }, [cryptos, filters])

  return (
    <>
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Mercado cripto</p>
        <h1 id="page-title">Consulta rápida de criptomonedas</h1>
        <p>
          Filtrá y ordená Bitcoin, Ethereum y Solana. Los favoritos se conservan al recargar la aplicación.
        </p>
        <p className="favorite-summary" aria-live="polite">
          Favoritos seleccionados: <strong>{favoriteCount}</strong>
        </p>
      </section>

      <SearchForm initialValues={defaultForm} onApply={setFilters} />

      {loadState === 'initial' && <OperationStatus kind="initial" />}
      {loadState === 'loading' && <OperationStatus kind="loading" />}
      {loadState === 'error' && (
        <OperationStatus
          kind="error"
          message={errorMessage}
          onRetry={() => setRequestVersion((previous) => previous + 1)}
        />
      )}
      {loadState === 'success' && visibleCryptos.length === 0 && <OperationStatus kind="empty" />}
      {loadState === 'success' && visibleCryptos.length > 0 && <CryptoList items={visibleCryptos} />}
    </>
  )
}
