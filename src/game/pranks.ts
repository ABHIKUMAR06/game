import type { Prank } from './types'

export const PRANKS: Prank[] = [
  {
    id: 'slap',
    name: 'Office Slap',
    blurb: 'Open-palm performance review.',
    emoji: '👋',
    meltdown: 16,
    suspicion: 8,
    cooldownMs: 900,
    fx: 'slap',
    reaction:
      'SLAP! Cartoon stars orbit their skull. Dignity files a complaint.',
  },
  {
    id: 'kick',
    name: 'Cubicle Kick',
    blurb: 'Strategic shin diplomacy.',
    emoji: '👟',
    meltdown: 18,
    suspicion: 10,
    cooldownMs: 1100,
    fx: 'kick',
    reaction:
      'A sneaker of justice. They hop like a cursed TPS form.',
  },
  {
    id: 'haircut',
    name: 'Guerrilla Haircut',
    blurb: 'Scissors + zero consent + maximum comedy.',
    emoji: '✂️',
    meltdown: 20,
    suspicion: 12,
    cooldownMs: 1400,
    fx: 'cut',
    hairDamage: 0.34,
    reaction:
      'SNIP. A tuft floats away like a doomed stock option.',
  },
  {
    id: 'rubber-chicken',
    name: 'Rubber Chicken',
    blurb: 'Weaponized poultry.',
    emoji: '🐔',
    meltdown: 14,
    suspicion: 5,
    cooldownMs: 850,
    fx: 'chicken',
    reaction: 'BWOK— dignity leaves the building screaming.',
  },
  {
    id: 'coffee-spill',
    name: 'Coffee Flood',
    blurb: 'Scalding “oops.”',
    emoji: '☕',
    meltdown: 17,
    suspicion: 9,
    cooldownMs: 1200,
    fx: 'spill',
    reaction: 'Latte tsunami. Spreadsheet becomes abstract art.',
  },
  {
    id: 'pie-face',
    name: 'Pie of Doom',
    blurb: 'Cream. Chaos. Close-up.',
    emoji: '🥧',
    meltdown: 22,
    suspicion: 11,
    cooldownMs: 1500,
    fx: 'pie',
    reaction:
      'Cream eclipse. They wipe… and wipe… the horror never ends.',
  },
  {
    id: 'stapler-slam',
    name: 'Stapler Slam',
    blurb: 'Giant cartoon stapler. Pure nightmare fuel.',
    emoji: '📎',
    meltdown: 24,
    suspicion: 14,
    cooldownMs: 1700,
    fx: 'slam',
    reaction:
      'KA-CHUNK. Temporary staples of shame across the forehead.',
  },
  {
    id: 'void-memo',
    name: 'Void Memo',
    blurb: 'Subject: You never existed.',
    emoji: '📜',
    meltdown: 26,
    suspicion: 16,
    cooldownMs: 1900,
    fx: 'void',
    reaction:
      'They read it. The fluorescent lights flicker. LinkedIn weeps.',
  },
]

export const MELTDOWN_GOAL = 100
export const SUSPICION_LIMIT = 100
export const ROUND_SECONDS = 75
export const SCAN_INTERVAL_MS = 6200
export const SCAN_DURATION_MS = 1700
export const SCAN_SUSPICION_MULT = 2.35
