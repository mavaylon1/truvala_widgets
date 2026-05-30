import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUGGESTED = [
  'What are the nearby schools like?',
  'Walk me through the monthly costs',
  'Tell me about the neighborhood',
  'Any flood or wildfire risks?',
  'How walkable is this area?',
  "What's the solar potential here?",
]

function buildSystemPrompt(ctx) {
  const { listing, schools, lifestyle, insurance, solar } = ctx
  return `You are the Truvala Concierge, a warm and conversational guide helping home buyers explore a listing.

RULES YOU MUST FOLLOW:
- Only state facts that are explicitly in the context below. Do not invent numbers, ratings, distances, risk levels, or any other specifics.
- If a buyer asks something not covered by the context, use the web search tool to find a real answer rather than guessing.
- If you search the web, tell the buyer you looked it up. Do not present search results as if they were already in your context.
- Opinions and impressions drawn from the data are welcome. Made-up facts are not.
- Keep responses under 150 words. Suggest a follow-up question at the end when it feels natural.

Listing: ${listing.address}, ${listing.cityState} — ${listing.priceFormatted}
Property: ${listing.beds} bed, ${listing.baths} bath, ${listing.sqft.toLocaleString()} sqft ${listing.type}, built ${listing.year_built}

Schools:
${schools.map(s => `- ${s.name} (${s.grade}): ${s.score}/10, ${s.distance}`).join('\n')}

Risk & Insurance:
- Flood zone: ${insurance.flood_zone} — ${insurance.flood_zone_description}
- Wildfire risk: ${insurance.wildfire_risk} (${insurance.wildfire_risk_description})
- Earthquake risk: ${insurance.earthquake_risk}

Solar potential:
- Est. annual production: ${solar.annual_production_kwh.toLocaleString()} kWh
- Monthly savings: $${solar.monthly_savings}
- System cost: $${solar.system_cost.toLocaleString()} — break-even around year ${solar.break_even_year}`
}

// Streams the Responses API with web_search_preview enabled.
// Fires onSearchStart/onSearchEnd when a web search tool call is detected.
// Returns { content, sources, searched }.
async function callOpenAI(systemPrompt, conversationMessages, { onSearchStart, onSearchEnd } = {}) {
  const key = import.meta.env.VITE_OPENAI_API_KEY

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      tools: [{ type: 'web_search_preview' }],
      instructions: systemPrompt,
      input: conversationMessages,
      stream: true,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI error ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let content = ''
  let sources = []
  let searched = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data: ')) continue
      const json = trimmed.slice(6)
      if (json === '[DONE]') continue

      let event
      try { event = JSON.parse(json) } catch { continue }

      switch (event.type) {
        case 'response.web_search_call.in_progress':
        case 'response.web_search_call.searching':
          if (!searched) { searched = true; onSearchStart?.() }
          break
        case 'response.web_search_call.completed':
          onSearchEnd?.()
          break
        case 'response.output_text.delta':
          content += event.delta ?? ''
          break
        case 'response.output_text.done':
          if (event.text) content = event.text
          break
        case 'response.completed':
          for (const item of event.response?.output ?? []) {
            if (item.type !== 'message') continue
            for (const part of item.content ?? []) {
              for (const ann of part.annotations ?? []) {
                if (ann.type === 'url_citation') {
                  const already = sources.some(s => s.url === ann.url)
                  if (!already) sources.push({ url: ann.url, title: ann.title || ann.url })
                }
              }
            }
          }
          break
      }
    }
  }

  return { content, sources, searched }
}

function renderInline(text) {
  // Strip inline markdown links [text](url) — sources shown separately
  const cleaned = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  const parts = cleaned.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function renderMarkdown(text) {
  const blocks = text.split(/\n\n+/)
  return blocks.map((block, i) => {
    const lines = block.split('\n').filter(l => l.trim())
    const isBulletList = lines.length > 0 && lines.every(l => /^[-*]\s/.test(l.trim()))
    const isNumberedList = lines.length > 0 && lines.every(l => /^\d+\.\s/.test(l.trim()))

    if (isBulletList) {
      return (
        <ul key={i} style={{ margin: '4px 0 6px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {lines.map((l, j) => (
            <li key={j} style={{ lineHeight: 1.5 }}>{renderInline(l.replace(/^[-*]\s+/, ''))}</li>
          ))}
        </ul>
      )
    }
    if (isNumberedList) {
      return (
        <ol key={i} style={{ margin: '4px 0 6px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {lines.map((l, j) => (
            <li key={j} style={{ lineHeight: 1.5 }}>{renderInline(l.replace(/^\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      )
    }
    return (
      <p key={i} style={{ margin: i < blocks.length - 1 ? '0 0 6px' : 0, lineHeight: 1.55 }}>
        {renderInline(block)}
      </p>
    )
  })
}

function TypingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: color || 'currentColor', opacity: 0.4 }}
        />
      ))}
    </div>
  )
}

function SearchingIndicator({ accent, subtle, text, border, radius }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', marginBottom: 10 }}
    >
      <div style={{
        background: subtle,
        borderRadius: radius,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: `1px solid ${border}`,
        maxWidth: '80%',
      }}>
        {/* Pulsing globe */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}
        >
          🌐
        </motion.div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: accent, textTransform: 'uppercase', marginBottom: 2 }}>
            Searching the web
          </div>
          <div style={{ fontSize: 13, color: text, opacity: 0.7 }}>
            Let me look that up for you, give me just a moment...
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SourceList({ sources }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden' }}
    >
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              color: '#3B82F6',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              lineHeight: 1.4,
            }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
          >
            <span style={{ fontSize: 9, opacity: 0.6 }}>↗</span>
            {s.title}
          </a>
        ))}
      </div>
    </motion.div>
  )
}

export default function Concierge({ colors, design, listingContext }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinkingState, setThinkingState] = useState(null) // null | 'thinking' | 'searching'
  const [expandedSources, setExpandedSources] = useState({})
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)

  const bg = colors.card || colors.panel || colors.bg || '#ffffff'
  const text = colors.label || colors.text || '#111111'
  const accent = colors.tint || colors.primary || colors.accent || '#007AFF'
  const accentBg = colors.tintBg || colors.container || colors.accentBg || '#EBF3FF'
  const subtle = colors.groupedBg || colors.surface || '#f5f5f5'
  const muted = colors.secondary || colors.muted || '#888888'
  const border = colors.rule || colors.border || 'rgba(0,0,0,0.08)'
  const radius = design === 'ios' ? 16 : design === 'material' ? 12 : 8
  const font = design === 'luxe'
    ? "'Manrope', sans-serif"
    : design === 'dashboard'
    ? '"Inter", system-ui, sans-serif'
    : design === 'bauhaus'
    ? "'Barlow Condensed', sans-serif"
    : '-apple-system, BlinkMacSystemFont, sans-serif'

  const loading = thinkingState !== null

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinkingState])

  function toggleSources(idx) {
    setExpandedSources(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setThinkingState('thinking')
    setError(null)

    try {
      const systemPrompt = buildSystemPrompt(listingContext)
      const { content, sources, searched } = await callOpenAI(
        systemPrompt,
        nextMessages,
        {
          onSearchStart: () => setThinkingState('searching'),
          onSearchEnd: () => setThinkingState('thinking'),
        }
      )
      setMessages(prev => [...prev, { role: 'assistant', content, sources, searched }])
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setThinkingState(null)
    }
  }

  const { listing } = listingContext
  const primerText = `So glad you stopped by! This is ${listing.address} and it is a great one. I know this home and this neighborhood really well, so feel free to ask me anything. The schools, what the area is like to actually live in, what your monthly costs might look like. No pressure at all, just ask whatever is on your mind and we can go from there.`

  return (
    <div style={{
      background: bg,
      borderRadius: design === 'ios' ? 20 : design === 'material' ? 16 : design === 'dashboard' ? 10 : 0,
      overflow: 'hidden',
      boxShadow: design === 'ios' ? '0 2px 24px rgba(0,0,0,0.08)'
        : design === 'material' ? '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)'
        : design === 'dashboard' ? '0 1px 4px rgba(0,0,0,0.06)'
        : 'none',
      border: design === 'minimal' || design === 'dashboard' ? `1px solid ${border}` : 'none',
      display: 'flex',
      minHeight: 460,
      fontFamily: font,
    }}>
      {/* Left sidebar */}
      <div style={{
        width: 260,
        flexShrink: 0,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        background: subtle,
        padding: '20px 18px',
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: accent, textTransform: 'uppercase', marginBottom: 4 }}>
            Ask Truvala
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: text, lineHeight: 1.3 }}>{listing.address}</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 1 }}>{listing.cityState}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginTop: 4 }}>{listing.priceFormatted}</div>
        </div>

        <div style={{ height: 1, background: border, marginBottom: 16 }} />

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: muted, marginBottom: 10 }}>
          Suggested
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              style={{
                background: 'transparent',
                border: `1px solid ${border}`,
                borderRadius: design === 'ios' ? 10 : design === 'material' ? 8 : 4,
                padding: '7px 10px',
                fontSize: 12,
                color: text,
                textAlign: 'left',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'background 0.15s, border-color 0.15s',
                lineHeight: 1.35,
                fontFamily: font,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = accentBg; e.currentTarget.style.borderColor = accent } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = border }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px' }}>

          {/* Primer */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: accentBg,
              borderRadius: radius,
              padding: '12px 16px',
              marginBottom: 12,
              fontSize: 14,
              color: text,
              lineHeight: 1.55,
              maxWidth: '85%',
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: accent, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              Truvala Concierge
            </span>
            {primerText}
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  background: msg.role === 'user' ? accent : subtle,
                  color: msg.role === 'user' ? '#fff' : text,
                  borderRadius: design === 'ios'
                    ? (msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px')
                    : radius,
                  padding: '10px 14px',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}>
                  {msg.role === 'assistant' && (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: accent, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      Concierge {msg.searched ? '· searched the web' : ''}
                    </span>
                  )}
                  {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                </div>

                {/* Source offer — only on assistant messages that searched */}
                {msg.role === 'assistant' && msg.sources?.length > 0 && (
                  <div style={{ maxWidth: '80%', marginTop: 5 }}>
                    <button
                      onClick={() => toggleSources(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 11,
                        color: muted,
                        padding: 0,
                        fontFamily: font,
                        textDecoration: 'underline',
                        textDecorationStyle: 'dotted',
                        textUnderlineOffset: 2,
                      }}
                    >
                      {expandedSources[i] ? 'Hide sources' : 'Where did I find this?'}
                    </button>
                    <AnimatePresence>
                      {expandedSources[i] && <SourceList sources={msg.sources} />}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading states */}
          <AnimatePresence mode="wait">
            {thinkingState === 'searching' && (
              <SearchingIndicator
                key="searching"
                accent={accent}
                subtle={subtle}
                text={text}
                border={border}
                radius={radius}
              />
            )}
            {thinkingState === 'thinking' && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', marginBottom: 10 }}
              >
                <div style={{ background: subtle, borderRadius: radius, padding: '10px 14px', color: muted }}>
                  <TypingDots color={muted} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 8, padding: '6px 10px', background: '#FEF2F2', borderRadius: 8 }}>
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div style={{
          borderTop: `1px solid ${border}`,
          padding: '12px 16px',
          display: 'flex',
          gap: 8,
          background: bg,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            placeholder="Ask about this home or neighborhood…"
            disabled={loading}
            style={{
              flex: 1,
              border: `1px solid ${border}`,
              borderRadius: design === 'ios' ? 12 : 6,
              padding: '9px 14px',
              fontSize: 14,
              fontFamily: font,
              color: text,
              background: subtle,
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = accent }}
            onBlur={e => { e.target.style.borderColor = border }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              background: accent,
              color: '#fff',
              border: 'none',
              borderRadius: design === 'ios' ? 12 : 6,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.5 : 1,
              transition: 'opacity 0.15s',
              fontFamily: font,
              whiteSpace: 'nowrap',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
