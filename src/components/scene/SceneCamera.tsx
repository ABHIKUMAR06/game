import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface SceneCameraProps {
  hitNonce: number
  scanning: boolean
  interactive: boolean
}

export function SceneCamera({
  hitNonce,
  scanning,
  interactive,
}: SceneCameraProps) {
  const { camera } = useThree()
  const last = useRef(0)
  const shakeUntil = useRef(0)

  useFrame(({ clock }) => {
    if (hitNonce !== last.current) {
      last.current = hitNonce
      shakeUntil.current = clock.elapsedTime + 0.35
    }
    const base = new THREE.Vector3(0, 1.35, 3.4)
    if (scanning) {
      base.z = 3.05
      base.y = 1.45
    }
    let ox = 0
    let oy = 0
    if (clock.elapsedTime < shakeUntil.current) {
      const k = shakeUntil.current - clock.elapsedTime
      ox = (Math.random() - 0.5) * 0.08 * k * 3
      oy = (Math.random() - 0.5) * 0.06 * k * 3
    }
    if (!interactive) {
      camera.position.lerp(
        new THREE.Vector3(base.x + ox, base.y + oy, base.z),
        0.12,
      )
      camera.lookAt(0, 1.1, 0)
    }
  })

  if (!interactive) return null
  return (
    <OrbitControls
      enablePan={false}
      minDistance={2.2}
      maxDistance={5}
      maxPolarAngle={Math.PI / 1.7}
      target={[0, 1.1, 0]}
    />
  )
}
