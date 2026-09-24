import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { BossLook, DamageMarks, HitFx } from '../../game/types'
import { hairHex, skinHex, skinShade, suitHex } from '../../game/bossLooks'

interface BossFigureProps {
  look: BossLook
  hitNonce: number
  lastFx: HitFx | null
  damage: DamageMarks
}

function Decal({
  position,
  rotation,
  scale,
  color,
  opacity = 0.85,
  emissive,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale: [number, number, number] | number
  color: string
  opacity?: number
  emissive?: string
}) {
  return (
    <mesh position={position} rotation={rotation ?? [0, 0, 0]} scale={scale}>
      <circleGeometry args={[0.5, 20]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        emissive={emissive ?? color}
        emissiveIntensity={emissive ? 0.35 : 0.05}
        roughness={0.9}
      />
    </mesh>
  )
}

export function BossFigure({
  look,
  hitNonce,
  lastFx,
  damage,
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
      bruise: new THREE.MeshStandardMaterial({
        color: '#8b3a4a',
        transparent: true,
        opacity: 0.78,
        roughness: 0.95,
        depthWrite: false,
      }),
      coffee: new THREE.MeshStandardMaterial({
        color: '#4a2a14',
        transparent: true,
        opacity: 0.82,
        roughness: 0.95,
        depthWrite: false,
      }),
      cream: new THREE.MeshStandardMaterial({
        color: '#f7f2e6',
        roughness: 0.85,
        transparent: true,
        opacity: 0.92,
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
    const idle = Math.sin(t * 1.4) * 0.015

    let shakeX = 0
    let shakeY = idle
    let rotZ = 0
    let headPitch = Math.sin(t * 0.8) * 0.04
    root.current.rotation.x = 0

    if (since < 0.7 && hitNonce > 0) {
      const k = 1 - since / 0.7
      const amp = 0.28 * k
      if (lastFx === 'slap') {
        shakeX = Math.sin(since * 60) * amp * 1.35
        rotZ = Math.sin(since * 48) * amp
        headPitch = -0.2 * k
      } else if (lastFx === 'kick') {
        shakeY = Math.abs(Math.sin(since * 34)) * amp * 1.6
        root.current.rotation.x = -amp * 0.9
      } else if (lastFx === 'cut') {
        headPitch = -0.35 * k
        shakeX = Math.sin(since * 24) * amp * 0.6
      } else if (lastFx === 'slam' || lastFx === 'void') {
        shakeX = Math.sin(since * 52) * amp * 1.4
        shakeY = Math.cos(since * 40) * amp
      } else if (lastFx === 'spill' || lastFx === 'pie') {
        shakeY = Math.sin(since * 20) * amp * 0.7
        headPitch = 0.25 * k
      } else {
        shakeX = Math.sin(since * 45) * amp
      }
    }

    root.current.position.x = shakeX
    root.current.position.y = 0.85 + shakeY
    root.current.rotation.z = rotZ
    head.current.rotation.x = headPitch
  })

  const hairScale = Math.max(0.04, damage.hairIntegrity)
  const showHair = damage.hairIntegrity > 0.08
  const slapSlots: [number, number, number][] = [
    [0.18, 0.02, 0.3],
    [-0.2, -0.02, 0.3],
    [0.12, -0.1, 0.31],
    [-0.14, 0.1, 0.29],
    [0.05, 0.12, 0.3],
    [-0.08, -0.14, 0.3],
  ]
  const coffeeFace: [number, number, number][] = [
    [0.08, -0.05, 0.32],
    [-0.1, 0.04, 0.31],
    [0, -0.18, 0.28],
  ]
  const coffeeSuit: [number, number, number][] = [
    [0.15, -0.05, 0.3],
    [-0.18, 0.1, 0.28],
    [0.05, -0.2, 0.32],
    [-0.1, -0.15, 0.3],
    [0.22, 0.05, 0.25],
    [-0.22, -0.05, 0.26],
  ]

  return (
    <group ref={root} position={[0, 0.85, 0]}>
      <mesh castShadow position={[-0.14, -0.55, 0]} material={materials.suit}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
      </mesh>
      <mesh castShadow position={[0.14, -0.55, 0]} material={materials.suit}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
      </mesh>

      {/* kick welts on shin */}
      {Array.from({ length: damage.kickMarks }).map((_, i) => (
        <Decal
          key={`kick-${i}`}
          position={[i % 2 === 0 ? -0.2 : 0.2, -0.55 - i * 0.02, 0.08]}
          scale={0.12 + i * 0.02}
          color="#6b2a3a"
          opacity={0.75}
        />
      ))}

      <mesh castShadow position={[0, -0.05, 0]} material={materials.suit}>
        <capsuleGeometry args={[0.32, 0.45, 8, 16]} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0.12]} material={materials.shirt}>
        <boxGeometry args={[0.22, 0.5, 0.08]} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0.17]} material={materials.tie}>
        <boxGeometry args={[0.07, 0.42, 0.04]} />
      </mesh>

      {/* coffee stains on suit — persistent */}
      {Array.from({ length: damage.coffeeStains }).map((_, i) => {
        const p = coffeeSuit[i % coffeeSuit.length]!
        return (
          <mesh
            key={`coffee-suit-${i}`}
            position={[p[0], p[1], p[2]]}
            scale={0.14 + (i % 3) * 0.04}
            material={materials.coffee}
          >
            <circleGeometry args={[0.5, 16]} />
          </mesh>
        )
      })}

      {/* chicken dings on torso */}
      {Array.from({ length: damage.chickenHits }).map((_, i) => (
        <Decal
          key={`chicken-${i}`}
          position={[(i - 1.5) * 0.12, 0.15 - i * 0.08, 0.34]}
          scale={0.1}
          color="#c49a3a"
          opacity={0.7}
        />
      ))}

      {/* void cracks on torso */}
      {Array.from({ length: damage.voidCrack }).map((_, i) => (
        <Decal
          key={`void-${i}`}
          position={[0.05 * i, 0.1 - i * 0.12, 0.35]}
          scale={[0.08, 0.22, 1]}
          color="#6b3dff"
          opacity={0.65}
          emissive="#9b5cff"
        />
      ))}

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

      <group ref={head} position={[0, 0.55, 0]}>
        <mesh castShadow material={materials.skin}>
          <sphereGeometry args={[0.34, 32, 32]} />
        </mesh>
        <mesh castShadow position={[-0.34, 0, 0]} material={materials.shade}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
        <mesh castShadow position={[0.34, 0, 0]} material={materials.shade}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
        <mesh castShadow position={[0, -0.02, 0.32]} material={materials.shade}>
          <sphereGeometry args={[0.05, 12, 12]} />
        </mesh>

        <group position={[0, 0.06, 0.28]}>
          <mesh position={[-0.1, 0, 0]} material={materials.white}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh position={[0.1, 0, 0]} material={materials.white}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh position={[-0.1, 0, 0.045]} material={materials.eye}>
            <sphereGeometry args={[0.035, 12, 12]} />
          </mesh>
          <mesh position={[0.1, 0, 0.045]} material={materials.eye}>
            <sphereGeometry args={[0.035, 12, 12]} />
          </mesh>
        </group>

        <mesh
          position={[-0.1, 0.16, 0.3]}
          rotation={[0, 0, -0.15]}
          material={materials.hair}
        >
          <boxGeometry args={[0.12, 0.025, 0.04]} />
        </mesh>
        <mesh
          position={[0.1, 0.16, 0.3]}
          rotation={[0, 0, 0.15]}
          material={materials.hair}
        >
          <boxGeometry args={[0.12, 0.025, 0.04]} />
        </mesh>

        <mesh position={[0, -0.14, 0.3]} rotation={[0.2, 0, 0]} material={materials.shade}>
          <torusGeometry args={[0.07, 0.012, 8, 16, Math.PI]} />
        </mesh>

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
            <sphereGeometry
              args={[0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]}
            />
          </mesh>
        )}

        {/* persistent slap bruises */}
        {Array.from({ length: damage.slapMarks }).map((_, i) => {
          const p = slapSlots[i % slapSlots.length]!
          return (
            <mesh
              key={`slap-${i}`}
              position={p}
              scale={0.16 + (i % 3) * 0.03}
              material={materials.bruise}
            >
              <circleGeometry args={[0.5, 18]} />
            </mesh>
          )
        })}

        {/* coffee on face */}
        {Array.from({ length: Math.min(damage.coffeeStains, 3) }).map((_, i) => {
          const p = coffeeFace[i]!
          return (
            <mesh
              key={`coffee-face-${i}`}
              position={p}
              scale={0.12 + i * 0.03}
              material={materials.coffee}
            >
              <circleGeometry args={[0.5, 14]} />
            </mesh>
          )
        })}

        {/* pie cream layers */}
        {damage.pieSplat > 0 && (
          <mesh
            position={[0, 0.08, 0.28]}
            scale={[1, 0.7 + damage.pieSplat * 0.08, 1]}
            material={materials.cream}
          >
            <sphereGeometry
              args={[0.3, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]}
            />
          </mesh>
        )}
        {Array.from({ length: damage.pieSplat }).map((_, i) => (
          <mesh
            key={`pie-drip-${i}`}
            position={[(i - 1.5) * 0.1, -0.2 - i * 0.03, 0.28]}
            material={materials.cream}
          >
            <sphereGeometry args={[0.05, 10, 10]} />
          </mesh>
        ))}

        {/* stapler forehead bumps */}
        {Array.from({ length: damage.staplerBumps }).map((_, i) => (
          <mesh
            key={`stap-${i}`}
            position={[(i - 1.5) * 0.08, 0.22, 0.26]}
            material={materials.bruise}
          >
            <boxGeometry args={[0.06, 0.035, 0.04]} />
          </mesh>
        ))}

        {/* hair — visibly shrinks / gone */}
        {showHair ? (
          <group
            scale={[1, hairScale, 1]}
            position={[0, 0.05 * (1 - hairScale), 0]}
          >
            {look.hairStyle === 'slick' && (
              <mesh castShadow position={[0, 0.22, -0.02]} material={materials.hair}>
                <sphereGeometry
                  args={[0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]}
                />
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
                <mesh
                  castShadow
                  position={[-0.22, 0.18, 0]}
                  material={materials.hair}
                >
                  <sphereGeometry args={[0.12, 12, 12]} />
                </mesh>
                <mesh
                  castShadow
                  position={[0.22, 0.18, 0]}
                  material={materials.hair}
                >
                  <sphereGeometry args={[0.12, 12, 12]} />
                </mesh>
              </>
            )}
            {look.hairStyle === 'mullet' && (
              <>
                <mesh castShadow position={[0, 0.22, -0.02]} material={materials.hair}>
                  <sphereGeometry
                    args={[0.28, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]}
                  />
                </mesh>
                <mesh castShadow position={[0, 0.05, -0.28]} material={materials.hair}>
                  <boxGeometry args={[0.35, 0.35 * hairScale, 0.18]} />
                </mesh>
              </>
            )}
            {/* cut notches when partially damaged */}
            {damage.hairIntegrity < 0.75 && (
              <mesh position={[0.12, 0.3, 0.05]} material={materials.skin}>
                <boxGeometry args={[0.1, 0.08, 0.12]} />
              </mesh>
            )}
            {damage.hairIntegrity < 0.5 && (
              <mesh position={[-0.14, 0.28, 0.04]} material={materials.skin}>
                <boxGeometry args={[0.12, 0.1, 0.12]} />
              </mesh>
            )}
          </group>
        ) : (
          /* shiny bald dome highlight */
          <mesh position={[0, 0.28, 0]} material={materials.shade}>
            <sphereGeometry args={[0.12, 16, 12]} />
          </mesh>
        )}

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
