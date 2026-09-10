import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useClayKit, type ClayKit } from "./materials";
import {
  GEOM_REV,
  createEarCavityGeometry,
  createEarShellGeometry,
  createHullGeometry,
  earPose,
  onSphere,
} from "./geom";

type Props = { wireframe: boolean };

export function AssistantModel({ wireframe }: Props) {
  const kit = useClayKit(wireframe);
  const hull = useMemo(() => {
    try {
      return createHullGeometry();
    } catch {
      return new THREE.SphereGeometry(1, 64, 48);
    }
  }, [GEOM_REV]);
  const earShell = useMemo(() => createEarShellGeometry(), [GEOM_REV]);
  const earCavity = useMemo(() => createEarCavityGeometry(), [GEOM_REV]);

  useEffect(() => {
    return () => {
      hull.dispose();
      earShell.dispose();
      earCavity.dispose();
    };
  }, [hull, earShell, earCavity]);

  return (
    <group name="mimi" key="noshoulder">
      <mesh
        name="hull"
        geometry={hull}
        material={kit.hull}
        castShadow
        receiveShadow
      />
      <StripePlates kit={kit} />
      <Ear side={-1} shell={earShell} cavity={earCavity} kit={kit} />
      <Ear side={1} shell={earShell} cavity={earCavity} kit={kit} />
      <Temple side={-1} kit={kit} />
      <Temple side={1} kit={kit} />
      <Lens kit={kit} />
      <SidePod side={-1} kit={kit} />
      <SidePod side={1} kit={kit} />
      <Vent kit={kit} />
      <Screws kit={kit} />
    </group>
  );
}

function Ear({
  side,
  shell,
  cavity,
  kit,
}: {
  side: number;
  shell: THREE.BufferGeometry;
  cavity: THREE.BufferGeometry;
  kit: ClayKit;
}) {
  const pose = useMemo(() => earPose(side), [side]);
  return (
    <group position={pose.position} quaternion={pose.quaternion}>
      <mesh
        name={side < 0 ? "earOuterL" : "earOuterR"}
        geometry={shell}
        material={kit.accent}
        castShadow
        receiveShadow
      />
      <mesh
        name={side < 0 ? "earInnerL" : "earInnerR"}
        geometry={cavity}
        material={kit.cavity}
        castShadow
      />
    </group>
  );
}

function StripePlates({ kit }: { kit: ClayKit }) {
  const plates: Array<[number, number, number, number]> = [
    [Math.PI / 2 - 0.1, 0.2, 0.1, 0.58],
    [Math.PI / 2 - 0.32, 0.16, 0.14, 0.48],
    [Math.PI / 2 + 0.16, 0.16, 0.14, 0.48],
    [Math.PI / 2 - 0.5, 0.13, 0.2, 0.36],
    [Math.PI / 2 + 0.37, 0.13, 0.2, 0.36],
  ];
  return (
    <group name="stripePlates">
      {plates.map(([phi, dPhi, theta, dTheta], i) => (
        <mesh key={i} material={kit.hull} castShadow receiveShadow>
          <sphereGeometry args={[1.022, 18, 10, phi, dPhi, theta, dTheta]} />
        </mesh>
      ))}
    </group>
  );
}

function Temple({ side, kit }: { side: number; kit: ClayKit }) {
  const pose = useMemo(
    () => onSphere(new THREE.Vector3(0.78 * side, 0.3, 0.5), 0.985),
    [side],
  );
  return (
    <group position={pose.position} quaternion={pose.quaternion}>
      <mesh material={kit.cavity} castShadow>
        <boxGeometry args={[0.13, 0.18, 0.06]} />
      </mesh>
      <mesh
        position={[0, 0.04, 0.028]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.hull}
        castShadow
      >
        <cylinderGeometry args={[0.022, 0.022, 0.04, 12]} />
      </mesh>
      <mesh
        position={[0, -0.04, 0.028]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.hull}
        castShadow
      >
        <cylinderGeometry args={[0.022, 0.022, 0.04, 12]} />
      </mesh>
    </group>
  );
}

function Lens({ kit }: { kit: ClayKit }) {
  return (
    <group name="lens" position={[0, -0.02, 0]}>
      <mesh position={[0, 0, 0.955]} material={kit.accent} castShadow>
        <torusGeometry args={[0.3, 0.026, 14, 48]} />
      </mesh>
      <mesh
        position={[0, 0, 0.93]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.cavity}
      >
        <cylinderGeometry args={[0.268, 0.268, 0.055, 48]} />
      </mesh>
      <mesh
        position={[0, 0, 0.78]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.cavity}
      >
        <cylinderGeometry args={[0.235, 0.255, 0.26, 32]} />
      </mesh>
      <mesh position={[0, 0, 0.88]} material={kit.glass} castShadow>
        <sphereGeometry args={[0.205, 36, 24]} />
      </mesh>
      <mesh position={[0, 0, 1.02]} material={kit.cavity}>
        <torusGeometry args={[0.155, 0.008, 8, 32]} />
      </mesh>
      <mesh position={[0, 0, 1.035]} material={kit.cavity}>
        <torusGeometry args={[0.11, 0.007, 8, 28]} />
      </mesh>
      <mesh position={[0, 0, 1.05]} material={kit.cavity}>
        <circleGeometry args={[0.072, 28]} />
      </mesh>
    </group>
  );
}

function SidePod({ side, kit }: { side: number; kit: ClayKit }) {
  const pose = useMemo(
    () => onSphere(new THREE.Vector3(side, -0.06, 0.12), 1.0),
    [side],
  );
  return (
    <group position={pose.position} quaternion={pose.quaternion}>
      <mesh material={kit.hull} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.26, 0.12]} />
      </mesh>
      <mesh
        position={[0, 0.02, 0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.cavity}
      >
        <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
      </mesh>
      <mesh position={[0, 0.02, 0.09]} material={kit.hull}>
        <torusGeometry args={[0.045, 0.01, 8, 16]} />
      </mesh>
      <mesh position={[0, -0.08, 0.07]} material={kit.cavity}>
        <boxGeometry args={[0.08, 0.03, 0.02]} />
      </mesh>
    </group>
  );
}

function Vent({ kit }: { kit: ClayKit }) {
  return (
    <group name="vent" position={[0, -0.98, 0.1]} rotation={[0.15, 0, 0]}>
      {[-0.08, -0.04, 0, 0.04, 0.08].map((x) => (
        <mesh key={x} position={[x, 0, 0]} material={kit.cavity} castShadow>
          <boxGeometry args={[0.018, 0.04, 0.12]} />
        </mesh>
      ))}
    </group>
  );
}

function Screws({ kit }: { kit: ClayKit }) {
  const spots: Array<[number, number, number]> = [
    [0.18, 0.72, 0.66],
    [-0.18, 0.72, 0.66],
    [0.55, 0.42, 0.72],
    [-0.55, 0.42, 0.72],
    [0.62, -0.22, 0.74],
    [-0.62, -0.22, 0.74],
    [0.22, -0.62, 0.74],
    [-0.22, -0.62, 0.74],
    [0.48, 0.78, 0.38],
    [-0.48, 0.78, 0.38],
  ];
  return (
    <group name="screws">
      {spots.map((dir, i) => {
        const pose = onSphere(new THREE.Vector3(...dir), 1.012);
        return (
          <group key={i} position={pose.position} quaternion={pose.quaternion}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={kit.hull} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.018, 10]} />
            </mesh>
            <mesh position={[0, 0, 0.012]} material={kit.cavity}>
              <boxGeometry args={[0.018, 0.004, 0.006]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
