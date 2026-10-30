"use client";

import { useMemo, lazy, Suspense } from "react";
import { DoubleSide, Quaternion, Vector2, Vector3 } from "three";

import { patronById, type Patron, type PatronId } from "@/lib/padroeiros";

/**
 * Modelos `.glb` prontos, por santo. Para trocar um santo de primitivas para modelo,
 * ponha o arquivo em `public/modelos/` e registre aqui, por exemplo:
 *   francisco: "/modelos/francisco.glb"
 */
const SAINT_GLB: Partial<Record<PatronId, string>> = {};

// Em arquivo separado: enquanto a lista acima estiver vazia, o `drei` nem é baixado.
const GlbSaint = lazy(() => import("@/components/perfil/GlbSaint"));

const SKIN = "#E2B48C";
const CORD = "#EDE6D6";
const FULL_TURN = Math.PI * 2;
/** Abertura frontal dos mantos: começam e terminam fora da frente da túnica. */
const MANTLE_START = Math.PI * 0.33;
const MANTLE_LENGTH = Math.PI * 1.34;

type Point = readonly [number, number];
type Vec3 = readonly [number, number, number];

function Matte({ color, doubleSided = false }: { color: string; doubleSided?: boolean }) {
  return (
    <meshStandardMaterial
      color={color}
      flatShading
      roughness={0.85}
      metalness={0}
      side={doubleSided ? DoubleSide : undefined}
    />
  );
}

function Gold() {
  return (
    <meshStandardMaterial
      color="#C9A24A"
      flatShading
      metalness={0.6}
      roughness={0.35}
      emissive="#5A4310"
      emissiveIntensity={0.35}
    />
  );
}

/** Peça torneada a partir de um perfil de pontos `[raio, altura]`. */
function Lathe({
  profile,
  color,
  segments = 14,
  start = 0,
  length = FULL_TURN,
}: {
  profile: readonly Point[];
  color: string;
  segments?: number;
  start?: number;
  length?: number;
}) {
  const points = useMemo(() => profile.map(([radius, y]) => new Vector2(radius, y)), [profile]);
  return (
    <mesh>
      <latheGeometry args={[points, segments, start, length]} />
      <Matte color={color} doubleSided />
    </mesh>
  );
}

/** Cilindro entre dois pontos: braços, cordão e haste do lírio. */
function Limb({ from, to, radius, color }: { from: Vec3; to: Vec3; radius: number; color: string }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const direction = b.clone().sub(a);
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      length: direction.length(),
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize()),
    };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius * 1.15, length, 8]} />
      <Matte color={color} />
    </mesh>
  );
}

const TUNICA: readonly Point[] = [
  [0, 0.2],
  [0.5, 0.2],
  [0.52, 0.27],
  [0.44, 0.6],
  [0.34, 1],
  [0.33, 1.2],
  [0.36, 1.44],
  [0.3, 1.55],
  [0.17, 1.65],
  [0.09, 1.72],
  [0, 1.74],
];
const MANTO: readonly Point[] = [
  [0.56, 0.24],
  [0.5, 0.6],
  [0.4, 1],
  [0.39, 1.25],
  [0.42, 1.5],
  [0.34, 1.63],
  [0.16, 1.74],
];
const CAPA: readonly Point[] = [
  [0.47, 0.62],
  [0.42, 1],
  [0.4, 1.25],
  [0.42, 1.5],
  [0.34, 1.63],
  [0.16, 1.74],
];
const CAPUZ: readonly Point[] = [
  [0.17, 1.62],
  [0.27, 1.7],
  [0.25, 1.82],
  [0.16, 1.9],
];
const VEU: readonly Point[] = [
  [0, 2.14],
  [0.15, 2.1],
  [0.23, 1.96],
  [0.25, 1.78],
  [0.32, 1.6],
];

function Halo() {
  return (
    <>
      <mesh position={[0, 1.95, -0.2]}>
        <torusGeometry args={[0.32, 0.022, 8, 40]} />
        <Gold />
      </mesh>
      <mesh position={[0, 1.95, -0.21]}>
        <circleGeometry args={[0.31, 32]} />
        <meshBasicMaterial color="#E8C978" transparent opacity={0.22} side={DoubleSide} />
      </mesh>
    </>
  );
}

function TwelveStars() {
  return (
    <>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * FULL_TURN;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.34, 1.95 + Math.sin(angle) * 0.34, -0.2]}>
            <octahedronGeometry args={[0.04]} />
            <Gold />
          </mesh>
        );
      })}
    </>
  );
}

function FranciscanCord() {
  return (
    <>
      <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.338, 0.02, 6, 20]} />
        <Matte color={CORD} />
      </mesh>
      <Limb from={[0.1, 1, 0.31]} to={[0.14, 0.5, 0.44]} radius={0.018} color={CORD} />
      {[0.85, 0.7, 0.56].map((y) => (
        <mesh key={y} position={[0.1 + (1 - y) * 0.08, y, 0.31 + (1 - y) * 0.26]}>
          <sphereGeometry args={[0.032, 6, 5]} />
          <Matte color={CORD} />
        </mesh>
      ))}
    </>
  );
}

function Lily() {
  return (
    <>
      <Limb from={[0.02, 1.15, 0.38]} to={[-0.24, 2.05, 0.32]} radius={0.014} color="#5E7A4A" />
      {(
        [
          [0.78, 0.06],
          [0.9, 0.07],
          [1, 0.08],
        ] as const
      ).map(([along, radius], index) => (
        <mesh
          key={along}
          position={[0.02 - 0.26 * along + (index - 1) * 0.05, 1.15 + 0.9 * along, 0.37]}
          rotation={[0, 0, 0.3 * (index - 1) + 0.25]}
        >
          <coneGeometry args={[radius, 0.13, 5, 1, true]} />
          <Matte color="#F6F2E6" doubleSided />
        </mesh>
      ))}
    </>
  );
}

function RosesAndCrucifix() {
  const wood = "#4A3324";
  return (
    <>
      <mesh position={[0, 1.33, 0.43]}>
        <boxGeometry args={[0.025, 0.26, 0.025]} />
        <Matte color={wood} />
      </mesh>
      <mesh position={[0, 1.38, 0.43]}>
        <boxGeometry args={[0.13, 0.025, 0.025]} />
        <Matte color={wood} />
      </mesh>
      {(
        [
          [-0.09, 1.22],
          [0.09, 1.21],
          [-0.03, 1.16],
          [0.05, 1.27],
          [-0.11, 1.3],
        ] as const
      ).map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.42]}>
          <icosahedronGeometry args={[0.045, 0]} />
          <Matte color="#A8323E" />
        </mesh>
      ))}
    </>
  );
}

const ATTRIBUTES: Record<Patron["atributo"], () => JSX.Element> = {
  cordao: FranciscanCord,
  estrelas: TwelveStars,
  lirio: Lily,
  rosas: RosesAndCrucifix,
};

/** Santo montado com primitivas low-poly, enquanto não há modelo próprio. */
function LowPolySaint({ patron }: { patron: Patron }) {
  const { cores, capuz, barba, capa, atributo } = patron;
  const Attribute = ATTRIBUTES[atributo];

  return (
    <>
      {/* Pedestal */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.62, 0.68, 0.2, 10]} />
        <Matte color="#CFC8B8" />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.74, 0.76, 0.06, 10]} />
        <Matte color="#B9B19F" />
      </mesh>

      <Lathe profile={TUNICA} color={cores.tunica} />
      {cores.manto ? (
        <Lathe profile={capa ? CAPA : MANTO} color={cores.manto} start={MANTLE_START} length={MANTLE_LENGTH} />
      ) : null}

      {/* Cabeça */}
      <mesh position={[0, 1.9, 0.02]}>
        <sphereGeometry args={[0.21, 14, 12]} />
        <Matte color={SKIN} />
      </mesh>
      {capuz ? (
        <Lathe profile={CAPUZ} color={cores.tunica} segments={12} start={Math.PI * 0.45} length={Math.PI * 1.1} />
      ) : null}
      {cores.cabelo && !barba ? (
        <mesh position={[0, 1.97, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.175, 0.05, 6, 14]} />
          <Matte color={cores.cabelo} />
        </mesh>
      ) : null}
      {cores.cabelo && barba ? (
        <>
          <mesh position={[0, 1.93, -0.02]}>
            <sphereGeometry args={[0.2, 12, 10, 0, FULL_TURN, 0, Math.PI * 0.55]} />
            <Matte color={cores.cabelo} />
          </mesh>
          <mesh position={[0, 1.76, 0.17]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.12, 0.22, 8]} />
            <Matte color={cores.cabelo} />
          </mesh>
        </>
      ) : null}
      {cores.veu ? (
        <Lathe profile={VEU} color={cores.veu} start={Math.PI * 0.28} length={Math.PI * 1.44} />
      ) : null}

      {/* Braços e mãos */}
      <Limb from={[0.33, 1.5, 0.02]} to={[0.08, 1.24, 0.3]} radius={0.075} color={cores.tunica} />
      <Limb from={[-0.33, 1.5, 0.02]} to={[-0.08, 1.24, 0.3]} radius={0.075} color={cores.tunica} />
      <mesh position={[0, 1.27, 0.34]} scale={[1.1, 1, 0.8]}>
        <sphereGeometry args={[0.075, 8, 6]} />
        <Matte color={SKIN} />
      </mesh>

      {atributo === "estrelas" ? null : <Halo />}
      <Attribute />
    </>
  );
}

/**
 * Imagem 3D de um santo: usa o `.glb` quando existir e as primitivas nos demais casos,
 * inclusive enquanto o modelo baixa. Quem usa este componente não precisa saber qual é.
 */
export function SaintModel({ saintId }: { saintId: PatronId }) {
  const patron = patronById(saintId);
  const url = SAINT_GLB[patron.id];
  const fallback = <LowPolySaint patron={patron} />;

  return url ? (
    <Suspense fallback={fallback}>
      <GlbSaint url={url} />
    </Suspense>
  ) : (
    fallback
  );
}
