import { useState } from 'react'
import { Home } from './pages/Home'
import { Diagnostic } from './pages/Diagnostic'

type Page = 'home' | 'diagnostic'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  const go = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (page === 'diagnostic') return <Diagnostic onBack={() => go('home')} />
  return <Home onStart={() => go('diagnostic')} />
}
