import type { VoicePackId } from './types'

export type { VoicePackId }

export interface VoicePack {
  id: VoicePackId
  label: string
  lang: string
  preferFemale: boolean | null
  pitch: number
  rate: number
}

export const VOICE_PACKS: VoicePack[] = [
  { id: 'off', label: 'Mute', lang: '', preferFemale: null, pitch: 1, rate: 1 },
  {
    id: 'en-male',
    label: 'English · Men',
    lang: 'en',
    preferFemale: false,
    pitch: 0.85,
    rate: 1.05,
  },
  {
    id: 'en-female',
    label: 'English · Women',
    lang: 'en',
    preferFemale: true,
    pitch: 1.15,
    rate: 1.05,
  },
  {
    id: 'hi-male',
    label: 'Hindi · Men',
    lang: 'hi',
    preferFemale: false,
    pitch: 0.9,
    rate: 1.0,
  },
  {
    id: 'hi-female',
    label: 'Hindi · Women',
    lang: 'hi',
    preferFemale: true,
    pitch: 1.12,
    rate: 1.0,
  },
]

const FEMALE_HINTS = /female|woman|zira|samantha|karen|moira|veena|neerja|google हिन्दी|google हिंदी/i
const MALE_HINTS = /male|man|david|mark|daniel|ravi|google uk english male|microsoft david|microsoft mark/i

function scoreVoice(
  voice: SpeechSynthesisVoice,
  pack: VoicePack,
): number {
  if (pack.id === 'off') return -1
  let score = 0
  const lang = voice.lang.toLowerCase()
  if (pack.lang === 'hi') {
    if (lang.startsWith('hi')) score += 40
    else if (/india|in\b/.test(lang) && lang.startsWith('en')) score += 5
    else return -1
  } else if (pack.lang === 'en') {
    if (lang.startsWith('en')) score += 30
    else return -1
  }

  const name = `${voice.name} ${voice.lang}`
  if (pack.preferFemale === true) {
    if (FEMALE_HINTS.test(name)) score += 25
    if (MALE_HINTS.test(name)) score -= 15
  } else if (pack.preferFemale === false) {
    if (MALE_HINTS.test(name)) score += 25
    if (FEMALE_HINTS.test(name)) score -= 15
  }

  if (voice.localService) score += 5
  if (voice.default) score += 2
  return score
}

function pickVoice(pack: VoicePack): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  if (pack.id === 'off') return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  let best: SpeechSynthesisVoice | null = null
  let bestScore = -1
  for (const v of voices) {
    const s = scoreVoice(v, pack)
    if (s > bestScore) {
      bestScore = s
      best = v
    }
  }
  return bestScore > 0 ? best : null
}

/** Line bank keyed by prank id + fallbacks. */
const LINES_EN: Record<string, string[]> = {
  slap: [
    'Ow! That performance review stung!',
    'Did you just slap a director?',
    'Stars! I see stars and unpaid overtime!',
  ],
  kick: [
    'My shin! HR will hear about this!',
    'You kicked the hierarchy!',
    'Cubicle combat is not in the handbook!',
  ],
  haircut: [
    'My hair! My brand!',
    'That was a two hundred dollar fade!',
    'I look like a spreadsheet now!',
  ],
  'rubber-chicken': [
    'Not the chicken again!',
    'Poultry violence!',
    'Bwok this, bwok that!',
  ],
  'coffee-spill': [
    'My quarterly report!',
    'That was artisanal sludge!',
    'Hot! Hot! Hot!',
  ],
  'pie-face': [
    'Cream! Everywhere!',
    'I cannot see Q4!',
    'This pie is hostile!',
  ],
  'stapler-slam': [
    'Stapled! Emotionally!',
    'Giant stapler trauma!',
    'I am a document now!',
  ],
  'void-memo': [
    'I never existed?!',
    'This memo eats souls!',
    'LinkedIn is screaming!',
  ],
  caught: [
    'I saw that! Security!',
    'HR! Right now!',
    'You are so fired!',
  ],
  win: [
    'I quit! Supply closet forever!',
    'The meltdown is complete!',
  ],
  lose: [
    'HR has entered the chat.',
    'Workplace levity guidelines. Forever.',
  ],
  scan: [
    'I am watching you.',
    'Freeze. I see everything.',
  ],
  default: ['Office chaos!', 'What was that?!'],
}

const LINES_HI: Record<string, string[]> = {
  slap: [
    'अरे! ये थप्पड़ क्यों?',
    'मेरा चेहरा! मेरे अधिकार!',
    'ये परफॉर्मेंस रिव्यू नहीं था!',
  ],
  kick: [
    'मेरी पिंडली! ओuch!',
    'क्यूबिकल में लात?',
    'हेयर आर सुनेंगे!',
  ],
  haircut: [
    'मेरे बाल! मेरा स्टाइल!',
    'कैंची कहाँ से आई?',
    'अब मैं गंजा डायरेक्टर हूँ!',
  ],
  'rubber-chicken': [
    'फिर से चिकन?',
    'मुर्गी का आतंक!',
    'बोक बोक बंद करो!',
  ],
  'coffee-spill': [
    'मेरी रिपोर्ट भीग गई!',
    'गर्म कॉफी! हाय राम!',
    'स्प्रेडशीट खत्म!',
  ],
  'pie-face': [
    'पाइ! हर जगह!',
    'मैं कुछ नहीं देख पा रहा!',
    'ये पाई दुश्मन है!',
  ],
  'stapler-slam': [
    'स्टेपलर! बहुत बड़ा!',
    'माथा चिपक गया!',
    'मैं दस्तावेज़ बन गया!',
  ],
  'void-memo': [
    'मैं मौजूद ही नहीं?',
    'ये मेमो डरावना है!',
    'लिंक्डइन रो रहा है!',
  ],
  caught: [
    'मैंने देख लिया! सिक्योरिटी!',
    'एच आर अभी बुलाओ!',
    'तुम बर्खास्त हो!',
  ],
  win: [
    'मैं जाता हूँ! स्टोर रूम!',
    'मेल्टडाउन पूरा!',
  ],
  lose: [
    'एच आर आ गया।',
    'अब नियम की किताब हमेशा।',
  ],
  scan: [
    'मैं देख रहा हूँ।',
    'रुक जाओ। सब दिख रहा है।',
  ],
  default: ['दफ्तर में तबाही!', 'ये क्या था?!'],
}

function pickLine(pack: VoicePack, key: string): string {
  const bank = pack.lang === 'hi' ? LINES_HI : LINES_EN
  const lines = bank[key] ?? bank.default
  return lines[Math.floor(Math.random() * lines.length)]!
}

let warmed = false

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

export function speakReaction(
  packId: VoicePackId,
  key: string,
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const pack = VOICE_PACKS.find((p) => p.id === packId)
  if (!pack || pack.id === 'off') return

  warmVoices()
  const voice = pickVoice(pack)
  const text = pickLine(pack, key)

  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  if (voice) utter.voice = voice
  utter.lang = voice?.lang ?? (pack.lang === 'hi' ? 'hi-IN' : 'en-US')
  utter.pitch = pack.pitch
  utter.rate = pack.rate
  utter.volume = 1
  window.speechSynthesis.speak(utter)
}
