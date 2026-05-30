import { motion } from 'framer-motion'

const COLS = ['1fr', '52px', '56px', '52px']

export default function MinimalSchool({ colors, schools }) {
  const grid = { display: 'grid', gridTemplateColumns: COLS.join(' ') }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ background: colors.bg, fontFamily: 'system-ui, sans-serif', border: '1px solid rgba(0,0,0,0.14)' }}
    >
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${colors.rule}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>Nearby Schools</div>
      </div>

      {/* column headers */}
      <div style={{ ...grid, background: 'rgba(0,0,0,0.025)', borderBottom: `1px solid ${colors.rule}` }}>
        {['School', 'Grade', 'Dist.', 'Score'].map((h, i) => (
          <div key={h} style={{
            padding: '7px 14px',
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: colors.muted,
            borderRight: i < 3 ? `1px solid ${colors.rule}` : 'none',
          }}>{h}</div>
        ))}
      </div>

      {schools.map((school, i) => (
        <div key={school.name} style={{ ...grid, borderBottom: i < schools.length - 1 ? `1px solid ${colors.rule}` : 'none' }}>
          <div style={{ padding: '10px 14px', fontWeight: 700, fontSize: 13, color: colors.text, borderRight: `1px solid ${colors.rule}` }}>
            {school.name}
          </div>
          <div style={{ padding: '10px 14px', fontSize: 12, color: colors.text, borderRight: `1px solid ${colors.rule}` }}>
            {school.grade}
          </div>
          <div style={{ padding: '10px 14px', fontSize: 12, color: colors.text, borderRight: `1px solid ${colors.rule}` }}>
            {school.distance}
          </div>
          <div style={{ padding: '10px 14px', fontSize: 14, fontWeight: 700, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
            {school.score}
          </div>
        </div>
      ))}

      <div style={{ padding: '8px 14px', borderTop: `1px solid ${colors.rule}` }}>
        <div style={{ fontSize: 10, color: colors.muted }}>GreatSchools ratings · Riverside USD</div>
      </div>
    </motion.div>
  )
}
