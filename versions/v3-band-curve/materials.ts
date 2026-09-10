import { useEffect, useMemo } from "react";
import * as THREE from "three";

export const MAT_REV = 4;

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
      hull: phong({
        color: "#b4b8bf",
        specular: "#e8eaee",
        shininess: 42,
        emissive: "#5a5e66",
        emissiveIntensity: 0.16,
      }),
      panel: phong({
        color: "#9ea3ab",
        specular: "#d8dbe0",
        shininess: 30,
        emissive: "#4c5058",
        emissiveIntensity: 0.14,
      }),
      orange: phong({
        color: "#e26522",
        specular: "#ffc090",
        shininess: 52,
        emissive: "#8a3510",
        emissiveIntensity: 0.28,
      }),
      innerEar: phong({
        color: "#9a3b1c",
        specular: "#d08050",
        shininess: 16,
        emissive: "#4e1c0c",
        emissiveIntensity: 0.26,
      }),
      dark: phong({
        color: "#3d424a",
        specular: "#8a9098",
        shininess: 64,
        emissive: "#1a1d22",
        emissiveIntensity: 0.14,
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
