import { motion, AnimatePresence } from 'framer-motion'
import { useMortgage } from '@/hooks/useMortgage'
import CostBreakdownBar from '@/components/shared/CostBreakdownBar'
import SolarGraph from '@/components/shared/SolarGraph'

const $ = (n) => `$${Math.round(n).toLocaleString()}`

function BauhausSlider({ label, value, min, max, step = 1, format, onChange, primary }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: primary }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ '--thumb-color': primary }} />
    </div>
  )
}

function BauhausToggle({ label, value, onChange, color, text }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      display: 'flex', alignItems: 'center', gap: 6, background: 'none',
      border: `2px solid ${value ? color : 'rgba(0,0,0,0.12)'}`,
      cursor: 'pointer', padding: '5px 12px',
      fontSize: 10, fontWeight: 800,
      color: value ? color : 'rgba(0,0,0,0.35)',
      letterSpacing: '0.1em', textTransform: 'uppercase',
      transition: 'all 0.18s', fontFamily: "'Barlow Condensed', sans-serif",
    }}>{label}</button>
  )
}

export default function BauhausCost({ colors, property }) {
  const m = useMortgage(property.price)
  const { calc } = m

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
      {/* header — left border only */}
      <div style={{ borderLeft: `5px solid ${colors.primary}`, padding: '16px 18px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: `${colors.text}50`, textTransform: 'uppercase', marginBottom: 3 }}>
          Truvala
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.03em', color: colors.text, textTransform: 'uppercase', lineHeight: 1 }}>
          Mortgage Calculator
        </div>
      </div>

      <div style={{ height: 2, background: `${colors.text}08` }} />

      {/* sliders */}
      <div style={{ padding: '14px 18px 8px' }}>
        <BauhausSlider label="Purchase Price" value={m.homePrice} min={200000} max={2000000} step={5000}
          format={$} onChange={m.setHomePrice} primary={colors.primary} />
        <BauhausSlider label={`Down — ${m.downPct}% = ${$(m.homePrice * m.downPct / 100)}`}
          value={m.downPct} min={3} max={50} step={0.5}
          format={v => `${v}%`} onChange={m.setDownPct} primary={colors.primary} />
        <BauhausSlider label="Rate" value={m.rate} min={2} max={12} step={0.125}
          format={v => `${v.toFixed(2)}%`} onChange={m.setRate} primary={colors.primary} />
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          {[15, 30].map(yr => (
            <button key={yr} onClick={() => m.setTerm(yr)} style={{
              flex: 1, padding: '6px 0', border: `2px solid ${m.term === yr ? colors.primary : 'rgba(0,0,0,0.1)'}`,
              background: m.term === yr ? colors.primary : 'transparent',
              cursor: 'pointer', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: m.term === yr ? '#fff' : `${colors.text}50`,
              transition: 'all 0.18s', fontFamily: "'Barlow Condensed', sans-serif",
            }}>{yr} yr</button>
          ))}
        </div>
      </div>

      {/* total — just the number, primary colored */}
      <div style={{ padding: '10px 18px 12px', background: `${colors.text}04`, borderTop: `1px solid ${colors.text}08`, borderBottom: `1px solid ${colors.text}08` }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${colors.text}45`, marginBottom: 2 }}>
          Est. Monthly Total
        </div>
        <motion.div key={Math.round(calc.total)} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 40, fontWeight: 800, color: colors.primary, lineHeight: 1, letterSpacing: '-0.01em' }}>
          {$(calc.total)}
        </motion.div>
      </div>

      {/* breakdown bar + legend */}
      <div style={{ padding: '12px 18px 8px' }}>
        <CostBreakdownBar segments={calc.segments} total={calc.total} height={12} radius={0} gap={2} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8 }}>
          {calc.segments.map(seg => (
            <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, background: seg.color }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: `${colors.text}60`, textTransform: 'uppercase' }}>
                {seg.label} {$(seg.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* toggles */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 18px 14px', flexWrap: 'wrap' }}>
        <BauhausToggle label="HOA" value={m.hoaEnabled} onChange={m.setHoaEnabled} color="#10B981" />
        <BauhausToggle label="☀ Solar" value={m.solarEnabled} onChange={m.setSolarEnabled} color="#F59E0B" />
      </div>

      {/* HOA */}
      <AnimatePresence>
        {m.hoaEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 18px 12px' }}>
              <BauhausSlider label="HOA / month" value={m.hoa} min={0} max={1500} step={25}
                format={$} onChange={m.setHoa} primary="#10B981" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* solar */}
      <AnimatePresence>
        {m.solarEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: `3px solid #F59E0B`, padding: '12px 18px 4px', background: `rgba(245,158,11,0.04)` }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#92400E', marginBottom: 10 }}>
                ☀ Solar Inputs
              </div>
              <BauhausSlider label="System Cost" value={m.solarCost} min={5000} max={50000} step={500}
                format={$} onChange={m.setSolarCost} primary="#F59E0B" />
              <BauhausSlider label="Loan Rate" value={m.solarLoanRate} min={1} max={12} step={0.25}
                format={v => `${v.toFixed(2)}%`} onChange={m.setSolarLoanRate} primary="#F59E0B" />
              <BauhausSlider label="Loan Term" value={m.solarLoanTerm} min={5} max={25} step={1}
                format={v => `${v} yr`} onChange={m.setSolarLoanTerm} primary="#F59E0B" />
              <BauhausSlider label="Monthly Savings" value={m.solarMonthlySavings} min={50} max={400} step={5}
                format={$} onChange={m.setSolarMonthlySavings} primary="#10B981" />
            </div>

            <div style={{ display: 'flex', borderTop: `1px solid ${colors.text}10`, padding: '10px 18px' }}>
              {[['Solar Payment', $(calc.solarPayment), '#F59E0B'], ['Elec. Savings', $(m.solarMonthlySavings), '#10B981'], ['Net / mo', $(calc.solarNetMonthly), calc.solarNetMonthly >= 0 ? '#10B981' : '#EF4444']].map(([l, v, c]) => (
                <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: `${colors.text}40`, textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '4px 14px 14px', background: `rgba(245,158,11,0.03)` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${colors.text}40`, marginBottom: 8 }}>
                25-Year Projection {calc.breakEvenYear ? `· Break-even yr ${calc.breakEvenYear}` : ''}
              </div>
              <SolarGraph data={calc.solarProjection} breakEvenYear={calc.breakEvenYear} height={150} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
