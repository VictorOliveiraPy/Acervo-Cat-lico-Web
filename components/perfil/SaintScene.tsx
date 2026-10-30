"use client";

import { Canvas, invalidate, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import type { Group } from "three";

import { SaintModel } from "@/components/perfil/SaintModel";
import type { PatronId } from "@/lib/padroeiros";

/** Quanto cada pixel arrastado gira a imagem, em radianos. */
const DRAG_SPEED = 0.012;
/** Perda de impulso por quadro depois de soltar. */
const FRICTION = 0.92;
/** Depois de soltar, espera este tempo até voltar a balançar. */
const SWAY_DELAY_MS = 2500;
const SWAY_AMPLITUDE = 0.45;
const SWAY_PERIOD_MS = 2400;
const SWAY_EASING = 0.02;
const MIN_VELOCITY = 0.0005;

type Motion = { rotation: number; velocity: number; dragging: boolean; idleSince: number };

/** Aplica o giro a cada quadro. Fica em uma ref: um `setState` por quadro seria caro. */
function Turntable({
  motion,
  reducedMotion,
  children,
}: {
  motion: MutableRefObject<Motion>;
  reducedMotion: boolean;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);

  useFrame(() => {
    const state = motion.current;
    if (!state.dragging) {
      state.velocity *= FRICTION;
      state.rotation += state.velocity;
      const now = performance.now();
      if (!reducedMotion && now - state.idleSince > SWAY_DELAY_MS) {
        const target = Math.sin(now / SWAY_PERIOD_MS) * SWAY_AMPLITUDE;
        state.rotation += (target - state.rotation) * SWAY_EASING;
      }
      // Com movimento reduzido a tela só redesenha sob demanda: pede mais um quadro
      // enquanto ainda sobra impulso do arraste.
      if (reducedMotion && Math.abs(state.velocity) > MIN_VELOCITY) invalidate();
    }
    if (group.current) group.current.rotation.y = state.rotation;
  });

  return <group ref={group}>{children}</group>;
}

/** Cena 3D. Fica isolada neste arquivo para o `three` não pesar no resto da página. */
export default function SaintScene({
  saintId,
  label,
  onFirstDrag,
}: {
  saintId: PatronId;
  label: string;
  onFirstDrag: () => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const motion = useRef<Motion>({
    rotation: 0,
    velocity: 0,
    dragging: false,
    idleSince: Number.NEGATIVE_INFINITY,
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Fora da tela não desenha nada, para não gastar bateria com o que ninguém vê.
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      role="img"
      aria-label={label}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      // `pan-y`: arrastar na vertical continua rolando a página no celular.
      style={{ touchAction: "pan-y" }}
      onPointerDown={(event) => {
        motion.current.dragging = true;
        lastX.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
        onFirstDrag();
      }}
      onPointerMove={(event) => {
        const state = motion.current;
        if (!state.dragging) return;
        const delta = (event.clientX - lastX.current) * DRAG_SPEED;
        lastX.current = event.clientX;
        state.velocity = delta;
        state.rotation += delta;
        invalidate();
      }}
      onPointerUp={() => {
        motion.current.dragging = false;
        motion.current.idleSince = performance.now();
        invalidate();
      }}
      onPointerCancel={() => {
        motion.current.dragging = false;
        motion.current.idleSince = performance.now();
      }}
    >
      <Canvas
        frameloop={onScreen && !reducedMotion ? "always" : "demand"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 28, position: [0, 1.25, 6.4], near: 0.1, far: 50 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.12, 0)}
      >
        <hemisphereLight args={["#FFF4E6", "#4A4036", 2.6]} />
        <directionalLight position={[2.5, 4, 3.5]} intensity={2.6} />
        <directionalLight position={[-2.5, 3, -3]} intensity={1.7} color="#FFD9A0" />
        <Turntable motion={motion} reducedMotion={reducedMotion}>
          <SaintModel saintId={saintId} />
        </Turntable>
      </Canvas>
    </div>
  );
}
