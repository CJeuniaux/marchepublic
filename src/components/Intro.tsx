import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Intro animée : des points se connectent pour dessiner un parcours de décision,
 * le chemin s'éclaire, puis le wordmark marchepublic.be apparaît.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), 2400)
    const t2 = window.setTimeout(onDone, 3050)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [onDone])

  const nodes = [
    { x: 60, y: 200 },
    { x: 170, y: 120 },
    { x: 300, y: 180 },
    { x: 430, y: 90 },
    { x: 540, y: 160 },
  ]
  const path = 'M60 200 L170 120 L300 180 L430 90 L540 160'

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 dotgrid-light opacity-50" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-coral/20 blur-3xl" />

      <svg viewBox="0 0 600 280" className="w-[min(90vw,600px)] relative">
        <motion.path
          d={path}
          fill="none"
          stroke="#45C7C7"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i === nodes.length - 1 ? 10 : 6}
            fill={i === nodes.length - 1 ? '#FF735C' : '#FFFFFF'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.28, duration: 0.4, ease: 'backOut' }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
        <motion.circle
          cx={540} cy={160} r={18} fill="none" stroke="#FF735C" strokeWidth={2}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
          style={{ transformOrigin: '540px 160px' }}
        />
      </svg>

      <motion.div
        className="mt-2 text-center px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          marchepublic<span className="text-teal">.be</span>
        </p>
        <p className="mt-2 text-sm text-aqua/70">Le labyrinthe juridique, transformé en parcours clair.</p>
      </motion.div>

      <button
        onClick={onDone}
        className="absolute bottom-6 right-6 text-xs text-white/50 hover:text-white transition-colors"
      >
        Passer →
      </button>
    </motion.div>
  )
}
