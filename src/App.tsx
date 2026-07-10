import { useState, type ComponentType } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Home } from './pages/Home'
import { Diagnostic } from './pages/Diagnostic'
import { Intro } from './components/Intro'
import { MentionsLegales } from './pages/MentionsLegales'
import { Confidentialite } from './pages/Confidentialite'
import { CGU } from './pages/CGU'
import { Cookies } from './pages/Cookies'
import { AuthProvider } from './context/AuthContext'
import { RequireAuth } from './components/premium/RequireAuth'
import { Login } from './pages/premium/Login'
import { Register } from './pages/premium/Register'
import { Compte } from './pages/premium/Compte'
import { Profil } from './pages/premium/Profil'
import { Prestataires } from './pages/premium/Prestataires'
import { NouveauMarche } from './pages/premium/NouveauMarche'
import { DetailMarche } from './pages/premium/DetailMarche'

type LegalPage = 'mentions-legales' | 'confidentialite' | 'cgu' | 'cookies'

// Route "/" : gère l'intro (1re visite) + home + diagnostic (bascule d'état, sans URL dédiée).
function HomeRoute() {
  const navigate = useNavigate()
  const [inDiagnostic, setInDiagnostic] = useState(false)
  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.localStorage.getItem('mp_intro_seen')
  })

  const finishIntro = () => {
    try { window.localStorage.setItem('mp_intro_seen', '1') } catch { /* ignore */ }
    setIntro(false)
  }

  const goLegal = (p: LegalPage) => navigate(`/${p}`)

  return (
    <>
      <AnimatePresence>{intro && <Intro key="intro" onDone={finishIntro} />}</AnimatePresence>
      {inDiagnostic
        ? <Diagnostic onBack={() => setInDiagnostic(false)} />
        : <Home onStart={() => setInDiagnostic(true)} onLegal={goLegal} />}
    </>
  )
}

// Enveloppe les pages légales (qui attendent une prop onBack) avec la navigation.
function LegalRoute({ Component }: { Component: ComponentType<{ onBack: () => void }> }) {
  const navigate = useNavigate()
  return <Component onBack={() => navigate('/')} />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/mentions-legales" element={<LegalRoute Component={MentionsLegales} />} />
          <Route path="/confidentialite" element={<LegalRoute Component={Confidentialite} />} />
          <Route path="/cgu" element={<LegalRoute Component={CGU} />} />
          <Route path="/cookies" element={<LegalRoute Component={Cookies} />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/compte" element={<RequireAuth><Compte /></RequireAuth>} />
          <Route path="/compte/profil" element={<RequireAuth><Profil /></RequireAuth>} />
          <Route path="/compte/prestataires" element={<RequireAuth><Prestataires /></RequireAuth>} />
          <Route path="/compte/marches/nouveau" element={<RequireAuth><NouveauMarche /></RequireAuth>} />
          <Route path="/compte/marches/:id" element={<RequireAuth><DetailMarche /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
