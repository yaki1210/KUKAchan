import { useEffect, useMemo } from "react";
import * as THREE from "three";

export const MAT_REV = 2;

export type ClayKit = {
  hull: THREE.MeshPhongMaterial;
  panel: THREE.MeshPhongMaterial;
  orange: THREE.MeshPhongMaterial;
  innerEar: THREE.MeshPhongMaterial;
  dark: THREE.MeshPhongMaterial;
  glass: THREE.MeshPhongMaterial;
  steel: THREE.MeshPhongMaterial;
  pupil: THREE.MeshPhongMaterial;
};

function phong(opts: {
  color: string;
  specular: string;
  shininess: number;
  emissive: string;
  emissiveIntensity: number;
}) {
  return new THREE.MeshPhongMaterial({
    color: opts.color,
    specular: opts.specular,
    shininess: opts.shininess,
    emissive: opts.emissive,
    emissiveIntensity: opts.emissiveIntensity,
  });
}

export function useClayKit(wireframe: boolean): ClayKit {
  const kit = useMemo(() => {
    return {
      // Satin silver body — concept's cool light gray
      hull: phong({
        color: "#d2d5da",
        specular: "#f6f7f9",
        shininess: 38,
        emissive: "#6f7380",
        emissiveIntensity: 0.2,
      }),
      panel: phong({
        color: "#b6bac0",
        specular: "#e6e8ec",
        shininess: 28,
        emissive: "#5c6068",
        emissiveIntensity: 0.18,
      }),
      // Amber / terracotta ear + lens ring
      orange: phong({
        color: "#e28638",
        specular: "#ffd4a8",
        shininess: 48,
        emissive: "#8f3e14",
        emissiveIntensity: 0.3,
      }),
      innerEar: phong({
        color: "#9a3b1c",
        specular: "#d08050",
        shininess: 16,
        emissive: "#4e1c0c",
        emissiveIntensity: 0.26,
      }),
      dark: phong({
        color: "#2a2e34",
        specular: "#8a9098",
        shininess: 72,
        emissive: "#121418",
        emissiveIntensity: 0.16,
      }),
      glass: phong({
        color: "#14181e",
        specular: "#b7d4ee",
        shininess: 150,
        emissive: "#0a0c10",
        emissiveIntensity: 0.22,
      }),
      steel: phong({
        color: "#a4aab2",
        specular: "#ffffff",
        shininess: 95,
        emissive: "#4a4e56",
        emissiveIntensity: 0.14,
      }),
      pupil: phong({
        color: "#08090b",
        specular: "#556677",
        shininess: 90,
        emissive: "#040506",
        emissiveIntensity: 0.1,
      }),
    };
  }, [MAT_REV]);

  useEffect(() => {
    for (const mat of Object.values(kit)) {
      mat.wireframe = wireframe;
      mat.needsUpdate = true;
    }
  }, [kit, wireframe]);

  useEffect(() => {
    return () => {
      for (const mat of Object.values(kit)) mat.dispose();
    };
  }, [kit]);

  return kit;
}
