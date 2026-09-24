export type Screen = 'title' | 'customize' | 'playing' | 'won' | 'lost'

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

export interface Prank {
  id: PrankId
  name: string
  blurb: string
  emoji: string
  meltdown: number
  suspicion: number
  cooldownMs: number
  reaction: string
  fx: HitFx
  /** How much cartoon hair integrity this removes (0–1). */
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
  suspicion: number
  score: number
  secondsLeft: number
  scanning: boolean
  lastPrankId: PrankId | null
  lastFx: HitFx | null
  hitNonce: number
  /** 1 = full coiffure, 0 = cartoon bald patch. */
  hairIntegrity: number
  floating: FloatingText[]
  cooldowns: Partial<Record<PrankId, number>>
  message: string
}
