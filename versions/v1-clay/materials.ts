import { useEffect, useMemo } from "react";
import * as THREE from "three";

export type ClayKit = {
  hull: THREE.MeshLambertMaterial;
  cavity: THREE.MeshLambertMaterial;
  glass: THREE.MeshPhongMaterial;
  accent: THREE.MeshLambertMaterial;
};

export function useClayKit(wireframe: boolean): ClayKit {
  const kit = useMemo(() => {
    const hull = new THREE.MeshLambertMaterial({
      color: "#f3efe8",
      emissive: "#d4cfc6",
      emissiveIntensity: 0.28,
    });
    const cavity = new THREE.MeshLambertMaterial({
      color: "#b7b0a6",
      emissive: "#8a8378",
      emissiveIntensity: 0.16,
    });
    const glass = new THREE.MeshPhongMaterial({
      color: "#f0ece6",
      specular: "#ffffff",
      shininess: 120,
      emissive: "#c9c5be",
      emissiveIntensity: 0.32,
    });
    const accent = new THREE.MeshLambertMaterial({
      color: "#ece7df",
      emissive: "#cfc9bf",
      emissiveIntensity: 0.22,
    });
    return { hull, cavity, glass, accent };
  }, []);

  useEffect(() => {
    kit.hull.wireframe = wireframe;
    kit.cavity.wireframe = wireframe;
    kit.glass.wireframe = wireframe;
    kit.accent.wireframe = wireframe;
    kit.hull.needsUpdate = true;
    kit.cavity.needsUpdate = true;
    kit.glass.needsUpdate = true;
    kit.accent.needsUpdate = true;
  }, [kit, wireframe]);

  useEffect(() => {
    return () => {
      kit.hull.dispose();
      kit.cavity.dispose();
      kit.glass.dispose();
      kit.accent.dispose();
    };
  }, [kit]);

  return kit;
}
