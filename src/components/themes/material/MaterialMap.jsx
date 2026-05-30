import { motion } from 'framer-motion'

export default function MaterialMap({ colors, property }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${property.lat},${property.lng}&heading=210&pitch=10&fov=80`

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', fontFamily: "'Barlow', sans-serif", boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)' }}
    >
      {/* header */}
      <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid ${colors.container}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: colors.primary, flexShrink: 0 }} />
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
            Street View
          </div>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: colors.text, lineHeight: 1.15 }}>{property.address}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <div style={{ fontSize: 12, color: colors.muted }}>{property.cityState}</div>
          <div style={{ background: colors.container, borderRadius: 20, padding: '4px 12px' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: colors.onContainer }}>{property.priceFormatted}</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: 240 }}>
        <iframe src={mapSrc} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Street View" />
      </div>

      <div style={{ padding: '10px 18px', display: 'flex', gap: 16 }}>
        {[['Type', property.type], ['Beds', `${property.beds} bd · ${property.baths} ba`]].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: colors.muted, textTransform: 'uppercase', marginBottom: 1 }}>{k}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{v}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
