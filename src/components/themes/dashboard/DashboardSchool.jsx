import { motion } from 'framer-motion'

const SCORE_STATUS = (s) => s >= 8 ? ['#10B981', '#ECFDF5'] : s >= 6 ? ['#F59E0B', '#FFFBEB'] : ['#EF4444', '#FEF2F2']

export default function DashboardSchool({ colors, schools }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        overflow: 'hidden',
        fontFamily: '"Inter", system-ui, sans-serif',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ background: colors.accent, padding: '10px 16px' }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 1 }}>
          School Snapshot
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Nearby Schools</div>
      </div>

      {/* column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 60px', padding: '8px 16px 6px', borderBottom: `1px solid ${colors.border}`, gap: 8 }}>
        {['School', 'Rating', 'Dist.'].map(h => (
          <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: colors.muted, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>

      {schools.map((school, i) => {
        const [dot, bg] = SCORE_STATUS(school.score)
        return (
          <motion.div
            key={school.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 56px 60px',
              padding: '12px 16px', gap: 8, alignItems: 'center',
              borderBottom: i < schools.length - 1 ? `1px solid ${colors.border}` : 'none',
              background: i === 0 ? colors.accentBg : 'transparent',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, lineHeight: 1.2 }}>{school.name}</div>
              <div style={{ fontSize: 11, color: colors.muted, marginTop: 1 }}>{school.grade}</div>
              <div style={{ height: 3, background: colors.border, marginTop: 6, borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${school.score * 10}%` }}
                  transition={{ delay: i * 0.07 + 0.2, duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: dot, borderRadius: 2 }}
                />
              </div>
            </div>
            {/* score status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: colors.text, fontFamily: '"DM Mono", monospace' }}>{school.score}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: colors.muted, fontFamily: '"DM Mono", monospace' }}>{school.distance}</div>
          </motion.div>
        )
      })}

      <div style={{ padding: '8px 16px', borderTop: `1px solid ${colors.border}` }}>
        <span style={{ fontSize: 10, color: colors.muted }}>Source: GreatSchools · Riverside USD</span>
      </div>
    </motion.div>
  )
}
