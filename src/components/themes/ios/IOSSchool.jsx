import { motion } from 'framer-motion'

function ScoreBubble({ score, color, delay }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 380, damping: 20 }}
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        background: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 4px 12px ${color}55`,
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>/10</span>
    </motion.div>
  )
}

const SCORE_COLORS = ['#3B82F6', '#F59E0B', '#10B981']

export default function IOSSchool({ colors, schools }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.1, 0.64, 1] }}
      style={{
        background: colors.card,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        padding: '18px 18px 14px',
      }}
    >
      {/* header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: colors.tint, textTransform: 'uppercase', marginBottom: 3 }}>
          Nearby Schools
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: colors.label, lineHeight: 1.1 }}>
          School Snapshot
        </div>
      </div>

      {/* school rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {schools.map((school, i) => (
          <motion.div
            key={school.name}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
            style={{
              background: colors.groupedBg,
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <ScoreBubble score={school.score} color={SCORE_COLORS[i]} delay={i * 0.08 + 0.1} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.label, lineHeight: 1.2 }}>
                {school.name}
              </div>
              <div style={{ fontSize: 12, color: colors.secondary, marginTop: 2 }}>
                {school.grade} · {school.distance}
              </div>
              {/* score bar */}
              <div style={{ marginTop: 6, height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${school.score * 10}%` }}
                  transition={{ delay: i * 0.08 + 0.2, duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: SCORE_COLORS[i], borderRadius: 2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* footer note */}
      <div style={{ marginTop: 12, fontSize: 11, color: colors.secondary, textAlign: 'center' }}>
        Ratings via GreatSchools · Riverside USD
      </div>
    </motion.div>
  )
}
