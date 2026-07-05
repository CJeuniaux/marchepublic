import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Home } from './pages/Home'
import { Diagnostic } from './pages/Diagnostic'
import { Intro } from './components/Intro'
import { MentionsLegales } from './pages/MentionsLegales'
import { Confidentialite } from './pages/Confidentialite'
import { CGU } from './pages/CGU'

type Page = 'home' | 'diagnostic' | 'mentions-legales' | 'confidentialite' | 'cgu'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.localStorage.getItem('mp_intro_seen')
  })

  const finishIntro = () => {
    try { window.localStorage.setItem('mp_intro_seen', '1') } catch { /* ignore */ }
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
        : page === 'mentions-legales'
        ? <MentionsLegales onBack={() => go('home')} />
        : page === 'confidentialite'
        ? <Confidentialite onBack={() => go('home')} />
        : page === 'cgu'
        ? <CGU onBack={() => go('home')} />
        : <Home onStart={() => go('diagnostic')} onLegal={go} />}
    </>
  )
}
