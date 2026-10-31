import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { COMPANIES, HUBS, SITES, type Company, type Country } from "./data";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

export function LogoTile({ c, height = 92 }: { c: Company; height?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="logo-tile" style={{ height }} title={`${c.name}: ${c.what}`}>
      {c.logo && !failed ? (
        <img src={asset(`logos/${c.logo}`)} alt={c.name} onError={() => setFailed(true)} />
      ) : (
        <span className="word">{c.name}</span>
      )}
    </div>
  );
}

/* Drag (or click) to move between the BEFORE and AFTER photos */
export function BeforeAfter({ before, after, w, h }: { before: string; after: string; w: number; h: number }) {
  const [pos, setPos] = useState(0.5);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const update = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  };
  return (
    <div
      ref={ref}
      className="ba"
      style={{ width: w, height: h }}
      onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); update(e.clientX); }}
      onPointerMove={(e) => drag.current && update(e.clientX)}
      onPointerUp={() => (drag.current = false)}
    >
      <img src={after} alt="After: anti-drone meshes protecting a street in Zaporizhzhia" style={{ objectPosition: "50% 30%" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos * 100}% 0 0)` }}>
        <img src={before} alt="Before: a pile of scrapped cable" />
      </div>
      <span className="lbl" style={{ left: 20 }}>BEFORE · WASTE</span>
      <span className="lbl" style={{ right: 20, color: "var(--accent)" }}>AFTER · SHIELD</span>
      <div className="handle" style={{ left: `${pos * 100}%` }}>
        <div className="knob">↔</div>
      </div>
    </div>
  );
}

/* Concept drawing: concrete posts and a straight cable lattice around a transformer, drawn line by line */
const STATIC = typeof location !== "undefined" && new URLSearchParams(location.search).has("static");

export function LatticeConcept({ size = 720, play: playProp = true }: { size?: number; play?: boolean }) {
  const play = playProp && !STATIC;
  const posts = [80, 220, 360, 500, 640];
  const lines = useMemo(() => {
    const v: number[] = []; for (let x = 80; x <= 640; x += 28) v.push(x);
    const h: number[] = []; for (let y = 150; y <= 520; y += 28) h.push(y);
    return { v, h };
  }, []);
  const t = (i: number) => (play ? { delay: 0.4 + i * 0.012, duration: 0.5 } : { duration: 0 });
  return (
    <svg viewBox="0 0 720 640" width={size} height={size * (640 / 720)} role="img" aria-label="Concept drawing of the cable lattice around a transformer">
      {/* ground */}
      <line x1="20" y1="560" x2="700" y2="560" stroke="var(--grid)" strokeWidth="2" />
      {/* transformer behind the screen */}
      <g opacity="0.95">
        <rect x="250" y="330" width="220" height="200" fill="#2a343c" stroke="#5a6a75" strokeWidth="2" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={262 + i * 23} y="350" width="12" height="160" fill="#36434c" />)}
        {[300, 360, 420].map((x) => <g key={x}><rect x={x - 9} y="250" width="18" height="80" fill="#7a4b3a" /><circle cx={x} cy="246" r="7" fill="#9aa6ae" /></g>)}
        <rect x="236" y="530" width="248" height="30" fill="#4a565e" />
      </g>
      {/* crushed concrete wall at the base */}
      <motion.rect x="70" y="510" width="580" height="50" fill="#5b6268" stroke="#77808a" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: 1 }} transition={play ? { delay: 0.2, duration: 0.6 } : { duration: 0 }} />
      {Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={84 + i * 24} cy={524 + (i % 3) * 10} r="6" fill="#6c747c" />)}
      {/* lattice: thin cables straight, tied at crossings */}
      {lines.v.map((x, i) => (
        <motion.line key={`v${x}`} x1={x} y1={150} x2={x} y2={510} stroke="var(--steel)" strokeWidth="2.2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t(i)} />
      ))}
      {lines.h.map((y, i) => (
        <motion.line key={`h${y}`} x1={80} y1={y} x2={640} y2={y} stroke="var(--steel)" strokeWidth={y > 430 ? 7 : 2.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t(i + lines.v.length)} />
      ))}
      {/* concrete posts */}
      {posts.map((x, i) => (
        <motion.rect key={x} x={x - 9} y="120" width="18" height="440" fill="#9aa2a8" stroke="#c3c9cd"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ originY: 1 }} transition={play ? { delay: 0.1 + i * 0.08, duration: 0.5 } : { duration: 0 }} />
      ))}
      {/* AMKA ropes top and bottom */}
      <line x1="60" y1="140" x2="660" y2="140" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
      <line x1="60" y1="508" x2="660" y2="508" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
      {/* labels */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="17" fill="var(--fg)">
        <text x="660" y="128" textAnchor="end" fill="var(--accent)">AMKA rope</text>
        <text x="14" y="112">concrete post</text>
        <text x="660" y="300" textAnchor="end" fill="var(--steel)">10 cm cable grid</text>
        <text x="660" y="470" textAnchor="end" fill="var(--steel)">thick cables low</text>
        <text x="360" y="600" textAnchor="middle" fill="var(--muted)">crushed-concrete wall · 2 m standoff · earthed</text>
      </g>
    </svg>
  );
}

/* Real map of the Baltics from Natural Earth outlines (mledoze/countries), drawn with d3-geo */
type Feature = GeoPermissibleObjects & { id?: string };
const FILES = ["lva", "ltu", "est", "blr", "rus", "pol", "fin", "swe"];
const MAIN = new Set(["lva", "ltu", "est"]);

// bundled into the build so the map works offline and from file://
const GEO = import.meta.glob("../public/data/*.geo.json", { eager: true, import: "default" }) as Record<string, Feature>;
const GEO_LIST = FILES.map((id) => ({ id, f: GEO[`../public/data/${id}.geo.json`] })).filter((g) => g.f);

export function BalticMap({ width, height, mode, onPick }: { width: number; height: number; mode: "logos" | "hubs"; onPick?: (c: Company | null) => void }) {
  const geo = GEO_LIST;
  const proj = useMemo(() => {
    const p = geoMercator();
    const main = geo.filter((g) => MAIN.has(g.id));
    if (main.length) p.fitExtent([[60, 40], [width * (mode === "logos" ? 0.62 : 0.9), height - 40]], { type: "FeatureCollection", features: main.map((m) => (m.f as any).features?.[0] ?? m.f) } as any);
    return p;
  }, [geo, width, height, mode]);
  const path = geoPath(proj);
  const pt = (lon: number, lat: number) => proj([lon, lat]) ?? [0, 0];

  const groups: { key: Country; label: string; lon: number; lat: number }[] = [
    { key: "EE", label: "Estonia", lon: 25.5, lat: 58.9 },
    { key: "LV", label: "Latvia", lon: 25.0, lat: 56.9 },
    { key: "LT", label: "Lithuania", lon: 23.9, lat: 55.3 },
  ];
  const latgale = [[26.2, 56.9], [27.4, 57.4], [28.2, 56.9], [28.2, 56.0], [27.0, 55.7], [26.2, 55.9]] as [number, number][];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Map of Estonia, Latvia and Lithuania with target sites and companies">
      <rect width={width} height={height} fill="#0b1013" />
      {geo.map((g) => (
        <path key={g.id} d={path(g.f as any) ?? ""} fill={MAIN.has(g.id) ? "#1d262c" : "#13191d"} stroke={MAIN.has(g.id) ? "#56646d" : "#2a343c"} strokeWidth={MAIN.has(g.id) ? 1.6 : 1} />
      ))}
      {geo.length > 0 && (
        <>
          <path d={"M" + latgale.map((p) => pt(p[0], p[1]).join(",")).join("L") + "Z"} fill="rgba(239,107,98,.10)" stroke="var(--risk)" strokeDasharray="6 6" />
          {mode === "logos" && SITES.map((s) => {
            const [x, y] = pt(s.lon, s.lat);
            return <g key={s.n}><title>{`${s.n} · ${s.o}`}</title>
              {s.risk && <circle cx={x} cy={y} r={13} fill="none" stroke="var(--risk)" strokeWidth="2" />}
              <circle cx={x} cy={y} r={7} fill={s.c === "gas" ? "var(--steel)" : s.c === "tele" ? "#b99be0" : "var(--accent)"} stroke="#0b1013" strokeWidth="2" />
            </g>;
          })}
          {mode === "hubs" && HUBS.map((h, i) => {
            const [x, y] = pt(h.lon, h.lat);
            return <g key={h.n}>
              <motion.circle cx={x} cy={y} r={46} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="2" initial={STATIC ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.2 }} style={{ transformOrigin: `${x}px ${y}px` }} />
              <circle cx={x} cy={y} r={9} fill="var(--accent)" />
              <text x={x + 60} y={y + 8} fill="var(--fg)" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="30">{h.n}</text>
            </g>;
          })}
          {mode === "logos" && groups.map((gr) => {
            const [x, y] = pt(gr.lon, gr.lat);
            return <text key={gr.key} x={x} y={y} fill="#5f6d75" fontFamily="JetBrains Mono, monospace" fontSize="18" letterSpacing="6" textAnchor="middle">{gr.label.toUpperCase()}</text>;
          })}
        </>
      )}
      {mode === "logos" && geo.length > 0 && groups.map((gr) => {
        const list = COMPANIES.filter((c) => c.country === gr.key && c.role === "supplier-buyer");
        const [cx, cy] = pt(gr.lon + (gr.key === "LV" ? 3.2 : 3.0), gr.lat);
        const boxX = width * 0.66, boxW = width * 0.32;
        const rows = Math.ceil(list.length / 3);
        const boxH = 40 + rows * 64;
        const boxY = gr.key === "EE" ? 40 : gr.key === "LV" ? 220 : height - boxH - 40;
        const anchor = pt(gr.key === "EE" ? 27.2 : gr.key === "LV" ? 27.6 : 25.5, gr.key === "EE" ? 58.7 : gr.key === "LV" ? 56.9 : 55.6);
        return (
          <g key={`box-${gr.key}`}>
            <line x1={anchor[0]} y1={anchor[1]} x2={boxX} y2={boxY + boxH / 2} stroke="var(--grid)" strokeDasharray="4 6" />
            <foreignObject x={boxX} y={boxY} width={boxW} height={boxH}>
              <div style={{ background: "var(--panel)", border: "1px solid var(--line)", padding: 12, height: "100%" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 14, letterSpacing: ".12em", color: "var(--muted)", marginBottom: 8 }}>{gr.label.toUpperCase()} · SUPPLIERS & BUYERS</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {list.map((c) => (
                    <div key={c.name} onMouseEnter={() => onPick?.(c)} onMouseLeave={() => onPick?.(null)}>
                      <LogoTile c={c} height={56} />
                    </div>
                  ))}
                </div>
              </div>
            </foreignObject>
            <circle cx={cx} cy={cy} r={0} />
          </g>
        );
      })}
    </svg>
  );
}
