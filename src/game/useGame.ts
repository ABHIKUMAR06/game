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
import type {
  BossLook,
  FloatingText,
  GameState,
  PrankId,
  Screen,
  VoicePackId,
} from './types'
import { speakReaction, warmVoices } from './voicePacks'
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
  lastFx: null,
  hitNonce: 0,
  hairIntegrity: 1,
  floating: [],
  cooldowns: {},
  message:
    'Slap. Kick. Snip. Keep it cartoon-terrifying — freeze when they scan.',
})

let floatId = 0

export function useGame() {
  const [state, setState] = useState<GameState>(initialState)
  const [voicePack, setVoicePack] = useState<VoicePackId>('en-male')
  const voiceRef = useRef(voicePack)
  voiceRef.current = voicePack
  const timers = useRef<number[]>([])
  const playing = state.screen === 'playing'

  useEffect(() => {
    warmVoices()
  }, [])

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])

  const say = useCallback((key: string) => {
    speakReaction(voiceRef.current, key)
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
      say(screen === 'won' ? 'win' : 'lose')
      setState((s) => ({
        ...s,
        screen,
        score,
        message,
        scanning: false,
      }))
    },
    [clearTimers, say],
  )

  const goTitle = useCallback(() => {
    clearTimers()
    setState((s) => ({ ...initialState(s.boss), screen: 'title' }))
  }, [clearTimers])

  const openCustomize = useCallback(() => {
    clearTimers()
    warmVoices()
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
        name: patch.name !== undefined ? patch.name.slice(0, 28) : s.boss.name,
      },
    }))
  }, [])

  const startGame = useCallback(() => {
    clearTimers()
    warmVoices()
    setState((s) => ({
      ...initialState({
        ...s.boss,
        name: sanitizeBossName(s.boss.name),
      }),
      screen: 'playing',
      message: `${sanitizeBossName(s.boss.name)} looms in 3D. Make them melt.`,
    }))
  }, [clearTimers])

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
            message: `Time’s up. ${s.boss.name} survived the shift. Your legend dies in Slack.`,
            scanning: false,
          }
        }
        return { ...s, secondsLeft: next }
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [playing])

  const prevScreen = useRef(state.screen)
  useEffect(() => {
    if (prevScreen.current === 'playing' && state.screen === 'lost') {
      // Timeout lose path (endGame already speaks for meltdown/HR)
      if (!state.message.includes('supply closet') && !state.message.includes('HR materializes')) {
        say('lose')
      }
    }
    prevScreen.current = state.screen
  }, [state.screen, state.message, say])

  useEffect(() => {
    if (!playing) return
    const tick = () => {
      setState((s) => {
        if (s.screen !== 'playing') return s
        return {
          ...s,
          scanning: true,
          message: `${s.boss.name} locks eyes. The cubicle goes cold. Freeze.`,
        }
      })
      say('scan')
      schedule(() => {
        setState((s) => {
          if (s.screen !== 'playing') return s
          return {
            ...s,
            scanning: false,
            message: `Clear. ${s.boss.name} is wrestling the printer again.`,
          }
        })
      }, SCAN_DURATION_MS)
    }
    const id = window.setInterval(tick, SCAN_INTERVAL_MS)
    schedule(tick, 3000)
    return () => window.clearInterval(id)
  }, [playing, schedule, say])

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

        let hairIntegrity = s.hairIntegrity
        if (prank.hairDamage && !caught) {
          hairIntegrity = Math.max(0, hairIntegrity - prank.hairDamage)
        }

        const baldBonus =
          prank.id === 'haircut' && hairIntegrity <= 0.05 ? 40 : 0

        const meltdown = Math.min(
          MELTDOWN_GOAL,
          s.meltdown + meltdownGain + baldBonus,
        )
        const suspicion = Math.min(SUSPICION_LIMIT, s.suspicion + suspicionGain)
        const points =
          meltdownGain * 10 +
          Math.max(0, 20 - suspicionGain) +
          (caught ? 0 : 15) +
          baldBonus * 2
        const score = s.score + points

        schedule(() => {
          say(caught ? 'caught' : prank.id)
        }, 40)

        if (meltdown >= MELTDOWN_GOAL) {
          const bonus = s.secondsLeft * 8
          schedule(() => {
            endGame(
              'won',
              score + bonus,
              `${s.boss.name} fled into the supply closet, hair in ruins, soul stapled. Leftover-clock bonus: +${bonus}.`,
            )
          }, 480)
        } else if (suspicion >= SUSPICION_LIMIT) {
          schedule(() => {
            endGame(
              'lost',
              score,
              `HR materializes beside ${s.boss.name} with a laminated pamphlet and haunted eyes. You’re toast.`,
            )
          }, 480)
        }

        const firstName = s.boss.name.split(' ')[0] || 'They'
        let message = caught
          ? `${s.boss.name} witnessed that ${prank.name.toLowerCase()}! Suspicion spiked.`
          : prank.reaction.replace(/\bThey\b/g, firstName)

        if (!caught && prank.id === 'haircut') {
          if (hairIntegrity <= 0.05) {
            message = `TOTAL DOME. ${firstName} is a polished corporate cue ball.`
          } else if (hairIntegrity < 0.4) {
            message = `SNIP. ${firstName}'s coiffure is hanging on by a performance review.`
          }
        }

        return {
          ...s,
          meltdown,
          suspicion,
          score,
          hairIntegrity,
          lastPrankId: id,
          lastFx: prank.fx,
          hitNonce: s.hitNonce + 1,
          cooldowns: { ...s.cooldowns, [id]: prank.cooldownMs },
          message,
        }
      })
    },
    [endGame, schedule, say],
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
    } else if (prank.id === 'haircut') {
      pushFloat('SNIP!', 'warn')
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
    voicePack,
    setVoicePack,
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
