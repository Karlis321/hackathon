import { useMemo, useState } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";

// Map of Latvia with every critical object type we target. Positions are approximate (town level, from public sources).
type Feature = GeoPermissibleObjects;
const GEO = import.meta.glob("../public/data/*.geo.json", { eager: true, import: "default" }) as Record<string, Feature>;
const FILES = ["lva", "ltu", "est", "blr", "rus"];
const LIST = FILES.map((id) => ({ id, f: GEO[`../public/data/${id}.geo.json`] })).filter((g) => g.f);

export type Kind = "sub" | "bess" | "hpp" | "chp" | "gas" | "tele" | "air";
export const KINDS: Record<Kind, { label: string; color: string; r: number }> = {
  sub: { label: "110 kV substation transformers", color: "#ff7a1a", r: 7 },
  bess: { label: "Grid battery storage", color: "#ffd166", r: 10 },
  hpp: { label: "Hydro plant transformers", color: "#6fa8d6", r: 10 },
  chp: { label: "Heat and power plant transformers", color: "#ef6b62", r: 9 },
  gas: { label: "Gas storage and stations", color: "#4fd1c5", r: 10 },
  tele: { label: "Broadcast transmitters", color: "#b99be0", r: 9 },
  air: { label: "Airport navigation aids", color: "#9ad17a", r: 9 },
};

// [name, kind, lon, lat]
const OBJECTS: [string, Kind, number, number][] = [
  ...([
    ["Rīga", 24.11, 56.95], ["Daugavpils", 26.53, 55.87], ["Liepāja", 21.01, 56.51], ["Jelgava", 23.72, 56.65], ["Jūrmala", 23.77, 56.97],
    ["Ventspils", 21.57, 57.39], ["Rēzekne", 27.33, 56.51], ["Valmiera", 25.42, 57.54], ["Jēkabpils", 25.86, 56.5], ["Ogre", 24.6, 56.82],
    ["Tukums", 23.15, 56.97], ["Cēsis", 25.27, 57.31], ["Salaspils", 24.35, 56.86], ["Kuldīga", 21.97, 56.97], ["Sigulda", 24.86, 57.15],
    ["Talsi", 22.59, 57.25], ["Dobele", 23.28, 56.62], ["Bauska", 24.19, 56.41], ["Saldus", 22.49, 56.66], ["Madona", 26.22, 56.85],
    ["Gulbene", 26.75, 57.18], ["Alūksne", 27.05, 57.42], ["Balvi", 27.27, 57.13], ["Ludza", 27.72, 56.55], ["Krāslava", 27.17, 55.9],
    ["Preiļi", 26.72, 56.29], ["Aizkraukle", 25.25, 56.6], ["Limbaži", 24.71, 57.51], ["Smiltene", 25.9, 57.42], ["Valka", 26.02, 57.78],
    ["Līvāni", 26.18, 56.35], ["Kandava", 22.78, 57.04], ["Grobiņa (330 kV)", 21.17, 56.54],
  ] as [string, number, number][]).map(([n, lon, lat]) => [n, "sub", lon, lat] as [string, Kind, number, number]),
  ["Rēzekne battery (60 MW)", "bess", 27.22, 56.44], ["Tume battery (20 MW)", "bess", 23.06, 57.02],
  ["Pļaviņas HPP", "hpp", 25.33, 56.62], ["Ķegums HPP", "hpp", 24.72, 56.74], ["Rīga HPP", "hpp", 24.27, 56.84],
  ["Rīga CHP-1", "chp", 24.16, 57.0], ["Rīga CHP-2", "chp", 24.4, 56.9],
  ["Inčukalns gas storage", "gas", 24.7, 57.1],
  ["Rīga TV tower", "tele", 24.13, 56.92],
  ["Rīga Airport", "air", 23.97, 56.92], ["Liepāja Airport", "air", 21.1, 56.53],
];

export function ObjectsMap({ width, height }: { width: number; height: number }) {
  const [hover, setHover] = useState<string | null>(null);
  const proj = useMemo(() => {
    const lv = LIST.find((g) => g.id === "lva");
    const p = geoMercator();
    if (lv) p.fitExtent([[40, 40], [width - 40, height - 40]], lv.f as any);
    return p;
  }, [width, height]);
  const path = geoPath(proj);
  const pt = (lon: number, lat: number) => proj([lon, lat]) ?? [0, 0];
  const latgale = ([[26.2, 56.9], [27.4, 57.4], [28.2, 56.9], [28.2, 56.0], [27.0, 55.7], [26.2, 55.9]] as [number, number][]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Map of Latvia with critical infrastructure objects">
      <rect width={width} height={height} fill="#0b1013" />
      {LIST.map((g) => (
        <path key={g.id} d={path(g.f as any) ?? ""} fill={g.id === "lva" ? "#1d262c" : "#121719"} stroke={g.id === "lva" ? "#5f6d75" : "#252e34"} strokeWidth={g.id === "lva" ? 1.8 : 1} />
      ))}
      <path d={"M" + latgale.map((p) => pt(p[0], p[1]).join(",")).join("L") + "Z"} fill="rgba(239,107,98,.10)" stroke="#ef6b62" strokeDasharray="6 6" />
      <text x={pt(27.2, 55.78)[0]} y={pt(27.2, 55.78)[1]} fill="#ef6b62" fontFamily="JetBrains Mono, monospace" fontSize="16" textAnchor="middle">PILOT REGION</text>
      {OBJECTS.map(([n, k, lon, lat]) => {
        const [x, y] = pt(lon, lat);
        const K = KINDS[k];
        return (
          <g key={n} onMouseEnter={() => setHover(`${n} · ${K.label}`)} onMouseLeave={() => setHover(null)} style={{ cursor: "default" }}>
            <title>{`${n} · ${K.label}`}</title>
            <circle cx={x} cy={y} r={K.r + 6} fill="transparent" />
            <circle cx={x} cy={y} r={K.r} fill={K.color} stroke="#0b1013" strokeWidth="2" />
          </g>
        );
      })}
      {hover && <text x={40} y={height - 30} fill="#e9edef" fontFamily="JetBrains Mono, monospace" fontSize="20">{hover}</text>}
    </svg>
  );
}

export const OBJECT_COUNTS = (Object.keys(KINDS) as Kind[]).map((k) => ({ k, ...KINDS[k], n: OBJECTS.filter((o) => o[1] === k).length }));
