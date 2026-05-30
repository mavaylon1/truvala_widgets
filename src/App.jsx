import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DESIGN_CONFIGS } from '@/data/designs'
import { useListingContext } from '@/hooks/useListingContext'

import IOSMap from '@/components/themes/ios/IOSMap'
import IOSSchool from '@/components/themes/ios/IOSSchool'
import IOSCost from '@/components/themes/ios/IOSCost'

import BauhausMap from '@/components/themes/bauhaus/BauhausMap'
import BauhausSchool from '@/components/themes/bauhaus/BauhausSchool'
import BauhausCost from '@/components/themes/bauhaus/BauhausCost'

import LuxeMap from '@/components/themes/luxe/LuxeMap'
import LuxeSchool from '@/components/themes/luxe/LuxeSchool'
import LuxeCost from '@/components/themes/luxe/LuxeCost'

import MinimalMap from '@/components/themes/minimal/MinimalMap'
import MinimalSchool from '@/components/themes/minimal/MinimalSchool'
import MinimalCost from '@/components/themes/minimal/MinimalCost'

import MaterialMap from '@/components/themes/material/MaterialMap'
import MaterialSchool from '@/components/themes/material/MaterialSchool'
import MaterialCost from '@/components/themes/material/MaterialCost'

import DashboardMap from '@/components/themes/dashboard/DashboardMap'
import DashboardSchool from '@/components/themes/dashboard/DashboardSchool'
import DashboardCost from '@/components/themes/dashboard/DashboardCost'

import Concierge from '@/components/shared/Concierge'
import LifestyleWidget from '@/components/shared/LifestyleWidget'

const DESIGNS = ['ios', 'bauhaus', 'luxe', 'minimal', 'material', 'dashboard']

const WIDGET_MAP = {
  ios:       [IOSMap,       IOSSchool,       IOSCost],
  bauhaus:   [BauhausMap,   BauhausSchool,   BauhausCost],
  luxe:      [LuxeMap,      LuxeSchool,      LuxeCost],
  minimal:   [MinimalMap,   MinimalSchool,   MinimalCost],
  material:  [MaterialMap,  MaterialSchool,  MaterialCost],
  dashboard: [DashboardMap, DashboardSchool, DashboardCost],
}

const COL_LABELS = ['Location', 'Schools', 'Monthly Costs']

function ColorDot({ color, name, active, onClick, design }) {
  const swatch =
    design === 'ios' ? color.tint :
    design === 'bauhaus' ? color.primary :
    design === 'luxe' ? color.accent :
    design === 'minimal' ? color.text :
    design === 'material' ? color.primary :
    color.accent

  return (
    <button
      onClick={onClick}
      title={name}
      style={{
        width: 16, height: 16, borderRadius: '50%',
        background: swatch,
        border: active ? '2px solid #fff' : '2px solid transparent',
        outline: active ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'transform 0.15s',
        transform: active ? 'scale(1.3)' : 'scale(1)',
        boxShadow: `0 1px 3px ${swatch}55`,
        flexShrink: 0,
      }}
    />
  )
}

function DesignBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? '#e8edf5' : 'transparent',
      color: active ? '#0f1623' : '#4a6a8a',
      border: `1px solid ${active ? '#e8edf5' : '#1e2d42'}`,
      borderRadius: 6,
      padding: '5px 12px',
      fontSize: 11,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontFamily: 'system-ui, sans-serif',
      whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

export default function App() {
  const [design, setDesign] = useState('ios')
  const [colorIdx, setColorIdx] = useState(0)
  const { context, loading, error } = useListingContext()

  const config = DESIGN_CONFIGS[design]
  const colors = config.colors[colorIdx]
  const [MapWidget, SchoolWidget, CostWidget] = WIDGET_MAP[design]

  const pageBg =
    design === 'ios' ? '#F2F2F7' :
    design === 'minimal' ? (colors.bg === '#ffffff' ? '#f0f0f0' : '#e8e6e2') :
    design === 'dashboard' ? colors.bg :
    colors.bg

  const handleDesignChange = (d) => { setDesign(d); setColorIdx(0) }

  return (
    <div style={{ minHeight: '100vh', background: '#0c1018' }}>
      {/* control bar */}
      <div style={{
        background: '#0f1623',
        borderBottom: '1px solid #1a2438',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#e0e8f4', letterSpacing: '0.08em', fontFamily: 'system-ui, sans-serif', flexShrink: 0 }}>
          TRUVALA
        </div>
        <div style={{ width: 1, height: 14, background: '#1e2d42', flexShrink: 0 }} />

        {/* design buttons */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {DESIGNS.map(d => (
            <DesignBtn key={d} label={DESIGN_CONFIGS[d].name} active={design === d} onClick={() => handleDesignChange(d)} />
          ))}
        </div>

        <div style={{ fontSize: 10, color: '#2a4a6a', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', flexShrink: 0 }}>
          {config.subtitle}
        </div>

        <div style={{ flex: 1 }} />

        {/* colorway dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: '#2a4a6a', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', marginRight: 4 }}>
            Color
          </span>
          {config.colors.map((c, i) => (
            <ColorDot key={c.name} color={c} name={c.name} active={colorIdx === i} onClick={() => setColorIdx(i)} design={design} />
          ))}
          <span style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'system-ui, sans-serif', marginLeft: 6, minWidth: 56 }}>
            {colors.name}
          </span>
        </div>
      </div>

      {/* canvas */}
      <div style={{ padding: '28px 28px 48px', background: pageBg, minHeight: 'calc(100vh - 45px)' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280', fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
            Loading listing data…
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#EF4444', fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
            Error loading data: {error}
          </div>
        )}

        {context && (
          <>
            {/* column labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 8, maxWidth: 1200, margin: '0 auto 8px' }}>
              {COL_LABELS.map(l => (
                <div key={l} style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: design === 'ios' ? '#8E8E93' : design === 'minimal' ? colors.muted : design === 'dashboard' ? colors.muted : `${colors.text || '#000'}55`,
                  fontFamily: 'system-ui, sans-serif',
                }}>{l}</div>
              ))}
            </div>

            {/* widget grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${design}-${colorIdx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1200, margin: '0 auto', alignItems: 'start' }}
              >
                <MapWidget colors={colors} property={context.listing} />
                <SchoolWidget colors={colors} schools={context.schools} />
                <CostWidget colors={colors} property={context.listing} />
              </motion.div>
            </AnimatePresence>

            {/* Lifestyle widget — full width below grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`lifestyle-${design}-${colorIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: 1200, margin: '24px auto 0' }}
              >
                <div style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: design === 'ios' ? '#8E8E93' : design === 'minimal' ? colors.muted : design === 'dashboard' ? colors.muted : `${colors.text || '#000'}55`,
                  fontFamily: 'system-ui, sans-serif',
                  marginBottom: 8,
                }}>Lifestyle</div>
                <LifestyleWidget colors={colors} design={design} lifestyle={context.lifestyle} listing={context.listing} />
              </motion.div>
            </AnimatePresence>

            {/* Concierge — full width below widgets */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`concierge-${design}-${colorIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{ maxWidth: 1200, margin: '24px auto 0' }}
              >
                <div style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: design === 'ios' ? '#8E8E93' : design === 'minimal' ? colors.muted : design === 'dashboard' ? colors.muted : `${colors.text || '#000'}55`,
                  fontFamily: 'system-ui, sans-serif',
                  marginBottom: 8,
                }}>AI Concierge</div>
                <Concierge colors={colors} design={design} listingContext={context} />
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
