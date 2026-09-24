import { OfficeCanvas } from './scene/OfficeCanvas'
import type { BossLook, VoicePackId } from '../game/types'
import {
  FACIAL_HAIR,
  GLASSES,
  HAIR_COLORS,
  HAIR_STYLES,
  SKIN_TONES,
  SUIT_COLORS,
} from '../game/bossLooks'
import { VOICE_PACKS, previewVoice } from '../game/voicePacks'

interface CustomizeScreenProps {
  boss: BossLook
  voicePack: VoicePackId
  onChange: (patch: Partial<BossLook>) => void
  onVoicePack: (id: VoicePackId) => void
  onStart: () => void
  onBack: () => void
}

function ChipRow<T extends string>({
  label,
  options,
  value,
  onPick,
  swatch,
}: {
  label: string
  options: { id: T; label: string; hex?: string }[]
  value: T
  onPick: (id: T) => void
  swatch?: boolean
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.id === value
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onPick(opt.id)}
              className={[
                'rounded-lg border px-3 py-2 text-sm font-semibold transition',
                active
                  ? 'border-[var(--flare)] bg-[var(--flare)]/20 text-[var(--flare)]'
                  : 'border-white/15 bg-black/25 text-white/80 hover:border-white/35',
              ].join(' ')}
            >
              {swatch && opt.hex && (
                <span
                  className="mr-2 inline-block h-3 w-3 rounded-full align-middle ring-1 ring-white/30"
                  style={{ background: opt.hex }}
                  aria-hidden
                />
              )}
              {opt.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function CustomizeScreen({
  boss,
  voicePack,
  onChange,
  onVoicePack,
  onStart,
  onBack,
}: CustomizeScreenProps) {
  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col overflow-y-auto overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 20% 0%, rgba(240,199,94,0.18), transparent 50%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(42,107,90,0.4), transparent 45%),
            linear-gradient(165deg, #0d1a16, #1a332c 50%, #14221e)
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-stretch lg:gap-8 lg:py-8">
        <section className="flex min-h-[320px] flex-col lg:w-[46%]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--fluorescent)]">
            Build your villain · 3D
          </p>
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--flare)] sm:text-4xl">
            Dress the boss
          </h2>
            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <OfficeCanvas
              look={boss}
              hitNonce={0}
              lastFx={null}
              meltdown={0}
              interactive
              className="absolute inset-0"
            />
          </div>
          <p className="mt-2 text-center text-sm font-bold text-[var(--flare)]">
            {boss.name}
          </p>
          <p className="text-center text-xs text-white/45">
            Drag to orbit. Live 3D preview with lights and shadows.
          </p>
        </section>

        <section className="flex flex-1 flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm sm:p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Boss name
            </span>
            <input
              type="text"
              value={boss.name}
              maxLength={28}
              placeholder="Gary from Finance"
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-[var(--ink)]/80 px-4 py-3 text-base font-semibold text-[var(--paper)] outline-none ring-[var(--flare)] placeholder:text-white/30 focus:ring-2"
              autoComplete="off"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Reaction voice pack
            </legend>
            <div className="flex flex-wrap gap-2">
              {VOICE_PACKS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    onVoicePack(v.id)
                    previewVoice(v.id)
                  }}
                  className={[
                    'rounded-lg border px-3 py-2 text-sm font-semibold transition',
                    voicePack === v.id
                      ? 'border-[var(--fluorescent)] bg-[var(--fluorescent)]/15 text-[var(--fluorescent)]'
                      : 'border-white/15 bg-black/25 text-white/80 hover:border-white/35',
                  ].join(' ')}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-white/40">
              Tap a pack to preview. Picks the best natural English/Hindi voice your browser has.
            </p>
          </fieldset>

          <ChipRow
            label="Skin tone"
            options={SKIN_TONES}
            value={boss.skinTone}
            onPick={(skinTone) => onChange({ skinTone })}
            swatch
          />
          <ChipRow
            label="Hair style"
            options={HAIR_STYLES}
            value={boss.hairStyle}
            onPick={(hairStyle) => onChange({ hairStyle })}
          />
          <ChipRow
            label="Hair color"
            options={HAIR_COLORS}
            value={boss.hairColor}
            onPick={(hairColor) => onChange({ hairColor })}
            swatch
          />
          <ChipRow
            label="Suit"
            options={SUIT_COLORS}
            value={boss.suitColor}
            onPick={(suitColor) => onChange({ suitColor })}
            swatch
          />
          <ChipRow
            label="Facial hair"
            options={FACIAL_HAIR}
            value={boss.facialHair}
            onPick={(facialHair) => onChange({ facialHair })}
          />
          <ChipRow
            label="Glasses"
            options={GLASSES}
            value={boss.glasses}
            onPick={(glasses) => onChange({ glasses })}
          />

          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="animate-pulse-glow flex-1 rounded-xl bg-[var(--tomato)] px-6 py-3.5 text-base font-bold text-white shadow-[0_5px_0_#8f2f24] active:translate-y-1 active:shadow-[0_2px_0_#8f2f24]"
            >
              Start pranking {boss.name.trim() || 'the boss'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white/85 hover:bg-white/10"
            >
              Back
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
