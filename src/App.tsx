import './App.css'
import { Canvas } from '@react-three/fiber'

function App({ children }: { children: React.ReactNode }) {
  return (
    <div id="canvas-container">
      <Canvas>
        {children}
      </Canvas>
    </div>
  )
}

export default App
