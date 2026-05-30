import { motion, AnimatePresence } from 'framer-motion'
import { useMortgage } from '@/hooks/useMortgage'
import CostBreakdownBar from '@/components/shared/CostBreakdownBar'
import SolarGraph from '@/components/shared/SolarGraph'

function Slider({ label, value, min, max, step = 1, format, onChange, tint }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ '--thumb-color': tint }}
      />
    </div>
  )
}

function Toggle({ label, value, onChange, color }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <div style={{
        width: 40,
        height: 24,
        borderRadius: 12,
        background: value ? color : '#D1D5DB',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}>
        <motion.div
          animate={{ x: value ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          style={{
            position: 'absolute',
            top: 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
    </button>
  )
}

const $ = (n) => `$${Math.round(n).toLocaleString()}`
const pct = (n) => `${n.toFixed(2)}%`

export default function IOSCost({ colors, property }) {
  const m = useMortgage(property.price)
  const { calc } = m

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
        padding: '18px 18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: colors.tint, textTransform: 'uppercase', marginBottom: 3 }}>
          Mortgage Calculator
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: colors.label, lineHeight: 1.1 }}>
          Monthly Payment
        </div>
      </div>

      {/* inputs */}
      <div style={{ background: colors.groupedBg, borderRadius: 14, padding: '14px 14px 4px', marginBottom: 12 }}>
        <Slider label="Purchase Price" value={m.homePrice} min={200000} max={2000000} step={5000}
          format={$} onChange={m.setHomePrice} tint={colors.tint} />
        <Slider label={`Down Payment — ${$(m.homePrice * m.downPct / 100)}`}
          value={m.downPct} min={3} max={50} step={0.5}
          format={v => `${v}%`} onChange={m.setDownPct} tint={colors.tint} />
        <Slider label="Interest Rate" value={m.rate} min={2} max={12} step={0.125}
          format={pct} onChange={m.setRate} tint={colors.tint} />
        {/* Term toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginRight: 4 }}>Term</span>
          {[15, 30].map(yr => (
            <button key={yr} onClick={() => m.setTerm(yr)} style={{
              padding: '4px 14px',
              borderRadius: 999,
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              background: m.term === yr ? colors.tint : '#E5E7EB',
              color: m.term === yr ? '#fff' : '#6B7280',
              transition: 'all 0.2s',
            }}>{yr} yr</button>
          ))}
        </div>
      </div>

      {/* total + breakdown bar */}
      <div style={{ background: colors.tintBg, borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.tint }}>Est. Monthly Total</div>
          <motion.div
            key={Math.round(calc.total)}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 28, fontWeight: 700, color: colors.tint }}
          >
            {$(calc.total)}
          </motion.div>
        </div>
        <CostBreakdownBar segments={calc.segments} total={calc.total} height={10} radius={5} />
      </div>

      {/* segment legend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 14 }}>
        {calc.segments.map(seg => (
          <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: colors.groupedBg, borderRadius: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>{seg.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{$(seg.amount)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* toggles row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <Toggle label="HOA" value={m.hoaEnabled} onChange={m.setHoaEnabled} color="#10B981" />
        <Toggle label="Solar ☀" value={m.solarEnabled} onChange={m.setSolarEnabled} color="#F59E0B" />
      </div>

      {/* HOA input */}
      <AnimatePresence>
        {m.hoaEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', marginBottom: 12 }}
          >
            <div style={{ background: colors.groupedBg, borderRadius: 14, padding: '14px 14px 4px' }}>
              <Slider label="HOA / month" value={m.hoa} min={0} max={1500} step={25}
                format={$} onChange={m.setHoa} tint="#10B981" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* solar section */}
      <AnimatePresence>
        {m.solarEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 14, padding: '14px 14px 4px', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 10 }}>
                ☀ Solar Loan Inputs
              </div>
              <Slider label="System Cost" value={m.solarCost} min={5000} max={50000} step={500}
                format={$} onChange={m.setSolarCost} tint="#F59E0B" />
              <Slider label="Loan Rate" value={m.solarLoanRate} min={1} max={12} step={0.25}
                format={pct} onChange={m.setSolarLoanRate} tint="#F59E0B" />
              <Slider label="Loan Term" value={m.solarLoanTerm} min={5} max={25} step={1}
                format={v => `${v} yr`} onChange={m.setSolarLoanTerm} tint="#F59E0B" />
              <Slider label="Monthly Electricity Savings" value={m.solarMonthlySavings} min={50} max={400} step={5}
                format={$} onChange={m.setSolarMonthlySavings} tint="#10B981" />
            </div>

            {/* solar summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
              {[
                { label: 'Solar Payment', value: $(calc.solarPayment), color: '#F59E0B' },
                { label: 'Monthly Savings', value: $(m.solarMonthlySavings), color: '#10B981' },
                { label: 'Net Benefit', value: $(calc.solarNetMonthly), color: calc.solarNetMonthly >= 0 ? '#10B981' : '#EF4444' },
              ].map(item => (
                <div key={item.label} style={{ background: colors.groupedBg, borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* savings graph */}
            <div style={{ background: colors.groupedBg, borderRadius: 14, padding: '12px 10px 8px', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>
                25-Year Savings Projection
                {calc.breakEvenYear && (
                  <span style={{ marginLeft: 8, color: '#10B981' }}>· Break-even yr {calc.breakEvenYear}</span>
                )}
              </div>
              <SolarGraph data={calc.solarProjection} breakEvenYear={calc.breakEvenYear} height={160} />
              <div style={{ display: 'flex', gap: 12, marginTop: 6, justifyContent: 'center' }}>
                {[['#10B981','Cumulative Savings'],['#EF4444','Loan Cost'],['#3B82F6','Net']].map(([c,l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 2, background: c, borderRadius: 1 }} />
                    <span style={{ fontSize: 9, color: '#9CA3AF' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
