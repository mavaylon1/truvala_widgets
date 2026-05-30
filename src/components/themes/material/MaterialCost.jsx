import { motion, AnimatePresence } from 'framer-motion'
import { useMortgage } from '@/hooks/useMortgage'
import CostBreakdownBar from '@/components/shared/CostBreakdownBar'
import SolarGraph from '@/components/shared/SolarGraph'

const $ = (n) => `$${Math.round(n).toLocaleString()}`

function MatSlider({ label, value, min, max, step, format, onChange, primary }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.45)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: primary }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ '--thumb-color': primary }} />
    </div>
  )
}

function MatChip({ label, active, onClick, primary, container, onContainer }) {
  return (
    <button onClick={onClick} style={{
      background: active ? container : 'transparent',
      border: `1.5px solid ${active ? primary : 'rgba(0,0,0,0.12)'}`,
      borderRadius: 20, cursor: 'pointer', padding: '5px 16px',
      fontSize: 12, fontWeight: 600, fontFamily: "'Barlow', sans-serif",
      color: active ? onContainer : 'rgba(0,0,0,0.38)',
      transition: 'all 0.18s',
    }}>{label}</button>
  )
}

export default function MaterialCost({ colors, property }) {
  const m = useMortgage(property.price)
  const { calc } = m

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
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>Calculator</div>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: colors.text, lineHeight: 1.15 }}>Monthly Payment</div>
      </div>

      {/* sliders */}
      <div style={{ padding: '14px 18px 6px' }}>
        <MatSlider label="Purchase Price" value={m.homePrice} min={200000} max={2000000} step={5000} format={$} onChange={m.setHomePrice} primary={colors.primary} />
        <MatSlider label={`Down — ${m.downPct}% = ${$(m.homePrice * m.downPct / 100)}`} value={m.downPct} min={3} max={50} step={0.5} format={v => `${v}%`} onChange={m.setDownPct} primary={colors.primary} />
        <MatSlider label="Interest Rate" value={m.rate} min={2} max={12} step={0.125} format={v => `${v.toFixed(2)}%`} onChange={m.setRate} primary={colors.primary} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.38)', marginRight: 2 }}>Term</span>
          {[15, 30].map(yr => (
            <MatChip key={yr} label={`${yr} yr`} active={m.term === yr} onClick={() => m.setTerm(yr)}
              primary={colors.primary} container={colors.container} onContainer={colors.onContainer} />
          ))}
        </div>
      </div>

      {/* total — tonal container is used here, only here */}
      <div style={{ background: colors.container, margin: '4px 18px 14px', borderRadius: 14, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: `${colors.onContainer}65`, marginBottom: 6 }}>Est. Monthly Total</div>
        <motion.div key={Math.round(calc.total)} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 34, fontWeight: 700, color: colors.onContainer, marginBottom: 10 }}>
          {$(calc.total)}
        </motion.div>
        <CostBreakdownBar segments={calc.segments} total={calc.total} height={8} radius={4} gap={2} />
      </div>

      {/* breakdown — plain rows, no tinted cells */}
      <div style={{ padding: '0 18px 12px' }}>
        {calc.segments.map((seg, i) => (
          <div key={seg.key} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '9px 0',
            borderBottom: i < calc.segments.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: colors.muted }}>{seg.label}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{$(seg.amount)}</span>
          </div>
        ))}
      </div>

      {/* toggles */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 18px 14px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 12, flexWrap: 'wrap' }}>
        <MatChip label="HOA" active={m.hoaEnabled} onClick={() => m.setHoaEnabled(!m.hoaEnabled)}
          primary={colors.primary} container={colors.container} onContainer={colors.onContainer} />
        <MatChip label="☀ Solar" active={m.solarEnabled} onClick={() => m.setSolarEnabled(!m.solarEnabled)}
          primary="#D97706" container="#FEF3C7" onContainer="#78350F" />
      </div>

      <AnimatePresence>
        {m.hoaEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 18px 12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ height: 12 }} />
              <MatSlider label="HOA / month" value={m.hoa} min={0} max={1500} step={25} format={$} onChange={m.setHoa} primary="#10B981" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {m.solarEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '14px 18px 6px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', marginBottom: 14 }}>☀ Solar Loan</div>
              <MatSlider label="System Cost" value={m.solarCost} min={5000} max={50000} step={500} format={$} onChange={m.setSolarCost} primary="#D97706" />
              <MatSlider label="Loan Rate" value={m.solarLoanRate} min={1} max={12} step={0.25} format={v => `${v.toFixed(2)}%`} onChange={m.setSolarLoanRate} primary="#D97706" />
              <MatSlider label="Loan Term" value={m.solarLoanTerm} min={5} max={25} step={1} format={v => `${v} yr`} onChange={m.setSolarLoanTerm} primary="#D97706" />
              <MatSlider label="Monthly Savings" value={m.solarMonthlySavings} min={50} max={400} step={5} format={$} onChange={m.setSolarMonthlySavings} primary="#10B981" />
            </div>
            <div style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {[['Payment', $(calc.solarPayment), '#D97706'], ['Savings', $(m.solarMonthlySavings), '#10B981'], ['Net/mo', $(calc.solarNetMonthly), calc.solarNetMonthly >= 0 ? '#10B981' : '#EF4444']].map(([l, v, c], i) => (
                <div key={l} style={{ flex: 1, padding: '10px 0', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.muted, marginBottom: 8 }}>
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
