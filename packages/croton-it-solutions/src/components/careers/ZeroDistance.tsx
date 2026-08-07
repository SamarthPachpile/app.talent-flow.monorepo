"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

// Convert lat/lng degrees → unit vector on sphere
function latLngToVec3(lat: number, lng: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  );
}

const LOCATIONS = [
  { label: "London", lat: 51.5, lng: -0.1 },
  { label: "New York", lat: 40.7, lng: -74.0 },
  { label: "São Paulo", lat: -23.5, lng: -46.6 },
  { label: "Dubai", lat: 25.2, lng: 55.3 },
  { label: "Mumbai", lat: 19.1, lng: 72.9 },
  { label: "Singapore", lat: 1.3, lng: 103.8 },
  { label: "Tokyo", lat: 35.7, lng: 139.7 },
  { label: "Sydney", lat: -33.9, lng: 151.2 },
  { label: "Nairobi", lat: -1.3, lng: 36.8 },
  { label: "Toronto", lat: 43.7, lng: -79.4 },
  { label: "Frankfurt", lat: 50.1, lng: 8.7 },
  { label: "Johannesburg", lat: -26.2, lng: 28.0 },
];

export default function ZeroDistance() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(625, 625);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.8;

    // ── Globe sphere (lighter, whiter tone) ───────────────────
    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0xf0ede8, // very light warm white
      emissive: 0x1a1a1a, // subtle self-illumination so dark side isn't pure black
      specular: 0xffffff,
      shininess: 18,
      transparent: true,
      opacity: 0.62,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);

    // ── Wireframe overlay (lighter, more subtle) ──────────────
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xb0aba3,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    });
    const wireframe = new THREE.Mesh(new THREE.SphereGeometry(1.002, 28, 28), wireMat);

    // ── Atmosphere glow ───────────────────────────────────────
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.055,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.12, 48, 48), atmMat);

    // ── Lights ────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.75)); // brighter ambient = whiter overall
    const sun = new THREE.DirectionalLight(0xfffaf0, 1.2);
    sun.position.set(3, 2, 4);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xe8eeff, 0.4);
    fill.position.set(-3, -1, -2);
    scene.add(fill);
    // Rim light from behind for edge glow
    const rim = new THREE.DirectionalLight(0xfff0e0, 0.3);
    rim.position.set(0, 0, -4);
    scene.add(rim);

    // ── Location dots with lat/lng ────────────────────────────
    const dotGroup = new THREE.Group();

    LOCATIONS.forEach(({ lat, lng }, i) => {
      const dir = latLngToVec3(lat, lng);

      // Dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 14, 14),
        new THREE.MeshBasicMaterial({ color: 0xf97316 }),
      );
      dot.position.copy(dir);
      dotGroup.add(dot);

      // Inner bright core
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.01, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      core.position.copy(dir.clone().multiplyScalar(1.001));
      dotGroup.add(core);

      // Pulse ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.028, 0.042, 20),
        new THREE.MeshBasicMaterial({
          color: 0xf97316,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.copy(dir.clone().multiplyScalar(1.012));
      ring.lookAt(dir.clone().multiplyScalar(4));
      dotGroup.add(ring);

      // Outer pulse ring (secondary, slower)
      const ring2 = new THREE.Mesh(
        new THREE.RingGeometry(0.028, 0.038, 20),
        new THREE.MeshBasicMaterial({
          color: 0xfb923c,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        }),
      );
      ring2.position.copy(dir.clone().multiplyScalar(1.013));
      ring2.lookAt(dir.clone().multiplyScalar(4));
      dotGroup.add(ring2);

      // Primary pulse tween
      const t1 = gsap.to(ring.scale, {
        x: 3.2,
        y: 3.2,
        z: 3.2,
        duration: 1.6,
        repeat: -1,
        ease: "power2.out",
        delay: i * 0.18,
        onUpdate: () => {
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - (ring.scale.x - 1) / 2.2);
        },
      });

      // Secondary slower pulse
      const t2 = gsap.to(ring2.scale, {
        x: 4.5,
        y: 4.5,
        z: 4.5,
        duration: 2.2,
        repeat: -1,
        ease: "power1.out",
        delay: i * 0.18 + 0.5,
        onUpdate: () => {
          (ring2.material as THREE.MeshBasicMaterial).opacity =
            0.3 * (1 - (ring2.scale.x - 1) / 3.5);
        },
      });

      animationsRef.current.push(t1, t2);
    });

    // ── Axial tilt 23.5° ─────────────────────────────────────
    const TILT = 0.41;
    [globe, wireframe, dotGroup].forEach((obj) => (obj.rotation.z = TILT));

    scene.add(globe, wireframe, dotGroup);

    // ── GSAP planet rotation ──────────────────────────────────
    [globe, wireframe, dotGroup].forEach((obj) => {
      const t = gsap.to(obj.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
      animationsRef.current.push(t);
    });

    // ── Mouse drag ────────────────────────────────────────────
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - prevX) * 0.004;
      const dy = (e.clientY - prevY) * 0.004;
      [globe, wireframe, dotGroup].forEach((obj) => {
        obj.rotation.y += dx;
        obj.rotation.x += dy;
      });
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // ── Render loop ───────────────────────────────────────────
    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      animationsRef.current.forEach((t) => t.kill());
      renderer.dispose();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <section
      id="locations"
      data-section="locations"
      data-label="Global"
      className="relative bg-[#f0f1f5] overflow-hidden py-32"
    >
      {/* BIG BACKGROUND TEXT */}
      <h2
        className="absolute top-10 left-1/2 -translate-x-1/2
        text-[120px] sm:text-[180px] md:text-[240px]
        font-semibold text-[#2f3a4a] opacity-20 leading-none whitespace-nowrap pointer-events-none"
      >
        'zero distance'
      </h2>

      <div className="relative max-w-[1400px] mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
        {/* THREE.JS GLOBE */}
        <div className="flex justify-center items-center">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(0,0,0,0.78) 0%, transparent 70%)",
                transform: "translateY(50%) scaleY(0.35)",
                filter: "blur(12px)",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ width: 350, height: 350, cursor: "none" }}
              onMouseDown={() => {
                if (canvasRef.current) canvasRef.current.style.cursor = "none";
              }}
              onMouseUp={() => {
                if (canvasRef.current) canvasRef.current.style.cursor = "none";
              }}
            />
          </div>
        </div>

        {/* RIGHT TEXT */}
        <div className="mt-10 md:mt-0 md:pl-10 lg:pl-20">
          <h3 className="text-5xl md:text-7xl font-semibold text-[#2f3a4a] leading-tight">
            to clients
          </h3>
          <p className="mt-6 text-gray-600 max-w-md text-lg">
            Graviton's footprint offers timezone alignment and geographic proximity to support our{" "}
            <span className="font-medium text-[#2f3a4a]">"zero distance"</span> to clients
            philosophy.
          </p>

          {/* Location chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {LOCATIONS.map(({ label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-orange-200/60 text-sm text-[#2f3a4a]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-10 left-10">
        <button className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 transition-colors text-white px-8 py-3.5 rounded-full font-medium shadow-lg">
          See all locations →
        </button>
      </div>
    </section>
  );
}
