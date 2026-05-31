"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  opacity: number;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles on client mount to avoid hydration mismatch
    const generated: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2px to 6px
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * -20}s`,
      duration: `${Math.random() * 20 + 20}s`, // 20s to 40s
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background radial/mesh glows */}
      <div className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/5 blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/5 blur-[120px] animate-float-reverse" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full bg-fuchsia-500/3 blur-[100px] animate-pulse-slow" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-violet-400 pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animation: `float-orb ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
            filter: "blur(1px)",
            boxShadow: `0 0 10px rgba(167, 139, 250, ${p.opacity})`,
          }}
        />
      ))}

      {/* Dark overlay grid for professional tech/AI feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
    </div>
  );
}
