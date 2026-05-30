import { motion } from 'framer-motion'

export default function LuxeSchool({ colors, schools }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        background: colors.bg,
        fontFamily: "'Manrope', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '32px 32px 24px',
      }}
    >
      {/* label */}
      <div style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.26em',
        color: colors.muted,
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>Truvala</div>

      {/* title */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 26,
        color: colors.text,
        lineHeight: 1.1,
        marginBottom: 32,
      }}>School Snapshot</div>

      {/* schools — floating in whitespace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
        {schools.map((school, i) => (
          <motion.div
            key={school.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              paddingTop: 18,
              paddingBottom: 18,
              borderBottom: `0.5px solid ${colors.muted}35`,
              cursor: 'default',
            }}
          >
            {/* left: name + grade */}
            <div style={{ paddingRight: 16, flex: 1 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 19,
                color: colors.text,
                lineHeight: 1.2,
                marginBottom: 6,
              }}>{school.name}</div>
              <div style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: colors.muted,
                textTransform: 'uppercase',
              }}>{school.grade} · {school.distance}</div>
              {/* accent bar — just 1px */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 + 0.25, duration: 0.6, ease: 'easeOut' }}
                style={{
                  height: 1,
                  background: colors.accent,
                  width: `${school.score * 10}%`,
                  marginTop: 10,
                  transformOrigin: 'left',
                  opacity: 0.6,
                }}
              />
            </div>

            {/* right: score — large numeral, no decoration */}
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 56,
              color: colors.text,
              lineHeight: 0.85,
              textAlign: 'right',
              flexShrink: 0,
            }}>{school.score}</div>
          </motion.div>
        ))}
      </div>

      {/* caption */}
      <div style={{ marginTop: 24 }}>
        <div style={{ height: '0.5px', background: colors.muted, opacity: 0.3, marginBottom: 12 }} />
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 12,
          color: colors.muted,
          letterSpacing: '0.02em',
        }}>GreatSchools ratings — Riverside Unified</div>
      </div>
    </motion.div>
  )
}
