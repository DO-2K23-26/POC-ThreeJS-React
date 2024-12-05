import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import FishNavigator from './FishNavigator'

export default function App() {
  return (
    <Suspense fallback={<span>loading...</span>}>
      <Canvas dpr={[1, 2]} camera={{ position: [-2, 2, 4], fov: 25 }}>
        <directionalLight position={[10, 10, 0]} intensity={1.5} />
        <directionalLight position={[-10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 20, 0]} intensity={1.5} />
        <directionalLight position={[0, -10, 0]} intensity={0.25} />
        <Suspense fallback={null}>
          <FishNavigator />
        </Suspense>
      </Canvas>
    </Suspense>
  )
}