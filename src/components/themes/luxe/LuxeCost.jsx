import { motion, AnimatePresence } from 'framer-motion'
import { useMortgage } from '@/hooks/useMortgage'
import CostBreakdownBar from '@/components/shared/CostBreakdownBar'
import SolarGraph from '@/components/shared/SolarGraph'

const $ = (n) => `$${Math.round(n).toLocaleString()}`

function LuxeSlider({ label, value, min, max, step = 1, format, onChange, accent }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--luxe-muted)' }}>{label}</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: 'var(--luxe-text)' }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ '--thumb-color': accent }} />
      <div style={{ height: '0.5px', background: 'var(--luxe-muted)', opacity: 0.25, marginTop: 10 }} />
    </div>
  )
}

function LuxeToggle({ label, value, onChange, accent }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 28, height: 16, borderRadius: 8,
        background: value ? accent : 'rgba(0,0,0,0.12)',
        position: 'relative', transition: 'background 0.25s', flexShrink: 0,
      }}>
        <motion.div animate={{ x: value ? 13 : 1 }} transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          style={{ position: 'absolute', top: 1, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--luxe-muted)' }}>{label}</span>
    </button>
  )
}

export default function LuxeCost({ colors, property }) {
  const m = useMortgage(property.price)
  const { calc } = m

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      style={{
        '--luxe-bg': colors.bg,
        '--luxe-text': colors.text,
        '--luxe-muted': colors.muted,
        '--luxe-accent': colors.accent,
        background: colors.bg,
        fontFamily: "'Manrope', sans-serif",
        padding: '28px 28px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* label + title */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.26em', color: colors.muted, textTransform: 'uppercase', marginBottom: 8 }}>Truvala</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: colors.text, lineHeight: 1.1 }}>
          Mortgage Calculator
        </div>
      </div>

      {/* sliders */}
      <LuxeSlider label="Purchase Price" value={m.homePrice} min={200000} max={2000000} step={5000}
        format={$} onChange={m.setHomePrice} accent={colors.accent} />
      <LuxeSlider label={`Down — ${m.downPct}%`} value={m.downPct} min={3} max={50} step={0.5}
        format={v => $(m.homePrice * v / 100)} onChange={m.setDownPct} accent={colors.accent} />
      <LuxeSlider label="Interest Rate" value={m.rate} min={2} max={12} step={0.125}
        format={v => `${v.toFixed(2)}%`} onChange={m.setRate} accent={colors.accent} />

      {/* term */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.muted }}>Term</span>
        {[15, 30].map(yr => (
          <button key={yr} onClick={() => m.setTerm(yr)} style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontWeight: m.term === yr ? 500 : 300,
            color: m.term === yr ? colors.text : colors.muted,
            background: 'none', border: 'none',
            borderBottom: m.term === yr ? `1px solid ${colors.accent}` : 'none',
            cursor: 'pointer', padding: '2px 4px',
            transition: 'all 0.2s',
          }}>{yr} yr</button>
        ))}
      </div>

      {/* total */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', color: colors.muted, textTransform: 'uppercase', marginBottom: 6 }}>Est. Monthly</div>
        <motion.div key={Math.round(calc.total)} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 52, color: colors.text, lineHeight: 1 }}>
          {$(calc.total)}
        </motion.div>
        <div style={{ height: '0.5px', background: colors.muted, opacity: 0.3, marginTop: 16, marginBottom: 12 }} />
        <CostBreakdownBar segments={calc.segments} total={calc.total} height={4} radius={2} gap={1} />
      </div>

      {/* breakdown lines */}
      {calc.segments.map((seg, i) => (
        <motion.div key={seg.key}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, paddingBottom: 10, borderBottom: `0.5px solid ${colors.muted}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', color: colors.muted }}>{seg.label}</span>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 22, color: colors.text }}>{$(seg.amount)}</span>
        </motion.div>
      ))}

      {/* toggles */}
      <div style={{ display: 'flex', gap: 20, marginTop: 18, marginBottom: 4 }}>
        <LuxeToggle label="HOA" value={m.hoaEnabled} onChange={m.setHoaEnabled} accent="#10B981" />
        <LuxeToggle label="Solar" value={m.solarEnabled} onChange={m.setSolarEnabled} accent={colors.accent} />
      </div>

      {/* HOA */}
      <AnimatePresence>
        {m.hoaEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden', paddingTop: 12 }}>
            <LuxeSlider label="HOA / month" value={m.hoa} min={0} max={1500} step={25}
              format={$} onChange={m.setHoa} accent="#10B981" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* solar */}
      <AnimatePresence>
        {m.solarEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: 16, borderTop: `0.5px solid ${colors.muted}40`, paddingTop: 16 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: colors.text, marginBottom: 14 }}>
                Solar Calculator
              </div>
              <LuxeSlider label="System Cost" value={m.solarCost} min={5000} max={50000} step={500}
                format={$} onChange={m.setSolarCost} accent={colors.accent} />
              <LuxeSlider label="Loan Rate" value={m.solarLoanRate} min={1} max={12} step={0.25}
                format={v => `${v.toFixed(2)}%`} onChange={m.setSolarLoanRate} accent={colors.accent} />
              <LuxeSlider label="Loan Term" value={m.solarLoanTerm} min={5} max={25} step={1}
                format={v => `${v} yr`} onChange={m.setSolarLoanTerm} accent={colors.accent} />
              <LuxeSlider label="Monthly Savings" value={m.solarMonthlySavings} min={50} max={400} step={5}
                format={$} onChange={m.setSolarMonthlySavings} accent="#10B981" />

              {/* solar summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                {[['Solar Payment', $(calc.solarPayment), colors.text], ['Savings', $(m.solarMonthlySavings), '#10B981'], ['Net/mo', $(calc.solarNetMonthly), calc.solarNetMonthly >= 0 ? '#10B981' : '#EF4444']].map(([l,v,c]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', color: colors.muted, textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 22, color: c }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* savings graph */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', color: colors.muted, textTransform: 'uppercase', marginBottom: 10 }}>
                  25-Year Projection {calc.breakEvenYear ? `· Break-even yr ${calc.breakEvenYear}` : ''}
                </div>
                <SolarGraph data={calc.solarProjection} breakEvenYear={calc.breakEvenYear} height={150} />
              </div>

              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 12, color: colors.muted, marginTop: 10, lineHeight: 1.5 }}>
                Projection assumes constant electricity savings. Federal ITC solar credit not included.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
