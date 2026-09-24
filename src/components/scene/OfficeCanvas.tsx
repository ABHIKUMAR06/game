import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import type { BossLook, DamageMarks, HitFx } from '../../game/types'
import { EMPTY_DAMAGE } from '../../game/types'
import { BossFigure } from './BossFigure'
import { OfficeSet } from './OfficeSet'
import { HitEffects } from './HitEffects'
import { SceneCamera } from './SceneCamera'

export interface OfficeCanvasProps {
  look: BossLook
  hitNonce: number
  lastFx: HitFx | null
  damage?: DamageMarks
  meltdown: number
  interactive?: boolean
  className?: string
}

export function OfficeCanvas({
  look,
  hitNonce,
  lastFx,
  damage = EMPTY_DAMAGE(),
  meltdown,
  interactive = false,
  className = '',
}: OfficeCanvasProps) {
  const dread = Math.min(1, meltdown / 100)

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.35, 3.4], fov: 42, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a1210')
        }}
      >
        <color attach="background" args={['#0a1210']} />
        <fog attach="fog" args={['#0a1210', 6, 16]} />

        <ambientLight intensity={0.35 + dread * 0.12} />
        <directionalLight
          castShadow
          position={[3.5, 6, 2]}
          intensity={1.4}
          shadow-mapSize={[1024, 1024]}
          color="#fff4e0"
        />
        <pointLight
          position={[0, 2.8, 0.2]}
          intensity={1.25 + dread * 1.5}
          color={dread > 0.55 ? '#ff6b4a' : '#c8f06a'}
          distance={8}
        />
        <spotLight
          position={[-2, 4, 3]}
          angle={0.5}
          penumbra={0.6}
          intensity={0.6}
          color="#7dd3a7"
        />

        <Suspense fallback={null}>
          <hemisphereLight args={['#c8e0d4', '#1a2a22', 0.55]} />
          <OfficeSet dread={dread} />
          <BossFigure
            look={look}
            hitNonce={hitNonce}
            lastFx={lastFx}
            damage={damage}
          />
          <HitEffects hitNonce={hitNonce} fx={lastFx} />
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.55}
            scale={8}
            blur={2.4}
            far={4}
          />
          <SceneCamera
            hitNonce={hitNonce}
            scanning={false}
            interactive={interactive}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
