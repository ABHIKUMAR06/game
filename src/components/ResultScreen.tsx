interface ResultScreenProps {
  won: boolean
  score: number
  message: string
  onRetry: () => void
  onTitle: () => void
}

export function ResultScreen({
  won,
  score,
  message,
  onRetry,
  onTitle,
}: ResultScreenProps) {
  return (
    <div className="relative flex h-full min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-10">
      <div
        className="absolute inset-0"
        style={{
          background: won
            ? `radial-gradient(ellipse at 50% 30%, rgba(125,211,167,0.35), transparent 55%), linear-gradient(160deg, #0d1a16, #1f3d32)`
            : `radial-gradient(ellipse at 50% 30%, rgba(232,93,76,0.28), transparent 55%), linear-gradient(160deg, #1a1210, #14221e)`,
        }}
      />
      <div className="animate-bounce-in relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-black/40 p-6 text-center backdrop-blur-md sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
          {won ? 'Performance review: legendary' : 'Performance review: doomed'}
        </p>
        <h2
          className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold sm:text-5xl"
          style={{ color: won ? 'var(--fluorescent)' : 'var(--tomato)' }}
        >
          {won ? 'Meltdown!' : 'HR Got You'}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--paper)]/80 sm:text-base">
          {message}
        </p>
        <p className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--flare)]">
          Score {score}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-[var(--flare)] px-6 py-3 font-bold text-[var(--ink)] shadow-[0_4px_0_#a8862e] active:translate-y-0.5 active:shadow-[0_2px_0_#a8862e]"
          >
            Another shift
          </button>
          <button
            type="button"
            onClick={onTitle}
            className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10"
          >
            Back to lobby
          </button>
        </div>
      </div>
    </div>
  )
}
