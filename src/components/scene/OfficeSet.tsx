import { useMemo } from 'react'
import * as THREE from 'three'

interface OfficeSetProps {
  dread: number
}

export function OfficeSet({ dread }: OfficeSetProps) {
  const carpet = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2a3d34',
        roughness: 0.95,
      }),
    [],
  )
  const wall = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1c2c26',
        roughness: 0.85,
      }),
    [],
  )
  const desk = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6b4a2e',
        roughness: 0.55,
        metalness: 0.08,
      }),
    [],
  )
  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8a9490',
        roughness: 0.35,
        metalness: 0.65,
      }),
    [],
  )
  const screen = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: dread > 0.5 ? '#ff5533' : '#7dd3a7',
        emissive: dread > 0.5 ? '#ff2200' : '#3a8f6a',
        emissiveIntensity: 0.6 + dread * 0.8,
        roughness: 0.3,
      }),
    [dread],
  )

  return (
    <group>
      {/* floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        material={carpet}
      >
        <planeGeometry args={[14, 14]} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 2.2, -3.2]} receiveShadow material={wall}>
        <planeGeometry args={[14, 5]} />
      </mesh>
      {/* side walls hint */}
      <mesh
        position={[-4.5, 2.2, -0.5]}
        rotation={[0, Math.PI / 2, 0]}
        material={wall}
      >
        <planeGeometry args={[8, 5]} />
      </mesh>
      <mesh
        position={[4.5, 2.2, -0.5]}
        rotation={[0, -Math.PI / 2, 0]}
        material={wall}
      >
        <planeGeometry args={[8, 5]} />
      </mesh>

      {/* cubicle panels */}
      <mesh castShadow position={[-1.6, 0.7, -1.1]} material={wall}>
        <boxGeometry args={[0.08, 1.4, 2.2]} />
      </mesh>
      <mesh castShadow position={[1.6, 0.7, -1.1]} material={wall}>
        <boxGeometry args={[0.08, 1.4, 2.2]} />
      </mesh>

      {/* desk */}
      <mesh castShadow position={[0, 0.55, 0.55]} material={desk}>
        <boxGeometry args={[1.8, 0.08, 0.85]} />
      </mesh>
      <mesh castShadow position={[-0.75, 0.28, 0.55]} material={desk}>
        <boxGeometry args={[0.1, 0.5, 0.7]} />
      </mesh>
      <mesh castShadow position={[0.75, 0.28, 0.55]} material={desk}>
        <boxGeometry args={[0.1, 0.5, 0.7]} />
      </mesh>

      {/* monitor */}
      <mesh castShadow position={[0.35, 0.95, 0.35]} material={metal}>
        <boxGeometry args={[0.55, 0.4, 0.06]} />
      </mesh>
      <mesh position={[0.35, 0.95, 0.39]} material={screen}>
        <planeGeometry args={[0.48, 0.32]} />
      </mesh>
      <mesh castShadow position={[0.35, 0.68, 0.35]} material={metal}>
        <cylinderGeometry args={[0.04, 0.08, 0.25, 12]} />
      </mesh>

      {/* chair back behind boss */}
      <mesh castShadow position={[0, 0.95, -0.35]} material={metal}>
        <boxGeometry args={[0.55, 0.7, 0.08]} />
      </mesh>
      <mesh castShadow position={[0, 0.35, -0.2]} material={desk}>
        <cylinderGeometry args={[0.28, 0.3, 0.12, 20]} />
      </mesh>

      {/* fluorescent fixture */}
      <mesh position={[0, 3.1, 0]} material={metal}>
        <boxGeometry args={[2.2, 0.08, 0.35]} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.28]} />
        <meshStandardMaterial
          color="#f0c75e"
          emissive="#f0c75e"
          emissiveIntensity={0.85 + dread * 0.5}
        />
      </mesh>
    </group>
  )
}
