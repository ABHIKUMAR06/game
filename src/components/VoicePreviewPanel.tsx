import { useState } from 'react'
import type { VoicePackId } from '../game/types'
import { VOICE_PACKS, previewVoice, stopVoicePreview } from '../game/voicePacks'

interface VoicePreviewPanelProps {
  voicePack: VoicePackId
  onVoicePack: (id: VoicePackId) => void
  compact?: boolean
}

export function VoicePreviewPanel({
  voicePack,
  onVoicePack,
  compact = false,
}: VoicePreviewPanelProps) {
  const [playing, setPlaying] = useState<VoicePackId | null>(null)

  const listen = (id: VoicePackId) => {
    onVoicePack(id)
    setPlaying(id)
    previewVoice(id)
    window.setTimeout(() => {
      setPlaying((cur) => (cur === id ? null : cur))
    }, 3200)
  }

  const packs = VOICE_PACKS.filter((p) => p.id !== 'off')

  return (
    <section
      className={
        compact
          ? 'rounded-xl border border-white/10 bg-black/35 p-3'
          : 'rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5'
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fluorescent)]">
            Voice packs · listen first
          </p>
          <h3
            className={
              compact
                ? 'mt-1 text-base font-bold text-[var(--flare)]'
                : 'mt-1 font-[family-name:var(--font-display)] text-xl font-extrabold text-[var(--flare)]'
            }
          >
            Hear the reactions
          </h3>
          {!compact && (
            <p className="mt-1 text-sm text-white/55">
              Neural English & Hindi samples — tap Play, then pick your pack.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            stopVoicePreview()
            setPlaying(null)
            onVoicePack('off')
          }}
          className={[
            'shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold',
            voicePack === 'off'
              ? 'border-white/40 bg-white/15 text-white'
              : 'border-white/15 bg-black/30 text-white/70 hover:bg-black/50',
          ].join(' ')}
        >
          Mute
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {packs.map((pack) => {
          const active = voicePack === pack.id
          const isPlaying = playing === pack.id
          return (
            <div
              key={pack.id}
              className={[
                'flex items-center gap-2 rounded-xl border px-3 py-2.5 transition',
                active
                  ? 'border-[var(--flare)] bg-[var(--flare)]/10'
                  : 'border-white/12 bg-black/25',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => listen(pack.id)}
                className={[
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition',
                  isPlaying
                    ? 'animate-pulse bg-[var(--tomato)] text-white'
                    : 'bg-[var(--fluorescent)] text-[var(--ink)] hover:brightness-110',
                ].join(' ')}
                aria-label={`Play ${pack.label} preview`}
              >
                {isPlaying ? '…' : '▶'}
              </button>
              <button
                type="button"
                onClick={() => listen(pack.id)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-bold text-[var(--paper)]">
                  {pack.label}
                </p>
                <p className="truncate text-[11px] text-white/45">{pack.blurb}</p>
              </button>
              {active && (
                <span className="shrink-0 rounded-md bg-[var(--flare)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--flare)]">
                  Selected
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
