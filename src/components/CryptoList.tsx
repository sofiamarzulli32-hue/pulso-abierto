import type { CryptoMarket } from '../types/crypto'
import CryptoCard from './CryptoCard'

interface CryptoListProps {
  items: CryptoMarket[]
}

export default function CryptoList({ items }: CryptoListProps) {
  return (
    <section aria-labelledby="results-title">
      <div className="results-heading">
        <h2 id="results-title">Resultados</h2>
        <p aria-live="polite">{items.length} resultado{items.length === 1 ? '' : 's'}</p>
      </div>

      <div className="crypto-grid">
        {items.map((crypto) => <CryptoCard key={crypto.id} crypto={crypto} />)}
      </div>
    </section>
  )
}
