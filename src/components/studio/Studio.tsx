import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import type { ComponentRef } from "react";
import * as THREE from "three";
import { AssistantModel } from "@/components/assistant/AssistantModel";
import { useStudio, VIEW_PRESETS } from "@/lib/studio-store";

export function Studio() {
  const wireframe = useStudio((s) => s.wireframe);

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ position: [2.55, 0.55, 3.7], fov: 28, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#9a9893", 1);
      }}
    >
      <color attach="background" args={["#9a9893"]} />
      <fog attach="fog" args={["#9a9893", 12, 26]} />
      <Lights />
      <Suspense fallback={null}>
        <group position={[0, 0.08, 0]}>
          <AssistantModel wireframe={wireframe} />
        </group>
      </Suspense>
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.42}
        scale={10}
        blur={2.6}
        far={3.2}
        color="#3f3b34"
        frames={1}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.21, 0]}
        receiveShadow
      >
        <circleGeometry args={[6.5, 48]} />
        <meshLambertMaterial color="#8a8680" />
      </mesh>
      <CameraRig />
    </Canvas>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#f4f6fa", "#6a6560", 0.85]} />
      <directionalLight
        position={[4.2, 6.2, 5.4]}
        intensity={2.35}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={22}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-bias={-0.00025}
      />
      <directionalLight position={[2.2, 1.6, 4.4]} color="#ffd2a8" intensity={0.55} />
      <directionalLight position={[-5.2, 2.4, 2.2]} color="#c9d6ee" intensity={0.7} />
      <directionalLight position={[-2.4, 3.6, -5]} intensity={1.05} />
    </>
  );
}

function CameraRig() {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, size } = useThree();
  const autoRotate = useStudio((s) => s.autoRotate);
  const view = useStudio((s) => s.view);
  const viewTick = useStudio((s) => s.viewTick);
  const dest = useRef<THREE.Vector3 | null>(null);
  const portrait = size.height > size.width * 1.15;
  const targetY = portrait ? -0.38 : 0.08;
  const target = useRef(new THREE.Vector3(0, targetY, 0));
  target.current.y = targetY;

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = portrait ? 34 : 28;
    cam.updateProjectionMatrix();
  }, [camera, portrait]);

  useEffect(() => {
    if (!view) return;
    dest.current = new THREE.Vector3(...VIEW_PRESETS[view].eye);
  }, [view, viewTick]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const c = controls.current;
    if (dest.current && c) {
      const k = 1 - Math.pow(0.0008, dt);
      camera.position.lerp(dest.current, k);
      c.target.lerp(target.current, k);
      c.update();
      if (camera.position.distanceTo(dest.current) < 0.03) {
        dest.current = null;
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      autoRotate={autoRotate}
      autoRotateSpeed={0.55}
      minDistance={2.5}
      maxDistance={9}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI / 2 + 0.42}
      target={[0, targetY, 0]}
      enablePan
    />
  );
}
