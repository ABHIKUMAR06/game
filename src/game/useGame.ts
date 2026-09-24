import { MELTDOWN_GOAL, PRANKS } from './pranks'
import { DEFAULT_BOSS, sanitizeBossName } from './bossLooks'
import type {
  BossLook,
  DamageMarks,
  FloatingText,
  GameState,
  PrankId,
  VoicePackId,
} from './types'
import { EMPTY_DAMAGE } from './types'
import { speakReaction, warmVoices } from './voicePacks'
import { useCallback, useEffect, useRef, useState } from 'react'

const initialState = (boss: BossLook = DEFAULT_BOSS): GameState => ({
  screen: 'title',
  boss: { ...boss },
  meltdown: 0,
  score: 0,
  lastPrankId: null,
  lastFx: null,
  hitNonce: 0,
  damage: EMPTY_DAMAGE(),
  floating: [],
  cooldowns: {},
  message: 'Unlimited session. Leave lasting marks. No HR. No clock.',
  justMelted: false,
})

function applyDamage(damage: DamageMarks, id: PrankId): DamageMarks {
  const d = { ...damage }
  const clamp = (n: number, max: number) => Math.min(max, n)
  switch (id) {
    case 'slap':
      d.slapMarks = clamp(d.slapMarks + 1, 6)
      break
    case 'kick':
      d.kickMarks = clamp(d.kickMarks + 1, 5)
      break
    case 'haircut':
      d.hairIntegrity = Math.max(0, d.hairIntegrity - 0.28)
      break
    case 'rubber-chicken':
      d.chickenHits = clamp(d.chickenHits + 1, 4)
      break
    case 'coffee-spill':
      d.coffeeStains = clamp(d.coffeeStains + 1, 6)
      break
    case 'pie-face':
      d.pieSplat = clamp(d.pieSplat + 1, 4)
      break
    case 'stapler-slam':
      d.staplerBumps = clamp(d.staplerBumps + 1, 4)
      break
    case 'void-memo':
      d.voidCrack = clamp(d.voidCrack + 1, 3)
      break
  }
  return d
}

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
      }, 1000)
    },
    [schedule],
  )

  const goTitle = useCallback(() => {
    clearTimers()
    setState((s) => ({ ...initialState(s.boss), screen: 'title' }))
  }, [clearTimers])

  const openCustomize = useCallback(() => {
    clearTimers()
    warmVoices()
    // Keep boss look; reset damage when remixing look
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
      message: `${sanitizeBossName(s.boss.name)} is yours. Leave marks. No time limit.`,
    }))
  }, [clearTimers])

  // Cooldown ticker
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

        const damage = applyDamage(s.damage, id)
        const baldBonus =
          id === 'haircut' && damage.hairIntegrity <= 0.05 ? 25 : 0
        let meltdown = s.meltdown + prank.meltdown + baldBonus
        let justMelted = false
        let score = s.score + prank.meltdown * 12 + baldBonus * 2

        if (meltdown >= MELTDOWN_GOAL) {
          justMelted = true
          score += 200
          meltdown = meltdown % MELTDOWN_GOAL
          schedule(() => say('melt'), 80)
          schedule(() => {
            setState((cur) =>
              cur.justMelted ? { ...cur, justMelted: false } : cur,
            )
          }, 2800)
        }

        schedule(() => say(prank.id), 30)

        const firstName = s.boss.name.split(' ')[0] || 'They'
        let message = prank.reaction
        if (id === 'haircut') {
          if (damage.hairIntegrity <= 0.05) {
            message = `TOTAL DOME. ${firstName} is a polished corporate cue ball — permanently.`
          } else if (damage.hairIntegrity < 0.4) {
            message = `SNIP. ${firstName}'s hair is visibly ruined and staying that way.`
          }
        }
        if (justMelted) {
          message = `${firstName} melted down… then stayed for round two. Marks remain.`
        }

        return {
          ...s,
          meltdown,
          score,
          damage,
          lastPrankId: id,
          lastFx: prank.fx,
          hitNonce: s.hitNonce + 1,
          cooldowns: { ...s.cooldowns, [id]: prank.cooldownMs },
          message,
          justMelted,
        }
      })
    },
    [schedule, say],
  )

  const prevHit = useRef(0)
  useEffect(() => {
    if (state.hitNonce === prevHit.current) return
    prevHit.current = state.hitNonce
    if (state.screen !== 'playing' || !state.lastPrankId) return
    const prank = PRANKS.find((p) => p.id === state.lastPrankId)
    if (!prank) return
    if (state.justMelted) pushFloat('MELTDOWN!', 'warn')
    else if (prank.id === 'haircut') pushFloat('SNIP!', 'warn')
    else if (prank.id === 'slap') pushFloat('BRUISE!', 'bad')
    else if (prank.id === 'coffee-spill') pushFloat('STAIN!', 'bad')
    else pushFloat(`+${prank.meltdown}`, 'good')
  }, [
    state.hitNonce,
    state.lastPrankId,
    state.justMelted,
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
  }
}
