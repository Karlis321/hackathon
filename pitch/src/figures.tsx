// Figures redrawn from the team summary "Tīkls no tīkla": mast base cross-section and stock coverage chart.

const MONO = "JetBrains Mono, monospace";

/* Mast base: reclaimed concrete stub ~2.2 m in the ground, wooden pole banded to it (2.3 m overlap, 0.4 m off the soil) */
export function MastBase({ width = 560, height = 420 }: { width?: number | string; height?: number | string }) {
  const m = 34; // px per metre
  const g = 230; // ground line
  const stubBottom = g + 2.2 * m, poleBottom = g - 0.4 * m, stubTop = poleBottom - 2.3 * m;
  const dim = (x: number, y1: number, y2: number, label: string, left = false) => (
    <g stroke="#93a1ab" fill="#93a1ab" fontFamily={MONO} fontSize="14">
      <line x1={x} y1={y1} x2={x} y2={y2} strokeWidth="1.5" />
      <line x1={x - 6} y1={y1} x2={x + 6} y2={y1} strokeWidth="1.5" /><line x1={x - 6} y1={y2} x2={x + 6} y2={y2} strokeWidth="1.5" />
      <text x={left ? x - 10 : x + 10} y={(y1 + y2) / 2 + 5} stroke="none" textAnchor={left ? "end" : "start"}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 560 420" width={width} height={height} role="img" aria-label="Mast base: concrete stub set about 2.2 m into the ground with a wooden pole banded to it">
      <rect width="560" height="420" fill="#0b1013" />
      {/* soil and gravel backfill */}
      <rect x="0" y={g} width="560" height={420 - g} fill="#3a2f25" />
      <rect x={250} y={g} width={60} height={stubBottom - g + 10} fill="#6d6a63" />
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={254 + ((i * 37) % 52)} cy={g + 6 + ((i * 53) % (stubBottom - g))} r={2 + (i % 3)} fill="#8f8b82" />)}
      <line x1="0" y1={g} x2="560" y2={g} stroke="#8fb36a" strokeWidth="4" />
      {/* concrete stub (PT 4.0–6.0) */}
      <rect x={266} y={stubTop} width={28} height={stubBottom - stubTop} fill="#a9aeb1" />
      {/* wooden pole, banded to the stub, continues up (~10 m) */}
      <rect x={294} y={10} width={22} height={poleBottom - 10} fill="#6e5136" />
      <path d={`M290 30 l30 -8 M290 40 l30 -8`} stroke="#0b1013" strokeWidth="5" />
      {[stubTop + 18, poleBottom - 18].map((y) => <rect key={y} x={262} y={y - 4} width={58} height={8} fill="#3b4045" />)}
      {/* labels */}
      {dim(220, g, stubBottom, "≈2.2 m in ground", true)}
      {dim(340, stubTop, poleBottom, "2.3 m wood on stub")}
      {dim(340, poleBottom, g, "0.4 m off the soil")}
      <g fontFamily={MONO} fontSize="14" fill="#e9edef">
        <text x={330} y={60}>Reclaimed wooden pole (≈10 m)</text>
        <text x={20} y={stubTop + 20}>Reclaimed concrete stub</text>
        <text x={20} y={stubTop + 40} fill="#93a1ab">PT 4.0–6.0</text>
        <text x={20} y={stubTop + 80}>2 steel bands</text>
        <line x1={130} y1={stubTop + 76} x2={260} y2={stubTop + 18} stroke="#93a1ab" />
        <text x={330} y={stubBottom + 30}>Compacted gravel backfill</text>
        <line x1={326} y1={stubBottom + 25} x2={305} y2={stubBottom - 10} stroke="#93a1ab" />
      </g>
    </svg>
  );
}

/* Sites each reclaimed resource could cover (stock / need per site), 0–250 scale */
export const STOCK_ROWS: { label: string; sites: number; note: string; hot?: boolean }[] = [
  { label: "Concrete stubs", sites: 145, note: "880 in stock, 6 per site" },
  { label: "Wooden poles", sites: 250, note: "1,500 in stock, 6 per site" },
  { label: "AMKA as ropes", sites: 10, note: "1,116 m, ≈105 m per site" },
  { label: "AMKA as net wire", sites: 1, note: "1,116 m, ≈1,000 m per site", hot: true },
];

export function StockChart({ width = 1000, height = 330 }: { width?: number; height?: number }) {
  const x0 = 230, x1 = 850, max = 250;
  const sx = (v: number) => x0 + (v / max) * (x1 - x0);
  return (
    <svg viewBox="0 0 1000 330" width={width} height={height} role="img" aria-label="Sites each reclaimed resource could cover">
      {[0, 50, 100, 150, 200, 250].map((v) => (
        <g key={v}>
          <line x1={sx(v)} y1={20} x2={sx(v)} y2={290} stroke="#2a343c" />
          <text x={sx(v)} y={312} fill="#93a1ab" fontFamily={MONO} fontSize="15" textAnchor="middle">{v}</text>
        </g>
      ))}
      {STOCK_ROWS.map((r, i) => {
        const y = 34 + i * 66;
        return (
          <g key={r.label}>
            <text x={x0 - 14} y={y + 20} fill="#e9edef" fontFamily="Archivo, sans-serif" fontWeight="700" fontSize="21" textAnchor="end">{r.label}</text>
            <text x={x0 - 14} y={y + 42} fill="#93a1ab" fontFamily={MONO} fontSize="13" textAnchor="end">{r.note}</text>
            <rect x={x0} y={y} width={Math.max(4, sx(r.sites) - x0)} height={34} fill={r.hot ? "#ff7a1a" : "#6fa8d6"} />
            <text x={sx(r.sites) + 10} y={y + 24} fill={r.hot ? "#ff7a1a" : "#e9edef"} fontFamily={MONO} fontWeight="600" fontSize="20">≈{r.sites} {r.sites === 1 ? "site" : "sites"}</text>
          </g>
        );
      })}
    </svg>
  );
}
