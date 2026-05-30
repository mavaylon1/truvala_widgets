import { motion } from 'framer-motion'

export default function CostBreakdownBar({ segments, total, height = 12, radius = 6, gap = 2 }) {
  return (
    <div style={{ display: 'flex', height, gap, overflow: 'hidden', borderRadius: radius }}>
      {segments.map((seg, i) => {
        const pct = total > 0 ? (seg.amount / total) * 100 : 0
        return (
          <motion.div
            key={seg.key}
            initial={{ flex: 0 }}
            animate={{ flex: pct }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.04 }}
            style={{
              background: seg.color,
              height: '100%',
              borderRadius: radius,
              minWidth: pct > 0 ? 4 : 0,
            }}
          />
        )
      })}
    </div>
  )
}
