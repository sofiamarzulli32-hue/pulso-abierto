interface OperationStatusProps {
  kind: 'initial' | 'loading' | 'empty' | 'error'
  message?: string
  onRetry?: () => void
}

export default function OperationStatus({ kind, message, onRetry }: OperationStatusProps) {
  if (kind === 'initial') {
    return <p className="status-card">Preparando la consulta de mercado...</p>
  }

  if (kind === 'loading') {
    return (
      <p className="status-card" role="status" aria-live="polite">
        Cargando datos de CoinGecko...
      </p>
    )
  }

  if (kind === 'empty') {
    return (
      <div className="status-card" role="status">
        <p>No hay criptomonedas que coincidan con el criterio aplicado.</p>
      </div>
    )
  }

  return (
    <div className="status-card status-error" role="alert">
      <p>{message ?? 'No fue posible completar la consulta.'}</p>
      {onRetry && (
        <button className="secondary-button" type="button" onClick={onRetry}>
          Reintentar consulta
        </button>
      )}
    </div>
  )
}
