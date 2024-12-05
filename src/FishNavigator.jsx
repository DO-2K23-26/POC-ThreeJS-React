import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function FishNavigator(props) {
  const ref = useRef()
  const { scene, animations } = useGLTF('/fish.glb')
  const { actions } = useAnimations(animations, ref)
  const [targetPosition, setTargetPosition] = React.useState(new THREE.Vector3())
  const [isMoving, setIsMoving] = React.useState(false)

  const { camera, gl } = useThree()

  // Add click event listener to set the target position when clicked
  React.useEffect(() => {
    const handleClick = (event) => {
      // Get mouse position in normalized device coordinates (-1 to +1)
      const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)

      // Create a raycaster to find the 3D point on the plane
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)

      // Define a ground plane where the fish can move (e.g., y = 0)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0) // y = 0 plane
      const intersectPoint = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersectPoint)

      // Set the target position for the fish to move towards
      setTargetPosition(intersectPoint)
      ref.current.lookAt(
        intersectPoint.x,
        intersectPoint.y,
        intersectPoint.z
      )
    }

    gl.domElement.addEventListener('click', handleClick)

    return () => {
      gl.domElement.removeEventListener('click', handleClick)
    }
  }, [camera, gl])

  React.useEffect(() => {
    if (actions) {
      // Start with the "idle" action
      const idleAction = actions['idle'] // Replace 'idle' with the exact name of your idle animation
      if (idleAction) {
        idleAction.reset().fadeIn(0.5).play()
        idleAction.setLoop(THREE.LoopRepeat)
      }
    }
  }, [actions])

  useFrame((state, delta) => {
    if (!ref.current) return

    const currentPosition = ref.current.position
    const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition)
    const distance = direction.length()
    const moveDistance = Math.min(distance, delta * 1) // Adjust the speed here

    if (distance > 0) {
      // Switch to "swim" animation if moving
      if (!isMoving && actions) {
        const swimAction = actions['swim'] // Replace 'swim' with the exact name of your swim animation
        if (swimAction) {
          swimAction.reset().fadeIn(0.5).play()
          swimAction.setLoop(THREE.LoopRepeat)
        }

        const idleAction = actions['idle'] // Replace 'idle' with the exact name of your idle animation
        if (idleAction) idleAction.fadeOut(0.5)
      }

      setIsMoving(true)
      direction.normalize()
      currentPosition.addScaledVector(direction, moveDistance)
    } else if (isMoving) {
      // Switch to "idle" animation if stopped
      if (actions) {
        const idleAction = actions['idle'] // Replace 'idle' with the exact name of your idle animation
        if (idleAction) {
          idleAction.reset().fadeIn(0.5).play()
          idleAction.setLoop(THREE.LoopRepeat)
        }

        const swimAction = actions['swim'] // Replace 'swim' with the exact name of your swim animation
        if (swimAction) swimAction.fadeOut(0.5)
      }

      setIsMoving(false)
    }
  })

  return <primitive ref={ref} object={scene} {...props} />
}

export default FishNavigator

