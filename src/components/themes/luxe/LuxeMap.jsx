import { motion } from 'framer-motion'

export default function LuxeMap({ colors, property }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY
  const mapSrc = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${property.lat},${property.lng}&heading=210&pitch=10&fov=80`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        background: colors.bg,
        fontFamily: "'Manrope', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* minimal header */}
      <div style={{ padding: '28px 32px 20px' }}>
        <div style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.26em',
          color: colors.muted,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>Truvala</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 26,
          color: colors.text,
          lineHeight: 1.1,
        }}>Street View</div>
        <div style={{ height: '0.5px', background: colors.muted, opacity: 0.3, marginTop: 20 }} />
      </div>

      {/* map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 200 }}>
        <iframe
          src={mapSrc}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Street View"
        />
      </div>

      {/* address caption */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ padding: '20px 32px 28px' }}
      >
        <div style={{ height: '0.5px', background: colors.muted, opacity: 0.3, marginBottom: 16 }} />
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 20,
          color: colors.text,
          lineHeight: 1.3,
        }}>{property.address}, {property.cityState}</div>
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: colors.accent,
          marginTop: 6,
          letterSpacing: '0.06em',
        }}>{property.priceFormatted}</div>
      </motion.div>
    </motion.div>
  )
}
