import { motion } from 'framer-motion'

export default function MinimalMap({ colors, property }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${property.lat},${property.lng}&heading=210&pitch=10&fov=80`

  const rows = [
    ['Address', property.address],
    ['City', property.cityState],
    ['Listed Price', property.priceFormatted],
    ['Type', property.type],
    ['Beds / Baths', `${property.beds} bd · ${property.baths} ba`],
    ['Sq. Ft.', property.sqft.toLocaleString() + ' sqft'],
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ background: colors.bg, fontFamily: 'system-ui, sans-serif', border: '1px solid rgba(0,0,0,0.14)' }}
    >
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${colors.rule}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>Street View</div>
      </div>

      <div style={{ height: 220 }}>
        <iframe src={mapSrc} style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Street View" />
      </div>

      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', borderTop: `1px solid ${colors.rule}` }}>
          <div style={{ width: '45%', padding: '9px 14px', fontWeight: 700, fontSize: 13, color: colors.text, borderRight: `1px solid ${colors.rule}` }}>
            {label}
          </div>
          <div style={{ flex: 1, padding: '9px 14px', fontSize: 13, color: colors.text }}>
            {value}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
