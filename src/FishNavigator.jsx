import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function FishNavigator(props) {
  const ref = useRef()
  const { scene, animations } = useGLTF('/fish.glb')
  const { actions } = useAnimations(animations, ref)
  const [targetPosition, setTargetPosition] = React.useState(new THREE.Vector3())

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
    }

    gl.domElement.addEventListener('click', handleClick)

    return () => {
      gl.domElement.removeEventListener('click', handleClick)
    }
  }, [camera, gl])

  React.useEffect(() => {
    if (actions) {
      const action = actions['swim'] // Replace 'swim' with the actual name of the animation
      action.reset().fadeIn(0.5).play()
      action.setLoop(THREE.LoopRepeat)
    }
  }, [actions])

  useFrame((state, delta) => {
    if (!ref.current) return

    const currentPosition = ref.current.position
    const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition)
    const distance = direction.length()
    const moveDistance = Math.min(distance, delta * 1) // Adjust the speed here

    if (distance > 0) {
      direction.normalize()
      currentPosition.addScaledVector(direction, moveDistance)
    }
  })

  return <primitive ref={ref} object={scene} {...props} />
}

export default FishNavigator
