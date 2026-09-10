import { i as __toESM } from "../_runtime.mjs";
import { A as require_react, C as SphereGeometry, E as Vector3, S as Shape, _ as MeshPhongMaterial, a as useThree, b as Quaternion, c as BoxGeometry, d as ExtrudeGeometry, g as MeshLambertMaterial, i as useFrame, k as require_jsx_runtime, m as Matrix4, n as OrbitControls, r as Canvas, t as ContactShadows, u as CylinderGeometry, v as Path } from "../_libs/@react-three/drei+[...].mjs";
import { a as Box, i as Image, r as RotateCw, t as Undo2 } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as Brush, t as Evaluator } from "../_libs/three-bvh-csg+three-mesh-bvh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Z-DBb2MU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useClayKit(wireframe) {
	const kit = (0, import_react.useMemo)(() => {
		return {
			hull: new MeshLambertMaterial({
				color: "#f3efe8",
				emissive: "#d4cfc6",
				emissiveIntensity: .28
			}),
			cavity: new MeshLambertMaterial({
				color: "#b7b0a6",
				emissive: "#8a8378",
				emissiveIntensity: .16
			}),
			glass: new MeshPhongMaterial({
				color: "#f0ece6",
				specular: "#ffffff",
				shininess: 120,
				emissive: "#c9c5be",
				emissiveIntensity: .32
			}),
			accent: new MeshLambertMaterial({
				color: "#ece7df",
				emissive: "#cfc9bf",
				emissiveIntensity: .22
			})
		};
	}, []);
	(0, import_react.useEffect)(() => {
		kit.hull.wireframe = wireframe;
		kit.cavity.wireframe = wireframe;
		kit.glass.wireframe = wireframe;
		kit.accent.wireframe = wireframe;
		kit.hull.needsUpdate = true;
		kit.cavity.needsUpdate = true;
		kit.glass.needsUpdate = true;
		kit.accent.needsUpdate = true;
	}, [kit, wireframe]);
	(0, import_react.useEffect)(() => {
		return () => {
			kit.hull.dispose();
			kit.cavity.dispose();
			kit.glass.dispose();
			kit.accent.dispose();
		};
	}, [kit]);
	return kit;
}
function onSphere(dir, radius = 1) {
	const z = dir.clone().normalize();
	const up = Math.abs(z.y) > .92 ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0);
	const x = new Vector3().crossVectors(up, z).normalize();
	const y = new Vector3().crossVectors(z, x).normalize();
	const m = new Matrix4().makeBasis(x, y, z);
	const quaternion = new Quaternion().setFromRotationMatrix(m);
	const p = z.multiplyScalar(radius);
	return {
		position: [
			p.x,
			p.y,
			p.z
		],
		quaternion
	};
}
function createHullGeometry() {
	const evaluator = new Evaluator();
	evaluator.useGroups = false;
	const sphereGeo = new SphereGeometry(1, 80, 56);
	const sphere = new Brush(sphereGeo);
	sphere.updateMatrixWorld();
	const wellGeo = new CylinderGeometry(.305, .255, .52, 48);
	const well = new Brush(wellGeo);
	well.rotation.x = Math.PI / 2;
	well.position.set(0, -.02, .86);
	well.updateMatrixWorld();
	let result = evaluator.evaluate(sphere, well, 1);
	const cutTemple = (side) => {
		const box = new Brush(new BoxGeometry(.15, .2, .2));
		const dir = new Vector3(.78 * side, .3, .5).normalize();
		box.position.copy(dir.multiplyScalar(.97));
		box.lookAt(0, 0, 0);
		box.rotateY(Math.PI);
		box.updateMatrixWorld();
		result = evaluator.evaluate(result, box, 1);
		box.geometry.dispose();
	};
	cutTemple(-1);
	cutTemple(1);
	const vent = new Brush(new BoxGeometry(.3, .14, .18));
	vent.position.set(0, -.97, .08);
	vent.updateMatrixWorld();
	result = evaluator.evaluate(result, vent, 1);
	vent.geometry.dispose();
	const geo = result.geometry.clone();
	geo.computeVertexNormals();
	sphereGeo.dispose();
	wellGeo.dispose();
	return geo;
}
function createEarShellGeometry() {
	const outline = new Shape();
	outline.moveTo(0, .66);
	outline.bezierCurveTo(.045, .5, .175, .22, .215, .015);
	outline.quadraticCurveTo(.11, -.035, 0, -.045);
	outline.quadraticCurveTo(-.11, -.035, -.215, .015);
	outline.bezierCurveTo(-.175, .22, -.045, .5, 0, .66);
	const hole = new Path();
	hole.moveTo(0, .48);
	hole.bezierCurveTo(-.038, .37, -.11, .16, -.125, .075);
	hole.quadraticCurveTo(0, .03, .125, .075);
	hole.bezierCurveTo(.11, .16, .038, .37, 0, .48);
	outline.holes.push(hole);
	const g = new ExtrudeGeometry(outline, {
		depth: .12,
		bevelEnabled: true,
		bevelThickness: .015,
		bevelSize: .013,
		bevelSegments: 2,
		curveSegments: 18
	});
	g.translate(0, .02, -.06);
	g.computeVertexNormals();
	return g;
}
function createEarCavityGeometry() {
	const s = new Shape();
	s.moveTo(0, .48);
	s.bezierCurveTo(-.038, .37, -.11, .16, -.125, .075);
	s.quadraticCurveTo(0, .03, .125, .075);
	s.bezierCurveTo(.11, .16, .038, .37, 0, .48);
	const g = new ExtrudeGeometry(s, {
		depth: .022,
		bevelEnabled: true,
		bevelThickness: .01,
		bevelSize: .008,
		bevelSegments: 2,
		curveSegments: 14
	});
	g.translate(0, .02, -.055);
	g.computeVertexNormals();
	return g;
}
function earPose(side) {
	const theta = .4;
	const azim = .88;
	const pos = new Vector3(side * Math.sin(theta) * Math.sin(azim), Math.cos(theta), Math.sin(theta) * Math.cos(azim)).setLength(.96);
	const tip = new Vector3(side * .18, .96, .22).normalize();
	const face = new Vector3(-side * .22, .06, .97).normalize();
	const right = new Vector3().crossVectors(tip, face).normalize();
	face.copy(new Vector3().crossVectors(right, tip).normalize());
	const m = new Matrix4().makeBasis(right, tip, face);
	const quaternion = new Quaternion().setFromRotationMatrix(m);
	return {
		position: [
			pos.x,
			pos.y,
			pos.z
		],
		quaternion
	};
}
function AssistantModel({ wireframe }) {
	const kit = useClayKit(wireframe);
	const hull = (0, import_react.useMemo)(() => {
		try {
			return createHullGeometry();
		} catch {
			return new SphereGeometry(1, 64, 48);
		}
	}, []);
	const earShell = (0, import_react.useMemo)(() => createEarShellGeometry(), []);
	const earCavity = (0, import_react.useMemo)(() => createEarCavityGeometry(), []);
	(0, import_react.useEffect)(() => {
		return () => {
			hull.dispose();
			earShell.dispose();
			earCavity.dispose();
		};
	}, [
		hull,
		earShell,
		earCavity
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: "mimi",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				name: "hull",
				geometry: hull,
				material: kit.hull,
				castShadow: true,
				receiveShadow: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripePlates, { kit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FacePlates, { kit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bands, { kit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLines, { kit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ear, {
				side: -1,
				shell: earShell,
				cavity: earCavity,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ear, {
				side: 1,
				shell: earShell,
				cavity: earCavity,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Temple, {
				side: -1,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Temple, {
				side: 1,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lens, { kit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidePod, {
				side: -1,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidePod, {
				side: 1,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feet, { kit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vent, { kit }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, { kit })
		]
	});
}
function Ear({ side, shell, cavity, kit }) {
	const pose = (0, import_react.useMemo)(() => earPose(side), [side]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: pose.position,
		quaternion: pose.quaternion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				name: side < 0 ? "earOuterL" : "earOuterR",
				geometry: shell,
				material: kit.accent,
				castShadow: true,
				receiveShadow: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				name: side < 0 ? "earInnerL" : "earInnerR",
				geometry: cavity,
				material: kit.cavity,
				castShadow: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					-.02,
					0
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.hull,
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.09,
					.018,
					8,
					20
				] })
			})
		]
	});
}
function StripePlates({ kit }) {
	const plates = [
		[
			Math.PI / 2 - .1,
			.2,
			.1,
			.58
		],
		[
			Math.PI / 2 - .32,
			.16,
			.14,
			.48
		],
		[
			Math.PI / 2 + .16,
			.16,
			.14,
			.48
		],
		[
			Math.PI / 2 - .5,
			.13,
			.2,
			.36
		],
		[
			Math.PI / 2 + .37,
			.13,
			.2,
			.36
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		name: "stripePlates",
		children: plates.map(([phi, dPhi, theta, dTheta], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			material: kit.hull,
			castShadow: true,
			receiveShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				1.022,
				18,
				10,
				phi,
				dPhi,
				theta,
				dTheta
			] })
		}, i))
	});
}
function FacePlates({ kit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: "facePlates",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: kit.hull,
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1.016,
					20,
					10,
					Math.PI / 2 - .48,
					.96,
					1.12,
					.28
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: kit.hull,
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1.016,
					20,
					10,
					Math.PI / 2 - .42,
					.84,
					1.72,
					.26
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: kit.hull,
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1.018,
					14,
					10,
					Math.PI / 2 - .92,
					.34,
					1.28,
					.5
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: kit.hull,
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1.018,
					14,
					10,
					Math.PI / 2 + .58,
					.34,
					1.28,
					.5
				] })
			})
		]
	});
}
function Bands({ kit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: "bands",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
				y: .34,
				arc: Math.PI * 1.15,
				rotY: Math.PI / 2 + .22,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
				y: -.3,
				arc: Math.PI * 1.2,
				rotY: Math.PI / 2 + .2,
				kit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
				y: .34,
				arc: Math.PI * .7,
				rotY: -Math.PI / 2 + .15,
				kit,
				tube: .026
			})
		]
	});
}
function Band({ y, arc, rotY, kit, tube = .03 }) {
	const r = Math.sqrt(Math.max(.05, 1 - y * y)) * 1.012;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		rotation: [
			Math.PI / 2,
			rotY,
			0
		],
		position: [
			0,
			y,
			0
		],
		material: kit.accent,
		castShadow: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
			r,
			tube,
			10,
			48,
			arc
		] })
	});
}
function PanelLines({ kit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: "panelLines",
		children: [[
			.62,
			.12,
			-.12,
			-.55
		].map((y) => {
			const r = Math.sqrt(Math.max(.05, 1 - y * y)) * 1.004;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					y,
					0
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					r,
					.005,
					6,
					64
				] })
			}, y);
		}), [
			.22,
			-.22,
			.7,
			-.7
		].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			rotation: [
				0,
				a,
				Math.PI / 2
			],
			material: kit.cavity,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				1.004,
				.0045,
				6,
				48,
				Math.PI * .7
			] })
		}, a))]
	});
}
function Temple({ side, kit }) {
	const pose = (0, import_react.useMemo)(() => onSphere(new Vector3(.78 * side, .3, .5), .985), [side]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: pose.position,
		quaternion: pose.quaternion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: kit.cavity,
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.13,
					.18,
					.06
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.04,
					.028
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.hull,
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.022,
					.022,
					.04,
					12
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					-.04,
					.028
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.hull,
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.022,
					.022,
					.04,
					12
				] })
			})
		]
	});
}
function Lens({ kit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: "lens",
		position: [
			0,
			-.02,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					0,
					.955
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.accent,
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.3,
					.026,
					14,
					48
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					0,
					.93
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.268,
					.268,
					.055,
					48
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					0,
					.78
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.235,
					.255,
					.26,
					32
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					0,
					.88
				],
				material: kit.glass,
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.205,
					36,
					24
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					0,
					1.02
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.155,
					.008,
					8,
					32
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					0,
					1.035
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.11,
					.007,
					8,
					28
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					0,
					1.05
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.072, 28] })
			})
		]
	});
}
function SidePod({ side, kit }) {
	const pose = (0, import_react.useMemo)(() => onSphere(new Vector3(side, -.06, .12), 1), [side]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: pose.position,
		quaternion: pose.quaternion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: kit.hull,
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.16,
					.26,
					.12
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.02,
					.07
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.045,
					.045,
					.04,
					16
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.02,
					.09
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				material: kit.hull,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.045,
					.01,
					8,
					16
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					-.08,
					.07
				],
				material: kit.cavity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.08,
					.03,
					.02
				] })
			})
		]
	});
}
function Feet({ kit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		name: "feet",
		children: [-1, 1].map((side) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				.3 * side,
				-1.04,
				.16
			],
			rotation: [
				.18,
				0,
				-.12 * side
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: kit.cavity,
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.05,
					.058,
					.1,
					12
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					-.055,
					0
				],
				material: kit.hull,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.062,
					.062,
					.022,
					12
				] })
			})]
		}, side))
	});
}
function Vent({ kit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		name: "vent",
		position: [
			0,
			-.98,
			.1
		],
		rotation: [
			.15,
			0,
			0
		],
		children: [
			-.08,
			-.04,
			0,
			.04,
			.08
		].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				x,
				0,
				0
			],
			material: kit.cavity,
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.018,
				.04,
				.12
			] })
		}, x))
	});
}
function Screws({ kit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		name: "screws",
		children: [
			[
				.18,
				.72,
				.66
			],
			[
				-.18,
				.72,
				.66
			],
			[
				.55,
				.42,
				.72
			],
			[
				-.55,
				.42,
				.72
			],
			[
				.62,
				-.22,
				.74
			],
			[
				-.62,
				-.22,
				.74
			],
			[
				.22,
				-.62,
				.74
			],
			[
				-.22,
				-.62,
				.74
			],
			[
				.48,
				.78,
				.38
			],
			[
				-.48,
				.78,
				.38
			]
		].map((dir, i) => {
			const pose = onSphere(new Vector3(...dir), 1.012);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: pose.position,
				quaternion: pose.quaternion,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					material: kit.hull,
					castShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.022,
						.022,
						.018,
						10
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						0,
						.012
					],
					material: kit.cavity,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.018,
						.004,
						.006
					] })
				})]
			}, i);
		})
	});
}
var VIEW_PRESETS = {
	front: {
		eye: [
			0,
			.12,
			4.55
		],
		label: "前视"
	},
	threeQuarter: {
		eye: [
			2.55,
			.55,
			3.7
		],
		label: "¾"
	},
	side: {
		eye: [
			4.5,
			.18,
			.2
		],
		label: "侧视"
	},
	top: {
		eye: [
			.15,
			4.85,
			.35
		],
		label: "顶视"
	},
	back: {
		eye: [
			0,
			.25,
			-4.55
		],
		label: "后视"
	}
};
var useStudio = create((set) => ({
	autoRotate: true,
	wireframe: false,
	showRef: false,
	view: "threeQuarter",
	viewTick: 0,
	setAutoRotate: (autoRotate) => set({ autoRotate }),
	setWireframe: (wireframe) => set({ wireframe }),
	setShowRef: (showRef) => set({ showRef }),
	goToView: (view) => set((s) => ({
		view,
		autoRotate: false,
		viewTick: s.viewTick + 1
	})),
	resetView: () => set((s) => ({
		view: "threeQuarter",
		autoRotate: true,
		wireframe: false,
		viewTick: s.viewTick + 1
	}))
}));
function Studio() {
	const wireframe = useStudio((s) => s.wireframe);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		shadows: "percentage",
		dpr: [1, 2],
		camera: {
			position: [
				2.55,
				.55,
				3.7
			],
			fov: 28,
			near: .1,
			far: 40
		},
		gl: {
			antialias: true,
			preserveDrawingBuffer: true,
			alpha: false,
			toneMapping: 4,
			toneMappingExposure: 1.08
		},
		onCreated: ({ gl }) => {
			gl.setClearColor("#8f8b83", 1);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: ["#8f8b83"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
				attach: "fog",
				args: [
					"#8f8b83",
					11,
					24
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lights, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
					position: [
						0,
						.08,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantModel, { wireframe })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
				position: [
					0,
					-1.2,
					0
				],
				opacity: .42,
				scale: 10,
				blur: 2.6,
				far: 3.2,
				color: "#3f3b34",
				frames: 1
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					-1.21,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [6.5, 48] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshLambertMaterial", { color: "#7f7a73" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {})
		]
	});
}
function Lights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .9 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#ffffff",
			"#5c5852",
			1.15
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				4.2,
				6.2,
				5.4
			],
			intensity: 2.1,
			castShadow: true,
			"shadow-mapSize": [1024, 1024],
			"shadow-camera-near": 1,
			"shadow-camera-far": 22,
			"shadow-camera-left": -3.5,
			"shadow-camera-right": 3.5,
			"shadow-camera-top": 3.5,
			"shadow-camera-bottom": -3.5,
			"shadow-bias": -25e-5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-5.2,
				2.4,
				2.2
			],
			intensity: .9
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-2.4,
				3.6,
				-5
			],
			intensity: .9
		})
	] });
}
function CameraRig() {
	const controls = (0, import_react.useRef)(null);
	const { camera, size } = useThree();
	const autoRotate = useStudio((s) => s.autoRotate);
	const view = useStudio((s) => s.view);
	const viewTick = useStudio((s) => s.viewTick);
	const dest = (0, import_react.useRef)(null);
	const portrait = size.height > size.width * 1.15;
	const targetY = portrait ? -.38 : .08;
	const target = (0, import_react.useRef)(new Vector3(0, targetY, 0));
	target.current.y = targetY;
	(0, import_react.useEffect)(() => {
		const cam = camera;
		cam.fov = portrait ? 34 : 28;
		cam.updateProjectionMatrix();
	}, [camera, portrait]);
	(0, import_react.useEffect)(() => {
		if (!view) return;
		dest.current = new Vector3(...VIEW_PRESETS[view].eye);
	}, [view, viewTick]);
	useFrame((_, rawDt) => {
		const dt = Math.min(rawDt, .1);
		const c = controls.current;
		if (dest.current && c) {
			const k = 1 - Math.pow(8e-4, dt);
			camera.position.lerp(dest.current, k);
			c.target.lerp(target.current, k);
			c.update();
			if (camera.position.distanceTo(dest.current) < .03) dest.current = null;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
		ref: controls,
		makeDefault: true,
		enableDamping: true,
		dampingFactor: .08,
		autoRotate,
		autoRotateSpeed: .55,
		minDistance: 2.5,
		maxDistance: 9,
		minPolarAngle: .18,
		maxPolarAngle: Math.PI / 2 + .42,
		target: [
			0,
			targetY,
			0
		],
		enablePan: true
	});
}
var STAGES = [
	{
		id: "01",
		name: "白模",
		hint: "确认形体",
		current: true
	},
	{
		id: "02",
		name: "上色",
		hint: "材质质感",
		current: false
	},
	{
		id: "03",
		name: "动效",
		hint: "呼吸与表情",
		current: false
	}
];
var VIEW_ORDER = [
	"front",
	"threeQuarter",
	"side",
	"top",
	"back"
];
function StudioOverlay() {
	const autoRotate = useStudio((s) => s.autoRotate);
	const wireframe = useStudio((s) => s.wireframe);
	const showRef = useStudio((s) => s.showRef);
	const view = useStudio((s) => s.view);
	const setAutoRotate = useStudio((s) => s.setAutoRotate);
	const setWireframe = useStudio((s) => s.setWireframe);
	const setShowRef = useStudio((s) => s.setShowRef);
	const goToView = useStudio((s) => s.goToView);
	const resetView = useStudio((s) => s.resetView);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 text-ink-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "absolute top-0 right-0 left-0 flex items-start justify-between gap-4 p-4 md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel pointer-events-auto max-w-[min(100%,22rem)] rounded-xl px-4 py-3 md:rounded-2xl md:px-5 md:py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.68rem] font-medium tracking-[0.22em] text-muted uppercase",
							children: "Language companion"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-2xl leading-none font-semibold tracking-tight text-balance md:text-[1.75rem]",
							children: "MIMI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-[18rem] text-sm leading-snug text-muted",
							children: "当前为粘土白模。拖转查看形体，确认后再上色与动效。"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "hud-panel pointer-events-none hidden rounded-2xl px-4 py-3 sm:block",
					children: STAGES.map((stage, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `flex items-baseline gap-3 py-1.5 ${i < STAGES.length - 1 ? "border-b border-line" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `w-6 font-mono text-[0.7rem] ${stage.current ? "text-accent" : "text-muted"}`,
								children: stage.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-sm ${stage.current ? "text-ink-soft" : "text-muted"}`,
								children: stage.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.7rem] text-muted",
								children: stage.hint
							})
						]
					}, stage.id))
				})]
			}),
			showRef ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto absolute top-36 left-4 overflow-hidden rounded-xl border border-line shadow-lg md:top-40 md:left-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/concept-front.jpg",
					alt: "概念图",
					className: "h-36 w-28 object-cover object-[center_42%] md:h-52 md:w-40"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "bg-panel px-2 py-1 text-center text-[0.65rem] tracking-wide text-muted",
					children: "概念图对照"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "absolute right-0 bottom-0 left-0 flex flex-col gap-3 p-4 md:flex-row md:items-end md:justify-between md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hud-panel pointer-events-none rounded-lg px-3 py-1.5 text-[0.72rem] text-muted",
					children: "拖拽旋转 · 滚轮缩放 · 右键平移"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel pointer-events-auto flex max-w-full flex-wrap items-center gap-1 rounded-xl p-1.5 md:rounded-2xl",
					children: [
						VIEW_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => goToView(id),
							className: `rounded-lg px-2.5 py-2 text-[0.78rem] font-medium transition-colors duration-150 md:px-3 ${view === id ? "bg-ink-soft text-ink" : "text-muted hover:bg-panel-2 hover:text-ink-soft"}`,
							children: VIEW_PRESETS[id].label
						}, id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 hidden h-5 w-px bg-line-strong sm:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: autoRotate,
							onPressed: () => setAutoRotate(!autoRotate),
							label: "旋转",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, {
								className: "size-3.5",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: wireframe,
							onPressed: () => setWireframe(!wireframe),
							label: "线框",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
								className: "size-3.5",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: showRef,
							onPressed: () => setShowRef(!showRef),
							label: "对照",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
								className: "size-3.5",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: resetView,
							className: "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[0.78rem] font-medium text-muted transition-colors duration-150 hover:bg-panel-2 hover:text-ink-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {
								className: "size-3.5",
								strokeWidth: 1.75
							}), "复位"]
						})
					]
				})]
			})
		]
	});
}
function Toggle({ pressed, onPressed, label, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": pressed,
		onClick: onPressed,
		className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[0.78rem] font-medium transition-colors duration-150 ${pressed ? "bg-ink-soft text-ink" : "text-muted hover:bg-panel-2 hover:text-ink-soft"}`,
		children: [icon, label]
	});
}
function Home() {
	const setAutoRotate = useStudio((s) => s.setAutoRotate);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAutoRotate(false);
	}, [setAutoRotate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "studio-root",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioOverlay, {})]
	});
}
//#endregion
export { Home as component };
