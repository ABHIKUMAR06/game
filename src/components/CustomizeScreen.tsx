import { Boss } from './Boss'
import type { BossLook } from '../game/types'
import {
  FACIAL_HAIR,
  GLASSES,
  HAIR_COLORS,
  HAIR_STYLES,
  SKIN_TONES,
  SUIT_COLORS,
} from '../game/bossLooks'

interface CustomizeScreenProps {
  boss: BossLook
  onChange: (patch: Partial<BossLook>) => void
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
  onChange,
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

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:gap-10 lg:py-10">
        <section className="flex flex-col items-center lg:sticky lg:top-8 lg:w-[42%]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--fluorescent)]">
            Build your villain
          </p>
          <h2 className="mb-4 text-center font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--flare)] sm:text-4xl">
            Dress the boss
          </h2>
          <Boss look={boss} scanning={false} shaking={false} splash={null} />
          <p className="mt-3 max-w-xs text-center text-sm text-white/55">
            Live preview. Make him look like the one who invented Monday standups.
          </p>
        </section>

        <section className="flex flex-1 flex-col gap-5 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm sm:p-6">
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

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
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
