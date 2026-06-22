import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Home } from './pages/Home'
import { Diagnostic } from './pages/Diagnostic'
import { Intro } from './components/Intro'

type Page = 'home' | 'diagnostic'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.sessionStorage.getItem('mp_intro_seen')
  })

  const finishIntro = () => {
    try { window.sessionStorage.setItem('mp_intro_seen', '1') } catch { /* ignore */ }
    setIntro(false)
  }

  const go = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <AnimatePresence>{intro && <Intro key="intro" onDone={finishIntro} />}</AnimatePresence>
      {page === 'diagnostic'
        ? <Diagnostic onBack={() => go('home')} />
        : <Home onStart={() => go('diagnostic')} />}
    </>
  )
}
