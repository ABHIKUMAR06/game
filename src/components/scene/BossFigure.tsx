import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { BossLook, HitFx } from '../../game/types'
import { hairHex, skinHex, skinShade, suitHex } from '../../game/bossLooks'

interface BossFigureProps {
  look: BossLook
  scanning: boolean
  hitNonce: number
  lastFx: HitFx | null
  hairIntegrity: number
}

export function BossFigure({
  look,
  scanning,
  hitNonce,
  lastFx,
  hairIntegrity,
}: BossFigureProps) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const hitAt = useRef(0)
  const lastNonce = useRef(0)

  const skin = skinHex(look.skinTone)
  const shade = skinShade(look.skinTone)
  const hair = hairHex(look.hairColor)
  const suit = suitHex(look.suitColor)

  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({
        color: skin,
        roughness: 0.55,
        metalness: 0.05,
      }),
      shade: new THREE.MeshStandardMaterial({
        color: shade,
        roughness: 0.6,
        metalness: 0.04,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: hair,
        roughness: 0.7,
        metalness: 0.08,
      }),
      suit: new THREE.MeshStandardMaterial({
        color: suit,
        roughness: 0.45,
        metalness: 0.25,
      }),
      shirt: new THREE.MeshStandardMaterial({
        color: '#f4efe6',
        roughness: 0.7,
      }),
      tie: new THREE.MeshStandardMaterial({
        color: '#c45c3a',
        roughness: 0.4,
        metalness: 0.1,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: '#14221e',
        roughness: 0.3,
      }),
      white: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.4,
      }),
      frame: new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        metalness: 0.6,
        roughness: 0.3,
      }),
      lens: new THREE.MeshStandardMaterial({
        color: '#111111',
        transparent: true,
        opacity: 0.75,
        metalness: 0.4,
        roughness: 0.2,
      }),
    }),
    [skin, shade, hair, suit],
  )

  useFrame(({ clock }) => {
    if (!root.current || !head.current) return
    if (hitNonce !== lastNonce.current) {
      lastNonce.current = hitNonce
      hitAt.current = clock.elapsedTime
    }
    const t = clock.elapsedTime
    const since = t - hitAt.current
    const idle = Math.sin(t * 1.4) * 0.02

    let shakeX = 0
    let shakeY = idle
    let rotZ = 0
    let headPitch = scanning ? -0.12 : Math.sin(t * 0.8) * 0.04

    if (since < 0.55 && hitNonce > 0) {
      const k = 1 - since / 0.55
      const amp = 0.18 * k
      if (lastFx === 'slap') {
        shakeX = Math.sin(since * 55) * amp
        rotZ = Math.sin(since * 40) * amp
      } else if (lastFx === 'kick') {
        shakeY = Math.abs(Math.sin(since * 30)) * amp * 1.4
        root.current.rotation.x = -amp * 0.6
      } else if (lastFx === 'cut') {
        headPitch = -0.25 * k
        shakeX = Math.sin(since * 20) * amp * 0.5
      } else if (lastFx === 'slam' || lastFx === 'void') {
        shakeX = Math.sin(since * 48) * amp * 1.2
        shakeY = Math.cos(since * 35) * amp
      } else {
        shakeX = Math.sin(since * 42) * amp
      }
    } else {
      root.current.rotation.x = 0
    }

    root.current.position.x = shakeX
    root.current.position.y = 0.85 + shakeY
    root.current.rotation.z = rotZ
    head.current.rotation.x = headPitch
  })

  const hairScale = Math.max(0.05, hairIntegrity)
  const showHair = hairIntegrity > 0.08

  return (
    <group ref={root} position={[0, 0.85, 0]}>
      {/* legs */}
      <mesh castShadow position={[-0.14, -0.55, 0]} material={materials.suit}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
      </mesh>
      <mesh castShadow position={[0.14, -0.55, 0]} material={materials.suit}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
      </mesh>

      {/* torso */}
      <mesh castShadow position={[0, -0.05, 0]} material={materials.suit}>
        <capsuleGeometry args={[0.32, 0.45, 8, 16]} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0.12]} material={materials.shirt}>
        <boxGeometry args={[0.22, 0.5, 0.08]} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0.17]} material={materials.tie}>
        <boxGeometry args={[0.07, 0.42, 0.04]} />
      </mesh>

      {/* arms */}
      <mesh
        castShadow
        position={[-0.42, -0.05, 0]}
        rotation={[0, 0, 0.35]}
        material={materials.suit}
      >
        <capsuleGeometry args={[0.08, 0.4, 6, 12]} />
      </mesh>
      <mesh
        castShadow
        position={[0.42, -0.05, 0]}
        rotation={[0, 0, -0.35]}
        material={materials.suit}
      >
        <capsuleGeometry args={[0.08, 0.4, 6, 12]} />
      </mesh>

      {/* head group */}
      <group ref={head} position={[0, 0.55, 0]}>
        <mesh castShadow material={materials.skin}>
          <sphereGeometry args={[0.34, 32, 32]} />
        </mesh>
        {/* ears */}
        <mesh castShadow position={[-0.34, 0, 0]} material={materials.shade}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
        <mesh castShadow position={[0.34, 0, 0]} material={materials.shade}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
        {/* nose */}
        <mesh castShadow position={[0, -0.02, 0.32]} material={materials.shade}>
          <sphereGeometry args={[0.05, 12, 12]} />
        </mesh>

        {/* eyes */}
        <group position={[0, 0.06, 0.28]}>
          <mesh position={[-0.1, 0, 0]} material={materials.white} scale={[1, scanning ? 0.25 : 1, 1]}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh position={[0.1, 0, 0]} material={materials.white} scale={[1, scanning ? 0.25 : 1, 1]}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          {!scanning && (
            <>
              <mesh position={[-0.1, 0, 0.045]} material={materials.eye}>
                <sphereGeometry args={[0.035, 12, 12]} />
              </mesh>
              <mesh position={[0.1, 0, 0.045]} material={materials.eye}>
                <sphereGeometry args={[0.035, 12, 12]} />
              </mesh>
            </>
          )}
        </group>

        {/* brows */}
        <mesh
          position={[-0.1, scanning ? 0.14 : 0.16, 0.3]}
          rotation={[0, 0, scanning ? 0.3 : -0.15]}
          material={materials.hair}
        >
          <boxGeometry args={[0.12, 0.025, 0.04]} />
        </mesh>
        <mesh
          position={[0.1, scanning ? 0.14 : 0.16, 0.3]}
          rotation={[0, 0, scanning ? -0.3 : 0.15]}
          material={materials.hair}
        >
          <boxGeometry args={[0.12, 0.025, 0.04]} />
        </mesh>

        {/* mouth */}
        <mesh
          position={[0, -0.14, 0.3]}
          rotation={[scanning ? 0.4 : 0.2, 0, 0]}
          material={materials.shade}
        >
          <torusGeometry args={[0.07, 0.012, 8, 16, Math.PI]} />
        </mesh>

        {/* facial hair */}
        {look.facialHair === 'mustache' && (
          <mesh position={[0, -0.08, 0.32]} material={materials.hair}>
            <boxGeometry args={[0.16, 0.035, 0.05]} />
          </mesh>
        )}
        {look.facialHair === 'goatee' && (
          <mesh position={[0, -0.22, 0.28]} material={materials.hair}>
            <coneGeometry args={[0.06, 0.14, 10]} />
          </mesh>
        )}
        {look.facialHair === 'stubble' && (
          <mesh position={[0, -0.16, 0.18]} material={materials.hair}>
            <sphereGeometry args={[0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          </mesh>
        )}

        {/* hair styles — scale with integrity */}
        {showHair && (
          <group scale={[1, hairScale, 1]} position={[0, 0.05 * (1 - hairScale), 0]}>
            {look.hairStyle === 'slick' && (
              <mesh
                castShadow
                position={[0, 0.22, -0.02]}
                material={materials.hair}
              >
                <sphereGeometry args={[0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
            )}
            {look.hairStyle === 'tuft' && (
              <>
                <mesh castShadow position={[0, 0.28, 0]} material={materials.hair}>
                  <sphereGeometry args={[0.22, 16, 16]} />
                </mesh>
                <mesh castShadow position={[0, 0.42, 0]} material={materials.hair}>
                  <coneGeometry args={[0.08, 0.2, 10]} />
                </mesh>
              </>
            )}
            {look.hairStyle === 'balding' && (
              <>
                <mesh castShadow position={[-0.22, 0.18, 0]} material={materials.hair}>
                  <sphereGeometry args={[0.12, 12, 12]} />
                </mesh>
                <mesh castShadow position={[0.22, 0.18, 0]} material={materials.hair}>
                  <sphereGeometry args={[0.12, 12, 12]} />
                </mesh>
              </>
            )}
            {look.hairStyle === 'mullet' && (
              <>
                <mesh castShadow position={[0, 0.22, -0.02]} material={materials.hair}>
                  <sphereGeometry args={[0.28, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                </mesh>
                <mesh castShadow position={[0, 0.05, -0.28]} material={materials.hair}>
                  <boxGeometry args={[0.35, 0.35, 0.18]} />
                </mesh>
              </>
            )}
          </group>
        )}

        {/* glasses */}
        {look.glasses === 'round' && (
          <group position={[0, 0.06, 0.33]}>
            <mesh position={[-0.1, 0, 0]} material={materials.frame}>
              <torusGeometry args={[0.08, 0.012, 8, 20]} />
            </mesh>
            <mesh position={[0.1, 0, 0]} material={materials.frame}>
              <torusGeometry args={[0.08, 0.012, 8, 20]} />
            </mesh>
            <mesh material={materials.frame}>
              <boxGeometry args={[0.06, 0.015, 0.015]} />
            </mesh>
          </group>
        )}
        {look.glasses === 'square' && (
          <group position={[0, 0.06, 0.33]}>
            <mesh position={[-0.1, 0, 0]} material={materials.frame}>
              <boxGeometry args={[0.14, 0.1, 0.03]} />
            </mesh>
            <mesh position={[0.1, 0, 0]} material={materials.frame}>
              <boxGeometry args={[0.14, 0.1, 0.03]} />
            </mesh>
          </group>
        )}
        {look.glasses === 'shades' && (
          <group position={[0, 0.06, 0.34]}>
            <mesh position={[-0.1, 0, 0]} material={materials.lens}>
              <boxGeometry args={[0.15, 0.09, 0.04]} />
            </mesh>
            <mesh position={[0.1, 0, 0]} material={materials.lens}>
              <boxGeometry args={[0.15, 0.09, 0.04]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  )
}
