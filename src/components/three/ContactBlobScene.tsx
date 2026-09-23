import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const COUNT = 90;
const LINK_DIST = 1.9;
const MAX_SEGMENTS = 6000;
const CURSOR_LINKS = 4;
const BASE_COLOR = new THREE.Color(0xd80711);

function makeSoftDotTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255, 255, 255, 1)');
    g.addColorStop(0.4, 'rgba(255, 255, 255, 0.7)');
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

let cachedTexture: THREE.CanvasTexture | null = null;
function getSoftDotTexture() {
  if (!cachedTexture) cachedTexture = makeSoftDotTexture();
  return cachedTexture;
}

function ConnectField() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const cursorWorld = useRef(new THREE.Vector3(0, 0, 0));
  const cursorActive = useRef(false);

  const base = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      arr.push(
        (Math.random() * 2 - 1) * 7,
        (Math.random() * 2 - 1) * 4,
        (Math.random() * 2 - 1) * 2.5
      );
    }
    return arr;
  }, []);

  const speeds = useMemo(() => {
    const s = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      s[i] = (Math.random() * 2 - 1) * 0.12 + (Math.random() < 0.5 ? -0.05 : 0.05);
    }
    return s;
  }, []);

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(base), 3));
    return g;
  }, [base]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_SEGMENTS * 6), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_SEGMENTS * 6), 3));
    return g;
  }, []);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const posArray = pointsGeo.attributes.position.array as Float32Array;
  const linePos = lineGeo.attributes.position.array as Float32Array;
  const lineCol = lineGeo.attributes.color.array as Float32Array;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    // Field only reacts once the user has moved the pointer here
    const onEnter = () => {
      cursorActive.current = true;
      document.removeEventListener('mousemove', onEnter);
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mousemove', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousemove', onEnter);
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;

    // Cursor → point on the z=0 field plane
    if (cursorActive.current) {
      ndc.set(pointer.current.x, pointer.current.y);
      raycaster.setFromCamera(ndc, camera);
      const o = raycaster.ray.origin;
      const d = raycaster.ray.direction;
      if (Math.abs(d.z) > 1e-5) {
        const distT = -o.z / d.z;
        cursorWorld.current.set(
          THREE.MathUtils.clamp(o.x + d.x * distT, -6, 6),
          THREE.MathUtils.clamp(o.y + d.y * distT, -3, 3),
          0
        );
      }
    }

    // Drift points along orbital swirls (idle motion even without mouse)
    for (let i = 0; i < COUNT; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const bz = base[i * 3 + 2];
      const a = speeds[i] * t;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      posArray[i * 3] = bx * ca + bz * sa;
      posArray[i * 3 + 1] = by;
      posArray[i * 3 + 2] = -bx * sa + bz * ca;
    }
    pointsGeo.attributes.position.needsUpdate = true;

    // Constellate: connect close pairs + nearest cursor nodes
    const pulse = 0.85 + 0.15 * Math.sin(t * 0.4);
    const cx = cursorWorld.current.x;
    const cy = cursorWorld.current.y;
    const cz = cursorWorld.current.z;

    let idx = 0;
    const push = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, glow: number) => {
      if (idx + 6 > lineCol.length) return false;
      linePos[idx] = ax; linePos[idx + 1] = ay; linePos[idx + 2] = az;
      linePos[idx + 3] = bx; linePos[idx + 4] = by; linePos[idx + 5] = bz;
      const c = glow * pulse;
      lineCol[idx] = BASE_COLOR.r * c;
      lineCol[idx + 1] = BASE_COLOR.g * c;
      lineCol[idx + 2] = BASE_COLOR.b * c;
      lineCol[idx + 3] = BASE_COLOR.r * c;
      lineCol[idx + 4] = BASE_COLOR.g * c;
      lineCol[idx + 5] = BASE_COLOR.b * c;
      idx += 6;
      return true;
    };

    const d2 = LINK_DIST * LINK_DIST;
    for (let i = 0; i < COUNT && idx < lineCol.length - 6; i++) {
      const ax = posArray[i * 3];
      const ay = posArray[i * 3 + 1];
      const az = posArray[i * 3 + 2];
      for (let j = i + 1; j < COUNT && idx < lineCol.length - 6; j++) {
        const dx = ax - posArray[j * 3];
        const dy = ay - posArray[j * 3 + 1];
        const dz = az - posArray[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < d2) {
          const mid = Math.sqrt(
            ((ax + posArray[j * 3]) / 2 - cx) ** 2 +
              ((ay + posArray[j * 3 + 1]) / 2 - cy) ** 2 +
              ((az + posArray[j * 3 + 2]) / 2 - cz) ** 2
          );
          const glow = 0.1 + 0.25 * Math.max(0, 1 - mid / 5);
          push(
            ax, ay, az,
            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2],
            glow
          );
        }
      }
    }

    // Cursor hub links — the "connection" moment
    if (cursorActive.current) {
      const dists: { d: number; i: number }[] = [];
      for (let i = 0; i < COUNT; i++) {
        const dx = posArray[i * 3] - cx;
        const dy = posArray[i * 3 + 1] - cy;
        const dz = posArray[i * 3 + 2] - cz;
        const dd = dx * dx + dy * dy + dz * dz;
        let placed = false;
        for (let k = 0; k < dists.length; k++) {
          if (dd < dists[k].d) {
            dists.splice(k, 0, { d: dd, i });
            placed = true;
            break;
          }
        }
        if (!placed && dists.length < CURSOR_LINKS) dists.push({ d: dd, i });
        if (dists.length > CURSOR_LINKS) dists.pop();
      }
      for (const { i } of dists) {
        push(
          posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
          cx, cy, cz,
          0.45
        );
      }
    }

    lineGeo.setDrawRange(0, idx);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;

    // Gentle parallax tilt
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.current.x * 0.08,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.current.y * 0.06,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          map={getSoftDotTexture()}
          color="#dfe1e8"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial
          transparent
          vertexColors
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function ContactBlobScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ConnectField />
    </Canvas>
  );
}