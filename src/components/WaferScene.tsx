import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import {
  FLAVORS,
  SECTION_BG,
  STATIONS,
  scrollState,
  smoothstep,
  type Flavor,
} from "@/lib/scroll-store";
import { createWaferTexture } from "@/lib/wafer-textures";

const lerpK = (k: number, delta: number) => 1 - Math.exp(-k * delta);

function WaferStack({
  flavor,
  waferTex,
  seedRotation = 0,
}: {
  flavor: Flavor;
  waferTex: THREE.CanvasTexture;
  seedRotation?: number;
}) {
  const layers = [];
  // 5 wafers + 4 cream layers, stacked bottom-up.
  let y = -0.75;
  for (let i = 0; i < 5; i++) {
    layers.push(
      <RoundedBox
        key={`w${i}`}
        args={[2.3, 0.14, 2.3]}
        radius={0.05}
        smoothness={3}
        position={[0, y + 0.07, 0]}
      >
        <meshStandardMaterial map={waferTex} roughness={0.75} />
      </RoundedBox>,
    );
    y += 0.14;
    if (i < 4) {
      layers.push(
        <RoundedBox
          key={`c${i}`}
          args={[2.34, 0.2, 2.34]}
          radius={0.09}
          smoothness={3}
          position={[0, y + 0.1, 0]}
        >
          <meshStandardMaterial color={flavor.cream} roughness={0.32} />
        </RoundedBox>,
      );
      y += 0.2;
    }
  }

  return (
    <Float speed={1.6} rotationIntensity={0.22} floatIntensity={0.9}>
      <group rotation={[0.05, seedRotation, 0.05]}>{layers}</group>
    </Float>
  );
}

function CameraRig() {
  const rig = useMemo(
    () => ({
      camTarget: new THREE.Vector3(),
      lookTarget: new THREE.Vector3(),
      lookCurrent: new THREE.Vector3(0, 0.85, 0),
      bg: new THREE.Color(),
    }),
    [],
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const t = scrollState.progress * (STATIONS.length - 1);
    const i = Math.min(Math.floor(t), STATIONS.length - 2);
    const f = smoothstep(t - i);
    const A = STATIONS[i];
    const B = STATIONS[i + 1];

    rig.camTarget.set(
      THREE.MathUtils.lerp(A.cam[0], B.cam[0], f),
      THREE.MathUtils.lerp(A.cam[1], B.cam[1], f),
      THREE.MathUtils.lerp(A.cam[2], B.cam[2], f),
    );
    state.camera.position.lerp(rig.camTarget, lerpK(5, delta));

    rig.lookTarget.set(
      THREE.MathUtils.lerp(A.look[0], B.look[0], f),
      THREE.MathUtils.lerp(A.look[1], B.look[1], f),
      THREE.MathUtils.lerp(A.look[2], B.look[2], f),
    );
    rig.lookCurrent.lerp(rig.lookTarget, lerpK(5, delta));
    state.camera.lookAt(rig.lookCurrent);

    // Blend the scene background + fog tint toward the active section color.
    const active = Math.min(Math.round(t), SECTION_BG.length - 1);
    rig.bg.set(SECTION_BG[active] ?? "#fbf1de");
    const bg = state.scene.background as THREE.Color | null;
    if (bg) bg.lerp(rig.bg, lerpK(2.5, delta));
    const fog = state.scene.fog as THREE.Fog | null;
    if (fog) fog.color.lerp(rig.bg, lerpK(2.5, delta));
  });

  return null;
}

const CRUMB_COUNT = 90;

function CrumbField() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const crumbs = useMemo(
    () =>
      Array.from({ length: CRUMB_COUNT }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 3.5 - 0.8,
        z: 4 - Math.random() * 58,
        s: 0.04 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const time = clock.elapsedTime;
    crumbs.forEach((c, i) => {
      dummy.position.set(
        c.x,
        c.y + Math.sin(time * c.speed + c.phase) * 0.3,
        c.z,
      );
      dummy.rotation.set(time * 0.3 + c.phase, time * 0.2, 0);
      dummy.scale.setScalar(c.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, CRUMB_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#d99a4e" roughness={0.8} />
    </instancedMesh>
  );
}

function ProductStop({
  station,
  flavor,
  seedRotation,
  waferTex,
}: {
  station: (typeof STATIONS)[number];
  flavor: Flavor;
  seedRotation: number;
  waferTex: THREE.CanvasTexture;
}) {
  return (
    <group position={station.pos}>
      <WaferStack flavor={flavor} waferTex={waferTex} seedRotation={seedRotation} />
      <ContactShadows
        position={[0, -1.4, 0]}
        scale={7}
        blur={2.6}
        opacity={0.32}
        far={3}
        resolution={256}
        frames={1}
        color="#8a5a2b"
      />
    </group>
  );
}

export function WaferScene() {
  const waferTex = useMemo(() => createWaferTexture(), []);

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: STATIONS[0]!.cam, fov: 45 }}
    >
      <color attach="background" args={["#fbf1de"]} />
      <fog attach="fog" args={["#fbf1de", 13, 30]} />

      <ambientLight intensity={0.65} color="#fff2dd" />
      <directionalLight position={[6, 9, 4]} intensity={1.7} color="#ffe6c0" />
      <directionalLight position={[-6, 4, -6]} intensity={0.5} color="#ffd9e8" />

      <CameraRig />
      <CrumbField />

      {/* Hero: signature vanilla stack, sits low-center under the headline */}
      <ProductStop
        station={STATIONS[0]!}
        flavor={FLAVORS[0]!}
        seedRotation={0.3}
        waferTex={waferTex}
      />

      {/* Four flavor stops */}
      {FLAVORS.map((f, idx) => (
        <ProductStop
          key={f.id}
          station={STATIONS[idx + 1]!}
          flavor={f}
          seedRotation={idx * 0.7}
          waferTex={waferTex}
        />
      ))}

      {/* Outro: trio of stacks */}
      <group position={STATIONS[5]!.pos}>
        <group position={[-1.7, -0.5, 0.3]} scale={0.85}>
          <WaferStack flavor={FLAVORS[0]!} waferTex={waferTex} seedRotation={0.5} />
        </group>
        <group position={[1.6, -0.3, -0.4]} scale={0.8}>
          <WaferStack flavor={FLAVORS[3]!} waferTex={waferTex} seedRotation={1.4} />
        </group>
        <group position={[0.1, 0.6, 0.7]} scale={0.9}>
          <WaferStack flavor={FLAVORS[2]!} waferTex={waferTex} seedRotation={2.2} />
        </group>
        <ContactShadows
          position={[0, -1.6, 0]}
          scale={10}
          blur={2.8}
          opacity={0.3}
          far={3}
          resolution={256}
          frames={1}
          color="#8a5a2b"
        />
      </group>

      <Environment resolution={64}>
        <Lightformer
          intensity={2.2}
          position={[0, 5, 0]}
          rotation-x={Math.PI / 2}
          scale={[10, 10, 1]}
          color="#fff4e0"
        />
        <Lightformer
          intensity={1.2}
          position={[-5, 1, -1]}
          rotation-y={Math.PI / 2}
          scale={[20, 2, 1]}
          color="#ffe3c2"
        />
        <Lightformer
          intensity={0.8}
          position={[5, 1, 0]}
          rotation-y={-Math.PI / 2}
          scale={[20, 2, 1]}
          color="#ffd6e0"
        />
      </Environment>
    </Canvas>
  );
}
