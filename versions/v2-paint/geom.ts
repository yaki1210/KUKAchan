import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";

export const GEOM_REV = 8;

export function onSphere(
  dir: THREE.Vector3,
  radius = 1,
): { position: [number, number, number]; quaternion: THREE.Quaternion } {
  const z = dir.clone().normalize();
  const up =
    Math.abs(z.y) > 0.92
      ? new THREE.Vector3(0, 0, 1)
      : new THREE.Vector3(0, 1, 0);
  const x = new THREE.Vector3().crossVectors(up, z).normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  const m = new THREE.Matrix4().makeBasis(x, y, z);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(m);
  const p = z.multiplyScalar(radius);
  return { position: [p.x, p.y, p.z], quaternion };
}

export function createHullGeometry(): THREE.BufferGeometry {
  const evaluator = new Evaluator();
  evaluator.useGroups = false;

  const sphereGeo = new THREE.SphereGeometry(1, 80, 56);
  const sphere = new Brush(sphereGeo);
  sphere.updateMatrixWorld();

  const wellGeo = new THREE.CylinderGeometry(0.305, 0.255, 0.52, 48);
  const well = new Brush(wellGeo);
  well.rotation.x = Math.PI / 2;
  well.position.set(0, -0.02, 0.86);
  well.updateMatrixWorld();

  let result = evaluator.evaluate(sphere, well, SUBTRACTION);

  const cutTemple = (side: number) => {
    const box = new Brush(new THREE.BoxGeometry(0.15, 0.2, 0.2));
    const dir = new THREE.Vector3(0.78 * side, 0.3, 0.5).normalize();
    box.position.copy(dir.multiplyScalar(0.97));
    box.lookAt(0, 0, 0);
    box.rotateY(Math.PI);
    box.updateMatrixWorld();
    result = evaluator.evaluate(result, box, SUBTRACTION);
    box.geometry.dispose();
  };
  cutTemple(-1);
  cutTemple(1);

  const vent = new Brush(new THREE.BoxGeometry(0.3, 0.14, 0.18));
  vent.position.set(0, -0.97, 0.08);
  vent.updateMatrixWorld();
  result = evaluator.evaluate(result, vent, SUBTRACTION);
  vent.geometry.dispose();

  const geo = result.geometry.clone();
  geo.computeVertexNormals();
  sphereGeo.dispose();
  wellGeo.dispose();
  return geo;
}

export function createEarShellGeometry(): THREE.BufferGeometry {
  const outline = new THREE.Shape();
  outline.moveTo(0, 0.68);
  outline.bezierCurveTo(0.05, 0.52, 0.185, 0.24, 0.228, 0.05);
  outline.bezierCurveTo(0.245, -0.02, 0.22, -0.12, 0.155, -0.22);
  outline.quadraticCurveTo(0, -0.27, -0.155, -0.22);
  outline.bezierCurveTo(-0.22, -0.12, -0.245, -0.02, -0.228, 0.05);
  outline.bezierCurveTo(-0.185, 0.24, -0.05, 0.52, 0, 0.68);

  const hole = new THREE.Path();
  hole.moveTo(0, 0.5);
  hole.bezierCurveTo(-0.038, 0.38, -0.11, 0.18, -0.122, 0.1);
  hole.quadraticCurveTo(0, 0.06, 0.122, 0.1);
  hole.bezierCurveTo(0.11, 0.18, 0.038, 0.38, 0, 0.5);
  outline.holes.push(hole);

  const g = new THREE.ExtrudeGeometry(outline, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.016,
    bevelSegments: 3,
    curveSegments: 20,
  });
  g.translate(0, 0, -0.08);
  g.computeVertexNormals();
  return g;
}

export function createEarCavityGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(-0.038, 0.38, -0.11, 0.18, -0.122, 0.1);
  shape.quadraticCurveTo(0, 0.06, 0.122, 0.1);
  shape.bezierCurveTo(0.11, 0.18, 0.038, 0.38, 0, 0.5);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.024,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 14,
  });
  g.translate(0, 0, -0.07);
  g.computeVertexNormals();
  return g;
}

export function earPose(side: number): {
  position: [number, number, number];
  quaternion: THREE.Quaternion;
} {
  const theta = 0.64;
  const azim = 1.05;
  const pos = new THREE.Vector3(
    side * Math.sin(theta) * Math.sin(azim),
    Math.cos(theta),
    Math.sin(theta) * Math.cos(azim),
  ).setLength(0.9);

  const tip = new THREE.Vector3(side * 0.46, 0.86, 0.1).normalize();
  const face = new THREE.Vector3(-side * 0.34, -0.06, 0.94).normalize();
  const right = new THREE.Vector3().crossVectors(tip, face).normalize();
  face.copy(new THREE.Vector3().crossVectors(right, tip).normalize());
  const m = new THREE.Matrix4().makeBasis(right, tip, face);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(m);
  return { position: [pos.x, pos.y, pos.z], quaternion };
}

export function crownLinePoint(
  yaw: number,
  theta: number,
  radius = 1.02,
): THREE.Vector3 {
  return new THREE.Vector3(
    Math.sin(theta) * Math.sin(yaw),
    Math.cos(theta),
    Math.sin(theta) * Math.cos(yaw),
  ).multiplyScalar(radius);
}

export function crownLineCurve(
  yaw: number,
  theta0: number,
  theta1: number,
  radius = 1.02,
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const t = theta0 + (theta1 - theta0) * (i / n);
    pts.push(crownLinePoint(yaw, t, radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}
