import type { VoicePackId } from './types'

export type { VoicePackId }

export interface VoicePack {
  id: VoicePackId
  label: string
  shortLabel: string
  lang: string
  preferFemale: boolean | null
  pitch: number
  rate: number
  volume: number
  /** Bundled neural preview / reaction samples under /voice-samples */
  sampleDir: string | null
  blurb: string
}

export const VOICE_PACKS: VoicePack[] = [
  {
    id: 'off',
    label: 'Mute',
    shortLabel: 'Mute',
    lang: '',
    preferFemale: null,
    pitch: 1,
    rate: 1,
    volume: 0,
    sampleDir: null,
    blurb: 'No reaction audio',
  },
  {
    id: 'en-male',
    label: 'English · Men',
    shortLabel: 'EN Man',
    lang: 'en',
    preferFemale: false,
    pitch: 0.92,
    rate: 0.98,
    volume: 1,
    sampleDir: 'en-male',
    blurb: 'Neural English male — punchy office pain',
  },
  {
    id: 'en-female',
    label: 'English · Women',
    shortLabel: 'EN Woman',
    lang: 'en',
    preferFemale: true,
    pitch: 1.02,
    rate: 0.98,
    volume: 1,
    sampleDir: 'en-female',
    blurb: 'Neural English female — sharp reactions',
  },
  {
    id: 'hi-male',
    label: 'Hindi · Men',
    shortLabel: 'HI Man',
    lang: 'hi',
    preferFemale: false,
    pitch: 0.94,
    rate: 0.95,
    volume: 1,
    sampleDir: 'hi-male',
    blurb: 'Neural Hindi male — clear cubicle chaos',
  },
  {
    id: 'hi-female',
    label: 'Hindi · Women',
    shortLabel: 'HI Woman',
    lang: 'hi',
    preferFemale: true,
    pitch: 1.04,
    rate: 0.95,
    volume: 1,
    sampleDir: 'hi-female',
    blurb: 'Neural Hindi female — natural delivery',
  },
]

const PREMIUM =
  /google|microsoft|natural|neural|enhanced|premium|online|wavenet|studio|aria|jenny|guy|ryan|sonia|neerja|swara|ravi|heera|google हिन्दी|google हिंदी/i
const FEMALE =
  /female|woman|zira|samantha|karen|moira|veena|neerja|aria|jenny|sonia|swara|heera|susan|hazel|martha/i
const MALE =
  /male|man|david|mark|daniel|ravi|ryan|guy|george|thomas|james|fred|alex(?!a)/i
const BAD =
  /compact|eloquence|novelty|whisper|robot|dummy|eddy|shadow|santa|organ|zarvox|trinoids|bad news|good news|pipes|boing|cellos/i

const LINES_EN: Record<string, string[]> = {
  slap: ['Ow— my face! That slap stays!'],
  kick: ['My shin! You kicked me!'],
  haircut: ['My hair! You cut it!'],
  'rubber-chicken': ['Not the chicken! Stop!'],
  'coffee-spill': ['My suit! Coffee stain!'],
  'pie-face': ['Cream— everywhere!'],
  'stapler-slam': ['Stapled! My forehead!'],
  'void-memo': ['I never existed?!'],
  melt: ['I am melting! Supply closet— now!'],
  preview: ['Ow— my face! That slap stays!'],
  default: ['Stop! Office nightmare!'],
}

const LINES_HI: Record<string, string[]> = {
  slap: ['आह! मेरा चेहरा! ये निशान नहीं मिटेगा!'],
  kick: ['मेरी पिंडली! चोट रह जाएगी!'],
  haircut: ['मेरे बाल! काट दिए!'],
  'rubber-chicken': ['फिर चिकन! बंद करो!'],
  'coffee-spill': ['मेरा सूट! कॉफी का दाग!'],
  'pie-face': ['क्रीम! सब जगह!'],
  'stapler-slam': ['स्टेपलर! मेरा माथा!'],
  'void-memo': ['मैं हूँ ही नहीं?!'],
  melt: ['मैं पिघल रहा हूँ! स्टोर रूम!'],
  preview: ['आह! मेरा चेहरा! ये निशान नहीं मिटेगा!'],
  default: ['रुक जाओ! दफ्तर का सपना!'],
}

let warmed = false
let audioCtx: AudioContext | null = null
let currentAudio: HTMLAudioElement | null = null

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
  else score += 18
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

function pickLine(pack: VoicePack, key: string): string {
  const bank = pack.lang === 'hi' ? LINES_HI : LINES_EN
  const lines = bank[key] ?? bank.default
  return lines[Math.floor(Math.random() * lines.length)]!
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

export function playImpactSfx(kind: string): void {
  const ctx = ensureAudio()
  if (!ctx) return
  const t0 = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = kind === 'cut' || kind === 'haircut' ? 2400 : kind === 'slap' ? 900 : 500
  osc.type = kind === 'cut' || kind === 'haircut' ? 'triangle' : 'sine'
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

  const bufferSize = ctx.sampleRate * 0.12
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2)
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const nGain = ctx.createGain()
  nGain.gain.value = kind === 'coffee-spill' || kind === 'pie-face' ? 0.2 : 0.32
  noise.connect(nGain)
  nGain.connect(ctx.destination)
  noise.start(t0)
}

function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ''
    currentAudio = null
  }
}

function sampleUrl(pack: VoicePack, key: string): string | null {
  if (!pack.sampleDir) return null
  return `/voice-samples/${pack.sampleDir}/${key}.mp3`
}

function playSample(
  url: string,
  onFail: () => void,
): void {
  stopSpeech()
  const audio = new Audio(url)
  currentAudio = audio
  audio.volume = 1
  audio.play().catch(() => {
    onFail()
  })
}

function speakTts(pack: VoicePack, key: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  warmVoices()
  const voice = pickVoice(pack)
  const text = pickLine(pack, key)
  const utter = new SpeechSynthesisUtterance(text)
  if (voice) utter.voice = voice
  utter.lang = voice?.lang ?? (pack.lang === 'hi' ? 'hi-IN' : 'en-US')
  utter.pitch = pack.pitch
  utter.rate = pack.rate
  utter.volume = pack.volume
  window.speechSynthesis.speak(utter)
}

/** Prefer bundled neural MP3; fall back to curated browser TTS. */
export function speakReaction(packId: VoicePackId, key: string): void {
  const pack = VOICE_PACKS.find((p) => p.id === packId)
  if (!pack || pack.id === 'off') return

  playImpactSfx(key)

  const url = sampleUrl(pack, key) ?? sampleUrl(pack, 'preview')
  if (url) {
    playSample(url, () => speakTts(pack, key))
    return
  }
  window.setTimeout(() => speakTts(pack, key), 60)
}

export function previewVoice(packId: VoicePackId): void {
  const pack = VOICE_PACKS.find((p) => p.id === packId)
  if (!pack || pack.id === 'off') {
    stopSpeech()
    return
  }
  // Flat preview file for fast UI listen
  const flat = `/voice-samples/${pack.sampleDir}-preview.mp3`
  playImpactSfx('slap')
  playSample(flat, () => {
    const nested = sampleUrl(pack, 'preview')
    if (nested) playSample(nested, () => speakTts(pack, 'preview'))
    else speakTts(pack, 'preview')
  })
}

export function stopVoicePreview(): void {
  stopSpeech()
}
