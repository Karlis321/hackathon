import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

// 30 s explainer, 1920x1080 @ 30 fps. Same colours as the deck.
const C = { bg: "#0e1215", panel: "#161c21", line: "#2a343c", grid: "#3e4c56", fg: "#e9edef", muted: "#93a1ab", accent: "#ff7a1a", steel: "#6fa8d6", concrete: "#9aa2a8", risk: "#ef6b62" };
const FONT = "Archivo, 'Arial Narrow', Arial, sans-serif";
const MONO = "'JetBrains Mono', Consolas, monospace";
const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const t = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { ...clamp, easing: ease });

// scene windows (frames)
const S = { bin: [0, 120], truck: [120, 220], sort: [220, 340], posts: [340, 470], lattice: [470, 640], drone: [640, 790], end: [790, 900] } as const;

function Caption({ f, n, text, range }: { f: number; n: number; text: string; range: readonly [number, number] }) {
  const o = Math.min(t(f, range[0], range[0] + 15), 1 - t(f, range[1] - 12, range[1]));
  return (
    <div style={{ position: "absolute", left: 120, bottom: 110, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, display: "flex", alignItems: "baseline", gap: 24 }}>
      <span style={{ fontFamily: MONO, fontSize: 40, color: C.accent }}>{n}</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.fg }}>{text}</span>
    </div>
  );
}

const cablePaths = [
  "M0 0 C 30 -40, 60 40, 90 0 S 150 -30, 180 10",
  "M0 0 C 20 30, 50 -30, 80 10 S 120 40, 160 -10",
  "M0 0 C 40 20, 70 -40, 110 0",
  "M0 0 C 30 -20, 60 30, 100 -5 S 140 25, 170 0",
];

function Bin({ x, y, fill }: { x: number; y: number; fill: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-130} y={-20} width={260} height={180} fill={C.panel} stroke={C.grid} strokeWidth={4} />
      <rect x={-130} y={160 - 150 * fill} width={260} height={150 * fill} fill="#2b3640" />
      <text x={0} y={120} fontFamily={MONO} fontSize={22} fill={C.muted} textAnchor="middle">GRID SHIELD BIN</text>
    </g>
  );
}

function Transformer({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-130} y={-120} width={260} height={240} fill="#2a343c" stroke="#5a6a75" strokeWidth={3} />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-116 + i * 24} y={-96} width={14} height={192} fill="#36434c" />)}
      {[-70, 0, 70].map((bx) => <g key={bx}><rect x={bx - 12} y={-230} width={24} height={110} fill="#7a4b3a" /><circle cx={bx} cy={-236} r={9} fill="#9aa6ae" /></g>)}
      <rect x={-150} y={120} width={300} height={36} fill="#4a565e" />
    </g>
  );
}

export const HowItWorks = () => {
  const f = useCurrentFrame();

  // scene 1: cables drop into the bin
  const binFill = t(f, 20, 110, 0.05, 0.8);
  // scene 2: truck carries the bin to the workshop
  const truckX = t(f, S.truck[0], S.truck[1] - 10, 960, 1500);
  const showBinScenes = f < S.sort[0];
  // scene 3: sorting into three piles
  const sortP = t(f, S.sort[0] + 10, S.sort[1] - 20);
  // scenes 4-6: site build
  const site = f >= S.posts[0] && f < S.end[0];
  const postP = (i: number) => t(f, S.posts[0] + 10 + i * 10, S.posts[0] + 50 + i * 10);
  const wallP = t(f, S.posts[0] + 60, S.posts[1] - 10);
  const latP = t(f, S.lattice[0], S.lattice[1] - 20);
  const ropeP = t(f, S.lattice[0] + 100, S.lattice[1] - 10);
  // scene 6: drone flies in and hits the screen
  const droneX = interpolate(f, [S.drone[0], S.drone[0] + 70], [-160, 520], { ...clamp, easing: Easing.in(Easing.quad) });
  const hit = f >= S.drone[0] + 70;
  const fall = t(f, S.drone[0] + 72, S.drone[0] + 110, 0, 1);
  const flash = hit ? Math.max(0, 1 - (f - (S.drone[0] + 70)) / 14) : 0;
  const endO = t(f, S.end[0], S.end[0] + 20);

  const vLines = Array.from({ length: 23 }, (_, i) => 560 + i * 36);
  const hLines = Array.from({ length: 12 }, (_, i) => 330 + i * 36);
  const posts = [560, 760, 960, 1160, 1360];

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* lattice texture */}
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`, backgroundSize: "96px 96px", opacity: 0.35 }} />
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* ground */}
        <line x1={0} y1={820} x2={1920} y2={820} stroke={C.grid} strokeWidth={3} />

        {showBinScenes && (
          <g>
            {/* depot building on the left, workshop on the right during the truck scene */}
            <g opacity={1 - t(f, S.truck[0], S.truck[0] + 30)}>
              <rect x={220} y={520} width={360} height={300} fill={C.panel} stroke={C.grid} strokeWidth={3} />
              <text x={400} y={500} fontFamily={MONO} fontSize={26} fill={C.muted} textAnchor="middle">SADALES TĪKLS DEPOT</text>
            </g>
            <g opacity={t(f, S.truck[0] + 20, S.truck[0] + 60)}>
              <rect x={1420} y={480} width={400} height={340} fill={C.panel} stroke={C.accent} strokeWidth={3} />
              <text x={1620} y={460} fontFamily={MONO} fontSize={26} fill={C.accent} textAnchor="middle">MATRICA WORKSHOP</text>
            </g>
            {/* truck */}
            <g transform={`translate(${truckX} 0)`}>
              <g opacity={t(f, S.truck[0], S.truck[0] + 20)}>
                <rect x={-210} y={700} width={420} height={70} fill="#3a4650" />
                <rect x={210} y={650} width={120} height={120} fill="#4a5862" />
                <circle cx={-140} cy={790} r={30} fill="#1b2227" stroke={C.grid} strokeWidth={6} />
                <circle cx={140} cy={790} r={30} fill="#1b2227" stroke={C.grid} strokeWidth={6} />
                <circle cx={270} cy={790} r={30} fill="#1b2227" stroke={C.grid} strokeWidth={6} />
              </g>
              <Bin x={0} y={520} fill={binFill} />
            </g>
            {/* falling cable pieces */}
            {f < S.bin[1] && cablePaths.concat(cablePaths).map((d, i) => {
              const start = 10 + i * 11;
              const y = interpolate(f, [start, start + 26], [200, 600], clamp);
              const o = interpolate(f, [start, start + 4, start + 24, start + 28], [0, 1, 1, 0], clamp);
              return <path key={i} d={d} transform={`translate(${880 + (i % 4) * 20} ${y}) rotate(${i * 37})`} stroke={i % 3 === 0 ? C.accent : C.steel} strokeWidth={i % 2 ? 12 : 6} fill="none" strokeLinecap="round" opacity={o} />;
            })}
          </g>
        )}

        {/* scene 3: three piles */}
        {f >= S.sort[0] && f < S.posts[0] && (
          <g>
            {[
              { x: 560, label: "THIN → GRID", color: C.steel, w: 5 },
              { x: 960, label: "THICK → LOW SLATS", color: C.steel, w: 14 },
              { x: 1360, label: "AMKA → ROPE", color: C.accent, w: 10 },
            ].map((p, i) => (
              <g key={p.label} opacity={t(f, S.sort[0] + i * 10, S.sort[0] + 30 + i * 10)}>
                {Array.from({ length: 6 }).map((_, k) => {
                  const fromX = 960, fromY = 300;
                  const x = interpolate(sortP, [0, 1], [fromX, p.x - 100 + k * 40]);
                  const y = interpolate(sortP, [0, 1], [fromY, 760 - (k % 3) * 18]);
                  return <line key={k} x1={x - 80} y1={y} x2={x + 80} y2={y - 6} stroke={p.color} strokeWidth={p.w} strokeLinecap="round" />;
                })}
                <text x={p.x} y={880} fontFamily={MONO} fontSize={30} fill={p.color} textAnchor="middle">{p.label}</text>
              </g>
            ))}
          </g>
        )}

        {/* scenes 4-6: the site */}
        {site && (
          <g>
            <Transformer x={960} y={640} />
            {/* crushed concrete wall */}
            <g transform={`translate(0 ${(1 - wallP) * 60})`} opacity={wallP}>
              <rect x={540} y={760} width={840} height={60} fill="#5b6268" stroke="#77808a" />
              {Array.from({ length: 34 }).map((_, i) => <circle key={i} cx={556 + i * 24} cy={776 + (i % 3) * 12} r={7} fill="#6c747c" />)}
            </g>
            {/* lattice */}
            {vLines.map((x, i) => {
              const p = Math.max(0, Math.min(1, latP * 1.6 - i * 0.025));
              return <line key={`v${x}`} x1={x} y1={330} x2={x} y2={330 + 430 * p} stroke={C.steel} strokeWidth={3} />;
            })}
            {hLines.map((y, i) => {
              const p = Math.max(0, Math.min(1, latP * 2 - 0.4 - i * 0.03));
              return <line key={`h${y}`} x1={560} y1={y} x2={560 + 792 * p} y2={y} stroke={C.steel} strokeWidth={y > 640 ? 10 : 3} />;
            })}
            {/* ties at crossings */}
            {latP > 0.85 && vLines.filter((_, i) => i % 2 === 0).flatMap((x) => hLines.filter((_, j) => j % 2 === 0).map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill={C.fg} opacity={t(f, S.lattice[0] + 120, S.lattice[1] - 10)} />))}
            {/* concrete posts */}
            {posts.map((x, i) => {
              const h = 520 * postP(i);
              return <rect key={x} x={x - 13} y={820 - h} width={26} height={h} fill={C.concrete} stroke="#c3c9cd" strokeWidth={2} />;
            })}
            {/* AMKA ropes */}
            <line x1={540} y1={318} x2={540 + 840 * ropeP} y2={318} stroke={C.accent} strokeWidth={9} strokeLinecap="round" />
            <line x1={540} y1={758} x2={540 + 840 * ropeP} y2={758} stroke={C.accent} strokeWidth={9} strokeLinecap="round" />
            {/* standoff marker */}
            <g opacity={t(f, S.drone[0], S.drone[0] + 20)}>
              <line x1={560} y1={280} x2={830} y2={280} stroke={C.muted} strokeWidth={2} />
              <line x1={560} y1={268} x2={560} y2={292} stroke={C.muted} strokeWidth={2} />
              <line x1={830} y1={268} x2={830} y2={292} stroke={C.muted} strokeWidth={2} />
              <text x={695} y={256} fontFamily={MONO} fontSize={26} fill={C.muted} textAnchor="middle">2 m standoff</text>
            </g>
            {/* drone */}
            {f >= S.drone[0] && (
              <g transform={`translate(${droneX} ${470 + fall * 330}) rotate(${fall * 70})`} opacity={1 - t(f, S.drone[0] + 100, S.drone[0] + 130)}>
                <rect x={-36} y={-10} width={72} height={20} rx={6} fill="#1b2227" stroke={C.fg} strokeWidth={2} />
                <line x1={-60} y1={-18} x2={60} y2={18} stroke={C.fg} strokeWidth={3} />
                <line x1={-60} y1={18} x2={60} y2={-18} stroke={C.fg} strokeWidth={3} />
                {[[-60, -18], [60, 18], [-60, 18], [60, -18]].map(([px, py], k) => <ellipse key={k} cx={px} cy={py} rx={26} ry={5} fill="none" stroke={C.muted} strokeWidth={2} />)}
              </g>
            )}
            {flash > 0 && <circle cx={560} cy={470} r={40 + (1 - flash) * 80} fill={C.accent} opacity={flash * 0.8} />}
            {hit && <text x={1180} y={200} fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.fg} textAnchor="middle" opacity={t(f, S.drone[0] + 80, S.drone[0] + 100)}>Transformer untouched</text>}
          </g>
        )}
      </svg>

      <Caption f={f} n={1} text="Crews throw offcuts in one bin" range={S.bin} />
      <Caption f={f} n={2} text="Matrica collects cables and concrete poles" range={S.truck} />
      <Caption f={f} n={3} text="Sort by thickness" range={S.sort} />
      <Caption f={f} n={4} text="Concrete posts and a crushed-concrete wall" range={S.posts} />
      <Caption f={f} n={5} text="Straight cables, 10 cm grid, tied at crossings" range={S.lattice} />
      <Caption f={f} n={6} text="The drone hits the screen, 2 m out" range={S.drone} />

      {/* end card */}
      <AbsoluteFill style={{ opacity: endO, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <svg viewBox="0 0 64 64" width={180} height={180}>
          <g stroke={C.grid} strokeWidth={1.6}><path d="M12 8V56M32 8V56M52 8V56M8 12H56M8 32H56M8 52H56" /></g>
          <path d="M12 52V12L32 32L52 12V52" fill="none" stroke={C.accent} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.fg, letterSpacing: 2 }}>
          Grid waste becomes <span style={{ color: C.accent }}>grid shield</span>.
        </div>
        <div style={{ fontFamily: MONO, fontSize: 30, color: C.muted, letterSpacing: 8 }}>MATRICA · CLIMATHON 2026</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
