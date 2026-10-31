import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";

// 10 s, 60 fps visual-effects clip on the real (AI-edited) substation photo: a drone flies in from the left,
// hits the cable net in front of the transformer and detonates; posts and net hold, smoke drifts away.
export const IMPACT_FPS = 60;
export const IMPACT_FRAMES = 600;

const HIT = 230; // impact frame
const TARGET = { x: 610, y: 745 }; // point on the net, in 1920x1080 frame space
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* Quadcopter seen slightly from below: dark body, four arms, motion-blurred rotor discs */
function Drone({ spin }: { spin: number }) {
  const arms: [number, number][] = [[-46, -22], [46, -22], [-46, 22], [46, 22]];
  return (
    <svg viewBox="-80 -50 160 100" width={170} height={106} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="rotor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a3f44" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3a3f44" stopOpacity="0.05" />
        </radialGradient>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b4045" />
          <stop offset="100%" stopColor="#0f1113" />
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="0.6" /></filter>
      </defs>
      {arms.map(([x, y], i) => (
        <g key={i}>
          <line x1={0} y1={0} x2={x} y2={y} stroke="#15181b" strokeWidth={6} strokeLinecap="round" />
          <circle cx={x} cy={y} r={5} fill="#1d2125" />
          <ellipse cx={x} cy={y - 3} rx={26} ry={6} fill="url(#rotor)" transform={`rotate(${(spin + i * 45) % 8 - 4} ${x} ${y - 3})`} />
        </g>
      ))}
      <rect x={-18} y={-11} width={36} height={22} rx={7} fill="url(#body)" filter="url(#soft)" />
      <rect x={-9} y={9} width={18} height={10} rx={3} fill="#0b0d0f" />
      <circle cx={-14} cy={0} r={2} fill="#ff3b30" opacity={spin % 30 < 15 ? 1 : 0.2} />
    </svg>
  );
}

export const DroneImpact = () => {
  const f = useCurrentFrame();

  // flight: from off-screen left, slightly descending, growing as it approaches, with a gentle wobble
  const t = interpolate(f, [20, HIT], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const x = interpolate(t, [0, 1], [-180, TARGET.x]);
  const y = interpolate(t, [0, 1], [430, TARGET.y]) + Math.sin(f / 9) * 6 * (1 - t);
  const s = interpolate(t, [0, 1], [0.55, 0.9]);
  const tilt = interpolate(t, [0, 1], [8, 14]) + Math.sin(f / 13) * 3;
  const flying = f < HIT;

  // impact effects
  const k = f - HIT;
  const flash = k >= 0 ? Math.max(0, 1 - k / 16) : 0;
  const ring = k >= 0 ? interpolate(k, [0, 24], [0, 1], CLAMP) : 0;
  const shake = k >= 0 && k < 26 ? (1 - k / 26) * 14 : 0;
  const sx = shake * (random(`sx${f}`) - 0.5);
  const sy = shake * (random(`sy${f}`) - 0.5);
  const grade = k >= 0 ? interpolate(k, [0, 6, 40], [1.18, 1.06, 1], CLAMP) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(1.02)` }}>
        <Img src={staticFile("after-substation-real.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${grade}) contrast(1.05) saturate(0.95)` }} />

        {/* drone */}
        {flying && (
          <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${tilt}deg)`, filter: `blur(${0.4 + t * 0.6}px) drop-shadow(0 6px 6px rgba(0,0,0,.35))` }}>
            <Drone spin={f * 7} />
          </div>
        )}

        {/* smoke: soft grey puffs that grow, rise and drift right, fading out (SVG circles with a blur filter) */}
        {k >= 0 && (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <filter id="smokeBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
            </defs>
            <g filter="url(#smokeBlur)">
              {Array.from({ length: 80 }).map((_, i) => {
                const start = Math.floor(random(`st${i}`) * 40);
                const life = k - start;
                if (life < 0) return null;
                const p = Math.min(1, life / (240 + random(`lf${i}`) * 140));
                const px = TARGET.x + (random(`px${i}`) - 0.5) * 90 + p * (80 + random(`dx${i}`) * 300) + Math.sin(life / 20 + i) * 12;
                const py = TARGET.y + (random(`py${i}`) - 0.5) * 50 - p * (260 + random(`dy${i}`) * 220);
                const r = 18 + p * (70 + random(`r${i}`) * 70);
                const o = interpolate(p, [0, 0.05, 1], [0, 0.5, 0], CLAMP) * (0.5 + random(`o${i}`) * 0.5);
                const g = 95 + Math.floor(random(`g${i}`) * 80);
                return <circle key={i} cx={px} cy={py} r={r} fill={`rgb(${g},${g},${g + 4})`} opacity={o} />;
              })}
            </g>
          </svg>
        )}

        {/* sparks and small debris thrown back from the net, falling with gravity */}
        {k >= 0 && k < 70 && Array.from({ length: 40 }).map((_, i) => {
          const a = (-0.95 + random(`a${i}`) * 1.9) * Math.PI;
          const v = 6 + random(`v${i}`) * 14;
          const px = TARGET.x + Math.cos(a) * v * k * 0.9 - k * 1.2;
          const py = TARGET.y + Math.sin(a) * v * k * 0.6 + 0.09 * k * k;
          const o = Math.max(0, 1 - k / (30 + random(`so${i}`) * 40));
          const hot = random(`h${i}`) > 0.45;
          return <div key={i} style={{ position: "absolute", left: px, top: py, width: hot ? 4 : 5, height: hot ? 4 : 3, borderRadius: hot ? "50%" : 1, background: hot ? "#ffd27a" : "#1a1a1a", opacity: o, boxShadow: hot ? "0 0 8px 2px rgba(255,170,60,.8)" : "none" }} />;
        })}

        {/* shockwave ring */}
        {k >= 0 && k < 26 && (
          <div style={{ position: "absolute", left: TARGET.x - 220 * ring, top: TARGET.y - 140 * ring, width: 440 * ring, height: 280 * ring, borderRadius: "50%", border: `${3 * (1 - ring)}px solid rgba(255,240,220,${0.5 * (1 - ring)})`, filter: "blur(1px)" }} />
        )}

        {/* fireball flash */}
        {flash > 0 && (
          <>
            <div style={{ position: "absolute", left: TARGET.x - 300, top: TARGET.y - 300, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,235,${flash}) 0%, rgba(255,214,120,${flash}) 14%, rgba(255,140,40,${flash * 0.85}) 30%, rgba(220,70,20,${flash * 0.45}) 48%, rgba(200,60,20,0) 66%)` }} />
            <AbsoluteFill style={{ background: `rgba(255,200,150,${flash * 0.12})` }} />
          </>
        )}
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 18, bottom: 14, fontFamily: "Consolas, monospace", fontSize: 16, color: "rgba(255,255,255,.55)" }}>Visualisation · not real footage</div>
    </AbsoluteFill>
  );
};
