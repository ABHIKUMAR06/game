import type {
  BossLook,
  FacialHair,
  Glasses,
  HairColor,
  HairStyle,
  SkinTone,
  SuitColor,
} from './types'

export const DEFAULT_BOSS: BossLook = {
  name: 'Gary from Finance',
  skinTone: 'light',
  hairStyle: 'slick',
  hairColor: 'charcoal',
  suitColor: 'navy',
  facialHair: 'none',
  glasses: 'none',
}

/** Cartoon skin tones — neutral labels, warm undertones, no stereotypes. */
export const SKIN_TONES: {
  id: SkinTone
  label: string
  hex: string
  shade: string
}[] = [
  { id: 'fair', label: 'Fair', hex: '#f7d7c4', shade: '#e8bba3' },
  { id: 'light', label: 'Light', hex: '#f0c9a0', shade: '#e0b088' },
  { id: 'medium', label: 'Medium', hex: '#d4a574', shade: '#c08f5c' },
  { id: 'tan', label: 'Tan', hex: '#b07d4f', shade: '#96683e' },
  { id: 'deep', label: 'Deep', hex: '#8a5a3a', shade: '#6f462c' },
  { id: 'rich', label: 'Rich', hex: '#5c3a28', shade: '#472c1e' },
]

export const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'slick', label: 'Slick' },
  { id: 'tuft', label: 'Tuft' },
  { id: 'balding', label: 'Balding' },
  { id: 'mullet', label: 'Mullet' },
]

export const HAIR_COLORS: { id: HairColor; label: string; hex: string }[] = [
  { id: 'charcoal', label: 'Charcoal', hex: '#2b2b2b' },
  { id: 'salt', label: 'Salt & pepper', hex: '#9aa0a6' },
  { id: 'ginger', label: 'Ginger', hex: '#c46a2b' },
  { id: 'bleach', label: 'Boardroom bleach', hex: '#e8d9a8' },
]

export const SUIT_COLORS: { id: SuitColor; label: string; hex: string }[] = [
  { id: 'navy', label: 'Navy', hex: '#243b6b' },
  { id: 'charcoal', label: 'Charcoal', hex: '#3a3f46' },
  { id: 'olive', label: 'Olive', hex: '#4a5c3a' },
  { id: 'burgundy', label: 'Burgundy', hex: '#6b2a3a' },
]

export const FACIAL_HAIR: { id: FacialHair; label: string }[] = [
  { id: 'none', label: 'Clean' },
  { id: 'mustache', label: 'Mustache' },
  { id: 'goatee', label: 'Goatee' },
  { id: 'stubble', label: 'Stubble' },
]

export const GLASSES: { id: Glasses; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'round', label: 'Round' },
  { id: 'square', label: 'Square' },
  { id: 'shades', label: 'Shades' },
]

export function hairHex(color: HairColor): string {
  return HAIR_COLORS.find((c) => c.id === color)?.hex ?? '#2b2b2b'
}

export function suitHex(color: SuitColor): string {
  return SUIT_COLORS.find((c) => c.id === color)?.hex ?? '#243b6b'
}

export function skinHex(tone: SkinTone): string {
  return SKIN_TONES.find((t) => t.id === tone)?.hex ?? '#f0c9a0'
}

export function skinShade(tone: SkinTone): string {
  return SKIN_TONES.find((t) => t.id === tone)?.shade ?? '#e0b088'
}

export function sanitizeBossName(raw: string): string {
  const trimmed = raw.replace(/\s+/g, ' ').trim().slice(0, 28)
  return trimmed.length > 0 ? trimmed : DEFAULT_BOSS.name
}
