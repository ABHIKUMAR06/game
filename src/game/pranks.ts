import type { Prank } from './types'

export const PRANKS: Prank[] = [
  {
    id: 'rubber-chicken',
    name: 'Rubber Chicken',
    blurb: 'A classic. Squawk optional.',
    emoji: '🐔',
    meltdown: 14,
    suspicion: 6,
    cooldownMs: 900,
    reaction: 'BWOK— the chicken makes contact. Dignity leaves the building.',
  },
  {
    id: 'coffee-spill',
    name: 'Coffee Spill',
    blurb: 'Accidentally on purpose.',
    emoji: '☕',
    meltdown: 18,
    suspicion: 10,
    cooldownMs: 1400,
    reaction: 'Hot sludge baptizes the quarterly report.',
  },
  {
    id: 'whoopee',
    name: 'Whoopee Cushion',
    blurb: 'Strategic seating.',
    emoji: '💨',
    meltdown: 12,
    suspicion: 4,
    cooldownMs: 1100,
    reaction: 'A brass-band flatulence. The open office hears everything.',
  },
  {
    id: 'stapler',
    name: 'Stapler Swap',
    blurb: 'Glue the jaws shut.',
    emoji: '📎',
    meltdown: 16,
    suspicion: 8,
    cooldownMs: 1300,
    reaction: 'He squeezes. Nothing. He squeezes harder. Existential stapling.',
  },
  {
    id: 'fake-memo',
    name: 'Fake Memo',
    blurb: 'Subject: You are “fired.”',
    emoji: '📄',
    meltdown: 22,
    suspicion: 14,
    cooldownMs: 1800,
    reaction: 'He reads it twice. Then checks LinkedIn in panic.',
  },
  {
    id: 'desk-trap',
    name: 'Desk Trap',
    blurb: 'Drawer spring + glitter.',
    emoji: '🪤',
    meltdown: 20,
    suspicion: 12,
    cooldownMs: 1600,
    reaction: 'Drawer detonates. Glitter snow. Spreadsheet ruined. Perfect.',
  },
]

export const MELTDOWN_GOAL = 100
export const SUSPICION_LIMIT = 100
export const ROUND_SECONDS = 60
export const SCAN_INTERVAL_MS = 6500
export const SCAN_DURATION_MS = 1800
export const SCAN_SUSPICION_MULT = 2.4
