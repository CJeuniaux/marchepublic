import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Home } from './pages/Home'
import { Diagnostic } from './pages/Diagnostic'
import { Intro } from './components/Intro'
import { MentionsLegales } from './pages/MentionsLegales'
import { Confidentialite } from './pages/Confidentialite'
import { CGU } from './pages/CGU'
import { Cookies } from './pages/Cookies'

type Page = 'home' | 'diagnostic' | 'mentions-legales' | 'confidentialite' | 'cgu' | 'cookies'

const PATHS: Partial<Record<Page, string>> = {
  'mentions-legales': '/mentions-legales',
  confidentialite: '/confidentialite',
  cgu: '/cgu',
  cookies: '/cookies',
}

function pageFromPath(pathname: string): Page {
  if (pathname.startsWith('/mentions-legales')) return 'mentions-legales'
  if (pathname.startsWith('/confidentialite')) return 'confidentialite'
  if (pathname.startsWith('/cookies')) return 'cookies'
  if (pathname.startsWith('/cgu')) return 'cgu'
  return 'home'
}

export default function App() {
  const [page, setPage] = useState<Page>(() =>
    typeof window === 'undefined' ? 'home' : pageFromPath(window.location.pathname),
  )
  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.localStorage.getItem('mp_intro_seen')
  })

  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const finishIntro = () => {
    try { window.localStorage.setItem('mp_intro_seen', '1') } catch { /* ignore */ }
    setIntro(false)
  }

  const go = (p: Page) => {
    setPage(p)
    const target = PATHS[p] ?? '/'
    if (window.location.pathname !== target) window.history.pushState({}, '', target)
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
        : page === 'cookies'
        ? <Cookies onBack={() => go('home')} />
        : <Home onStart={() => go('diagnostic')} onLegal={go} />}
    </>
  )
}
