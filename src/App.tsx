import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Spawn from './pages/Spawn'
import SpawnExact from './pages/SpawnExact'
import Items from './pages/Items'
import Creatures from './pages/Creatures'
import Commands from './pages/Commands'
import CustomCaves from './pages/CustomCaves'
import History from './pages/History'
import SearchResults from './pages/SearchResults'
import { useI18n } from './i18n/I18nContext'

export default function App() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spawn-exact" element={<SpawnExact />} />
          <Route path="/spawn" element={<Spawn />} />
          <Route path="/items" element={<Items />} />
          <Route path="/creatures" element={<Creatures />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/custom-caves" element={<CustomCaves />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <footer className="border-t border-surface-line py-6 text-center text-xs text-bone-faint">
        {t('footer.text')}
      </footer>
    </div>
  )
}
