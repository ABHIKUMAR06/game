import { Boss } from './Boss'
import type { FloatingText, GameState } from '../game/types'
import type { Prank } from '../game/types'
import type { PrankId } from '../game/types'

interface GameScreenProps {
  state: GameState
  pranks: Prank[]
  meltdownGoal: number
  suspicionLimit: number
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
    <div className="pointer-events-none absolute inset-x-0 top-4 z-30 flex flex-col items-center gap-1">
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
  suspicionLimit,
  onPrank,
  onCustomize,
}: GameScreenProps) {
  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 40% at 50% -5%, rgba(200,240,106,0.2), transparent 50%),
            linear-gradient(180deg, #1a2e28 0%, #0d1a16 40%, #24352f 100%)
          `,
        }}
      />
      {/* carpet / cubicle texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(0,0,0,0.25) 12px, rgba(0,0,0,0.25) 13px),
            repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.18) 12px, rgba(0,0,0,0.18) 13px)
          `,
        }}
      />
      <div className="animate-flicker pointer-events-none absolute left-1/2 top-0 h-20 w-[65%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(240,199,94,0.28),transparent_70%)]" />

      <header className="relative z-10 flex items-start gap-3 px-3 pt-3 sm:px-5 sm:pt-4">
        <Meter
          label="Meltdown"
          value={state.meltdown}
          max={meltdownGoal}
          color="var(--flare)"
        />
        <Meter
          label="HR Suspicion"
          value={state.suspicion}
          max={suspicionLimit}
          color="var(--tomato)"
        />
        <div className="shrink-0 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-white/45">Clock</p>
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--fluorescent)]">
            {state.secondsLeft}s
          </p>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-between gap-2 px-3 pt-2 sm:px-5">
        <p className="text-sm font-semibold text-white/70">
          Score{' '}
          <span className="text-[var(--flare)]">{state.score}</span>
        </p>
        <button
          type="button"
          onClick={onCustomize}
          className="rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-black/50"
        >
          Remix {state.boss.name.split(' ')[0]}
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-3 py-2">
        <Floats items={state.floating} />
        {/* desk surface */}
        <div className="animate-float relative w-full max-w-md">
          <div
            className="absolute inset-x-6 bottom-0 h-16 rounded-t-lg"
            style={{
              background:
                'linear-gradient(180deg, #6b4f35 0%, #4a3422 100%)',
              boxShadow: '0 8px 0 #2a1c12',
            }}
          />
          <div className="relative pb-10 pt-2">
            <Boss
              look={state.boss}
              scanning={state.scanning}
              shaking={state.hitNonce > 0}
              splash={state.splash}
              key={state.hitNonce}
            />
          </div>
        </div>
        <p className="mt-2 min-h-[2.5rem] max-w-lg px-2 text-center text-sm leading-snug text-white/75 sm:text-base">
          {state.message}
        </p>
      </div>

      <nav className="relative z-10 border-t border-white/10 bg-black/45 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md sm:px-4">
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Deploy a prank on {state.boss.name}
        </p>
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2 sm:grid-cols-6">
          {pranks.map((p) => {
            const cd = state.cooldowns[p.id] ?? 0
            const ready = cd <= 0
            return (
              <button
                key={p.id}
                type="button"
                disabled={!ready}
                onClick={() => onPrank(p.id)}
                className="prank-btn flex flex-col items-center gap-1 rounded-xl border border-white/15 bg-[var(--teal)]/40 px-1 py-2 text-center transition hover:bg-[var(--teal)]/60 disabled:hover:bg-[var(--teal)]/40"
                title={p.blurb}
              >
                <span className="text-2xl leading-none" aria-hidden>
                  {p.emoji}
                </span>
                <span className="text-[10px] font-bold leading-tight text-[var(--paper)] sm:text-xs">
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
