import { motion } from 'framer-motion'

export default function DashboardMap({ colors, property }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${property.lat},${property.lng}&heading=210&pitch=10&fov=80`

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
      {/* header bar */}
      <div style={{ background: colors.accent, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 1 }}>
            Street View
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{property.address}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '3px 10px' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: '"DM Mono", monospace' }}>{property.priceFormatted}</span>
        </div>
      </div>

      <div style={{ position: 'relative', height: 240 }}>
        <iframe src={mapSrc} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Street View" />
      </div>

      <div style={{ padding: '10px 16px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: 16 }}>
        {[['City', property.cityState], ['Type', property.type], ['Beds/Bath', `${property.beds} bd · ${property.baths} ba`]].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: colors.muted, textTransform: 'uppercase', marginBottom: 1 }}>{k}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{v}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
