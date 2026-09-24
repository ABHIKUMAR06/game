import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { HitFx } from '../../game/types'

interface HitEffectsProps {
  hitNonce: number
  fx: HitFx | null
}

export function HitEffects({ hitNonce, fx }: HitEffectsProps) {
  const group = useRef<THREE.Group>(null)
  const flash = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const started = useRef(0)
  const last = useRef(0)

  const particles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      dir: new THREE.Vector3(
        Math.sin((i / 14) * Math.PI * 2),
        Math.cos((i / 14) * Math.PI * 2) * 0.8 + 0.3,
        Math.cos((i / 7) * Math.PI),
      ).normalize(),
      speed: 1.2 + (i % 5) * 0.25,
      size: 0.04 + (i % 3) * 0.02,
    }))
  }, [])

  const particleRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    if (!group.current) return
    if (hitNonce !== last.current) {
      last.current = hitNonce
      started.current = clock.elapsedTime
      group.current.visible = true
    }
    const age = clock.elapsedTime - started.current
    if (hitNonce === 0 || age > 0.85) {
      group.current.visible = false
      return
    }
    const k = 1 - age / 0.85
    if (flash.current) {
      const mat = flash.current.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, k * 0.55)
      flash.current.scale.setScalar(0.8 + (1 - k) * 2.2)
    }
    if (ring.current) {
      ring.current.scale.setScalar(0.4 + (1 - k) * 3.2)
      const mat = ring.current.material as THREE.MeshBasicMaterial
      mat.opacity = k * 0.9
    }
    particleRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const p = particles[i]!
      mesh.position.copy(p.dir.clone().multiplyScalar(p.speed * (1 - k) * 1.4))
      mesh.scale.setScalar(p.size * (0.4 + k))
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity = k
    })
  })

  if (!fx) return null

  const color =
    fx === 'slap'
      ? '#ff6b4a'
      : fx === 'kick'
        ? '#e85d4c'
        : fx === 'cut'
          ? '#f0c75e'
          : fx === 'spill'
            ? '#6b3a1e'
            : fx === 'pie'
              ? '#f5f0e6'
              : fx === 'void'
                ? '#9b5cff'
                : fx === 'slam'
                  ? '#a0a8a4'
                  : '#f0c75e'

  return (
    <group ref={group} position={[0, 1.45, 0.6]} visible={false}>
      <mesh ref={flash}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 28]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {particles.map((p, i) => (
        <mesh
          key={p.id}
          ref={(el) => {
            particleRefs.current[i] = el
          }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={1}
            emissive={color}
            emissiveIntensity={0.8}
            depthWrite={false}
          />
        </mesh>
      ))}

      {fx === 'slap' && (
        <mesh position={[0.25, 0.05, 0.1]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.35, 0.5, 0.08]} />
          <meshStandardMaterial color="#f0c9a0" emissive="#ff8866" emissiveIntensity={0.4} />
        </mesh>
      )}
      {fx === 'kick' && (
        <mesh position={[0.45, -0.75, 0.15]} rotation={[0, 0, -0.7]}>
          <boxGeometry args={[0.42, 0.22, 0.3]} />
          <meshStandardMaterial color="#222" emissive="#e85d4c" emissiveIntensity={0.5} />
        </mesh>
      )}
      {fx === 'cut' && (
        <mesh position={[-0.15, 0.4, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.55, 0.08, 0.03]} />
          <meshStandardMaterial color="#ddd" metalness={0.85} roughness={0.15} />
        </mesh>
      )}
      {fx === 'spill' && (
        <mesh position={[0, -0.15, 0.15]} rotation={[-1, 0, 0]}>
          <circleGeometry args={[0.55, 22]} />
          <meshStandardMaterial color="#4a2a14" transparent opacity={0.9} />
        </mesh>
      )}
      {fx === 'pie' && (
        <mesh>
          <sphereGeometry args={[0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#f7f2e6" />
        </mesh>
      )}
      {fx === 'slam' && (
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.65, 0.3, 0.25]} />
          <meshStandardMaterial color="#777" metalness={0.75} roughness={0.2} />
        </mesh>
      )}
      {fx === 'void' && (
        <mesh>
          <torusGeometry args={[0.35, 0.08, 12, 28]} />
          <meshStandardMaterial
            color="#9b5cff"
            emissive="#5a20aa"
            emissiveIntensity={1.6}
          />
        </mesh>
      )}
      {fx === 'chicken' && (
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#f0c75e" emissive="#f0c75e" emissiveIntensity={0.4} />
        </mesh>
      )}
    </group>
  )
}
