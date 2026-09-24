export type Screen = 'title' | 'customize' | 'playing'

export type VoicePackId =
  | 'off'
  | 'en-male'
  | 'en-female'
  | 'hi-male'
  | 'hi-female'

export type PrankId =
  | 'slap'
  | 'kick'
  | 'haircut'
  | 'rubber-chicken'
  | 'coffee-spill'
  | 'pie-face'
  | 'stapler-slam'
  | 'void-memo'

export type HitFx =
  | 'slap'
  | 'kick'
  | 'cut'
  | 'chicken'
  | 'spill'
  | 'pie'
  | 'slam'
  | 'void'

export type HairStyle = 'slick' | 'tuft' | 'balding' | 'mullet'
export type HairColor = 'charcoal' | 'salt' | 'ginger' | 'bleach'
export type SuitColor = 'navy' | 'charcoal' | 'olive' | 'burgundy'
export type FacialHair = 'none' | 'mustache' | 'goatee' | 'stubble'
export type Glasses = 'none' | 'round' | 'square' | 'shades'
export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'rich'

export interface BossLook {
  name: string
  skinTone: SkinTone
  hairStyle: HairStyle
  hairColor: HairColor
  suitColor: SuitColor
  facialHair: FacialHair
  glasses: Glasses
}

/** Lasting visual damage that accumulates during an unlimited session. */
export interface DamageMarks {
  /** Cheek/face slap bruises (0–6). */
  slapMarks: number
  /** Shin/torso kick welts (0–5). */
  kickMarks: number
  /** Coffee brown stains on suit + face (0–6). */
  coffeeStains: number
  /** Cream pie residue layers (0–4). */
  pieSplat: number
  /** Feather/ding marks from chicken (0–4). */
  chickenHits: number
  /** Forehead stapler dents (0–4). */
  staplerBumps: number
  /** Purple void crack intensity (0–3). */
  voidCrack: number
  /** 1 = full hair, 0 = cue-ball. */
  hairIntegrity: number
}

export interface Prank {
  id: PrankId
  name: string
  blurb: string
  emoji: string
  meltdown: number
  cooldownMs: number
  reaction: string
  fx: HitFx
  hairDamage?: number
}

export interface FloatingText {
  id: number
  text: string
  kind: 'good' | 'bad' | 'warn'
}

export interface GameState {
  screen: Screen
  boss: BossLook
  meltdown: number
  score: number
  lastPrankId: PrankId | null
  lastFx: HitFx | null
  hitNonce: number
  damage: DamageMarks
  floating: FloatingText[]
  cooldowns: Partial<Record<PrankId, number>>
  message: string
  /** Soft meltdown celebration flag — play continues. */
  justMelted: boolean
}

export const EMPTY_DAMAGE = (): DamageMarks => ({
  slapMarks: 0,
  kickMarks: 0,
  coffeeStains: 0,
  pieSplat: 0,
  chickenHits: 0,
  staplerBumps: 0,
  voidCrack: 0,
  hairIntegrity: 1,
})
