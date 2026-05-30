import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'

const fmt = (v) => `$${Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`

export default function SolarGraph({ data, breakEvenYear, height = 160, theme = 'ios' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickFormatter={v => `${v}yr`}
          interval={4}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickFormatter={fmt}
          width={36}
        />
        <Tooltip
          formatter={(v, name) => [fmt(v), name === 'saved' ? 'Savings' : name === 'paid' ? 'Paid' : 'Net']}
          labelFormatter={v => `Year ${v}`}
          contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        />
        {breakEvenYear != null && (
          <ReferenceLine
            x={breakEvenYear}
            stroke="#10B981"
            strokeDasharray="4 3"
            label={{ value: `Break-even yr ${breakEvenYear}`, fontSize: 9, fill: '#10B981', position: 'insideTopRight' }}
          />
        )}
        <ReferenceLine y={0} stroke="rgba(0,0,0,0.15)" />
        <Area dataKey="saved" stroke="#10B981" strokeWidth={1.5} fill="url(#savingsGrad)" dot={false} name="saved" />
        <Area dataKey="paid" stroke="#EF4444" strokeWidth={1.5} fill="url(#paidGrad)" dot={false} name="paid" />
        <Area dataKey="net" stroke="#3B82F6" strokeWidth={2} fill="none" dot={false} name="net" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
