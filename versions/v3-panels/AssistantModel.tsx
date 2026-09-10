import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useClayKit, type ClayKit } from "./materials";
import {
  ARMOR_PATCHES,
  BAND_R,
  BAND_TUBE,
  GEOM_REV,
  PLATE_R,
  createEarCavityGeometry,
  createEarShellGeometry,
  createHullGeometry,
  earPose,
  lowerBandCurve,
  onSphere,
  spherePatchArgs,
  upperBandCurve,
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
    <group name="mimi" key="v3-panels">
      <mesh
        name="hull"
        geometry={hull}
        material={kit.dark}
        castShadow
        receiveShadow
      />
      <ArmorPlates kit={kit} />
      <OrangeBands kit={kit} />
      <LensSeam kit={kit} />
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

function ArmorPlates({ kit }: { kit: ClayKit }) {
  return (
    <group name="armorPlates">
      {ARMOR_PATCHES.map((patch, i) => (
        <mesh
          key={i}
          material={kit.hull}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={spherePatchArgs(patch, PLATE_R)} />
        </mesh>
      ))}
    </group>
  );
}

function OrangeBands({ kit }: { kit: ClayKit }) {
  const upper = useMemo(() => upperBandCurve(BAND_R), []);
  const lower = useMemo(() => lowerBandCurve(BAND_R), []);
  const upperEnds = useMemo(
    () => [upper.getPoint(0), upper.getPoint(1)] as const,
    [upper],
  );
  const lowerEnds = useMemo(
    () => [lower.getPoint(0), lower.getPoint(1)] as const,
    [lower],
  );

  return (
    <group name="orangeBands">
      <mesh material={kit.orange} castShadow>
        <tubeGeometry args={[upper, 48, BAND_TUBE, 10, false]} />
      </mesh>
      <mesh material={kit.orange} castShadow>
        <tubeGeometry args={[lower, 40, BAND_TUBE, 10, false]} />
      </mesh>
      {upperEnds.map((p, i) => (
        <mesh key={`u${i}`} position={p} material={kit.orange} castShadow>
          <sphereGeometry args={[BAND_TUBE, 12, 10]} />
        </mesh>
      ))}
      {lowerEnds.map((p, i) => (
        <mesh key={`l${i}`} position={p} material={kit.orange} castShadow>
          <sphereGeometry args={[BAND_TUBE, 12, 10]} />
        </mesh>
      ))}
    </group>
  );
}

function LensSeam({ kit }: { kit: ClayKit }) {
  return (
    <mesh position={[0, -0.02, 0.99]} material={kit.dark} castShadow>
      <torusGeometry args={[0.345, 0.008, 8, 48]} />
    </mesh>
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
        material={kit.orange}
        castShadow
        receiveShadow
      />
      <mesh
        name={side < 0 ? "earInnerL" : "earInnerR"}
        geometry={cavity}
        material={kit.innerEar}
        castShadow
      />
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
      <mesh position={[0, 0.058, 0]} material={kit.dark} castShadow>
        <boxGeometry args={[0.13, 0.068, 0.06]} />
      </mesh>
      <mesh position={[0, -0.058, 0]} material={kit.dark} castShadow>
        <boxGeometry args={[0.13, 0.068, 0.06]} />
      </mesh>
      <mesh position={[0.056, 0, 0]} material={kit.dark} castShadow>
        <boxGeometry args={[0.02, 0.18, 0.055]} />
      </mesh>
      <mesh position={[-0.056, 0, 0]} material={kit.dark} castShadow>
        <boxGeometry args={[0.02, 0.18, 0.055]} />
      </mesh>
      <mesh
        position={[0, 0.058, 0.028]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.steel}
        castShadow
      >
        <cylinderGeometry args={[0.02, 0.02, 0.04, 12]} />
      </mesh>
      <mesh
        position={[0, -0.058, 0.028]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.steel}
        castShadow
      >
        <cylinderGeometry args={[0.02, 0.02, 0.04, 12]} />
      </mesh>
    </group>
  );
}

function Lens({ kit }: { kit: ClayKit }) {
  return (
    <group name="lens" position={[0, -0.02, 0]}>
      <mesh position={[0, 0, 0.955]} material={kit.orange} castShadow>
        <torusGeometry args={[0.3, 0.026, 14, 48]} />
      </mesh>
      <mesh
        position={[0, 0, 0.93]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.dark}
      >
        <cylinderGeometry args={[0.268, 0.268, 0.055, 48]} />
      </mesh>
      <mesh
        position={[0, 0, 0.78]}
        rotation={[Math.PI / 2, 0, 0]}
        material={kit.dark}
      >
        <cylinderGeometry args={[0.235, 0.255, 0.26, 32]} />
      </mesh>
      <mesh position={[0, 0, 0.88]} material={kit.glass} castShadow>
        <sphereGeometry args={[0.205, 36, 24]} />
      </mesh>
      <mesh position={[0, 0, 1.02]} material={kit.steel}>
        <torusGeometry args={[0.155, 0.008, 8, 32]} />
      </mesh>
      <mesh position={[0, 0, 1.035]} material={kit.dark}>
        <torusGeometry args={[0.11, 0.007, 8, 28]} />
      </mesh>
      <mesh position={[0, 0, 1.05]} material={kit.pupil}>
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
        material={kit.dark}
      >
        <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
      </mesh>
      <mesh position={[0, 0.02, 0.09]} material={kit.steel}>
        <torusGeometry args={[0.045, 0.01, 8, 16]} />
      </mesh>
      <mesh position={[0, -0.08, 0.07]} material={kit.dark}>
        <boxGeometry args={[0.08, 0.03, 0.02]} />
      </mesh>
    </group>
  );
}

function Vent({ kit }: { kit: ClayKit }) {
  return (
    <group name="vent" position={[0, -0.98, 0.1]} rotation={[0.15, 0, 0]}>
      {[-0.08, -0.04, 0, 0.04, 0.08].map((x) => (
        <mesh key={x} position={[x, 0, 0]} material={kit.dark} castShadow>
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
        const pose = onSphere(new THREE.Vector3(...dir), 1.02);
        return (
          <group key={i} position={pose.position} quaternion={pose.quaternion}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={kit.steel} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.016, 10]} />
            </mesh>
            <mesh position={[0, 0, 0.01]} material={kit.dark}>
              <boxGeometry args={[0.016, 0.004, 0.005]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
