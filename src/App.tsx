import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CryptoDetailPage from './pages/CryptoDetailPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Pulso Abierto, ir al inicio">
            Pulso Abierto
          </Link>
          <p className="tagline">Datos claros para seguir el mercado cripto</p>
        </div>
      </header>

      <main className="container main-content" id="contenido-principal">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/criptomonedas/:id" element={<CryptoDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          <small>Proyecto académico - Datos provistos por CoinGecko.</small>
        </div>
      </footer>
    </div>
  )
}
