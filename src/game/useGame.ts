import {
  MELTDOWN_GOAL,
  PRANKS,
  ROUND_SECONDS,
  SCAN_DURATION_MS,
  SCAN_INTERVAL_MS,
  SCAN_SUSPICION_MULT,
  SUSPICION_LIMIT,
} from './pranks'
import { DEFAULT_BOSS, sanitizeBossName } from './bossLooks'
import type { BossLook, FloatingText, GameState, PrankId, Screen } from './types'
import { useCallback, useEffect, useRef, useState } from 'react'

const initialState = (boss: BossLook = DEFAULT_BOSS): GameState => ({
  screen: 'title',
  boss: { ...boss },
  meltdown: 0,
  suspicion: 0,
  score: 0,
  secondsLeft: ROUND_SECONDS,
  scanning: false,
  lastPrankId: null,
  hitNonce: 0,
  splash: null,
  floating: [],
  cooldowns: {},
  message: 'Pick a prank. Avoid eye contact when he scans the room.',
})

let floatId = 0

export function useGame() {
  const [state, setState] = useState<GameState>(initialState)
  const timers = useRef<number[]>([])
  const playing = state.screen === 'playing'

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])

  const pushFloat = useCallback(
    (text: string, kind: FloatingText['kind']) => {
      const id = ++floatId
      setState((s) => ({
        ...s,
        floating: [...s.floating.slice(-4), { id, text, kind }],
      }))
      schedule(() => {
        setState((s) => ({
          ...s,
          floating: s.floating.filter((f) => f.id !== id),
        }))
      }, 900)
    },
    [schedule],
  )

  const endGame = useCallback(
    (
      screen: Extract<Screen, 'won' | 'lost'>,
      score: number,
      message: string,
    ) => {
      clearTimers()
      setState((s) => ({
        ...s,
        screen,
        score,
        message,
        scanning: false,
      }))
    },
    [clearTimers],
  )

  const goTitle = useCallback(() => {
    clearTimers()
    setState((s) => ({ ...initialState(s.boss), screen: 'title' }))
  }, [clearTimers])

  const openCustomize = useCallback(() => {
    clearTimers()
    setState((s) => ({
      ...initialState(s.boss),
      screen: 'customize',
    }))
  }, [clearTimers])

  const updateBoss = useCallback((patch: Partial<BossLook>) => {
    setState((s) => ({
      ...s,
      boss: {
        ...s.boss,
        ...patch,
        name:
          patch.name !== undefined
            ? patch.name.slice(0, 28)
            : s.boss.name,
      },
    }))
  }, [])

  const startGame = useCallback(() => {
    clearTimers()
    setState((s) => ({
      ...initialState({
        ...s.boss,
        name: sanitizeBossName(s.boss.name),
      }),
      screen: 'playing',
      message: `${sanitizeBossName(s.boss.name)} is mid–status update. Ruin it.`,
    }))
  }, [clearTimers])

  // Countdown
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setState((s) => {
        if (s.screen !== 'playing') return s
        const next = s.secondsLeft - 1
        if (next <= 0) {
          return {
            ...s,
            secondsLeft: 0,
            screen: 'lost',
            message: `Time’s up. ${s.boss.name} finished the TPS report and your alibi evaporated.`,
            scanning: false,
          }
        }
        return { ...s, secondsLeft: next }
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [playing])

  // Scanning
  useEffect(() => {
    if (!playing) return
    const tick = () => {
      setState((s) => {
        if (s.screen !== 'playing') return s
        return {
          ...s,
          scanning: true,
          message: `${s.boss.name} is scanning the cubicles. Freeze.`,
        }
      })
      schedule(() => {
        setState((s) => {
          if (s.screen !== 'playing') return s
          return {
            ...s,
            scanning: false,
            message: `Clear. ${s.boss.name} is arguing with the printer.`,
          }
        })
      }, SCAN_DURATION_MS)
    }
    const id = window.setInterval(tick, SCAN_INTERVAL_MS)
    schedule(tick, 3200)
    return () => window.clearInterval(id)
  }, [playing, schedule])

  // Cooldowns
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setState((s) => {
        if (s.screen !== 'playing') return s
        const entries = Object.entries(s.cooldowns) as [PrankId, number][]
        if (entries.length === 0) return s
        const next: Partial<Record<PrankId, number>> = {}
        let changed = false
        for (const [k, v] of entries) {
          const nv = Math.max(0, v - 100)
          if (nv > 0) next[k] = nv
          if (nv !== v) changed = true
        }
        return changed ? { ...s, cooldowns: next } : s
      })
    }, 100)
    return () => window.clearInterval(id)
  }, [playing])

  const deployPrank = useCallback(
    (id: PrankId) => {
      setState((s) => {
        if (s.screen !== 'playing') return s
        const prank = PRANKS.find((p) => p.id === id)
        if (!prank) return s
        if ((s.cooldowns[id] ?? 0) > 0) return s

        const caught = s.scanning
        const suspicionGain = Math.round(
          prank.suspicion * (caught ? SCAN_SUSPICION_MULT : 1),
        )
        const meltdownGain = caught
          ? Math.round(prank.meltdown * 0.55)
          : prank.meltdown

        const meltdown = Math.min(MELTDOWN_GOAL, s.meltdown + meltdownGain)
        const suspicion = Math.min(SUSPICION_LIMIT, s.suspicion + suspicionGain)
        const points =
          meltdownGain * 10 +
          Math.max(0, 20 - suspicionGain) +
          (caught ? 0 : 15)
        const score = s.score + points

        schedule(() => {
          setState((cur) =>
            cur.splash === prank.emoji ? { ...cur, splash: null } : cur,
          )
        }, 700)

        if (meltdown >= MELTDOWN_GOAL) {
          const bonus = s.secondsLeft * 8
          schedule(() => {
            endGame(
              'won',
              score + bonus,
              `${s.boss.name} fled to the supply closet clutching a stress ball shaped like himself. Leftover-clock bonus: +${bonus}.`,
            )
          }, 420)
        } else if (suspicion >= SUSPICION_LIMIT) {
          schedule(() => {
            endGame(
              'lost',
              score,
              `HR arrived with a pamphlet for ${s.boss.name}: “Workplace Levity Guidelines.” You’re toast.`,
            )
          }, 420)
        }

        return {
          ...s,
          meltdown,
          suspicion,
          score,
          lastPrankId: id,
          hitNonce: s.hitNonce + 1,
          splash: prank.emoji,
          cooldowns: { ...s.cooldowns, [id]: prank.cooldownMs },
          message: caught
            ? `${s.boss.name} saw that ${prank.name.toLowerCase()}! Suspicion spiked.`
            : prank.reaction.replace(/\bHe\b/g, s.boss.name.split(' ')[0] || 'He'),
        }
      })
    },
    [endGame, schedule],
  )

  const prevHit = useRef(0)
  useEffect(() => {
    if (state.hitNonce === prevHit.current) return
    prevHit.current = state.hitNonce
    if (state.screen !== 'playing' || !state.lastPrankId) return
    const prank = PRANKS.find((p) => p.id === state.lastPrankId)
    if (!prank) return
    if (state.message.includes('Suspicion spiked')) {
      pushFloat('CAUGHT!', 'bad')
    } else {
      pushFloat(`+${prank.meltdown} meltdown`, 'good')
    }
  }, [
    state.hitNonce,
    state.lastPrankId,
    state.message,
    state.screen,
    pushFloat,
  ])

  return {
    state,
    goTitle,
    openCustomize,
    updateBoss,
    startGame,
    deployPrank,
    pranks: PRANKS,
    meltdownGoal: MELTDOWN_GOAL,
    suspicionLimit: SUSPICION_LIMIT,
  }
}
