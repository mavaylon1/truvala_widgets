import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell } from 'recharts'
import { Dumbbell, Trees, ShoppingCart, UtensilsCrossed, BookOpen, PlaneTakeoff, X, MapPin, ChevronRight } from 'lucide-react'

const CUISINE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7DC6F', '#BB8FCE']

const CATEGORIES = [
  { key: 'gyms',      Icon: Dumbbell,        label: 'Gyms',      dataKey: 'gyms' },
  { key: 'parks',     Icon: Trees,           label: 'Parks',     dataKey: 'parks' },
  { key: 'grocery',   Icon: ShoppingCart,    label: 'Grocery',   dataKey: 'grocery_stores' },
  { key: 'cuisine',   Icon: UtensilsCrossed, label: 'Cuisine',   dataKey: 'cuisine_distribution' },
  { key: 'libraries', Icon: BookOpen,        label: 'Libraries', dataKey: 'libraries' },
  { key: 'airports',  Icon: PlaneTakeoff,    label: 'Airports',  dataKey: 'airports' },
]

const ICON_HOVER = {
  gyms:      { rotate: 20 },
  parks:     { rotate: -10 },
  grocery:   { x: 5 },
  cuisine:   { rotate: 12 },
  libraries: { y: -5 },
  airports:  { x: 5, y: -5 },
}

const CONCIERGE_PROMPTS = {
  gyms:      'Tell me about the gym options near this home',
  parks:     'What are the parks near this home like?',
  grocery:   'Tell me about grocery shopping in this area',
  libraries: 'Are there good libraries near this home?',
  airports:  'Tell me about airport access from this home',
}

const TOP_LABELS = {
  gyms: 'Closest', parks: 'Nearest', grocery: 'Closest', libraries: 'Nearest', airports: 'Closest',
}

function directionsUrl(listing, place) {
  const origin = `${listing.lat},${listing.lng}`
  if (place.placeId) return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination_place_id=${place.placeId}`
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(place.address)}`
}

function humanDistance(miles) {
  if (miles == null) return null
  if (miles <= 0.4) return `${Math.round(miles * 20)} min walk`
  if (miles <= 1.2) return `${Math.round(miles * 15)} min walk`
  if (miles <= 3)   return `${Math.round(miles * 3)} min drive`
  return `${Math.round(miles * 2.5)} min drive`
}

function estimateDriveMinutes(miles) {
  if (miles < 5) return Math.round(miles * 3)
  if (miles < 20) return Math.round(miles * 2.5)
  return Math.round(miles * 1.5)
}

function Stars({ rating }) {
  if (!rating) return null
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  return (
    <span style={{ fontSize: 12, letterSpacing: 1, lineHeight: 1 }}>
      <span style={{ color: '#F59E0B' }}>{'★'.repeat(full)}{hasHalf ? '★' : ''}</span>
      <span style={{ color: '#D1D5DB' }}>{'☆'.repeat(5 - full - (hasHalf ? 1 : 0))}</span>
      <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 4, letterSpacing: 0 }}>{rating}</span>
    </span>
  )
}

// — Animations —

function GymsAnimation({ accent }) {
  const speedLines = [
    { y: 28, x: 8,  len: 16, delay: 0,    op: 0.13 },
    { y: 36, x: 4,  len: 22, delay: 0.12, op: 0.18 },
    { y: 44, x: 10, len: 14, delay: 0.25, op: 0.11 },
    { y: 56, x: 6,  len: 20, delay: 0.08, op: 0.16 },
    { y: 64, x: 3,  len: 17, delay: 0.2,  op: 0.12 },
    { y: 72, x: 9,  len: 13, delay: 0.35, op: 0.1  },
  ]
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Speed lines — left side */}
      {speedLines.map((l, i) => (
        <motion.line key={`l${i}`} x1={l.x} y1={l.y} x2={l.x + l.len} y2={l.y}
          stroke={accent} strokeWidth={1.2} strokeLinecap="round"
          animate={{ opacity: [0, l.op, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
        />
      ))}
      {/* Speed lines — right side (mirrored) */}
      {speedLines.map((l, i) => (
        <motion.line key={`r${i}`} x1={100 - l.x - l.len} y1={l.y} x2={100 - l.x} y2={l.y}
          stroke={accent} strokeWidth={1.2} strokeLinecap="round"
          animate={{ opacity: [0, l.op, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: l.delay + 0.05, ease: 'easeInOut' }}
        />
      ))}
      {/* Dumbbell */}
      <motion.g
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="20" y="47" width="60" height="6" rx="3" fill={accent} opacity={0.9} />
        <rect x="12" y="38" width="10" height="24" rx="3" fill={accent} />
        <rect x="6" y="41" width="7" height="18" rx="2" fill={accent} opacity={0.6} />
        <rect x="78" y="38" width="10" height="24" rx="3" fill={accent} />
        <rect x="87" y="41" width="7" height="18" rx="2" fill={accent} opacity={0.6} />
      </motion.g>
      <motion.ellipse cx="50" cy="82" rx="28" ry="4" fill={accent} opacity={0.1}
        animate={{ rx: [26, 30, 26] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

function ParksAnimation({ accent }) {
  const windGusts = [
    { y: 22, x1: -30, len: 22, delay: 0,    op: 0.18, dur: 2.8 },
    { y: 32, x1: -30, len: 16, delay: 0.7,  op: 0.12, dur: 3.2 },
    { y: 18, x1: -30, len: 28, delay: 1.4,  op: 0.15, dur: 2.6 },
    { y: 28, x1: -30, len: 12, delay: 0.3,  op: 0.1,  dur: 3.0 },
    { y: 68, x1: -30, len: 18, delay: 0.9,  op: 0.1,  dur: 3.4 },
    { y: 74, x1: -30, len: 24, delay: 1.8,  op: 0.08, dur: 2.9 },
  ]
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'hidden' }}>
      {/* Wind gusts — drift left to right */}
      {windGusts.map((w, i) => (
        <motion.g key={i}
          animate={{ x: [0, 130] }}
          transition={{ duration: w.dur, repeat: Infinity, delay: w.delay, ease: 'linear', repeatDelay: 0.4 }}
        >
          <path d={`M${w.x1},${w.y} Q${w.x1 + w.len * 0.4},${w.y - 3} ${w.x1 + w.len},${w.y}`}
            fill="none" stroke={accent} strokeWidth={1.2} strokeLinecap="round" opacity={w.op} />
        </motion.g>
      ))}
      <rect x="10" y="80" width="80" height="4" rx="2" fill={accent} opacity={0.15} />
      <rect x="46" y="62" width="8" height="20" rx="3" fill={accent} opacity={0.7} />
      <motion.g animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: '50px', originY: '72px' }}>
        <ellipse cx="50" cy="54" rx="26" ry="20" fill={accent} opacity={0.25} />
        <ellipse cx="50" cy="48" rx="20" ry="16" fill={accent} opacity={0.4} />
        <ellipse cx="50" cy="40" rx="14" ry="12" fill={accent} opacity={0.7} />
      </motion.g>
      <motion.ellipse cx="22" cy="78" rx="10" ry="7" fill={accent} opacity={0.2}
        animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ originX: '22px', originY: '82px' }}
      />
      <motion.ellipse cx="78" cy="78" rx="10" ry="7" fill={accent} opacity={0.2}
        animate={{ rotate: [3, -3, 3] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{ originX: '78px', originY: '82px' }}
      />
    </svg>
  )
}

function GroceryAnimation({ accent }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Cart body */}
      <motion.g
        animate={{ x: [-3, 3, -3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M20 35 L28 68 L75 68 L82 42 L30 42 Z" fill="none" stroke={accent} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        <line x1="20" y1="35" x2="14" y2="25" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
        {/* Wheels */}
        <circle cx="38" cy="75" r="5" fill={accent} opacity={0.7} />
        <circle cx="65" cy="75" r="5" fill={accent} opacity={0.7} />
        {/* Items in cart */}
        <motion.rect x="38" y="50" width="10" height="13" rx="2" fill={accent} opacity={0.4}
          animate={{ scaleY: [0, 1] }} transition={{ duration: 0.4, delay: 0.3 }} style={{ originY: '63px' }}
        />
        <motion.rect x="52" y="46" width="10" height="17" rx="2" fill={accent} opacity={0.5}
          animate={{ scaleY: [0, 1] }} transition={{ duration: 0.4, delay: 0.5 }} style={{ originY: '63px' }}
        />
        <motion.rect x="64" y="52" width="8" height="11" rx="2" fill={accent} opacity={0.35}
          animate={{ scaleY: [0, 1] }} transition={{ duration: 0.4, delay: 0.7 }} style={{ originY: '63px' }}
        />
      </motion.g>
    </svg>
  )
}

function CuisineAnimation({ accent }) {
  const steam = [
    { x: 35, delay: 0,   dx: 4  },
    { x: 50, delay: 0.6, dx: -3 },
    { x: 65, delay: 1.2, dx: 5  },
  ]
  const sparkles = [
    { x: 12, y: 30, color: CUISINE_COLORS[0], size: 5, delay: 0,   dur: 2.2 },
    { x: 85, y: 22, color: CUISINE_COLORS[1], size: 4, delay: 0.7, dur: 1.9 },
    { x: 88, y: 60, color: CUISINE_COLORS[2], size: 5, delay: 1.4, dur: 2.5 },
    { x: 10, y: 65, color: CUISINE_COLORS[3], size: 4, delay: 0.4, dur: 2.0 },
    { x: 78, y: 42, color: CUISINE_COLORS[4], size: 3, delay: 1.1, dur: 1.8 },
    { x: 20, y: 45, color: CUISINE_COLORS[5], size: 3, delay: 1.8, dur: 2.3 },
    { x: 50, y: 10, color: CUISINE_COLORS[0], size: 4, delay: 0.9, dur: 2.1 },
    { x: 70, y: 75, color: CUISINE_COLORS[2], size: 3, delay: 0.2, dur: 1.7 },
  ]
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Colorful sparkles */}
      {sparkles.map((s, i) => (
        <motion.g key={i}
          animate={{ opacity: [0, 0.85, 0], scale: [0.3, 1, 0.3], rotate: [0, 45, 90] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          style={{ originX: `${s.x}px`, originY: `${s.y}px` }}
        >
          <line x1={s.x - s.size} y1={s.y} x2={s.x + s.size} y2={s.y} stroke={s.color} strokeWidth={1.5} strokeLinecap="round" />
          <line x1={s.x} y1={s.y - s.size} x2={s.x} y2={s.y + s.size} stroke={s.color} strokeWidth={1.5} strokeLinecap="round" />
          <line x1={s.x - s.size * 0.7} y1={s.y - s.size * 0.7} x2={s.x + s.size * 0.7} y2={s.y + s.size * 0.7} stroke={s.color} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
          <line x1={s.x + s.size * 0.7} y1={s.y - s.size * 0.7} x2={s.x - s.size * 0.7} y2={s.y + s.size * 0.7} stroke={s.color} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
        </motion.g>
      ))}
      {/* Bowl */}
      <path d="M22 62 Q22 80 50 80 Q78 80 78 62 Z" fill={accent} opacity={0.2} />
      <path d="M22 62 Q22 80 50 80 Q78 80 78 62" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="62" x2="82" y2="62" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="62" rx="24" ry="6" fill={accent} opacity={0.15} />
      {steam.map((s, i) => (
        <motion.path key={i}
          d={`M${s.x},58 Q${s.x + s.dx},48 ${s.x},38 Q${s.x - s.dx},28 ${s.x},18`}
          fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round"
          animate={{ opacity: [0, 0.6, 0], y: [0, -8, -16] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}

function LibrariesAnimation({ accent }) {
  const books = [
    { x: 18, h: 36, w: 14, opacity: 0.4, delay: 0    },
    { x: 33, h: 42, w: 12, opacity: 0.65, delay: 0.15 },
    { x: 46, h: 50, w: 14, opacity: 0.85, delay: 0.3  },
    { x: 61, h: 38, w: 12, opacity: 0.5, delay: 0.45  },
    { x: 74, h: 44, w: 14, opacity: 0.6, delay: 0.6   },
  ]
  const twinkles = [
    { x: 14, y: 20, size: 4, delay: 0    },
    { x: 82, y: 14, size: 3, delay: 0.9  },
    { x: 52, y: 10, size: 5, delay: 1.7  },
    { x: 28, y: 32, size: 3, delay: 0.5  },
    { x: 88, y: 38, size: 4, delay: 1.3  },
    { x: 68, y: 22, size: 3, delay: 2.1  },
    { x: 10, y: 48, size: 3, delay: 0.7  },
    { x: 92, y: 58, size: 4, delay: 1.6  },
  ]
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Twinkles */}
      {twinkles.map((t, i) => (
        <motion.g key={i}
          animate={{ opacity: [0, 0.7, 0], scale: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: t.delay, ease: 'easeInOut' }}
          style={{ originX: `${t.x}px`, originY: `${t.y}px` }}
        >
          <line x1={t.x - t.size} y1={t.y} x2={t.x + t.size} y2={t.y} stroke={accent} strokeWidth={1.2} strokeLinecap="round" />
          <line x1={t.x} y1={t.y - t.size} x2={t.x} y2={t.y + t.size} stroke={accent} strokeWidth={1.2} strokeLinecap="round" />
          <line x1={t.x - t.size * 0.6} y1={t.y - t.size * 0.6} x2={t.x + t.size * 0.6} y2={t.y + t.size * 0.6} stroke={accent} strokeWidth={0.8} strokeLinecap="round" opacity={0.5} />
          <line x1={t.x + t.size * 0.6} y1={t.y - t.size * 0.6} x2={t.x - t.size * 0.6} y2={t.y + t.size * 0.6} stroke={accent} strokeWidth={0.8} strokeLinecap="round" opacity={0.5} />
        </motion.g>
      ))}
      <rect x="12" y="78" width="76" height="5" rx="2" fill={accent} opacity={0.2} />
      {books.map((b, i) => (
        <motion.g key={i} animate={{ y: [-2, 2, -2] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}>
          <rect x={b.x} y={78 - b.h} width={b.w} height={b.h} rx="2" fill={accent} opacity={b.opacity} />
          <line x1={b.x + 3} y1={78 - b.h + 6} x2={b.x + 3} y2={78 - 6} stroke="white" strokeWidth="1" opacity={0.3} />
        </motion.g>
      ))}
    </svg>
  )
}

function AirportsAnimation({ accent }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Flight arc path (dashed) */}
      <path
        d="M15 75 Q30 20 85 25"
        fill="none" stroke={accent} strokeWidth="1.5"
        strokeDasharray="4 4" opacity={0.25}
        strokeLinecap="round"
      />
      {/* Animated plane along arc using keyframe x/y */}
      <motion.g
        animate={{ x: [0, 28, 68], y: [0, -46, -50] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8, times: [0, 0.5, 1] }}
      >
        <g transform="translate(6, 66) rotate(-35)">
          <line x1="0" y1="0" x2="12" y2="0" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="3" y1="-3" x2="9" y2="0" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          <line x1="1" y1="3" x2="7" y2="0" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </motion.g>
      {/* Origin dot */}
      <circle cx="15" cy="75" r="4" fill={accent} opacity={0.4} />
      {/* Destination dot — pulse */}
      <motion.circle cx="85" cy="25" r="4" fill={accent}
        animate={{ r: [3, 6, 3], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="85" cy="25" r="3" fill={accent} opacity={0.8} />
      {/* Ground line */}
      <line x1="8" y1="80" x2="40" y2="80" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity={0.2} />
    </svg>
  )
}

function CategoryAnimation({ category, accent }) {
  const containerStyle = {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 8,
  }
  switch (category) {
    case 'gyms':      return <div style={containerStyle}><GymsAnimation accent={accent} /></div>
    case 'parks':     return <div style={containerStyle}><ParksAnimation accent={accent} /></div>
    case 'grocery':   return <div style={containerStyle}><GroceryAnimation accent={accent} /></div>
    case 'cuisine':   return <div style={containerStyle}><CuisineAnimation accent={accent} /></div>
    case 'libraries': return <div style={containerStyle}><LibrariesAnimation accent={accent} /></div>
    case 'airports':  return <div style={containerStyle}><AirportsAnimation accent={accent} /></div>
    default:          return null
  }
}

// — Detail views —

function PlaceGrid({ places, listing, accent, text, muted, border, subtle, radius, catKey }) {
  if (!places?.length) return <div style={{ fontSize: 13, color: muted, padding: '20px 0' }}>No results found nearby.</div>
  const items = places.slice(0, 4)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {items.map((p, i) => {
        const isTop = i === 0
        const time = humanDistance(p.distance)
        return (
          <motion.a
            key={i}
            href={directionsUrl(listing, p)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25, ease: 'easeOut' }}
            whileHover={{ y: -2, boxShadow: `0 4px 14px ${accent}18` }}
            style={{
              textDecoration: 'none',
              background: isTop ? `${accent}09` : subtle,
              border: `1px solid ${isTop ? `${accent}28` : border}`,
              borderRadius: radius,
              padding: '11px 12px',
              display: 'flex', flexDirection: 'column', gap: 5,
              cursor: 'pointer',
            }}
          >
            {/* Rank + name */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 999, flexShrink: 0,
                background: isTop ? accent : `${muted}18`,
                color: isTop ? '#fff' : muted,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isTop ? `0 2px 6px ${accent}35` : 'none',
                marginTop: 1,
              }}>{i + 1}</div>
              <div style={{
                fontSize: 13, fontWeight: isTop ? 700 : 600,
                color: text, lineHeight: 1.3,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>{p.name}</div>
            </div>

            {/* Rating */}
            {p.rating && <Stars rating={p.rating} />}

            {/* Time chip */}
            {time && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 10, fontWeight: 600,
                color: isTop ? accent : muted,
              }}>
                <MapPin size={8} strokeWidth={2.5} />{time}
              </div>
            )}
          </motion.a>
        )
      })}
    </div>
  )
}

function CuisineView({ data, accent, text, muted, border, radius, onPrompt }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const chartData = data.map(c => ({ name: c.label, value: c.count || 1 }))

  return (
    <div>
      {/* Donut — centered */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <PieChart width={180} height={180}>
            <Pie data={chartData} cx={90} cy={90} innerRadius={52} outerRadius={76} dataKey="value"
              onClick={(_, i) => setSelectedIndex(p => p === i ? null : i)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CUISINE_COLORS[i % CUISINE_COLORS.length]}
                  opacity={selectedIndex === null || selectedIndex === i ? 1 : 0.2}
                  stroke={selectedIndex === i ? '#fff' : 'transparent'}
                  strokeWidth={selectedIndex === i ? 3 : 0}
                />
              ))}
            </Pie>
          </PieChart>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', width: 72 }}>
            <AnimatePresence mode="wait">
              {selectedIndex !== null ? (
                <motion.div key={selectedIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: CUISINE_COLORS[selectedIndex % CUISINE_COLORS.length], lineHeight: 1 }}>{data[selectedIndex].percentage}%</div>
                  <div style={{ fontSize: 10, color: muted, marginTop: 2, lineHeight: 1.2 }}>{data[selectedIndex].label}</div>
                </motion.div>
              ) : (
                <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ fontSize: 10, color: muted, lineHeight: 1.5 }}>tap<br />a slice</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Legend — 2 column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
        {data.map((c, i) => (
          <motion.div key={c.label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            onClick={() => setSelectedIndex(p => p === i ? null : i)}
            whileHover={{ x: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              cursor: 'pointer',
              opacity: selectedIndex === null || selectedIndex === i ? 1 : 0.3,
              transition: 'opacity 0.2s',
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: 3, flexShrink: 0,
              background: CUISINE_COLORS[i % CUISINE_COLORS.length],
              boxShadow: selectedIndex === i ? `0 0 0 2px ${CUISINE_COLORS[i % CUISINE_COLORS.length]}40` : 'none',
              transition: 'box-shadow 0.2s',
            }} />
            <span style={{ fontSize: 12, color: text, flex: 1, fontWeight: selectedIndex === i ? 600 : 400 }}>{c.label}</span>
            <span style={{ fontSize: 11, color: muted, fontWeight: 500 }}>{c.percentage}%</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div key={selectedIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              padding: '11px 14px',
              background: `${CUISINE_COLORS[selectedIndex % CUISINE_COLORS.length]}12`,
              border: `1px solid ${CUISINE_COLORS[selectedIndex % CUISINE_COLORS.length]}35`,
              borderRadius: radius,
            }}
          >
            <button onClick={() => onPrompt?.(`Tell me about ${data[selectedIndex].label} restaurants near this home`)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: text, textAlign: 'left', padding: 0, fontWeight: 500 }}
            >
              Shall I dive into <strong style={{ color: CUISINE_COLORS[selectedIndex % CUISINE_COLORS.length] }}>{data[selectedIndex].label}</strong> options for you in the area?
            </button>
            <button onClick={() => setSelectedIndex(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
              <X size={12} color={muted} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AirportBoard({ airports, listing, text, muted, border, radius }) {
  if (!airports?.length) return <div style={{ fontSize: 13, color: muted, padding: '20px 0' }}>No airports found nearby.</div>
  const maxDist = Math.max(...airports.map(a => a.distance || 0)) || 1
  return (
    <div style={{ borderRadius: radius, overflow: 'hidden', border: `1px solid ${border}` }}>
      <div style={{ background: '#0f1a2e', padding: '9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontFamily: '"DM Mono", monospace' }}>
          Departures from listing
        </span>
        <motion.div animate={{ rotate: [0, 5, -3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <PlaneTakeoff size={14} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
        </motion.div>
      </div>
      {airports.map((a, i) => {
        const driveMin = a.distance != null ? estimateDriveMinutes(a.distance) : null
        const barPct = ((a.distance || 0) / maxDist) * 100
        return (
          <motion.a key={i} href={directionsUrl(listing, a)} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            whileHover={{ background: '#192338' }}
            style={{
              display: 'block', padding: '14px 16px',
              background: i === 0 ? '#162030' : '#111827',
              borderTop: `1px solid rgba(255,255,255,0.06)`,
              textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                {a.address && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: '"DM Mono", monospace' }}>{a.address.split(',').slice(-3, -1).join(',').trim()}</div>}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0EA5E9', fontFamily: '"DM Mono", monospace', lineHeight: 1 }}>{driveMin ?? '—'}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 1 }}>min drive</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: '"DM Mono", monospace', flexShrink: 0 }}>{a.distance}mi</span>
              <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.1 + 0.2 }}
                  style={{ height: '100%', background: '#0EA5E9', opacity: i === 0 ? 0.8 : 0.4, borderRadius: 1 }} />
              </div>
              <ChevronRight size={11} color="rgba(255,255,255,0.15)" strokeWidth={1.5} />
            </div>
          </motion.a>
        )
      })}
    </div>
  )
}

function TileGrid({ categories, lifestyle, accent, text, muted, border, subtle, radius, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {categories.map(cat => {
        const data = lifestyle[cat.dataKey]
        const count = Array.isArray(data) ? data.length : 0
        const closest = cat.key !== 'cuisine' ? data?.[0]?.distance : null
        const time = closest != null ? humanDistance(closest) : null
        const teaser = cat.key === 'cuisine' ? data?.[0]?.label : null

        return (
          <motion.button key={cat.key} onClick={() => onSelect(cat.key)}
            variants={{
              rest: { y: 0, boxShadow: '0 0px 0px rgba(0,0,0,0)' },
              hover: { y: -3, boxShadow: `0 8px 24px ${accent}20` },
            }}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            style={{
              background: subtle, border: `1px solid ${border}`,
              borderRadius: radius, padding: '18px 14px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8, textAlign: 'center',
            }}
          >
            <motion.div
              variants={{ rest: {}, hover: ICON_HOVER[cat.key] }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              <cat.Icon size={24} color={accent} strokeWidth={1.5} />
            </motion.div>
            <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{cat.label}</div>
            <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>
              {count > 0 ? `${count} nearby` : 'See nearby'}
              {time && <><br /><span style={{ fontWeight: 500 }}>{time}</span></>}
              {teaser && <><br />{teaser} area</>}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

export default function LifestyleWidget({ colors, design, lifestyle, listing, onPrompt }) {
  const [active, setActive] = useState(null)

  const bg = colors.card || colors.panel || colors.bg || '#ffffff'
  const text = colors.label || colors.text || '#111111'
  const accent = colors.tint || colors.primary || colors.accent || '#007AFF'
  const subtle = colors.groupedBg || colors.surface || colors.accentBg || '#f5f5f5'
  const muted = colors.secondary || colors.muted || '#888888'
  const border = colors.rule || colors.border || 'rgba(0,0,0,0.08)'
  const radius = design === 'ios' ? 16 : design === 'material' ? 12 : design === 'dashboard' ? 8 : 6
  const font = design === 'luxe' ? "'Manrope', sans-serif"
    : design === 'dashboard' ? '"Inter", system-ui, sans-serif'
    : design === 'bauhaus' ? "'Barlow Condensed', sans-serif"
    : '-apple-system, BlinkMacSystemFont, sans-serif'

  const activeCategory = CATEGORIES.find(c => c.key === active)

  function renderDetail() {
    const shared = { listing, accent, text, muted, border, subtle, radius }
    switch (active) {
      case 'gyms':      return <PlaceGrid places={lifestyle.gyms} catKey="gyms" {...shared} />
      case 'parks':     return <PlaceGrid places={lifestyle.parks} catKey="parks" {...shared} />
      case 'grocery':   return <PlaceGrid places={lifestyle.grocery_stores} catKey="grocery" {...shared} />
      case 'libraries': return <PlaceGrid places={lifestyle.libraries} catKey="libraries" {...shared} />
      case 'airports':  return <AirportBoard airports={lifestyle.airports} listing={listing} text={text} muted={muted} border={border} radius={radius} />
      case 'cuisine':   return <CuisineView data={lifestyle.cuisine_distribution} onPrompt={onPrompt} accent={accent} text={text} muted={muted} border={border} radius={radius} />
      default:          return null
    }
  }

  return (
    <div style={{
      background: bg,
      borderRadius: design === 'ios' ? 20 : design === 'material' ? 16 : design === 'dashboard' ? 10 : 0,
      overflow: 'hidden',
      boxShadow: design === 'ios' ? '0 2px 24px rgba(0,0,0,0.08)'
        : design === 'material' ? '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)'
        : design === 'dashboard' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
      border: design === 'minimal' || design === 'dashboard' ? `1px solid ${border}` : 'none',
      fontFamily: font,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <motion.div key={active || 'default'} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: accent, textTransform: 'uppercase', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {activeCategory && <activeCategory.Icon size={12} color={accent} strokeWidth={2.5} />}
            {active ? activeCategory?.label : 'Lifestyle & Neighborhood'}
          </motion.div>
          {!active && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: muted }}>Walkability</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 100, height: 3, background: `${muted}25`, borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${lifestyle.walkability_score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', background: accent, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{lifestyle.walkability_score}/100</span>
                <span style={{ fontSize: 11, color: muted }}>{lifestyle.walkability_label}</span>
              </div>
            </div>
          )}
        </div>
        {active && (
          <button onClick={() => setActive(null)} style={{
            background: subtle, border: `1px solid ${border}`, borderRadius: 999,
            width: 28, height: 28, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={13} color={muted} />
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px 20px' }}>
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div key="grid" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <TileGrid categories={CATEGORIES} lifestyle={lifestyle}
                accent={accent} text={text} muted={muted} border={border} subtle={subtle} radius={radius}
                onSelect={setActive}
              />
            </motion.div>
          ) : (
            <motion.div key={active} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              {/* Animation strip + content */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
                {/* Animation panel — stretches to match content height */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{
                    width: 150, flexShrink: 0,
                    background: `${accent}0a`,
                    border: `1px solid ${accent}18`,
                    borderRadius: radius,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: 100,
                  }}
                >
                  <div style={{ width: 120, height: 120 }}>
                    <CategoryAnimation category={active} accent={accent} />
                  </div>
                </motion.div>

                {/* Content — 3/4 width */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {renderDetail()}
                  {active !== 'cuisine' && active !== 'airports' && (
                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                      onClick={() => onPrompt?.(CONCIERGE_PROMPTS[active])}
                      style={{
                        marginTop: 12, width: '100%', padding: '9px 14px',
                        background: `${accent}0e`, border: `1px solid ${accent}35`,
                        borderRadius: radius, fontSize: 12, fontWeight: 600,
                        color: accent, cursor: 'pointer', fontFamily: font,
                      }}
                    >
                      Ask Concierge about {activeCategory?.label.toLowerCase()} in this area
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
