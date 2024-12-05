import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { EffectComposer, ShaderPass, RenderPass } from 'three-stdlib';
import * as THREE from 'three';
import PixelateShader from './PixelateShader';
import FishNavigator from './FishNavigator';

extend({ EffectComposer, ShaderPass, RenderPass });

function Effects() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height);
    const pixelatePass = new ShaderPass(PixelateShader);
    pixelatePass.uniforms['resolution'].value = new THREE.Vector2(size.width, size.height);
    pixelatePass.uniforms['pixelSize'].value = 8.0;

    composer.current = new EffectComposer(gl, renderTarget);
    composer.current.addPass(new RenderPass(scene, camera));
    composer.current.addPass(pixelatePass);

    return () => {
      renderTarget.dispose();
      composer.current.dispose();
    };
  }, [gl, scene, camera, size]);

  useFrame((_, delta) => {
    if (composer.current) {
      composer.current.render(delta);
    }
  }, 1);

  return null;
}

export default function App() {
  return (
    <Suspense fallback={<span>loading...</span>}>
      <Canvas dpr={[1, 2]} camera={{ position: [-2, 2, 4], fov: 25 }}>
        <directionalLight position={[10, 10, 0]} intensity={1.5} />
        <directionalLight position={[-10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 20, 0]} intensity={1.5} />
        <directionalLight position={[0, -10, 0]} intensity={0.25} />
        <Suspense fallback={null}>
          <FishNavigator scale={3}/>
        </Suspense>
        <Effects />
      </Canvas>
    </Suspense>
  );
}