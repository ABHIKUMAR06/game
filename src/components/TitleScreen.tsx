import type { VoicePackId } from '../game/types'
import { VoicePreviewPanel } from './VoicePreviewPanel'

interface TitleScreenProps {
  onStart: () => void
  voicePack: VoicePackId
  onVoicePack: (id: VoicePackId) => void
}

export function TitleScreen({
  onStart,
  voicePack,
  onVoicePack,
}: TitleScreenProps) {
  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col overflow-y-auto overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200, 240, 106, 0.22), transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 70%, rgba(42, 107, 90, 0.45), transparent 50%),
            linear-gradient(165deg, #0d1a16 0%, #1a332c 45%, #14221e 100%)
          `,
        }}
      />
      <div className="animate-flicker pointer-events-none fixed left-1/2 top-0 h-24 w-[70%] -translate-x-1/2 rounded-b-full bg-[radial-gradient(ellipse_at_top,rgba(240,199,94,0.35),transparent_70%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-5 py-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fluorescent)]">
          Unlimited 3D cubicle catharsis
        </p>
        <h1
          className="animate-title-sway font-[family-name:var(--font-display)] text-[clamp(2.6rem,10vw,5.2rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--flare)]"
          style={{ textShadow: '0 4px 0 #2a6b5a, 0 8px 24px rgba(0,0,0,0.45)' }}
        >
          Cubicle
          <br />
          Justice
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--paper)]/85 sm:text-lg">
          Slap, kick, snip hair, spill coffee — every hit leaves a lasting mark.
          No HR. No clock. Listen to the voice packs, then start the chaos.
        </p>

        <div className="mt-8 w-full max-w-xl text-left">
          <VoicePreviewPanel
            voicePack={voicePack}
            onVoicePack={onVoicePack}
          />
        </div>

        <button
          type="button"
          onClick={onStart}
          className="animate-pulse-glow mt-8 rounded-xl bg-[var(--tomato)] px-8 py-3.5 text-lg font-bold text-white shadow-[0_6px_0_#8f2f24] transition hover:brightness-110 active:translate-y-1 active:shadow-[0_2px_0_#8f2f24]"
        >
          Design your boss
        </button>

        <ul className="mt-8 grid w-full max-w-lg gap-2 text-left text-sm text-[var(--paper)]/70 sm:grid-cols-3">
          <li className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            Permanent <span className="text-[var(--flare)]">bruises & stains</span>
          </li>
          <li className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            Juicy <span className="text-[var(--tomato)]">hit FX + SFX</span>
          </li>
          <li className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            Voices EN / HI <span className="text-[var(--mint)]">Play ▶</span>
          </li>
        </ul>
      </main>

      <footer className="relative z-10 pb-5 text-center text-xs text-white/35">
        Cartoon-real damage. Neural voice samples. Torture forever.
      </footer>
    </div>
  )
}
