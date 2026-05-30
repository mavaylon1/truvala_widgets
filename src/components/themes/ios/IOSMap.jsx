import { motion } from 'framer-motion'

export default function IOSMap({ colors, property }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${property.lat},${property.lng}&heading=210&pitch=10&fov=80`

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
      }}
    >
      {/* pill header */}
      <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: colors.tint, textTransform: 'uppercase', marginBottom: 2 }}>
            Street View
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: colors.label, lineHeight: 1.2 }}>
            {property.address}
          </div>
          <div style={{ fontSize: 13, color: colors.secondary, marginTop: 1 }}>
            {property.cityState}
          </div>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          style={{
            background: colors.tintBg,
            borderRadius: 12,
            padding: '6px 12px',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.tint }}>{property.priceFormatted}</div>
        </motion.div>
      </div>

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

      {/* location pill */}
      <div style={{ padding: '12px 18px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          background: colors.tintBg,
          borderRadius: 999,
          padding: '4px 12px',
          fontSize: 12,
          fontWeight: 600,
          color: colors.tint,
        }}>📍 {property.cityState}</div>
        <div style={{ fontSize: 12, color: colors.secondary }}>{property.type} · {property.beds} bed · {property.baths} bath</div>
      </div>
    </motion.div>
  )
}
