import type { VoicePackId } from './types'

export type { VoicePackId }

export interface VoicePack {
  id: VoicePackId
  label: string
  lang: string
  preferFemale: boolean | null
  pitch: number
  rate: number
  volume: number
}

/** Tuned for more natural delivery — avoid cartoon chipmunk / robot defaults. */
export const VOICE_PACKS: VoicePack[] = [
  { id: 'off', label: 'Mute', lang: '', preferFemale: null, pitch: 1, rate: 1, volume: 0 },
  {
    id: 'en-male',
    label: 'English · Men',
    lang: 'en',
    preferFemale: false,
    pitch: 0.92,
    rate: 0.98,
    volume: 1,
  },
  {
    id: 'en-female',
    label: 'English · Women',
    lang: 'en',
    preferFemale: true,
    pitch: 1.02,
    rate: 0.98,
    volume: 1,
  },
  {
    id: 'hi-male',
    label: 'Hindi · Men',
    lang: 'hi',
    preferFemale: false,
    pitch: 0.94,
    rate: 0.95,
    volume: 1,
  },
  {
    id: 'hi-female',
    label: 'Hindi · Women',
    lang: 'hi',
    preferFemale: true,
    pitch: 1.04,
    rate: 0.95,
    volume: 1,
  },
]

/** Prefer neural / natural engines; demote compact / novelty voices. */
const PREMIUM =
  /google|microsoft|natural|neural|enhanced|premium|online|wavenet|studio|aria|jenny|guy|ryan|sonia|neerja|swara|ravi|heera|google हिन्दी|google हिंदी/i
const FEMALE =
  /female|woman|zira|samantha|karen|moira|veena|neerja|aria|jenny|sonia|swara|heera|susan|hazel|martha/i
const MALE =
  /male|man|david|mark|daniel|ravi|ryan|guy|george|thomas|james|fred|alex(?!a)/i
const BAD =
  /compact|eloquence|novelty|whisper|robot|dummy|eddy|shadow|santa|organ|zarvox|trinoids|bad news|good news|pipes|boing|cellos/i

function scoreVoice(voice: SpeechSynthesisVoice, pack: VoicePack): number {
  if (pack.id === 'off') return -Infinity
  const lang = voice.lang.toLowerCase()
  const name = `${voice.name} ${voice.lang}`

  let score = 0
  if (pack.lang === 'hi') {
    if (lang.startsWith('hi')) score += 50
    else if (lang.includes('-in') && lang.startsWith('en')) score += 8
    else return -Infinity
  } else {
    if (!lang.startsWith('en')) return -Infinity
    if (/en-us|en_us/.test(lang)) score += 12
    else if (/en-gb|en_gb|en-au|en-in/.test(lang)) score += 10
    else score += 6
  }

  if (BAD.test(name)) score -= 80
  if (PREMIUM.test(name)) score += 35
  if (voice.localService) score += 4
  else score += 18 // cloud/neural often remote

  if (pack.preferFemale === true) {
    if (FEMALE.test(name)) score += 30
    if (MALE.test(name)) score -= 40
  } else if (pack.preferFemale === false) {
    if (MALE.test(name)) score += 30
    if (FEMALE.test(name)) score -= 40
  }

  return score
}

function pickVoice(pack: VoicePack): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  if (pack.id === 'off') return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  let best: SpeechSynthesisVoice | null = null
  let bestScore = -Infinity
  for (const v of voices) {
    const s = scoreVoice(v, pack)
    if (s > bestScore) {
      bestScore = s
      best = v
    }
  }
  return bestScore > -Infinity ? best : null
}

/** Short, punchy reaction lines — land harder than long sentences. */
const LINES_EN: Record<string, string[]> = {
  slap: ['Ow— my face!', 'That slap stays!', 'Handprint! Forever!'],
  kick: ['My shin!', 'You kicked me!', 'That bruise is real!'],
  haircut: ['My hair!', 'You cut it!', 'I look ruined!'],
  'rubber-chicken': ['Not the chicken!', 'Bwok— stop!', 'Poultry assault!'],
  'coffee-spill': ['My suit!', 'Coffee stain!', 'It will not wash out!'],
  'pie-face': ['Cream— everywhere!', 'I cannot see!', 'Pie trauma!'],
  'stapler-slam': ['Stapled!', 'My forehead!', 'Ka-chunk— no!'],
  'void-memo': ['I never existed?!', 'This memo burns!', 'Void— no!'],
  melt: ['I am melting!', 'Supply closet— now!'],
  default: ['Stop!', 'Office nightmare!'],
}

const LINES_HI: Record<string, string[]> = {
  slap: ['आह! मेरा चेहरा!', 'थप्पड़ का निशान!', 'ये नहीं मिटेगा!'],
  kick: ['मेरी पिंडली!', 'लात लगी!', 'चोट रह जाएगी!'],
  haircut: ['मेरे बाल!', 'काट दिए!', 'लूक खराब!'],
  'rubber-chicken': ['फिर चिकन!', 'बोक बंद करो!', 'मुर्गी मत मारो!'],
  'coffee-spill': ['मेरा सूट!', 'कॉफी का दाग!', 'नहीं छूटेगा!'],
  'pie-face': ['क्रीम! सब जगह!', 'दिखाई नहीं दे रहा!', 'पाई का डर!'],
  'stapler-slam': ['स्टेपलर!', 'माथा!', 'का-चंक! नहीं!'],
  'void-memo': ['मैं हूँ ही नहीं?!', 'मेमो जलता है!', 'शून्य! नहीं!'],
  melt: ['मैं पिघल रहा हूँ!', 'स्टोर रूम! अभी!'],
  default: ['रुक जाओ!', 'दफ्तर का सपना!'],
}

function pickLine(pack: VoicePack, key: string): string {
  const bank = pack.lang === 'hi' ? LINES_HI : LINES_EN
  const lines = bank[key] ?? bank.default
  return lines[Math.floor(Math.random() * lines.length)]!
}

let warmed = false
let audioCtx: AudioContext | null = null

export function warmVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.getVoices()
  if (!warmed) {
    warmed = true
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    }
  }
}

function ensureAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return null
  if (!audioCtx) audioCtx = new AC()
  if (audioCtx.state === 'suspended') void audioCtx.resume()
  return audioCtx
}

/** Juicy procedural hit thud under the spoken line. */
export function playImpactSfx(kind: string): void {
  const ctx = ensureAudio()
  if (!ctx) return
  const t0 = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = kind === 'cut' ? 2400 : kind === 'slap' ? 900 : 500
  osc.type = kind === 'cut' ? 'triangle' : 'sine'
  osc.frequency.setValueAtTime(kind === 'kick' ? 90 : 140, t0)
  osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.18)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.45, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + 0.3)

  // noise slap layer
  const bufferSize = ctx.sampleRate * 0.12
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2)
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const nGain = ctx.createGain()
  nGain.gain.value = kind === 'spill' || kind === 'pie' ? 0.2 : 0.32
  noise.connect(nGain)
  nGain.connect(ctx.destination)
  noise.start(t0)
}

export function speakReaction(packId: VoicePackId, key: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const pack = VOICE_PACKS.find((p) => p.id === packId)
  if (!pack || pack.id === 'off') return

  warmVoices()
  playImpactSfx(key)

  const voice = pickVoice(pack)
  const text = pickLine(pack, key)

  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  if (voice) utter.voice = voice
  utter.lang =
    voice?.lang ?? (pack.lang === 'hi' ? 'hi-IN' : 'en-US')
  utter.pitch = pack.pitch
  utter.rate = pack.rate
  utter.volume = pack.volume

  // Tiny delay so impact SFX leads the line (feels more natural)
  window.setTimeout(() => {
    window.speechSynthesis.speak(utter)
  }, 60)
}

export function previewVoice(packId: VoicePackId): void {
  speakReaction(packId, 'slap')
}
