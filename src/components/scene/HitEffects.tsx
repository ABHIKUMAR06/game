import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { HitFx } from '../../game/types'

interface HitEffectsProps {
  hitNonce: number
  fx: HitFx | null
}

export function HitEffects({ hitNonce, fx }: HitEffectsProps) {
  const group = useRef<THREE.Group>(null)
  const started = useRef(0)
  const last = useRef(0)

  useFrame(({ clock }) => {
    if (!group.current) return
    if (hitNonce !== last.current) {
      last.current = hitNonce
      started.current = clock.elapsedTime
      group.current.visible = true
    }
    const age = clock.elapsedTime - started.current
    if (hitNonce === 0 || age > 0.7) {
      group.current.visible = false
      return
    }
    const k = 1 - age / 0.7
    group.current.scale.setScalar(0.6 + (1 - k) * 1.4)
    group.current.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.material && 'opacity' in mesh.material) {
        ;(mesh.material as THREE.MeshStandardMaterial).opacity = k
      }
    })
  })

  if (!fx) return null

  return (
    <group ref={group} position={[0, 1.5, 0.55]} visible={false}>
      {fx === 'slap' && (
        <mesh>
          <circleGeometry args={[0.35, 20]} />
          <meshStandardMaterial
            color="#f0c75e"
            transparent
            opacity={0.9}
            emissive="#f0c75e"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
      {fx === 'kick' && (
        <mesh position={[0.4, -0.6, 0.2]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.35, 0.18, 0.25]} />
          <meshStandardMaterial color="#e85d4c" emissive="#e85d4c" emissiveIntensity={0.5} />
        </mesh>
      )}
      {fx === 'cut' && (
        <>
          <mesh position={[-0.2, 0.35, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.45, 0.06, 0.02]} />
            <meshStandardMaterial color="#d0d5d2" metalness={0.8} roughness={0.2} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[(i - 1) * 0.12, 0.15 - i * 0.05, 0.1]}>
              <boxGeometry args={[0.05, 0.12, 0.02]} />
              <meshStandardMaterial color="#2b2b2b" />
            </mesh>
          ))}
        </>
      )}
      {fx === 'chicken' && (
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#f0c75e" />
        </mesh>
      )}
      {fx === 'spill' && (
        <mesh position={[0, -0.2, 0.2]} rotation={[-0.8, 0, 0]}>
          <circleGeometry args={[0.4, 20]} />
          <meshStandardMaterial
            color="#6b3a1e"
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
      {fx === 'pie' && (
        <mesh>
          <sphereGeometry args={[0.28, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#f5f0e6" />
        </mesh>
      )}
      {fx === 'slam' && (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.25, 0.2]} />
          <meshStandardMaterial color="#888" metalness={0.7} roughness={0.25} />
        </mesh>
      )}
      {fx === 'void' && (
        <mesh>
          <ringGeometry args={[0.15, 0.4, 24]} />
          <meshStandardMaterial
            color="#9b5cff"
            emissive="#5a20aa"
            emissiveIntensity={1.2}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </group>
  )
}
