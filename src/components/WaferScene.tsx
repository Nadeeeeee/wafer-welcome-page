import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Image, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import {
  FLAVORS,
  SECTION_BG,
  STATIONS,
  scrollState,
  smoothstep,
  type Flavor,
} from "@/lib/scroll-store";

const lerpK = (k: number, delta: number) => 1 - Math.exp(-k * delta);

function ProductPack({ flavor, scale = 1 }: { flavor: Flavor; scale?: number }) {
  return (
    <Float speed={1.35} rotationIntensity={0.08} floatIntensity={0.45}>
      <Image
        url={flavor.image}
        transparent
        toneMapped={false}
        scale={[5.4 * scale, 4.05 * scale]}
      />
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
    if (!A || !B) return;

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
  sectionIndex,
  scale = 1,
}: {
  station: (typeof STATIONS)[number];
  flavor: Flavor;
  sectionIndex: number;
  scale?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const currentSection = scrollState.progress * (STATIONS.length - 1);
    group.current.visible = Math.round(currentSection) === sectionIndex;
  });

  return (
    <group ref={group} position={station.pos}>
      <ProductPack flavor={flavor} scale={scale} />
    </group>
  );
}

function ProductFinale({ station }: { station: (typeof STATIONS)[number] }) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const currentSection = scrollState.progress * (STATIONS.length - 1);
    group.current.visible = Math.round(currentSection) === STATIONS.length - 1;
  });

  return (
    <group ref={group} position={station.pos}>
      {FLAVORS.slice(0, 3).map((flavor, index) => (
        <group
          key={flavor.id}
          position={[(index - 1) * 2.3, index === 1 ? 0.7 : -0.25, index * -0.12]}
        >
          <ProductPack flavor={flavor} scale={0.62} />
        </group>
      ))}
    </group>
  );
}

export function WaferScene() {
  const cheese = FLAVORS[0];
  const firstStation = STATIONS[0];
  const outroStation = STATIONS[STATIONS.length - 1];
  if (!cheese || !firstStation || !outroStation) return null;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: firstStation.cam, fov: 45 }}
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
        station={firstStation}
        flavor={cheese}
        sectionIndex={0}
        scale={0.9}
      />

      {/* Product stops */}
      {FLAVORS.map((flavor, index) => {
        const station = STATIONS[index + 1];
        return station ? (
          <ProductStop
            key={flavor.id}
            station={station}
            flavor={flavor}
            sectionIndex={index + 1}
            scale={0.9}
          />
        ) : null;
      })}

      {/* Outro: a fan of the range */}
      <ProductFinale station={outroStation} />

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
