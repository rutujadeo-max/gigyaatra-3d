import { Html, Float } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import {
  clampToWorld,
  getNearestRegion,
  getRegionForPosition,
  WORLD_HALF_EXTENT,
  worldRegions,
} from '../../data/worldRegions'
import { useWorldStore } from '../../store/worldStore'

const skinToneMap = {
  fair: '#f5d0a9',
  light: '#e8be96',
  medium: '#cf9d72',
  olive: '#b7855b',
  brown: '#8f5a3b',
  deep: '#5e3924',
}

const bodyScaleMap = {
  balanced: [0.95, 1.15, 0.55],
  lean: [0.78, 1.3, 0.45],
  broad: [1.15, 1.05, 0.62],
}

const hairProfileMap = {
  short: { scale: [0.52, 0.2, 0.52], y: 1.54 },
  curly: { scale: [0.62, 0.28, 0.62], y: 1.56 },
  ponytail: { scale: [0.54, 0.18, 0.54], y: 1.55 },
  buzz: { scale: [0.48, 0.12, 0.48], y: 1.52 },
}

const getPointerHandlers = () => ({
  onPointerOver: () => {
    document.body.style.cursor = 'pointer'
  },
  onPointerOut: () => {
    document.body.style.cursor = 'default'
  },
})

const RegionDecoration = ({ region, decoration, index }) => {
  const meshRef = useRef(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return
    }

    meshRef.current.rotation.x = clock.getElapsedTime() * 0.25 + index
    meshRef.current.rotation.z = clock.getElapsedTime() * 0.35 + index * 0.4
  })

  const geometry = useMemo(() => {
    if (decoration.kind === 'sphere') {
      return <sphereGeometry args={[0.65, 20, 20]} />
    }

    if (decoration.kind === 'cylinder') {
      return <cylinderGeometry args={[0.45, 0.45, 1.1, 18]} />
    }

    return <boxGeometry args={[0.9, 0.9, 0.9]} />
  }, [decoration.kind])

  return (
    <Float
      floatIntensity={1.4}
      key={`${region.id}-${index}`}
      rotationIntensity={0.6}
      speed={1.4 + index * 0.2}
    >
      <mesh
        castShadow
        position={decoration.position}
        ref={meshRef}
        scale={decoration.scale}
      >
        {geometry}
        <meshStandardMaterial
          color={region.accent}
          emissive={region.accent}
          emissiveIntensity={0.55}
          metalness={0.2}
          roughness={0.25}
        />
      </mesh>
    </Float>
  )
}

const RegionZone = ({ isActive, onSelect, region }) => {
  const surfaceRef = useRef(null)
  const haloRef = useRef(null)

  useFrame(({ clock }) => {
    const pulse = (Math.sin(clock.getElapsedTime() * 2 + region.position[0]) + 1) / 2

    if (surfaceRef.current) {
      surfaceRef.current.position.y = pulse * 0.08
      surfaceRef.current.material.emissiveIntensity = 0.15 + pulse * 0.22 + (isActive ? 0.18 : 0)
    }

    if (haloRef.current) {
      haloRef.current.scale.setScalar(1 + pulse * 0.06 + (isActive ? 0.1 : 0))
      haloRef.current.material.opacity = 0.18 + pulse * 0.15 + (isActive ? 0.2 : 0)
    }
  })

  const pointerHandlers = getPointerHandlers()

  return (
    <group position={[region.position[0], 0, region.position[1]]}>
      <mesh
        onClick={() => onSelect(region.slug)}
        receiveShadow
        ref={surfaceRef}
        {...pointerHandlers}
      >
        <boxGeometry args={[region.size[0], 0.7, region.size[1]]} />
        <meshStandardMaterial
          color={region.color}
          emissive={region.color}
          metalness={0.15}
          roughness={0.55}
        />
      </mesh>

      <mesh position={[0, 0.46, 0]} ref={haloRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2.4, 48]} />
        <meshBasicMaterial color={region.accent} opacity={0.24} transparent />
      </mesh>

      <Html center position={[0, 1.8, 0]}>
        <button
          className="rounded-full border border-white/20 bg-slate-950/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-black/30 transition hover:border-purple-300 hover:text-purple-100"
          onClick={() => onSelect(region.slug)}
          type="button"
        >
          {region.name}
        </button>
      </Html>

      {region.ambientObjects.map((decoration, index) => (
        <RegionDecoration
          decoration={decoration}
          index={index}
          key={`${region.id}-${decoration.kind}-${index}`}
          region={region}
        />
      ))}
    </group>
  )
}

const Ground = () => (
  <group>
    <mesh position={[0, -0.35, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[WORLD_HALF_EXTENT.x * 2 + 6, WORLD_HALF_EXTENT.z * 2 + 6]} />
      <meshStandardMaterial color="#0b1220" roughness={0.97} />
    </mesh>

    <gridHelper
      args={[WORLD_HALF_EXTENT.x * 2 + 4, 24, '#312e81', '#1e293b']}
      position={[0, -0.32, 0]}
    />
  </group>
)

const Avatar = ({ avatarConfig }) => {
  const groupRef = useRef(null)
  const keysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  })
  const lastRegionIdRef = useRef(null)
  const setWorldState = useWorldStore((state) => state.setWorldState)

  useEffect(() => {
    const pressedKeys = {
      KeyW: 'up',
      ArrowUp: 'up',
      KeyS: 'down',
      ArrowDown: 'down',
      KeyA: 'left',
      ArrowLeft: 'left',
      KeyD: 'right',
      ArrowRight: 'right',
    }

    const handleKeyDown = (event) => {
      const key = pressedKeys[event.code]

      if (!key) {
        return
      }

      keysRef.current[key] = true
    }

    const handleKeyUp = (event) => {
      const key = pressedKeys[event.code]

      if (!key) {
        return
      }

      keysRef.current[key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const skinColor = skinToneMap[avatarConfig.skinTone] ?? skinToneMap.medium
  const bodyScale = bodyScaleMap[avatarConfig.bodyShape] ?? bodyScaleMap.balanced
  const hairProfile = hairProfileMap[avatarConfig.hairStyle] ?? hairProfileMap.short

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) {
      return
    }

    const horizontal = Number(keysRef.current.right) - Number(keysRef.current.left)
    const vertical = Number(keysRef.current.down) - Number(keysRef.current.up)
    const direction = new THREE.Vector3(horizontal, 0, vertical)

    if (direction.lengthSq() > 0) {
      direction.normalize()
      const nextPosition = clampToWorld({
        x: groupRef.current.position.x + direction.x * delta * 5.8,
        z: groupRef.current.position.z + direction.z * delta * 5.8,
      })

      groupRef.current.position.x = nextPosition.x
      groupRef.current.position.z = nextPosition.z
      groupRef.current.rotation.y = Math.atan2(direction.x, direction.z)
    }

    groupRef.current.position.y = 0.78 + Math.sin(clock.getElapsedTime() * 5.5) * 0.05

    const position = {
      x: Number(groupRef.current.position.x.toFixed(3)),
      z: Number(groupRef.current.position.z.toFixed(3)),
    }

    const activeRegion =
      getRegionForPosition(position) ?? getNearestRegion(position) ?? worldRegions[0]

    if (lastRegionIdRef.current !== activeRegion.id) {
      lastRegionIdRef.current = activeRegion.id
    }

    setWorldState({
      avatarPosition: position,
      activeRegionId: activeRegion.id,
    })
  })

  return (
    <group castShadow position={[0, 0.78, 0]} ref={groupRef}>
      <mesh castShadow position={[0, 0.72, 0]}>
        <boxGeometry args={bodyScale} />
        <meshStandardMaterial color={avatarConfig.outfitColor} roughness={0.4} />
      </mesh>

      <mesh castShadow position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>

      <mesh castShadow position={[0, hairProfile.y, -0.02]} scale={hairProfile.scale}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#111827" roughness={0.85} />
      </mesh>

      <mesh castShadow position={[-0.6, 0.72, 0]}>
        <boxGeometry args={[0.22, 0.85, 0.22]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh castShadow position={[0.6, 0.72, 0]}>
        <boxGeometry args={[0.22, 0.85, 0.22]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh castShadow position={[-0.26, -0.18, 0]}>
        <boxGeometry args={[0.25, 0.9, 0.25]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      <mesh castShadow position={[0.26, -0.18, 0]}>
        <boxGeometry args={[0.25, 0.9, 0.25]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  )
}

const FollowCamera = () => {
  const { camera } = useThree()
  const targetPositionRef = useRef(new THREE.Vector3(0, 13.5, 11))
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const { avatarPosition } = useWorldStore.getState()

    targetPositionRef.current.set(avatarPosition.x, 13.5, avatarPosition.z + 11)
    lookAtRef.current.set(avatarPosition.x, 0, avatarPosition.z)

    camera.position.lerp(targetPositionRef.current, 0.08)
    camera.lookAt(lookAtRef.current)
  })

  return null
}

const Scene = ({ avatarConfig, onRegionSelect }) => {
  const activeRegionId = useWorldStore((state) => state.activeRegionId)

  return (
    <>
      <color args={['#050816']} attach="background" />
      <fog args={['#050816', 18, 40]} attach="fog" />
      <ambientLight intensity={0.85} />
      <directionalLight castShadow intensity={1.35} position={[10, 20, 12]} />
      <pointLight color="#7c3aed" intensity={18} position={[0, 8, 0]} />

      <Ground />

      {worldRegions.map((region) => (
        <RegionZone
          isActive={activeRegionId === region.id}
          key={region.id}
          onSelect={onRegionSelect}
          region={region}
        />
      ))}

      <Avatar avatarConfig={avatarConfig} />
      <FollowCamera />
    </>
  )
}

export const WorldCanvas = ({ avatarConfig, onRegionSelect }) => (
  <Canvas camera={{ fov: 42, position: [0, 13.5, 11] }} className="h-full w-full" shadows>
    <Suspense fallback={null}>
      <Scene avatarConfig={avatarConfig} onRegionSelect={onRegionSelect} />
    </Suspense>
  </Canvas>
)
