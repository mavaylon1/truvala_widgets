import { motion, AnimatePresence } from 'framer-motion'
import { useMortgage } from '@/hooks/useMortgage'
import CostBreakdownBar from '@/components/shared/CostBreakdownBar'
import SolarGraph from '@/components/shared/SolarGraph'

const $ = (n) => `$${Math.round(n).toLocaleString()}`
const mono = { fontFamily: '"DM Mono", monospace' }

function DashSlider({ label, value, min, max, step, format, onChange, accent }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: accent, ...mono }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} style={{ '--thumb-color': accent }} />
    </div>
  )
}

function DashToggle({ label, active, onClick, accent, accentBg, border }) {
  return (
    <button onClick={onClick} style={{
      background: active ? accentBg : 'transparent',
      border: `1px solid ${active ? accent : border}`,
      borderRadius: 6, cursor: 'pointer', padding: '4px 12px',
      fontSize: 11, fontWeight: 600, fontFamily: '"Inter", system-ui, sans-serif',
      color: active ? accent : '#9ca3af',
      transition: 'all 0.15s',
    }}>{label}</button>
  )
}

export default function DashboardCost({ colors, property }) {
  const m = useMortgage(property.price)
  const { calc } = m

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
      {/* header */}
      <div style={{ background: colors.accent, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 1 }}>
            Mortgage Calculator
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Monthly Payment</div>
        </div>
        <motion.div key={Math.round(calc.total)} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 20, fontWeight: 700, color: '#fff', ...mono }}>
          {$(calc.total)}
        </motion.div>
      </div>

      {/* breakdown bar */}
      <div style={{ padding: '10px 16px 8px', borderBottom: `1px solid ${colors.border}` }}>
        <CostBreakdownBar segments={calc.segments} total={calc.total} height={8} radius={4} gap={2} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 10px', marginTop: 6 }}>
          {calc.segments.map(seg => (
            <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: 1, background: seg.color }} />
              <span style={{ fontSize: 10, color: colors.muted }}>{seg.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: colors.text, ...mono }}>{$(seg.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* sliders */}
      <div style={{ padding: '12px 16px 6px', borderBottom: `1px solid ${colors.border}` }}>
        <DashSlider label="Purchase Price" value={m.homePrice} min={200000} max={2000000} step={5000} format={$} onChange={m.setHomePrice} accent={colors.accent} />
        <DashSlider label={`Down Payment — ${m.downPct}% = ${$(m.homePrice * m.downPct / 100)}`} value={m.downPct} min={3} max={50} step={0.5} format={v => `${v}%`} onChange={m.setDownPct} accent={colors.accent} />
        <DashSlider label="Interest Rate" value={m.rate} min={2} max={12} step={0.125} format={v => `${v.toFixed(2)}%`} onChange={m.setRate} accent={colors.accent} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: colors.muted, marginRight: 4 }}>Term</span>
          {[15, 30].map(yr => (
            <DashToggle key={yr} label={`${yr} yr`} active={m.term === yr} onClick={() => m.setTerm(yr)}
              accent={colors.accent} accentBg={colors.accentBg} border={colors.border} />
          ))}
        </div>
      </div>

      {/* toggles */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 16px', borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
        <DashToggle label="HOA" active={m.hoaEnabled} onClick={() => m.setHoaEnabled(!m.hoaEnabled)}
          accent={colors.accent} accentBg={colors.accentBg} border={colors.border} />
        <DashToggle label="☀ Solar" active={m.solarEnabled} onClick={() => m.setSolarEnabled(!m.solarEnabled)}
          accent="#D97706" accentBg="#FFFBEB" border={colors.border} />
      </div>

      <AnimatePresence>
        {m.hoaEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px 2px', borderBottom: `1px solid ${colors.border}` }}>
              <DashSlider label="HOA / month" value={m.hoa} min={0} max={1500} step={25} format={$} onChange={m.setHoa} accent="#10B981" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {m.solarEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px 6px', background: '#FFFBEB', borderBottom: `1px solid #FDE68A` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#92400E', marginBottom: 10 }}>
                ☀ Solar Calculator
              </div>
              <DashSlider label="System Cost" value={m.solarCost} min={5000} max={50000} step={500} format={$} onChange={m.setSolarCost} accent="#D97706" />
              <DashSlider label="Loan Rate" value={m.solarLoanRate} min={1} max={12} step={0.25} format={v => `${v.toFixed(2)}%`} onChange={m.setSolarLoanRate} accent="#D97706" />
              <DashSlider label="Loan Term" value={m.solarLoanTerm} min={5} max={25} step={1} format={v => `${v} yr`} onChange={m.setSolarLoanTerm} accent="#D97706" />
              <DashSlider label="Monthly Savings" value={m.solarMonthlySavings} min={50} max={400} step={5} format={$} onChange={m.setSolarMonthlySavings} accent="#10B981" />
            </div>

            {/* solar summary row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${colors.border}` }}>
              {[['Loan Pmt', $(calc.solarPayment), '#D97706'], ['Elec. Save', $(m.solarMonthlySavings), '#10B981'], ['Net/mo', $(calc.solarNetMonthly), calc.solarNetMonthly >= 0 ? '#10B981' : '#EF4444']].map(([l, v, c], i) => (
                <div key={l} style={{ padding: '10px 0', textAlign: 'center', borderRight: i < 2 ? `1px solid ${colors.border}` : 'none' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c, ...mono }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted, marginBottom: 8 }}>
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
