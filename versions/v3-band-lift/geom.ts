import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";

export const GEOM_REV = 15;

/** Armor plates sit proud of the dark under-hull so gaps read as panel seams. */
export const PLATE_R = 1.005;
export const BAND_R = 1.003;
export const BAND_TUBE = 0.018;
export const TEMPLE_DIR = { x: 0.78, y: 0.44, z: 0.5 };

export type PatchSpec = {
  yaw0: number;
  yaw1: number;
  theta0: number;
  theta1: number;
  w?: number;
  h?: number;
};

const S = 0.007;
const C = 0.013;
const BT = 0.024;

/** Upper band: whole strip lifted; center still a little lower than the temples. */
export function upperTheta(yaw: number): number {
  const yawMax = 1.3;
  const tMid = 1.185;
  const tEnd = 1.1;
  const u = Math.min(1, Math.abs(yaw) / yawMax);
  return tMid + (tEnd - tMid) * u * u;
}

/** Lower band: center up, ends keep dropping so the 3/4 tail stays a slant. */
export function lowerTheta(yaw: number): number {
  const yawMax = 1.05;
  const tMid = 2.0;
  const tEnd = 2.14;
  const u = Math.min(1, Math.abs(yaw) / yawMax);
  return tMid + (tEnd - tMid) * u * u;
}

const UB_MID = upperTheta(0);
const UB_IN = upperTheta(0.55);
const UB_TEMPLE = upperTheta(1.0);
const UB_END = upperTheta(1.3);
const LB_MID = lowerTheta(0);
const LB_SIDE = lowerTheta(0.7);

export const ARMOR_PATCHES: PatchSpec[] = [
  { yaw0: -Math.PI, yaw1: Math.PI, theta0: 0.0, theta1: 0.14, w: 48, h: 6 },

  { yaw0: -0.95, yaw1: -0.4 - C, theta0: 0.14 + S, theta1: 0.78, w: 14, h: 16 },
  { yaw0: -0.4 + C, yaw1: -C, theta0: 0.14 + S, theta1: 0.8, w: 10, h: 16 },
  { yaw0: C, yaw1: 0.4 - C, theta0: 0.14 + S, theta1: 0.8, w: 10, h: 16 },
  { yaw0: 0.4 + C, yaw1: 0.95, theta0: 0.14 + S, theta1: 0.78, w: 14, h: 16 },
  { yaw0: -1.18, yaw1: -0.95 - S, theta0: 0.16, theta1: 0.78, w: 8, h: 14 },
  { yaw0: 0.95 + S, yaw1: 1.18, theta0: 0.16, theta1: 0.78, w: 8, h: 14 },

  { yaw0: 2.08, yaw1: 4.2, theta0: 0.14 + S, theta1: 0.41, w: 28, h: 10 },
  { yaw0: 1.2, yaw1: 2.06, theta0: 0.16, theta1: 0.41, w: 16, h: 8 },
  { yaw0: -2.06, yaw1: -1.2, theta0: 0.16, theta1: 0.41, w: 16, h: 8 },

  { yaw0: -0.5, yaw1: 0.5, theta0: 0.78 + S, theta1: UB_MID - BT, w: 18, h: 10 },
  { yaw0: -1.28, yaw1: -0.5 - S, theta0: 0.78 + S, theta1: UB_TEMPLE - BT, w: 16, h: 10 },
  { yaw0: 0.5 + S, yaw1: 1.28, theta0: 0.78 + S, theta1: UB_TEMPLE - BT, w: 16, h: 10 },

  { yaw0: -0.82, yaw1: -0.36, theta0: UB_IN + BT, theta1: 1.94, w: 12, h: 16 },
  { yaw0: 0.36, yaw1: 0.82, theta0: UB_IN + BT, theta1: 1.94, w: 12, h: 16 },
  { yaw0: -0.34, yaw1: 0.34, theta0: 1.88, theta1: LB_MID - BT, w: 12, h: 6 },
  { yaw0: -1.28, yaw1: -0.82 - S, theta0: 1.42, theta1: LB_SIDE - BT, w: 10, h: 12 },
  { yaw0: 0.82 + S, yaw1: 1.28, theta0: 1.42, theta1: LB_SIDE - BT, w: 10, h: 12 },

  { yaw0: -0.9, yaw1: 0.9, theta0: LB_MID + BT, theta1: 2.58, w: 22, h: 12 },
  { yaw0: -1.28, yaw1: -0.9 - S, theta0: LB_SIDE + BT, theta1: 2.5, w: 8, h: 10 },
  { yaw0: 0.9 + S, yaw1: 1.28, theta0: LB_SIDE + BT, theta1: 2.5, w: 8, h: 10 },

  { yaw0: -2.05, yaw1: -1.32, theta0: 0.42, theta1: UB_END - BT, w: 16, h: 16 },
  { yaw0: 1.32, yaw1: 2.05, theta0: 0.42, theta1: UB_END - BT, w: 16, h: 16 },
  { yaw0: -2.05, yaw1: -1.32, theta0: UB_END + BT, theta1: 2.52, w: 16, h: 16 },
  { yaw0: 1.32, yaw1: 2.05, theta0: UB_END + BT, theta1: 2.52, w: 16, h: 16 },

  { yaw0: 2.08, yaw1: 4.2, theta0: 0.42, theta1: 1.55, w: 28, h: 16 },
  { yaw0: 2.08, yaw1: 4.2, theta0: 1.57, theta1: 2.55, w: 28, h: 14 },

  { yaw0: 0.5, yaw1: 2.5, theta0: 2.6, theta1: 3.05, w: 20, h: 8 },
  { yaw0: -2.5, yaw1: -0.5, theta0: 2.6, theta1: 3.05, w: 20, h: 8 },
];

export function spherePatchArgs(
  patch: PatchSpec,
  radius = PLATE_R,
): ConstructorParameters<typeof THREE.SphereGeometry> {
  const w = patch.w ?? 16;
  const h = patch.h ?? 12;
  return [
    radius,
    w,
    h,
    patch.yaw0 + Math.PI / 2,
    patch.yaw1 - patch.yaw0,
    patch.theta0,
    patch.theta1 - patch.theta0,
  ];
}

export function upperBandCurve(radius = BAND_R): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const n = 48;
  const yaw0 = -1.3;
  const yaw1 = 1.3;
  for (let i = 0; i <= n; i++) {
    const yaw = yaw0 + (yaw1 - yaw0) * (i / n);
    pts.push(crownLinePoint(yaw, upperTheta(yaw), radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function lowerBandCurve(radius = BAND_R): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const n = 48;
  const yawMax = 1.05;
  for (let i = 0; i <= n; i++) {
    const yaw = -yawMax + (2 * yawMax * i) / n;
    pts.push(crownLinePoint(yaw, lowerTheta(yaw), radius));
  }
  return new THREE.CatmullRomCurve3(pts);
}

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
    const dir = new THREE.Vector3(
      TEMPLE_DIR.x * side,
      TEMPLE_DIR.y,
      TEMPLE_DIR.z,
    ).normalize();
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

  const cutGroove = (yaw: number, t0: number, t1: number, radius: number) => {
    const curve = crownLineCurve(yaw, t0, t1, 1.0);
    const tubeGeo = new THREE.TubeGeometry(curve, 40, radius, 8, false);
    const brush = new Brush(tubeGeo);
    brush.updateMatrixWorld();
    try {
      result = evaluator.evaluate(result, brush, SUBTRACTION);
    } catch {
      /* keep hull if a groove boolean fails */
    }
    tubeGeo.dispose();
  };
  cutGroove(-0.4, 0.16, 0.8, 0.016);
  cutGroove(0, 0.14, 0.84, 0.016);
  cutGroove(0.4, 0.16, 0.8, 0.016);

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
