import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef();
  const count = 20000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for user code compatibility
  
  const positions = useMemo(() => {
     const pos = [];
     for(let i=0; i<count; i++) pos.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
     return pos;
  }, []);

  // Material & Geom
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  const PARAMS = useMemo(() => ({"loopSec":25,"turns":2,"sc":0.9,"glow":0.32,"hue":1,"beam":0.53}), []);
  const addControl = (id, l, min, max, val) => {
      return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };
  const setInfo = () => {};
  const annotate = () => {};

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;
    const THREE_LIB = THREE;

    if(material.uniforms && material.uniforms.uTime) {
         material.uniforms.uTime.value = time;
    }

    for (let i = 0; i < count; i++) {
        // USER CODE START
        const loopSec = Math.round(addControl("loopSec", "Loop Seconds", 4, 20, 12));
        const turns = Math.round(addControl("turns", "Coil Spin Turns", 0, 4, 1));
        const sc = addControl("sc", "Core Scale", 0.5, 2, 1.0);
        const glow = addControl("glow", "Core Glow", 0.2, 1, 0.85);
        const hue = addControl("hue", "Core Hue", 0, 1, 0.54);
        const beam = addControl("beam", "Energy Beam", 0, 1, 0.8);
        const TAU = 6.2831853;
        const lp = (time % loopSec) / loopSec * TAU;
        const u = i / count;
        const a = (i * 0.6180339887) % 1;
        const b = (i * 0.7548776662) % 1;
        const c = (i * 0.3819660113) % 1;
        const rot = lp * turns;
        let x = 0;
        let y = 0;
        let z = 0;
        let h = 0;
        let s = 0;
        let l = 0;
        if (u < 0.20) {
          const ang = a * TAU;
          const phi = b * TAU;
          const rad = 30 + 3.4 * Math.cos(phi);
          x = rad * Math.cos(ang);
          y = rad * Math.sin(ang);
          z = 2.8 * Math.sin(phi);
          h = 0.58;
          s = 0.12;
          l = 0.3 + 0.18 * Math.abs(Math.sin(ang * 12.0)) + 0.1 * Math.max(0, Math.cos(phi));
        } else if (u < 0.30) {
          const ang = a * TAU;
          const r = 14 + b * 15;
          x = r * Math.cos(ang);
          y = r * Math.sin(ang);
          z = -1.8 + (c - 0.5) * 0.8;
          h = 0.6;
          s = 0.2;
          l = 0.1 + 0.07 * Math.abs(Math.sin(ang * 10.0 + rot));
        } else if (u < 0.56) {
          const k = i % 10;
          const ang = k * TAU / 10.0 + rot + (b - 0.5) * 0.42;
          const r = 15 + a * 12;
          x = r * Math.cos(ang);
          y = r * Math.sin(ang);
          z = 0.4 + c * 3.2;
          h = hue;
          s = 0.75 - 0.35 * c;
          l = glow * (0.4 + 0.3 * Math.sin(lp * 3.0 + k * 0.6283) + 0.25 * c);
        } else if (u < 0.66) {
          const ang = a * TAU;
          const phi = b * TAU;
          const rad = 12 + 1.5 * Math.cos(phi);
          x = rad * Math.cos(ang);
          y = rad * Math.sin(ang);
          z = 1.2 + 1.5 * Math.sin(phi);
          h = hue;
          s = 0.45;
          l = glow * (0.65 + 0.2 * Math.sin(lp * 2.0 + ang * 3.0));
        } else if (u < 0.78) {
          const r = Math.sqrt(a) * 10.5;
          const ang = b * TAU;
          x = r * Math.cos(ang);
          y = r * Math.sin(ang);
          z = 0.8 + 0.3 * Math.sin(r * 0.8 - lp * 2.0);
          h = hue;
          s = 0.85 * (r / 10.5);
          l = Math.min(1, glow * (0.95 - 0.35 * r / 10.5 + 0.12 * Math.sin(r * 1.2 - lp * 4.0)));
        } else if (u < 0.88) {
          const ang = a * TAU + lp * 2.0;
          const r = 36 + 10 * b;
          x = r * Math.cos(ang);
          y = r * Math.sin(ang);
          z = (c - 0.5) * 8.0 * Math.sin(a * 17.0);
          h = hue;
          s = 0.8;
          l = glow * 0.5 * Math.max(0, Math.sin(a * 60.0 + lp * 3.0));
        } else {
          const t = (a + lp / TAU * 2.0) % 1;
          const ang = c * TAU;
          const r = (1.0 - t) * 7.0 * b;
          x = r * Math.cos(ang);
          y = r * Math.sin(ang);
          z = 2.0 + t * 45.0;
          h = hue;
          s = 0.6 + 0.4 * t;
          l = beam * glow * (1.0 - t) * 0.9;
        }
        const yaw = Math.sin(lp) * 0.6;
        const cyw = Math.cos(yaw);
        const syw = Math.sin(yaw);
        const px = x * cyw + z * syw;
        const pz = -x * syw + z * cyw;
        const tl = 0.2;
        const ct = Math.cos(tl);
        const st = Math.sin(tl);
        const py = y * ct - pz * st;
        const qz = y * st + pz * ct;
        const pulse = 1.0 + 0.02 * Math.sin(lp * 3.0);
        target.set(px * sc * pulse, py * sc * pulse, qz * sc * pulse);
        color.setHSL(h, Math.min(1, Math.max(0, s)), Math.min(1, Math.max(0, l)));
        if (i === 0) {
          setInfo("Energy Core", "Original ring shaped power core made of particles. Seamless loop of " + loopSec + " seconds. Record exactly one loop for Canva.");
          annotate("top", new THREE.Vector3(0, 48 * sc, 0), "Energy Core");
        }
        // USER CODE END

        positions[i].lerp(target, 0.1);
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={['#000000', 0.01]} />
        <ParticleSwarm />
        <OrbitControls autoRotate={true} />
        <Effects disableGamma>
            <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}