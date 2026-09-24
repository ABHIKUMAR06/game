import { OfficeCanvas } from './scene/OfficeCanvas'
import type {
  FloatingText,
  GameState,
  Prank,
  PrankId,
  VoicePackId,
} from '../game/types'
import { VOICE_PACKS, previewVoice } from '../game/voicePacks'

interface GameScreenProps {
  state: GameState
  pranks: Prank[]
  meltdownGoal: number
  voicePack: VoicePackId
  onVoicePack: (id: VoicePackId) => void
  onPrank: (id: PrankId) => void
  onCustomize: () => void
}

function Meter({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-white/55 sm:text-xs">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
        <div
          className="meter-fill h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

function Floats({ items }: { items: FloatingText[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex flex-col items-center gap-1 sm:top-20">
      {items.map((f) => (
        <span
          key={f.id}
          className={[
            'animate-bounce-in rounded-full px-3 py-1 text-sm font-bold shadow-lg',
            f.kind === 'good' && 'bg-[var(--fluorescent)] text-[var(--ink)]',
            f.kind === 'bad' && 'bg-[var(--tomato)] text-white',
            f.kind === 'warn' && 'bg-[var(--flare)] text-[var(--ink)]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {f.text}
        </span>
      ))}
    </div>
  )
}

export function GameScreen({
  state,
  pranks,
  meltdownGoal,
  voicePack,
  onVoicePack,
  onPrank,
  onCustomize,
}: GameScreenProps) {
  const d = state.damage
  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col overflow-hidden bg-[var(--night)]">
      <header className="relative z-20 flex items-center gap-3 px-2 pt-2 sm:px-4 sm:pt-3">
        <Meter
          label="Meltdown (loops)"
          value={state.meltdown}
          max={meltdownGoal}
          color="var(--flare)"
        />
        <div className="shrink-0 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-center backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-wider text-white/45">Score</p>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--flare)]">
            {state.score}
          </p>
        </div>
      </header>

      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-2 pt-2 sm:px-4">
        <p className="text-[11px] text-white/55 sm:text-xs">
          Marks · slap {d.slapMarks} · coffee {d.coffeeStains} · hair{' '}
          {Math.round(d.hairIntegrity * 100)}% · pie {d.pieSplat}
          <span className="ml-2 text-[var(--mint)]">Unlimited · no HR</span>
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[11px] text-white/55">
            Voice
            <select
              value={voicePack}
              onChange={(e) => {
                const id = e.target.value as VoicePackId
                onVoicePack(id)
                previewVoice(id)
              }}
              className="rounded-md border border-white/15 bg-black/50 px-2 py-1 text-xs font-semibold text-[var(--paper)]"
            >
              {VOICE_PACKS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={onCustomize}
            className="rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-black/60"
          >
            Remix {state.boss.name.split(' ')[0]}
          </button>
        </div>
      </div>

      <div className="relative z-10 min-h-0 flex-1">
        <Floats items={state.floating} />
        {state.justMelted && (
          <div className="animate-bounce-in pointer-events-none absolute inset-x-0 top-8 z-40 text-center">
            <p className="inline-block rounded-xl bg-[var(--flare)] px-4 py-2 font-[family-name:var(--font-display)] text-lg font-extrabold text-[var(--ink)] shadow-lg">
              Meltdown! Marks stay — keep going
            </p>
          </div>
        )}
        <OfficeCanvas
          look={state.boss}
          hitNonce={state.hitNonce}
          lastFx={state.lastFx}
          damage={state.damage}
          meltdown={state.meltdown}
          interactive
          className="h-full min-h-[280px]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 px-3">
          <p className="mx-auto max-w-xl rounded-xl bg-black/55 px-3 py-2 text-center text-sm text-white/85 backdrop-blur-sm">
            <span className="font-bold text-[var(--flare)]">{state.boss.name}</span>
            {' — '}
            {state.message}
          </p>
        </div>
      </div>

      <nav className="relative z-20 border-t border-white/10 bg-black/60 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md sm:px-4">
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Leave lasting damage · {state.boss.name}
        </p>
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-2 sm:grid-cols-8">
          {pranks.map((p) => {
            const cd = state.cooldowns[p.id] ?? 0
            const ready = cd <= 0
            return (
              <button
                key={p.id}
                type="button"
                disabled={!ready}
                onClick={() => onPrank(p.id)}
                className="prank-btn flex flex-col items-center gap-1 rounded-xl border border-white/15 bg-[var(--teal)]/45 px-1 py-2 text-center transition hover:bg-[var(--teal)]/65 disabled:hover:bg-[var(--teal)]/45"
                title={p.blurb}
              >
                <span className="text-xl leading-none sm:text-2xl" aria-hidden>
                  {p.emoji}
                </span>
                <span className="text-[9px] font-bold leading-tight text-[var(--paper)] sm:text-[10px]">
                  {p.name}
                </span>
                {!ready && (
                  <span className="text-[9px] text-white/45">
                    {(cd / 1000).toFixed(1)}s
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
