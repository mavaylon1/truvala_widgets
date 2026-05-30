import { motion } from 'framer-motion'

export default function BauhausSchool({ colors, schools }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: colors.bg,
        fontFamily: "'Barlow Condensed', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* header — left border accent only */}
      <div style={{ borderLeft: `5px solid ${colors.primary}`, padding: '16px 18px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: `${colors.text}50`, textTransform: 'uppercase', marginBottom: 3 }}>
          Truvala
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.03em', color: colors.text, textTransform: 'uppercase', lineHeight: 1 }}>
          School Snapshot
        </div>
      </div>

      <div style={{ height: 2, background: `${colors.text}08` }} />

      {/* school rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {schools.map((school, i) => (
          <motion.div
            key={school.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              borderBottom: i < schools.length - 1 ? `1px solid ${colors.text}08` : 'none',
            }}
          >
            {/* score — small solid square, not stretched */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.08 + 0.1, type: 'spring', stiffness: 300 }}
              style={{
                width: 52,
                height: 52,
                background: i === 0 ? colors.primary : `${colors.text}08`,
                border: i > 0 ? `2px solid ${colors.text}15` : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div style={{
                fontSize: 24,
                fontWeight: 800,
                lineHeight: 1,
                color: i === 0 ? '#fff' : colors.primary,
              }}>{school.score}</div>
              <div style={{
                fontSize: 9,
                fontWeight: 700,
                color: i === 0 ? 'rgba(255,255,255,0.6)' : `${colors.text}40`,
                letterSpacing: '0.04em',
              }}>/10</div>
            </motion.div>

            {/* info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                {school.name}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: `${colors.text}50`, letterSpacing: '0.04em', marginTop: 2 }}>
                {school.grade} · {school.distance}
              </div>
              <div style={{ height: 4, background: `${colors.text}08`, marginTop: 8, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${school.score * 10}%` }}
                  transition={{ delay: i * 0.08 + 0.2, duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: colors.primary, opacity: i === 0 ? 1 : 0.45 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* footer */}
      <div style={{ padding: '10px 18px', borderTop: `1px solid ${colors.text}08` }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: `${colors.text}35`, textTransform: 'uppercase' }}>
          GreatSchools · Riverside USD
        </div>
      </div>
    </motion.div>
  )
}
