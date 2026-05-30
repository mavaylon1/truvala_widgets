import { motion } from 'framer-motion'

export default function MaterialSchool({ colors, schools }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', fontFamily: "'Barlow', sans-serif", boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)' }}
    >
      {/* neutral header */}
      <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid rgba(0,0,0,0.06)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: colors.primary, flexShrink: 0 }} />
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>Schools</div>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: colors.text, lineHeight: 1.15 }}>School Snapshot</div>
      </div>

      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {schools.map((school, i) => (
          <motion.div
            key={school.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: 'rgba(0,0,0,0.025)',
              borderRadius: 12, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            {/* score — tonal chip only for the top school, plain for others */}
            <div style={{
              width: 48, height: 48, borderRadius: 10, flexShrink: 0,
              background: i === 0 ? colors.container : 'rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: i === 0 ? colors.onContainer : colors.text }}>
                {school.score}
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, color: i === 0 ? `${colors.onContainer}70` : colors.muted }}>/10</div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, lineHeight: 1.2 }}>{school.name}</div>
              <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{school.grade} · {school.distance}</div>
              <div style={{ height: 4, background: 'rgba(0,0,0,0.07)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${school.score * 10}%` }}
                  transition={{ delay: i * 0.08 + 0.2, duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: colors.primary, borderRadius: 2, opacity: i === 0 ? 1 : 0.45 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: '6px 18px 14px' }}>
        <div style={{ fontSize: 11, color: colors.muted, textAlign: 'center' }}>GreatSchools ratings · Riverside USD</div>
      </div>
    </motion.div>
  )
}
