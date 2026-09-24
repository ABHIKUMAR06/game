export type Screen = 'title' | 'customize' | 'playing' | 'won' | 'lost'

export type PrankId =
  | 'rubber-chicken'
  | 'coffee-spill'
  | 'whoopee'
  | 'stapler'
  | 'fake-memo'
  | 'desk-trap'

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
  hitNonce: number
  splash: string | null
  floating: FloatingText[]
  cooldowns: Partial<Record<PrankId, number>>
  message: string
}
