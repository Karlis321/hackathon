import { useState } from "react";

// Isometric drawing of the "Tīkls no tīkla" net around a 20/0.4 kV kiosk substation, with numbered callouts.
// Design from the team summary: 10 x 8 m enclosure, 6 masts (wooden pole banded to a reclaimed concrete stub),
// ~9 m wall net of woven AMKA strand plus a roof net, AMKA ropes, corner guy wires, a lifting gate panel, earthing.
// Units are metres; iso() turns (x, y, z) into screen coordinates.
const S = 25;
const O = { x: 560, y: 300 };
const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
export const iso = (x: number, y: number, z: number): [number, number] => [O.x + (x - y) * C30 * S, O.y + (x + y) * S30 * S - z * S];
const pts = (...p: [number, number, number][]) => p.map((q) => iso(...q).join(",")).join(" ");

const W = 10, D = 8, H = 8.7; // enclosure footprint and net height
const STUB = 1.2; // concrete stub height above ground (another ~2.2 m is below)
const MASTS: [number, number][] = [[0, 0], [5, 0], [10, 0], [10, 8], [5, 8], [0, 8]];
const GATE = { x0: 6.5, x1: 9.3, z: 4.2 }; // lifting gate panel on the front long side (y = D)

export const PARTS: { n: number; h: string; t: string }[] = [
  { n: 1, h: "Mast", t: "Old wooden pole banded to a reclaimed concrete stub" },
  { n: 2, h: "Top rope", t: "AMKA cable, used whole, around the tops and across the roof" },
  { n: 3, h: "Wall net", t: "Woven from AMKA aluminium strands, 50 mm mesh, ~9 m high" },
  { n: 4, h: "Roof net", t: "Against drones diving from above" },
  { n: 5, h: "Gate panel", t: "Lifts for service vehicles" },
  { n: 6, h: "Guy wire", t: "To a ground anchor at each corner" },
  { n: 7, h: "The protected substation", t: "20/0.4 kV kiosk inside a 10 × 8 m enclosure" },
  { n: 8, h: "A drone caught in the wall net", t: "Metal mesh that propellers can't cut" },
];

// point on the right short-side net where the drone is stopped (drawing coordinates, viewBox 1080x760)
export const HIT_POINT = (): [number, number] => iso(W, 3.2, 4.6);

function Mast({ x, y, dim }: { x: number; y: number; dim: number }) {
  const b = iso(x, y, 0), s = iso(x, y, STUB), t = iso(x, y, H + 0.4);
  return (
    <g opacity={dim}>
      <rect x={t[0] - 5} y={t[1]} width={10} height={s[1] - t[1] + 6} fill="url(#wood)" />
      <rect x={b[0] - 7} y={s[1]} width={14} height={b[1] - s[1]} fill="url(#stub)" />
      {[0.55, 0.95].map((z) => { const p = iso(x, y, z); return <rect key={z} x={p[0] - 8} y={p[1] - 2} width={16} height={4} fill="#3b4045" />; })}
    </g>
  );
}

export function ProductCage({ width = 1080, height = 760, callouts = true, showDrone = true, preserve = "xMidYMid meet" }: { width?: number; height?: number; callouts?: boolean; showDrone?: boolean; preserve?: string }) {
  const [hl, setHl] = useState<number | null>(null);
  const dim = (n: number) => (hl === null || hl === n ? 1 : 0.35);
  const back = MASTS.filter(([x, y]) => y === 0 || x === 0);
  const front = MASTS.filter(([x, y]) => !(y === 0 || x === 0));

  const anchors: Record<number, [number, number]> = {
    1: iso(10, 0, 6.5), 2: iso(7.5, 0, H), 3: iso(0, 5.5, 4.5), 4: iso(5, 4, H),
    5: iso((GATE.x0 + GATE.x1) / 2, D, 2.2), 6: iso(-2.6, -2, 0), 7: iso(5, 5.2, 1.4), 8: HIT_POINT(),
  };
  const labels: Record<number, [number, number]> = {
    1: [960, 170], 2: [830, 70], 3: [70, 330], 4: [420, 40], 5: [700, 720], 6: [110, 560], 7: [430, 720], 8: [1010, 430],
  };

  return (
    <svg viewBox="0 0 1080 760" width={width} height={height} preserveAspectRatio={preserve} role="img" aria-label="Drawing of the drone net: masts of wooden poles on concrete stubs, woven AMKA net on all sides and the roof, ropes, guy wires, gate panel, earthing and a stopped drone">
      <defs>
        <pattern id="mesh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H6M0 0V6" stroke="#5e666c" strokeWidth="0.9" />
        </pattern>
        <pattern id="meshRoof" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <path d="M0 0H7M0 0V7" stroke="#5e666c" strokeWidth="0.8" />
        </pattern>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfe0ea" /><stop offset="1" stopColor="#eef3ef" /></linearGradient>
        <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a6a4a" /><stop offset="0.5" stopColor="#6e5136" /><stop offset="1" stopColor="#4f3a27" /></linearGradient>
        <linearGradient id="stub" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#cdd0d2" /><stop offset="0.5" stopColor="#a9aeb1" /><stop offset="1" stopColor="#80868a" /></linearGradient>
      </defs>

      {/* scene */}
      <rect width="1080" height="760" fill="url(#sky)" />
      <rect y="250" width="1080" height="510" fill="#8fb36a" />
      {[[60, 250, 70], [170, 238, 85], [300, 245, 75], [760, 236, 90], [880, 245, 70], [990, 240, 80], [1060, 250, 60]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y - r * 0.4} rx={r} ry={r * 0.75} fill={i % 2 ? "#4f7a3d" : "#5c8946"} />
      ))}
      <polygon points={pts([7, D + 0.2, 0], [9, D + 0.2, 0], [9, D + 12, 0], [7, D + 12, 0])} fill="#cdbf9a" />
      {/* overhead line on the left: where the AMKA comes from */}
      <g>
        {[[-9, 14], [-9, 4], [-9, -6]].map(([x, y], i) => { const b = iso(x, y, 0), t = iso(x, y, 7); return <rect key={i} x={b[0] - 3} y={t[1]} width={6} height={b[1] - t[1]} fill="#7a5a3c" />; })}
        {[6.6, 6.2].map((z) => <path key={z} d={`M${iso(-9, 14, z).join(",")} Q${iso(-9, 9, z - 0.8).join(",")} ${iso(-9, 4, z).join(",")} Q${iso(-9, -1, z - 0.8).join(",")} ${iso(-9, -6, z).join(",")}`} stroke="#1a1d20" strokeWidth="2" fill="none" />)}
      </g>
      <polygon points={pts([0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0])} fill="#9fae86" />

      {/* back walls (net) */}
      <g opacity={dim(1)}>
        <polygon points={pts([0, 0, 0], [0, D, 0], [0, D, H], [0, 0, H])} fill="url(#mesh)" />
        <polygon points={pts([0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H])} fill="url(#mesh)" />
      </g>
      {back.map(([x, y]) => <Mast key={`${x}-${y}`} x={x} y={y} dim={dim(3)} />)}

      {/* kiosk substation */}
      <g>
        <polygon points={pts([3.4, 2.8, 0], [6.6, 2.8, 0], [6.6, 2.8, 2.6], [3.4, 2.8, 2.6])} fill="#cfd4d6" />
        <polygon points={pts([6.6, 2.8, 0], [6.6, 5.2, 0], [6.6, 5.2, 2.6], [6.6, 2.8, 2.6])} fill="#b4babd" />
        <polygon points={pts([3.4, 5.2, 0], [6.6, 5.2, 0], [6.6, 5.2, 2.6], [3.4, 5.2, 2.6])} fill="#e3e6e7" />
        <polygon points={pts([3.2, 2.6, 2.6], [6.8, 2.6, 2.6], [6.8, 5.4, 2.6], [3.2, 5.4, 2.6])} fill="#7d878d" />
        {[3.9, 4.6, 5.3, 6.0].map((x) => <line key={x} x1={iso(x, 5.2, 0.2)[0]} y1={iso(x, 5.2, 0.2)[1]} x2={iso(x, 5.2, 2.4)[0]} y2={iso(x, 5.2, 2.4)[1]} stroke="#9ea6aa" strokeWidth="2" />)}
        <polygon points={pts([4.8, 5.2, 1.8], [5.2, 5.2, 1.8], [5.0, 5.2, 2.15])} fill="#f5c400" stroke="#222" strokeWidth="1" />
      </g>

      {/* roof net */}
      <polygon points={pts([0, 0, H], [W, 0, H], [W, D, H], [0, D, H])} fill="url(#meshRoof)" opacity={dim(2)} />

      {/* front walls (net) */}
      <g opacity={dim(1)}>
        <polygon points={pts([W, 0, 0], [W, D, 0], [W, D, H], [W, 0, H])} fill="url(#mesh)" />
        <polygon points={pts([0, D, 0], [W, D, 0], [W, D, H], [0, D, H])} fill="url(#mesh)" />
      </g>

      {/* gate panel that lifts for service vehicles */}
      <g opacity={dim(7)}>
        <polygon points={pts([GATE.x0, D, 0], [GATE.x1, D, 0], [GATE.x1, D, GATE.z], [GATE.x0, D, GATE.z])} fill="rgba(255,122,26,.10)" stroke="#2b3036" strokeWidth="2.5" />
        <polyline points={pts([GATE.x0, D, GATE.z], [(GATE.x0 + GATE.x1) / 2, D, GATE.z + 1.2], [GATE.x1, D, GATE.z])} stroke="#2b3036" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
      </g>

      {front.map(([x, y]) => <Mast key={`${x}-${y}`} x={x} y={y} dim={dim(3)} />)}

      {/* AMKA ropes: around the tops and across the roof */}
      <g stroke="#111416" strokeWidth="3" fill="none" opacity={dim(4)}>
        <polygon points={pts([0, 0, H], [W, 0, H], [W, D, H], [0, D, H])} />
        <polyline points={pts([5, 0, H], [5, D, H])} />
        <polyline points={pts([0, D, 0.05], [W, D, 0.05], [W, 0, 0.05])} />
      </g>

      {/* guy wires to ground anchors at every corner */}
      <g opacity={dim(6)}>
        {[[0, 0, -2.6, -2], [W, 0, W + 2.6, -2], [W, D, W + 2.6, D + 2], [0, D, -2.6, D + 2]].map(([x, y, ax, ay], i) => {
          const a = iso(x, y, H), g = iso(ax, ay, 0);
          return <g key={i}><line x1={a[0]} y1={a[1]} x2={g[0]} y2={g[1]} stroke="#2b2f33" strokeWidth="1.6" /><rect x={g[0] - 5} y={g[1] - 3} width={10} height={6} fill="#6b6f72" /></g>;
        })}
      </g>

      {/* stub foundation hint: cut-away of the 2.2 m below ground at the front middle mast */}
      <g opacity={dim(5)}>
        {(() => { const a = iso(5, 8, 0), b = iso(5, 8, -2.2); return <rect x={a[0] - 7} y={a[1]} width={14} height={b[1] - a[1]} fill="url(#stub)" opacity={0.45} strokeDasharray="3 3" stroke="#555" />; })()}
      </g>

      {/* earthing */}
      <g opacity={dim(8)}>
        <polyline points={pts([W, D, 0.4], [W + 0.5, D + 0.7, 0])} stroke="#3aa635" strokeWidth="3" fill="none" strokeDasharray="6 4" />
        <polyline points={pts([W, D, 0.4], [W + 0.5, D + 0.7, 0])} stroke="#f2d000" strokeWidth="3" fill="none" strokeDasharray="6 4" strokeDashoffset="5" />
        <circle cx={iso(W + 0.5, D + 0.7, 0)[0]} cy={iso(W + 0.5, D + 0.7, 0)[1]} r="5" fill="#6b6f72" />
      </g>

      {/* drone caught on the side net */}
      {showDrone && (
        <g transform={`translate(${HIT_POINT()[0]} ${HIT_POINT()[1]}) rotate(-18)`} opacity={dim(9)}>
          <line x1="-14" y1="-5" x2="14" y2="5" stroke="#111" strokeWidth="3" /><line x1="-14" y1="5" x2="14" y2="-5" stroke="#111" strokeWidth="3" />
          <rect x="-5" y="-3.5" width="10" height="7" rx="2" fill="#1b1e21" />
        </g>
      )}

      {/* person for scale */}
      <g transform={`translate(${iso(W + 1.6, D + 1.2, 0)[0]} ${iso(W + 1.6, D + 1.2, 0)[1]})`}>
        <rect x="-4" y="-44" width="8" height="24" rx="3" fill="#ff7a1a" />
        <rect x="-4" y="-22" width="3" height="22" fill="#2b3036" /><rect x="1" y="-22" width="3" height="22" fill="#2b3036" />
        <circle cx="0" cy="-50" r="5" fill="#e6c3a5" /><path d="M-6 -52 Q0 -60 6 -52Z" fill="#f2f2f2" />
      </g>

      {/* callouts */}
      {callouts && PARTS.map((p) => {
        const a = anchors[p.n], l = labels[p.n];
        return (
          <g key={p.n} onMouseEnter={() => setHl(p.n)} onMouseLeave={() => setHl(null)} style={{ cursor: "default" }}>
            <line x1={a[0]} y1={a[1]} x2={l[0]} y2={l[1]} stroke="#ffffff" strokeWidth="2" />
            <line x1={a[0]} y1={a[1]} x2={l[0]} y2={l[1]} stroke="#3e4c56" strokeWidth="1" />
            <circle cx={a[0]} cy={a[1]} r="4" fill="#11161a" />
            <circle cx={l[0]} cy={l[1]} r="18" fill="#ff7a1a" stroke="#fff" strokeWidth="2.5" />
            <text x={l[0]} y={l[1] + 7} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="19" fill="#fff">{p.n}</text>
          </g>
        );
      })}
    </svg>
  );
}
