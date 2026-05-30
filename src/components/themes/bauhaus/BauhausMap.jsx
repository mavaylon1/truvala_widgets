import { motion } from 'framer-motion'

export default function BauhausMap({ colors, property }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${property.lat},${property.lng}&heading=210&pitch=10&fov=80`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: colors.bg,
        fontFamily: "'Barlow Condensed', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* header — left border only */}
      <div style={{ borderLeft: `5px solid ${colors.primary}`, padding: '16px 18px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: `${colors.text}50`, textTransform: 'uppercase', marginBottom: 3 }}>
          Truvala
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.03em', color: colors.text, textTransform: 'uppercase', lineHeight: 1 }}>
          Street View
        </div>
      </div>

      <div style={{ height: 2, background: `${colors.text}08` }} />

      {/* map */}
      <div style={{ position: 'relative', height: 260 }}>
        <iframe
          src={mapSrc}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Street View"
        />
      </div>

      {/* address */}
      <div style={{ padding: '12px 18px', borderTop: `2px solid ${colors.text}`, background: colors.bg }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>
          {property.address}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: `${colors.text}55`, letterSpacing: '0.04em' }}>
            {property.cityState}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: colors.primary }}>
            {property.priceFormatted}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
