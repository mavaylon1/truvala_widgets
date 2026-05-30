import { motion, AnimatePresence } from 'framer-motion'
import { useMortgage } from '@/hooks/useMortgage'
import SolarGraph from '@/components/shared/SolarGraph'

const $ = (n) => `$${Math.round(n).toLocaleString()}`
const LW = '42%'

function SliderRow({ label, value, min, max, step, format, onChange, colors }) {
  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${colors.rule}` }}>
      <div style={{ width: LW, padding: '10px 14px', fontWeight: 700, fontSize: 12, color: colors.text, borderRight: `1px solid ${colors.rule}`, display: 'flex', alignItems: 'center' }}>
        {label}
      </div>
      <div style={{ flex: 1, padding: '8px 14px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{format(value)}</div>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))} style={{ '--thumb-color': colors.text, width: '100%' }} />
      </div>
    </div>
  )
}

function ToggleBtn({ label, active, onClick, colors }) {
  return (
    <button onClick={onClick} style={{
      background: active ? colors.text : 'transparent',
      border: `1px solid ${active ? colors.text : colors.rule}`,
      color: active ? colors.bg : colors.muted,
      padding: '3px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'system-ui, sans-serif',
    }}>{label}</button>
  )
}

export default function MinimalCost({ colors, property }) {
  const m = useMortgage(property.price)
  const { calc } = m

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ background: colors.bg, fontFamily: 'system-ui, sans-serif', border: '1px solid rgba(0,0,0,0.14)' }}
    >
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${colors.rule}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>Monthly Payment</div>
      </div>

      <SliderRow label="Purchase Price" value={m.homePrice} min={200000} max={2000000} step={5000} format={$} onChange={m.setHomePrice} colors={colors} />
      <SliderRow label={`Down · ${m.downPct}%`} value={m.downPct} min={3} max={50} step={0.5} format={v => $(m.homePrice * v / 100)} onChange={m.setDownPct} colors={colors} />
      <SliderRow label="Interest Rate" value={m.rate} min={2} max={12} step={0.125} format={v => `${v.toFixed(2)}%`} onChange={m.setRate} colors={colors} />

      {/* term */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.rule}` }}>
        <div style={{ width: LW, padding: '10px 14px', fontWeight: 700, fontSize: 12, color: colors.text, borderRight: `1px solid ${colors.rule}`, display: 'flex', alignItems: 'center' }}>
          Loan Term
        </div>
        <div style={{ flex: 1, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          {[15, 30].map(yr => <ToggleBtn key={yr} label={`${yr} yr`} active={m.term === yr} onClick={() => m.setTerm(yr)} colors={colors} />)}
        </div>
      </div>

      {/* total */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.rule}`, background: 'rgba(0,0,0,0.025)' }}>
        <div style={{ width: LW, padding: '12px 14px', fontWeight: 700, fontSize: 12, color: colors.text, borderRight: `1px solid ${colors.rule}`, display: 'flex', alignItems: 'center' }}>
          Est. Monthly Total
        </div>
        <motion.div key={Math.round(calc.total)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ flex: 1, padding: '10px 14px', fontSize: 20, fontWeight: 700, color: colors.text, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'center' }}>
          {$(calc.total)}
        </motion.div>
      </div>

      {/* breakdown */}
      {calc.segments.map(seg => (
        <div key={seg.key} style={{ display: 'flex', borderBottom: `1px solid ${colors.rule}` }}>
          <div style={{ width: LW, padding: '9px 14px', fontWeight: 700, fontSize: 12, color: colors.text, borderRight: `1px solid ${colors.rule}` }}>
            {seg.label}
          </div>
          <div style={{ flex: 1, padding: '9px 14px', fontSize: 13, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>
            {$(seg.amount)}
          </div>
        </div>
      ))}

      {/* toggles */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.rule}` }}>
        <div style={{ width: LW, padding: '10px 14px', fontWeight: 700, fontSize: 12, color: colors.text, borderRight: `1px solid ${colors.rule}`, display: 'flex', alignItems: 'center' }}>
          Add-ons
        </div>
        <div style={{ flex: 1, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <ToggleBtn label="HOA" active={m.hoaEnabled} onClick={() => m.setHoaEnabled(!m.hoaEnabled)} colors={colors} />
          <ToggleBtn label="Solar" active={m.solarEnabled} onClick={() => m.setSolarEnabled(!m.solarEnabled)} colors={colors} />
        </div>
      </div>

      <AnimatePresence>
        {m.hoaEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
            <SliderRow label="HOA / month" value={m.hoa} min={0} max={1500} step={25} format={$} onChange={m.setHoa} colors={colors} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {m.solarEnabled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: `1px solid ${colors.rule}`, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: colors.muted }}>
              Solar Calculator
            </div>
            <SliderRow label="System Cost" value={m.solarCost} min={5000} max={50000} step={500} format={$} onChange={m.setSolarCost} colors={colors} />
            <SliderRow label="Loan Rate" value={m.solarLoanRate} min={1} max={12} step={0.25} format={v => `${v.toFixed(2)}%`} onChange={m.setSolarLoanRate} colors={colors} />
            <SliderRow label="Loan Term" value={m.solarLoanTerm} min={5} max={25} step={1} format={v => `${v} yr`} onChange={m.setSolarLoanTerm} colors={colors} />
            <SliderRow label="Monthly Savings" value={m.solarMonthlySavings} min={50} max={400} step={5} format={$} onChange={m.setSolarMonthlySavings} colors={colors} />
            <div style={{ display: 'flex', borderBottom: `1px solid ${colors.rule}` }}>
              {[['Solar Payment', $(calc.solarPayment)], ['Elec. Savings', $(m.solarMonthlySavings)], ['Net / mo', $(calc.solarNetMonthly)]].map(([l, v], i) => (
                <div key={l} style={{ flex: 1, padding: '10px 14px', borderRight: i < 2 ? `1px solid ${colors.rule}` : 'none' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: colors.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: colors.muted, marginBottom: 8 }}>
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
