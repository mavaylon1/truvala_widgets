import { useState, useMemo } from 'react'

export const COST_COLORS = {
  principal: '#3B82F6',
  interest: '#EF4444',
  tax: '#F59E0B',
  insurance: '#8B5CF6',
  hoa: '#10B981',
  solar: '#F59E0B',
}

const CA_TAX_RATE = 0.011

function calcPI(principal, annualRate, termYears) {
  if (principal <= 0) return 0
  const r = annualRate / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function useMortgage(initialPrice = 485000) {
  const [homePrice, setHomePrice] = useState(initialPrice)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.875)
  const [term, setTerm] = useState(30)
  const [hoaEnabled, setHoaEnabled] = useState(false)
  const [hoa, setHoa] = useState(250)
  const [insurance, setInsurance] = useState(185)
  const [solarEnabled, setSolarEnabled] = useState(false)
  const [solarCost, setSolarCost] = useState(18000)
  const [solarLoanRate, setSolarLoanRate] = useState(4.99)
  const [solarLoanTerm, setSolarLoanTerm] = useState(20)
  const [solarMonthlySavings, setSolarMonthlySavings] = useState(165)

  const calc = useMemo(() => {
    const downPayment = homePrice * (downPct / 100)
    const loanAmount = homePrice - downPayment
    const monthlyPI = calcPI(loanAmount, rate, term)
    const firstInterest = loanAmount * (rate / 100 / 12)
    const firstPrincipal = monthlyPI - firstInterest
    const monthlyTax = (homePrice * CA_TAX_RATE) / 12
    const monthlyHoa = hoaEnabled ? hoa : 0
    const solarPayment = solarEnabled ? calcPI(solarCost, solarLoanRate, solarLoanTerm) : 0

    const segments = [
      { key: 'principal', label: 'Principal', amount: firstPrincipal, color: COST_COLORS.principal },
      { key: 'interest', label: 'Interest', amount: firstInterest, color: COST_COLORS.interest },
      { key: 'tax', label: 'Property Tax', amount: monthlyTax, color: COST_COLORS.tax },
      { key: 'insurance', label: 'Insurance', amount: insurance, color: COST_COLORS.insurance },
      ...(hoaEnabled ? [{ key: 'hoa', label: 'HOA', amount: monthlyHoa, color: COST_COLORS.hoa }] : []),
      ...(solarEnabled ? [{ key: 'solar', label: 'Solar Loan', amount: solarPayment, color: COST_COLORS.solar }] : []),
    ]
    const total = segments.reduce((s, seg) => s + seg.amount, 0)

    const solarProjection = Array.from({ length: 26 }, (_, yr) => {
      const months = yr * 12
      const paid = Math.min(months, solarLoanTerm * 12) * solarPayment
      const saved = months * solarMonthlySavings
      return { year: yr, paid: Math.round(paid), saved: Math.round(saved), net: Math.round(saved - paid) }
    })
    const breakEvenYear = solarEnabled
      ? solarProjection.find(d => d.net >= 0)?.year ?? null
      : null

    return {
      downPayment,
      loanAmount,
      firstPrincipal,
      firstInterest,
      monthlyTax,
      monthlyHoa,
      solarPayment,
      solarNetMonthly: solarEnabled ? solarMonthlySavings - solarPayment : 0,
      total,
      segments,
      solarProjection,
      breakEvenYear,
    }
  }, [homePrice, downPct, rate, term, hoa, hoaEnabled, insurance, solarEnabled, solarCost, solarLoanRate, solarLoanTerm, solarMonthlySavings])

  return {
    homePrice, setHomePrice,
    downPct, setDownPct,
    rate, setRate,
    term, setTerm,
    hoa, setHoa,
    hoaEnabled, setHoaEnabled,
    insurance, setInsurance,
    solarEnabled, setSolarEnabled,
    solarCost, setSolarCost,
    solarLoanRate, setSolarLoanRate,
    solarLoanTerm, setSolarLoanTerm,
    solarMonthlySavings, setSolarMonthlySavings,
    calc,
  }
}
