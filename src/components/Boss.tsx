import type { BossLook } from '../game/types'
import { hairHex, skinHex, skinShade, suitHex } from '../game/bossLooks'

interface BossProps {
  look: BossLook
  scanning: boolean
  shaking: boolean
  splash: string | null
}

export function Boss({ look, scanning, shaking, splash }: BossProps) {
  const hair = hairHex(look.hairColor)
  const suit = suitHex(look.suitColor)
  const skin = skinHex(look.skinTone)
  const shade = skinShade(look.skinTone)

  return (
    <div className="relative mx-auto flex w-full max-w-[280px] flex-col items-center sm:max-w-[320px]">
      {splash && (
        <div
          key={splash + String(shaking)}
          className="animate-splash pointer-events-none absolute left-1/2 top-8 z-20 -translate-x-1/2 text-5xl"
          aria-hidden
        >
          {splash}
        </div>
      )}
      <div
        className={[
          'relative w-full',
          shaking ? 'animate-shake' : '',
          scanning ? 'animate-scan rounded-2xl' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <svg
          viewBox="0 0 200 240"
          className="h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
          role="img"
          aria-label={`Cartoon boss ${look.name}`}
        >
          {/* chair / desk hint */}
          <ellipse cx="100" cy="228" rx="70" ry="10" fill="#0a1411" opacity="0.45" />

          {/* body / suit */}
          <path
            d="M55 150 Q100 130 145 150 L155 230 L45 230 Z"
            fill={suit}
          />
          <path d="M92 150 L100 210 L108 150 Z" fill="#f5f0e6" />
          <path d="M92 150 L100 168 L108 150" fill="#c45c3a" />

          {/* neck */}
          <rect x="88" y="118" width="24" height="28" rx="6" fill={skin} />

          {/* head */}
          <ellipse cx="100" cy="88" rx="42" ry="48" fill={skin} />

          {/* ears */}
          <ellipse cx="56" cy="90" rx="8" ry="12" fill={shade} />
          <ellipse cx="144" cy="90" rx="8" ry="12" fill={shade} />

          {/* hair */}
          {look.hairStyle === 'slick' && (
            <path
              d="M58 72 Q100 22 142 72 L138 78 Q100 42 62 78 Z"
              fill={hair}
              stroke={hair}
              strokeWidth="1"
            />
          )}
          {look.hairStyle === 'tuft' && (
            <>
              <path d="M68 72 Q100 40 132 72 Q118 58 100 60 Q82 58 68 72" fill={hair} />
              <path d="M94 48 Q100 18 110 46 L104 52 Q100 32 96 52 Z" fill={hair} />
            </>
          )}
          {look.hairStyle === 'balding' && (
            <>
              <path d="M58 78 Q70 55 85 68" fill={hair} />
              <path d="M142 78 Q130 55 115 68" fill={hair} />
              <circle cx="100" cy="55" r="18" fill={skin} />
            </>
          )}
          {look.hairStyle === 'mullet' && (
            <>
              <path d="M62 68 Q100 28 138 68 Q125 48 100 50 Q75 48 62 68" fill={hair} />
              <path d="M55 95 Q48 130 70 140 Q80 110 62 90" fill={hair} />
              <path d="M145 95 Q152 130 130 140 Q120 110 138 90" fill={hair} />
            </>
          )}

          {/* eyes */}
          <ellipse
            cx="82"
            cy="88"
            rx="7"
            ry={scanning ? 2 : 8}
            fill="#1a2f2a"
          />
          <ellipse
            cx="118"
            cy="88"
            rx="7"
            ry={scanning ? 2 : 8}
            fill="#1a2f2a"
          />
          {!scanning && (
            <>
              <circle cx="84" cy="85" r="2.2" fill="#fff" />
              <circle cx="120" cy="85" r="2.2" fill="#fff" />
            </>
          )}

          {/* brows */}
          <path
            d={scanning ? 'M72 74 L92 78' : 'M72 76 L92 72'}
            stroke="#2b2b2b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={scanning ? 'M128 74 L108 78' : 'M128 76 L108 72'}
            stroke="#2b2b2b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* facial hair */}
          {look.facialHair === 'mustache' && (
            <path
              d="M78 108 Q100 118 122 108 Q100 124 78 108"
              fill={hair}
            />
          )}
          {look.facialHair === 'goatee' && (
            <path d="M92 112 Q100 138 108 112 Q100 122 92 112" fill={hair} />
          )}
          {look.facialHair === 'stubble' && (
            <ellipse cx="100" cy="118" rx="22" ry="14" fill={hair} opacity="0.35" />
          )}

          {/* mouth */}
          <path
            d={
              scanning
                ? 'M86 118 Q100 112 114 118'
                : 'M86 116 Q100 128 114 116'
            }
            stroke={shade}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* glasses */}
          {look.glasses === 'round' && (
            <>
              <circle cx="82" cy="88" r="14" fill="none" stroke="#222" strokeWidth="3" />
              <circle cx="118" cy="88" r="14" fill="none" stroke="#222" strokeWidth="3" />
              <line x1="96" y1="88" x2="104" y2="88" stroke="#222" strokeWidth="3" />
            </>
          )}
          {look.glasses === 'square' && (
            <>
              <rect x="68" y="76" width="28" height="24" rx="3" fill="none" stroke="#222" strokeWidth="3" />
              <rect x="104" y="76" width="28" height="24" rx="3" fill="none" stroke="#222" strokeWidth="3" />
              <line x1="96" y1="88" x2="104" y2="88" stroke="#222" strokeWidth="3" />
            </>
          )}
          {look.glasses === 'shades' && (
            <>
              <rect x="66" y="78" width="30" height="20" rx="4" fill="#1a1a1a" opacity="0.85" />
              <rect x="104" y="78" width="30" height="20" rx="4" fill="#1a1a1a" opacity="0.85" />
              <line x1="96" y1="88" x2="104" y2="88" stroke="#1a1a1a" strokeWidth="3" />
            </>
          )}
        </svg>
      </div>
      <p className="mt-2 max-w-[90%] truncate text-center font-[family-name:var(--font-display)] text-lg font-bold text-[var(--flare)] sm:text-xl">
        {look.name}
      </p>
      {scanning && (
        <p className="animate-bounce-in mt-1 text-xs font-semibold uppercase tracking-widest text-[var(--tomato)]">
          Scanning…
        </p>
      )}
    </div>
  )
}
