import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BalticMap, LatticeConcept, LogoTile } from "./components";
import { ObjectsMap, OBJECT_COUNTS } from "./objectsMap";
import { COMPANIES, CREDITS, EU_FUNDS, OBJECTS, SOURCES, TEAM } from "./data";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
// ?static renders every slide in its final state (for checks and the PDF export)
export const STATIC = typeof location !== "undefined" && new URLSearchParams(location.search).has("static");
const rise = (d = 0) => STATIC ? { initial: false as const } : ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const } });

// Photos. The "after" images show the shield on the same real photo (visualisation, labelled on the slide).
export const IMG = {
  subBefore: "img/before-substation.jpg",
  subAfter: "img/after-substation-real.jpg", // generated with Qwen-Image-Edit from the before photo
  stormBefore: "img/storm-before.jpg",
  stormAfter: null as string | null,
  scrap: "img/before-cable-scrap.jpg",
  transformer: "img/transformer-110-20kv.jpg",
  cutter: "img/process-cutter.jpg",
  gabion: "img/process-gabion.jpg",
};

export interface SlideDef { id: string; title: string; seconds: number; notes: string; render: () => ReactNode }

function Takes({ size = 26 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: size }}>
      <span className="mono muted" style={{ fontSize: size * 0.7, letterSpacing: ".12em" }}>WE TAKE</span>
      <span className="chip" style={{ fontSize: size * 0.8, borderColor: "var(--accent)" }}>Cable offcuts</span>
      <span className="mono accent">+</span>
      <span className="chip" style={{ fontSize: size * 0.8, borderColor: "var(--accent)" }}>Concrete poles</span>
      <span className="mono accent">→</span>
      <span className="chip" style={{ fontSize: size * 0.8, background: "var(--accent)", color: "#11161a", borderColor: "var(--accent)", fontWeight: 600 }}>Shield</span>
    </div>
  );
}

function Photo({ src, label, color = "var(--fg)", credit, children, pos = "50% 50%" }: { src: string; label?: string; color?: string; credit?: string; children?: ReactNode; pos?: string }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", border: "1px solid var(--line)", height: "100%", background: "#0b1013" }}>
      <img src={asset(src)} alt={label ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />
      {label && <span className="lbl-photo" style={{ color }}>{label}</span>}
      {children && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "48px 32px 26px", background: "linear-gradient(transparent, rgba(8,10,12,.92))" }}>{children}</div>}
      {credit && <span className="credit" style={{ right: 8, top: 8 }}>{credit}</span>}
    </div>
  );
}

function Title() {
  return (
    <div className="slide" style={{ justifyContent: "center" }}>
      <div style={{ position: "absolute", right: 60, top: 80, opacity: 0.9 }}><LatticeConcept size={760} /></div>
      <motion.img {...rise(0)} src={asset("brand/matrica-logo.svg")} alt="Matrica" style={{ width: 520, marginBottom: 56 }} />
      <motion.h1 {...rise(0.15)} style={{ maxWidth: 1050 }}>Grid waste becomes <span className="accent">grid shield</span>.</motion.h1>
      <motion.p {...rise(0.3)} className="lead" style={{ marginTop: 36, maxWidth: 980 }}>
        We take the cables and concrete poles grid companies throw away, and build shields around small, critical grid equipment.
      </motion.p>
      <motion.div {...rise(0.4)} style={{ marginTop: 40 }}><Takes /></motion.div>
      <motion.div {...rise(0.5)} style={{ marginTop: 32, display: "flex", gap: 16 }}>
        <span className="chip">Climathon 2026 · RTU</span>
        <span className="chip">Challenge: AS "Sadales tīkls"</span>
      </motion.div>
    </div>
  );
}

function Problem() {
  const items: [string, string, string, string, string][] = [
    ["1 · Waste", "var(--accent)", IMG.scrap, "Cable offcuts and concrete poles have no second life.", "GeorgHH, CC BY-SA 4.0"],
    ["2 · Drones", "var(--risk)", IMG.transformer, "Transformers stand in the open. Drones target them.", "Kreuzschnabel, CC BY-SA 3.0"],
    ["3 · Storms", "var(--steel)", IMG.stormBefore, "Trees fall on lines. Poles break. Power goes out.", "Arlington County, CC BY-SA 2.0"],
  ];
  return (
    <div className="slide">
      <div className="eyebrow">The problem</div>
      <motion.h2 {...rise(0)}>Three problems, one place.</motion.h2>
      <div className="row" style={{ marginTop: 44, height: 700, gap: 24 }}>
        {items.map(([h, c, src, t, cr], i) => (
          <motion.div {...rise(0.15 + i * 0.12)} className="grow" key={h}>
            <Photo src={src} credit={cr} pos={i === 1 ? "50% 40%" : "50% 50%"}>
              <div className="tag" style={{ color: c }}>{h}</div>
              <h3 style={{ marginTop: 14, fontSize: 38 }}>{t}</h3>
            </Photo>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FullPhoto({ src, tag, tagColor, line, sub, credit }: { src: string; tag: string; tagColor: string; line: string; sub?: string; credit: string }) {
  return (
    <div className="slide" style={{ padding: 0 }}>
      <img src={asset(src)} alt={line} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, padding: "80px 120px 160px", background: "linear-gradient(rgba(8,10,12,.92), transparent)" }}>
        <motion.div {...rise(0)} className="tag" style={{ color: tagColor, fontSize: 22 }}>{tag}</motion.div>
        <motion.h2 {...rise(0.1)} style={{ marginTop: 18, fontSize: 72, maxWidth: 1500 }}>{line}</motion.h2>
        {sub && <motion.p {...rise(0.2)} className="lead" style={{ marginTop: 14, fontSize: 28 }}>{sub}</motion.p>}
      </div>
      <span className="credit" style={{ right: 12, bottom: 40 }}>{credit}</span>
    </div>
  );
}

const Before = () => <FullPhoto src={IMG.subBefore} tag="Before" tagColor="var(--risk)" line="Today: transformers stand unprotected." credit="Photo: Tiia Monto, CC BY-SA 4.0" />;
const After = () => (
  <FullPhoto src={IMG.subAfter} tag="After · with Matrica" tagColor="var(--accent)" line="Reused concrete posts + a net from cables."
    sub="Crushed concrete forms the base. Same real substation; the shield is an AI visualisation (Qwen-Image-Edit)." credit="Photo: Tiia Monto, CC BY-SA 4.0 · AI edit: Qwen-Image-Edit" />
);

function Weather() {
  return (
    <div className="slide">
      <div className="eyebrow">Storms</div>
      <motion.h2 {...rise(0)}>The same shield protects lines from storms.</motion.h2>
      <div className="row" style={{ marginTop: 40, height: 740, gap: 24 }}>
        <motion.div {...rise(0.1)} className="grow">
          <Photo src={IMG.stormBefore} label="BEFORE" color="var(--risk)" credit="Arlington County, CC BY-SA 2.0">
            <h3 style={{ fontSize: 36 }}>A tree falls on the line. The pole breaks.</h3>
          </Photo>
        </motion.div>
        <motion.div {...rise(0.25)} className="grow">
          {IMG.stormAfter ? (
            <Photo src={IMG.stormAfter} label="AFTER · VISUALISATION" color="var(--accent)" credit="Same photo · shield visualisation: Matrica">
              <h3 style={{ fontSize: 36 }}>Concrete poles and a cable net catch the tree. The line stays up.</h3>
            </Photo>
          ) : (
            <div className="card" style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center" }}>
              <h3 style={{ fontSize: 36, maxWidth: 640 }}>Concrete poles and a cable net catch the tree. The line stays up.</h3>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function NetDiagram() {
  const n = 9;
  return (
    <svg viewBox="0 0 300 220" width="100%" height="100%" role="img" aria-label="Cut cables laid in a grid and tied at the crossings">
      <rect width="300" height="220" fill="#0b1013" />
      {Array.from({ length: n }).map((_, i) => <line key={`v${i}`} x1={50 + i * 25} y1={20} x2={50 + i * 25} y2={200} stroke="#1c1f22" strokeWidth="5" />)}
      {Array.from({ length: n }).map((_, i) => <line key={`h${i}`} x1={40} y1={30 + i * 20.5} x2={260} y2={30 + i * 20.5} stroke="#2a2e32" strokeWidth="5" />)}
      {Array.from({ length: n }).flatMap((_, i) => Array.from({ length: n }).map((__, j) => <circle key={`${i}-${j}`} cx={50 + i * 25} cy={30 + j * 20.5} r="3" fill="#ff7a1a" />))}
      <text x="150" y="216" fill="#93a1ab" fontFamily="JetBrains Mono, monospace" fontSize="11" textAnchor="middle">ties at every crossing</text>
    </svg>
  );
}

function Process() {
  const card = (n: string, h: string, t: string, media: ReactNode, d: number) => (
    <motion.div {...rise(d)} className="card" style={{ padding: 0, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ height: 180, overflow: "hidden", borderBottom: "1px solid var(--line)" }}>{media}</div>
      <div style={{ padding: "12px 16px" }}>
        <div className="mono accent" style={{ fontSize: 18 }}>{n}</div>
        <b style={{ fontFamily: "var(--display)", fontSize: 26 }}>{h}</b>
        <p className="muted" style={{ fontSize: 18, marginTop: 4, lineHeight: 1.3 }}>{t}</p>
      </div>
    </motion.div>
  );
  const img = (src: string, pos = "50% 50%") => <img src={asset(src)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />;
  return (
    <div className="slide" style={{ paddingTop: 76 }}>
      <div className="eyebrow">How it works · two materials</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 52 }}>Concrete goes to the transformer. Cables become the net.</motion.h2>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "150px repeat(4, 1fr)", gap: 14, alignItems: "stretch" }}>
        <div className="lane-h"><span>CONCRETE<br />POLES</span></div>
        {card("C1", "Intact poles → posts", "Set 2 m around the transformer.", img(IMG.subAfter, "30% 75%"), 0.1)}
        {card("C2", "Broken poles → crushed", "Crushed concrete fills a low base wall.", img(IMG.gabion), 0.18)}
        <div className="card lane-note" style={{ gridColumn: "span 2" }}>
          <p style={{ fontSize: 24, lineHeight: 1.4 }}>Concrete never goes to the inventory. It goes <b className="accent">straight from the depot to the site</b>: posts stand, rubble fills the wall.</p>
        </div>
        <div className="lane-h"><span>CABLES</span></div>
        {card("A1", "Into the inventory", "Crews throw any offcut into one bin.", img(IMG.scrap), 0.26)}
        {card("A2", "Cut to one size", "Every cable is cut to 2 m pieces.", img(IMG.cutter, "50% 60%"), 0.34)}
        {card("A3", "Tie into a net", "2 m pieces laid 10 cm apart both ways, tied at every crossing: a 2 × 2 m panel.", <NetDiagram />, 0.42)}
        {card("A4", "Hang on the posts", "Panels clip onto overhead-cable ropes between the posts.", img(IMG.subAfter, "40% 65%"), 0.5)}
      </div>
      <p className="small" style={{ marginTop: 14, fontSize: 15 }}>Photos: GeorgHH (CC BY-SA 4.0), S.J. de Waard (CC BY-SA 3.0), Encik Tekateki (CC0), Tiia Monto (CC BY-SA 4.0) with Matrica visualisation.</p>
    </div>
  );
}

function Video() {
  const [ok, setOk] = useState(true);
  return (
    <div className="slide" style={{ paddingTop: 76 }}>
      <div className="eyebrow">How it works · 30 seconds</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 60 }}>From bin to shield.</motion.h2>
      <motion.div {...rise(0.15)} style={{ marginTop: 30, width: 1440, height: 810, border: "1px solid var(--line)", background: "#0b1013", alignSelf: "center" }}>
        {ok ? (
          <video src={asset("video/how-it-works.mp4")} autoPlay muted loop playsInline title="Click to pause or play"
            onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }} onError={() => setOk(false)} />
        ) : <div style={{ display: "grid", placeItems: "center", height: "100%" }}><LatticeConcept size={600} /></div>}
      </motion.div>
    </div>
  );
}

function Where() {
  return (
    <div className="slide" style={{ paddingTop: 76 }}>
      <div className="eyebrow">Where</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 60 }}>Every critical object we can protect in Latvia.</motion.h2>
      <div className="row" style={{ marginTop: 24, gap: 30 }}>
        <motion.div {...rise(0.1)} style={{ border: "1px solid var(--line)" }}><ObjectsMap width={1220} height={740} /></motion.div>
        <div className="grow" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OBJECT_COUNTS.map((o, i) => (
            <motion.div {...rise(0.2 + i * 0.05)} key={o.k} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
              <span className="dot" style={{ width: 16, height: 16, background: o.color }} />
              <span style={{ fontSize: 22, flex: 1 }}>{o.label}</span>
              <span className="mono" style={{ fontSize: 24 }}>{o.n}</span>
            </motion.div>
          ))}
          <p className="small" style={{ fontSize: 15, marginTop: 6 }}>Points at town level from public sources; exact sites to confirm with AST and Sadales tīkls. Most 110 kV substations have two transformers: ~250–300 in total.</p>
        </div>
      </div>
    </div>
  );
}

function Economics() {
  const [price, setPrice] = useState(20);
  const [units, setUnits] = useState(275);
  const cost = 12;
  const fmt = (k: number) => (k >= 1000 ? `€${(k / 1000).toFixed(1)}M` : `€${Math.round(k)}k`);
  return (
    <div className="slide">
      <div className="eyebrow">Economics</div>
      <motion.h2 {...rise(0)}>One kit. Clear numbers. <span className="est" style={{ fontSize: 22, verticalAlign: "middle" }}>estimates</span></motion.h2>
      <div className="row" style={{ marginTop: 50, gap: 30 }}>
        {[["€10–14k", "our cost per transformer kit"], ["€18–25k", "price per kit"], ["~10%", "yearly inspection contract"], ["~€0", "material cost: it's their waste"]].map(([n, l], i) => (
          <motion.div {...rise(0.1 + i * 0.1)} className="card grow" key={l}>
            <div className="big-num" style={{ fontSize: 72, color: i === 1 ? "var(--accent)" : "var(--fg)" }}>{n}</div>
            <div className="muted" style={{ fontSize: 24, marginTop: 10 }}>{l}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...rise(0.5)} className="row" style={{ marginTop: 34, gap: 30, flex: 1 }}>
        <div className="card grow" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div className="mono small" style={{ letterSpacing: ".1em" }}>TRY IT · MARKET MODEL</div>
          <label style={{ fontSize: 24 }}>Price per kit: <b className="mono accent">€{price}k</b>
            <input type="range" min={15} max={30} step={1} value={price} onChange={(e) => setPrice(+e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
          </label>
          <label style={{ fontSize: 24 }}>Transformers protected: <b className="mono accent">{units}</b>
            <input type="range" min={10} max={900} step={5} value={units} onChange={(e) => setUnits(+e.target.value)} onKeyDown={(e) => e.stopPropagation()} />
          </label>
          <p className="small">Latvia ≈ 250–300 transformers. Baltics ≈ 3× that. Cost assumed €12k per kit.</p>
        </div>
        <div className="card" style={{ width: 760, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignContent: "center" }}>
          <div><div className="big-num">{fmt(price * units)}</div><div className="muted" style={{ fontSize: 22 }}>kit revenue</div></div>
          <div><div className="big-num" style={{ color: "var(--ok)" }}>{fmt((price - cost) * units)}</div><div className="muted" style={{ fontSize: 22 }}>gross margin</div></div>
          <div><div className="big-num" style={{ fontSize: 64 }}>{fmt(price * units * 0.1)}</div><div className="muted" style={{ fontSize: 22 }}>service per year</div></div>
          <div><div className="big-num" style={{ fontSize: 64, color: "var(--steel)" }}>↓</div><div className="muted" style={{ fontSize: 22 }}>disposal cost for the grid company</div></div>
        </div>
      </motion.div>
    </div>
  );
}

function Practical() {
  const cols: [string, string, string[]][] = [
    ["Safe", "var(--ok)", ["Earthed net", "Outside the 110 kV clearance zone", "Built under the site's work permit"]],
    ["Honest limits", "var(--warn)", ["Stops FPV and small drones, debris and falling branches", "Does not stop Shahed-class drones or missiles", "Version 1 covers the sides"]],
    ["Pilot", "var(--accent)", ["2–5 transformers in Latgale", "With Sadales tīkls", "Measure cost, time, tonnes reused and winter performance"]],
  ];
  return (
    <div className="slide">
      <div className="eyebrow">Practical</div>
      <motion.h2 {...rise(0)}>Built with what crews already know.</motion.h2>
      <div className="row" style={{ marginTop: 56, gap: 30, flex: 1 }}>
        {cols.map(([h, color, items], i) => (
          <motion.div {...rise(0.15 + i * 0.12)} className="card grow" key={h} style={{ borderTop: `4px solid ${color}` }}>
            <h3 style={{ fontSize: 52, color }}>{h}</h3>
            <ul style={{ margin: "36px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 28 }}>
              {items.map((t) => <li key={t} style={{ fontSize: 34, lineHeight: 1.25 }}>{t}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Partners() {
  const sb = COMPANIES.filter((c) => c.role === "supplier-buyer");
  const dl = COMPANIES.filter((c) => c.role === "delivery");
  return (
    <div className="slide" style={{ paddingTop: 80 }}>
      <div className="eyebrow">Target suppliers, customers and partners</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 64 }}>The companies that would want this.</motion.h2>
      <motion.div {...rise(0.15)} style={{ marginTop: 30 }}>
        <div className="mono small" style={{ letterSpacing: ".1em", marginBottom: 10 }}>MATERIAL SUPPLIERS AND BUYERS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>{sb.map((c) => <LogoTile key={c.name} c={c} height={84} />)}</div>
      </motion.div>
      <motion.div {...rise(0.3)} style={{ marginTop: 24 }}>
        <div className="mono small" style={{ letterSpacing: ".1em", marginBottom: 10 }}>DELIVERY PARTNERS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>{dl.map((c) => <LogoTile key={c.name} c={c} height={84} />)}</div>
      </motion.div>
      <motion.div {...rise(0.45)} style={{ marginTop: 28 }}>
        <div className="mono small" style={{ letterSpacing: ".1em", marginBottom: 10 }}>EUROPEAN FUNDS FOR SCALE-UP</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {EU_FUNDS.map((f) => <span className="chip" key={f.n}><b style={{ fontFamily: "var(--body)" }}>{f.n}</b><span className="muted">{f.d}</span></span>)}
        </div>
      </motion.div>
      <p className="small" style={{ marginTop: 18, fontSize: 16 }}>No agreements yet. Logos belong to their owners and are shown to name target companies.</p>
    </div>
  );
}

function Future() {
  return (
    <div className="slide" style={{ paddingTop: 80 }}>
      <div className="eyebrow">The future</div>
      <div className="row" style={{ gap: 40, flex: 1 }}>
        <div style={{ width: 760, display: "flex", flexDirection: "column" }}>
          <motion.h2 {...rise(0)} style={{ fontSize: 72 }}>A Baltic take-back network.</motion.h2>
          <motion.p {...rise(0.15)} className="lead" style={{ marginTop: 28, fontSize: 30 }}>
            Three hubs. Every grid, telecom and renewables company as a supplier. Each country's waste protects its own grid.
          </motion.p>
          <motion.div {...rise(0.35)} className="card" style={{ marginTop: "auto", borderColor: "var(--accent)", background: "var(--accent-soft)" }}>
            <div className="mono" style={{ fontSize: 20, letterSpacing: ".12em", color: "var(--accent)" }}>OUR ASK</div>
            <h3 style={{ fontSize: 48, marginTop: 10 }}>A pilot with Sadales tīkls on 2–5 transformers.</h3>
          </motion.div>
          {TEAM.members.length > 0 && (
            <motion.p {...rise(0.5)} className="muted" style={{ marginTop: 24, fontSize: 24 }}>
              Team Matrica: {TEAM.members.map((m) => (m.role ? `${m.name} (${m.role})` : m.name)).join(" · ")}
            </motion.p>
          )}
        </div>
        <motion.div {...rise(0.2)} style={{ border: "1px solid var(--line)" }}><BalticMap width={880} height={830} mode="hubs" /></motion.div>
      </div>
    </div>
  );
}

function Appendix() {
  const rows = [...OBJECTS].map((o) => ({ o, t: o[2] + o[3] + o[4] + o[5] + o[6] + o[7] })).sort((a, b) => b.t - a.t);
  return (
    <div className="slide" style={{ padding: "60px 80px 80px", overflow: "auto" }}>
      <div className="eyebrow">Appendix</div>
      <div className="row" style={{ gap: 40, alignItems: "flex-start" }}>
        <div className="grow">
          <h3>Scored target objects (0–10 each)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 14, fontSize: 18 }}>
            <thead><tr>{["Object", "Owner", "Crit", "Fit", "Exp", "Vol", "Safe", "Pay", "/60"].map((h) => <th key={h} style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid var(--line)", fontFamily: "var(--mono)", fontSize: 14, color: "var(--muted)" }}>{h}</th>)}</tr></thead>
            <tbody>{rows.map(({ o, t }) => <tr key={o[0]}>{[o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], t].map((v, i) => <td key={i} style={{ padding: "6px 8px", borderBottom: "1px solid var(--line)", fontFamily: i > 1 ? "var(--mono)" : undefined }}>{v}</td>)}</tr>)}</tbody>
          </table>
          <h3 style={{ marginTop: 30 }}>Assumptions behind the economics</h3>
          <ul style={{ fontSize: 20, lineHeight: 1.5, color: "var(--muted)" }}>
            <li>Kit for one 110/20 kV transformer: ~14 concrete posts, ~180 m² of cable net, ~120 m AMKA rope, ~10 m³ crushed-concrete wall.</li>
            <li>Cost €10–14k: baskets and earthing €2–3k, cable cutting and tying €2–3k, installation 3 people × 4 days €4–5k, engineering and transport €2–3k.</li>
            <li>Price €18–25k and a yearly service at ~10% are hypotheses to validate with Sadales tīkls.</li>
            <li>~250–300 transformers in Latvia (most 110 kV substations have two). To confirm with AST and Sadales tīkls.</li>
          </ul>
        </div>
        <div style={{ width: 640 }}>
          <h3 style={{ fontSize: 28 }}>Sources</h3>
          <ul style={{ fontSize: 15, lineHeight: 1.35, paddingLeft: 20, margin: "8px 0" }}>{SOURCES.map(([t, u]) => <li key={t}>{t}<br /><span className="mono muted" style={{ fontSize: 11, wordBreak: "break-all" }}>{u}</span></li>)}</ul>
          <h3 style={{ marginTop: 14, fontSize: 28 }}>Image and data credits</h3>
          <ul style={{ fontSize: 15, lineHeight: 1.35, paddingLeft: 20, margin: "8px 0" }}>{CREDITS.map(([t, u]) => <li key={t}><b>{t}</b>: <span className="muted">{u}</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export const SLIDES: SlideDef[] = [
  { id: "title", title: "Title", seconds: 8, render: () => <Title />,
    notes: "Hi, we're Matrica. We take the cables and concrete poles that Sadales tīkls throws away, and turn them into shields for the grid itself." },
  { id: "problem", title: "Three problems", seconds: 22, render: () => <Problem />,
    notes: "Three problems meet in the same place. One: waste. Cable offcuts and concrete poles have no second life. Two: drones. Transformers stand in the open, and drones target them. Three: storms. Trees fall on lines, poles break, and the power goes out." },
  { id: "before", title: "Before", seconds: 8, render: () => <Before />,
    notes: "This is a real substation today. Nothing stands between a drone and the transformer." },
  { id: "after", title: "After", seconds: 14, render: () => <After />,
    notes: "And this is the same substation with our shield: reused concrete poles as posts, a net made from cable offcuts, and crushed concrete as the base wall." },
  { id: "weather", title: "Storms", seconds: 16, render: () => <Weather />,
    notes: "The same idea protects lines from storms. Today a falling tree breaks the pole and takes the line down. With concrete poles and a cable net, the net catches the tree and the line stays up." },
  { id: "process", title: "Process", seconds: 25, render: () => <Process />,
    notes: "There are two materials. Concrete goes straight to the site: intact poles become posts, broken ones are crushed into the base wall. Cables go to our inventory: crews just throw them in one bin. We cut every cable to one size, two metres, lay them ten centimetres apart both ways, tie every crossing, and hang the panels between the posts." },
  { id: "video", title: "Video", seconds: 12, render: () => <Video />,
    notes: "Here's the whole flow in thirty seconds. [Let it play while you speak.] One kit per transformer, three people, about four days." },
  { id: "where", title: "Where", seconds: 15, render: () => <Where />,
    notes: "These are the critical objects we can protect in Latvia: over thirty substations, the grid batteries, hydro and heat plants, gas storage, broadcast and airport equipment. We start in Latgale, next to the border." },
  { id: "economics", title: "Economics", seconds: 25, render: () => <Economics />,
    notes: "Our numbers are estimates we'll confirm with Sadales tīkls. A kit costs us ten to fourteen thousand euros and sells for eighteen to twenty-five, plus a yearly inspection contract. Latvia has around 250 to 300 transformers: five to six million euros. The Baltics are about three times that." },
  { id: "practical", title: "Practical", seconds: 10, render: () => <Practical />,
    notes: "It's safe, earthed and outside the high-voltage zone. It stops small drones and falling branches, not missiles. We propose a pilot in Latgale." },
  { id: "partners", title: "Partners", seconds: 12, render: () => <Partners />,
    notes: "These are the companies we'll work with: grid operators as suppliers and buyers, contractors to install, recyclers for what's left. European programmes fund the scale-up. No agreements yet; that's our next step." },
  { id: "future", title: "Future", seconds: 13, render: () => <Future />,
    notes: "Our vision: a Baltic take-back network, three hubs, every grid's waste protecting its own grid. Our ask today: a pilot with Sadales tīkls on two to five transformers. Thank you." },
];

export const APPENDIX: SlideDef = { id: "appendix", title: "Appendix", seconds: 0, notes: "Not presented. Sources, credits, assumptions and the full scoring table.", render: () => <Appendix /> };
