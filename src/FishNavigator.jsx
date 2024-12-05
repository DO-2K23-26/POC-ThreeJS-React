import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function getRandomPosition() {
  return {
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: (Math.random() - 0.5) * 2,
  }
}

function FishNavigator(props) {
  const ref = useRef()
  const { scene, animations } = useGLTF('/fish.glb')
  const { actions } = useAnimations(animations, ref)
  const [targetPosition, setTargetPosition] = React.useState(getRandomPosition())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTargetPosition(getRandomPosition())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (actions) {
      const action = actions['swim'] // Replace 'swim' with the actual name of the animation
      action.reset().fadeIn(0.5).play()
      action.setLoop(THREE.LoopRepeat)
    }
  }, [actions])

  useFrame((state, delta) => {
    const currentPosition = ref.current.position
    const direction = {
      x: targetPosition.x - currentPosition.x,
      y: targetPosition.y - currentPosition.y,
      z: targetPosition.z - currentPosition.z,
    }
    const distance = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2)
    const moveDistance = Math.min(distance, delta * 0.1) // Adjust the speed here
    if (distance > 0) {
      currentPosition.x += (direction.x / distance) * moveDistance
      currentPosition.y += (direction.y / distance) * moveDistance
      currentPosition.z += (direction.z / distance) * moveDistance
    }
  })

  return <primitive ref={ref} object={scene} {...props} />
}

export default FishNavigator