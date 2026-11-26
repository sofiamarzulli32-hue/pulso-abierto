import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="status-card">
      <p className="eyebrow">404</p>
      <h1>Página inexistente</h1>
      <p>La dirección ingresada no coincide con una página disponible en Pulso Abierto.</p>
      <Link className="text-link" to="/">Ir al inicio</Link>
    </section>
  )
}
