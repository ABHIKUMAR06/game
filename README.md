# Cubicle Justice

3D satirical office comedy web game. Design a cartoon boss, then slap, kick, snip their hair, and deploy cubicle nightmares until they melt down — with English or Hindi reaction voice packs.

Silly cartoon slapstick. Not graphic violence.

## Play locally

```bash
npm install
npm run dev
```

Opens on **http://127.0.0.1:4731**.

## How to play

1. Design your boss in the live **3D** customizer (name, skin, hair, suit, glasses).
2. Pick a **voice pack**: English men/women, Hindi men/women, or mute.
3. Use the chaos toolkit (slap, kick, haircut, chicken, coffee, pie, stapler slam, void memo).
4. Fill **Meltdown** before **HR Suspicion** hits 100 or the clock runs out.
5. Freeze when they **scan** — getting caught spikes suspicion.
6. Guerrilla haircuts permanently shrink their 3D coiffure.

## Stack

Vite + React + TypeScript + Tailwind + Three.js (`@react-three/fiber`, `@react-three/drei`). Voices use the browser Speech Synthesis API (quality depends on voices installed on the device).
