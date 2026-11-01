import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BalticMap, LatticeConcept, LogoTile } from "./components";
import { ObjectsMap, OBJECT_COUNTS } from "./objectsMap";
import { PARTS, ProductCage } from "./productCage";
import { MastBase, StockChart } from "./figures";
import { COMPANIES, CREDITS, EU_FUNDS, OBJECTS, SOURCES, TEAM } from "./data";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
// ?static renders every slide in its final state (for checks and the PDF export)
export const STATIC = typeof location !== "undefined" && new URLSearchParams(location.search).has("static");
const rise = (d = 0) => STATIC ? { initial: false as const } : ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const } });

// Photos. The "after" images show the shield on the same real photo (visualisation, labelled on the slide).
export const IMG = {
  subBefore: "img/before-substation.jpg",
  subAfter: "img/after-substation-cage.jpg", // full cage drawn over the before photo (scripts/make_cage_photo.py)
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
      <span className="chip" style={{ fontSize: size * 0.8, borderColor: "var(--accent)" }}>AMKA cable</span>
      <span className="mono accent">+</span>
      <span className="chip" style={{ fontSize: size * 0.8, borderColor: "var(--accent)" }}>Wooden poles</span>
      <span className="mono accent">+</span>
      <span className="chip" style={{ fontSize: size * 0.8, borderColor: "var(--accent)" }}>Concrete stubs</span>
      <span className="mono accent">→</span>
      <span className="chip" style={{ fontSize: size * 0.8, background: "var(--accent)", color: "#11161a", borderColor: "var(--accent)", fontWeight: 600 }}>Drone net</span>
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
      <div style={{ position: "absolute", right: 60, top: 120, width: 760, lineHeight: 0, border: "1px solid var(--line)" }}><ProductCage width={760} height={535} callouts={false} /></div>
      <motion.img {...rise(0)} src={asset("brand/matrica-logo.svg")} alt="Matrica" style={{ width: 520, marginBottom: 56 }} />
      <motion.h1 {...rise(0.15)} style={{ maxWidth: 900, fontSize: 100 }}>Matrica: drone nets from <span className="accent">grid surplus</span>.</motion.h1>
      <motion.p {...rise(0.3)} className="lead" style={{ marginTop: 30, maxWidth: 860 }}>
        Tīkls no tīkla: in Latvian, <i>tīkls</i> means both <b className="accent">net</b> and <b className="accent">grid</b>.
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
    ["1 · Waste", "var(--accent)", IMG.scrap, "Surplus AMKA cable, wooden poles and concrete stubs pile up.", "GeorgHH, CC BY-SA 4.0"],
    ["2 · Drones", "var(--risk)", IMG.transformer, "Substations stand in the open. Drones target them.", "Kreuzschnabel, CC BY-SA 3.0"],
    ["3 · Storms", "var(--steel)", IMG.stormBefore, "Storms and icing bring branches and debris down on the equipment.", "Arlington County, CC BY-SA 2.0"],
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

function FullPhoto({ src, tag, tagColor, line, sub, credit, corner = "tl" }: { src: string; tag: string; tagColor: string; line: string; sub?: string; credit: string; corner?: "tl" | "br" }) {
  return (
    <div className="slide" style={{ padding: 0 }}>
      <img src={asset(src)} alt={line} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", ...(corner === "br" ? { right: 60, bottom: 70, maxWidth: 640 } : { left: 80, top: 60, maxWidth: 1180 }), padding: "28px 40px 32px", background: "rgba(8,10,12,.84)", border: "1px solid var(--line)" }}>
        <motion.div {...rise(0)} className="tag" style={{ color: tagColor, fontSize: 22 }}>{tag}</motion.div>
        <motion.h2 {...rise(0.1)} style={{ marginTop: 16, fontSize: corner === "br" ? 46 : 64 }}>{line}</motion.h2>
        {sub && <motion.p {...rise(0.2)} style={{ marginTop: 14, fontSize: corner === "br" ? 22 : 26, color: "var(--fg)", lineHeight: 1.35 }}>{sub}</motion.p>}
      </div>
      <span className="credit" style={{ right: 12, top: 12 }}>{credit}</span>
    </div>
  );
}

const Before = () => <FullPhoto src={IMG.subBefore} tag="Before" tagColor="var(--risk)" line="Today: transformers stand unprotected." credit="Photo: Tiia Monto, CC BY-SA 4.0" />;
const After = () => (
  <FullPhoto src={IMG.subAfter} tag="After · with Matrica" tagColor="var(--accent)" line="The whole substation inside a net from the grid."
    sub="Six masts from reused poles, woven AMKA net on every side and over the top. Same real photo; the cage is a visualisation." credit="Photo: Tiia Monto, CC BY-SA 4.0 · cage visualisation: Matrica" corner="br" />
);

function Product() {
  return (
    <div className="slide" style={{ paddingTop: 72 }}>
      <div className="eyebrow">The product</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 56 }}>The structure: six masts, a woven net, a roof.</motion.h2>
      <div className="row" style={{ marginTop: 22, gap: 28, alignItems: "flex-start" }}>
        <motion.div {...rise(0.1)} style={{ border: "1px solid var(--line)", lineHeight: 0 }}><ProductCage width={1080} height={760} /></motion.div>
        <ol className="grow" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {PARTS.map((p, i) => (
            <motion.li {...rise(0.2 + i * 0.05)} key={p.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span className="mono" style={{ flex: "none", width: 34, height: 34, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 17 }}>{p.n}</span>
              <span><b style={{ fontFamily: "var(--display)", fontSize: 24 }}>{p.h}</b><br /><span className="muted" style={{ fontSize: 18 }}>{p.t}</span></span>
            </motion.li>
          ))}
          <motion.li {...rise(0.7)} className="small" style={{ marginTop: 6, fontSize: 17 }}>20/0.4 kV kiosk · 10 × 8 m enclosure · net ~9 m high on all sides and over the top. The overhead line on the left is where the AMKA comes from.</motion.li>
        </ol>
      </div>
    </div>
  );
}

function Weather() {
  return (
    <div className="slide">
      <div className="eyebrow">Storms</div>
      <motion.h2 {...rise(0)}>The net also takes the storm.</motion.h2>
      <div className="row" style={{ marginTop: 40, height: 740, gap: 24 }}>
        <motion.div {...rise(0.1)} className="grow">
          <Photo src={IMG.stormBefore} label="BEFORE" color="var(--risk)" credit="Arlington County, CC BY-SA 2.0">
            <h3 style={{ fontSize: 36 }}>Today a falling tree hits the equipment directly.</h3>
          </Photo>
        </motion.div>
        <motion.div {...rise(0.25)} className="grow">
          {IMG.stormAfter ? (
            <Photo src={IMG.stormAfter} label="AFTER · VISUALISATION" color="var(--accent)" credit="Same photo · shield visualisation: Matrica">
              <h3 style={{ fontSize: 36 }}>Guyed masts and the metal net catch branches before they reach the substation.</h3>
            </Photo>
          ) : (
            <div className="card" style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div style={{ maxWidth: 680 }}>
                <h3 style={{ fontSize: 36 }}>Guyed masts and the metal net catch branches before they reach the substation.</h3>
                <p className="muted" style={{ fontSize: 24, marginTop: 18 }}>Checked after every storm and icing. Wet snow on the roof net is a known risk to test.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StepArt({ kind }: { kind: "strand" | "mesh" }) {
  return (
    <svg viewBox="0 0 300 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label={kind === "strand" ? "AMKA core unwound into strands" : "Chain-link mesh panel"}>
      <rect width="300" height="180" fill="#0b1013" />
      {kind === "strand" && (<>
        <g stroke="#1d2125" strokeWidth="16" strokeLinecap="round"><path d="M20 60 C80 40 120 80 170 60" /><path d="M20 90 C80 70 120 110 170 90" /><path d="M20 120 C80 100 120 140 170 120" /></g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M170 ${60 + i * 10} C210 ${50 + i * 12} 240 ${70 + i * 9} 285 ${48 + i * 15}`} stroke="#b9c2c8" strokeWidth="2.5" fill="none" />)}
        <text x="150" y="168" fill="#93a1ab" fontFamily="JetBrains Mono, monospace" fontSize="11" textAnchor="middle">AMKA core → 2–2.5 mm aluminium strands</text>
      </>)}
      {kind === "mesh" && (<>
        <defs><pattern id="cl" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H22M0 0V22" stroke="#b9c2c8" strokeWidth="2.2" /></pattern></defs>
        <rect x="30" y="15" width="240" height="135" fill="url(#cl)" stroke="#ff7a1a" strokeWidth="2" />
        <text x="150" y="168" fill="#93a1ab" fontFamily="JetBrains Mono, monospace" fontSize="11" textAnchor="middle">chain-link machine · 50 mm mesh panels</text>
      </>)}
    </svg>
  );
}

function Process() {
  const card = (n: string, h: string, t: string, media: ReactNode, d: number) => (
    <motion.div {...rise(d)} className="card" style={{ padding: 0, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ height: 196, overflow: "hidden", borderBottom: "1px solid var(--line)", lineHeight: 0 }}>{media}</div>
      <div style={{ padding: "12px 16px" }}>
        <div className="mono accent" style={{ fontSize: 18 }}>{n}</div>
        <b style={{ fontFamily: "var(--display)", fontSize: 26 }}>{h}</b>
        <p className="muted" style={{ fontSize: 18, marginTop: 4, lineHeight: 1.3 }}>{t}</p>
      </div>
    </motion.div>
  );
  const img = (src: string, pos = "50% 50%") => <img src={asset(src)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />;
  return (
    <div className="slide" style={{ paddingTop: 72 }}>
      <div className="eyebrow">The practical process</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 50 }}>The workshop makes the net. Crews raise it the way they already work.</motion.h2>
      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "140px repeat(3, 1fr)", gap: 14, alignItems: "stretch" }}>
        <div className="lane-h"><span>IN THE<br />WORKSHOP</span></div>
        {card("01", "Sort the AMKA", "Keep long, undamaged lengths for ropes. Strip the rest.", img(IMG.scrap), 0.1)}
        {card("02", "Unwind the strands", "Each phase core unwinds into aluminium strands of about 2–2.5 mm.", <StepArt kind="strand" />, 0.18)}
        {card("03", "Weave the net", "A chain-link machine turns the strands into 50 mm mesh panels.", <StepArt kind="mesh" />, 0.26)}
        <div className="lane-h"><span>ON<br />SITE</span></div>
        {card("04", "Set the masts", "Stub ~2.2 m into the ground, wooden pole banded on top. Grid crews do this every day.", <MastBase width="100%" height="100%" />, 0.34)}
        {card("05", "Hang ropes and net", "AMKA around the tops and across the roof, guys at the corners, net laced on.", <ProductCage width={600} height={196} callouts={false} preserve="xMidYMid slice" />, 0.42)}
        {card("06", "Earth and inspect", "Bond the net to the site's earth. Check it after storms and icing.", img(IMG.subAfter, "30% 60%"), 0.5)}
      </div>
      <p className="small" style={{ marginTop: 12, fontSize: 15 }}>Photos: GeorgHH (CC BY-SA 4.0); Tiia Monto (CC BY-SA 4.0) with AI visualisation. Drawings: Matrica, after the team summary.</p>
    </div>
  );
}

function Video() {
  const [ok, setOk] = useState(true);
  return (
    <div className="slide" style={{ paddingTop: 76 }}>
      <div className="eyebrow">Drone test · visualisation</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 60 }}>The drone stops at the net, not at the substation.</motion.h2>
      <motion.div {...rise(0.15)} style={{ marginTop: 30, width: 1440, height: 810, border: "1px solid var(--line)", background: "#0b1013", alignSelf: "center" }}>
        {ok ? (
          <video src={asset("video/cage-drone-impact-10s.mp4")} autoPlay muted loop playsInline title="Click to pause or play"
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
      <motion.h2 {...rise(0)} style={{ fontSize: 60 }}>Where it can go after the pilot.</motion.h2>
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
          <p className="small" style={{ fontSize: 15, marginTop: 6 }}>The pilot is one 20/0.4 kV kiosk substation. These larger critical objects come later. Points at town level from public sources; exact sites to confirm with AST and Sadales tīkls.</p>
        </div>
      </div>
    </div>
  );
}

function Numbers() {
  const site: [string, string][] = [["6", "masts"], ["~105 m", "AMKA for ropes"], ["~1 km", "AMKA for the net"], ["~390 m²", "net (36 × 8.7 m + 80 m² roof)"], ["~20 km", "aluminium strand"]];
  return (
    <div className="slide" style={{ paddingTop: 72 }}>
      <div className="eyebrow">The numbers · from the Sadales tīkls stock sheet</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 56 }}>Poles for hundreds of sites. Cable for one.</motion.h2>
      <div className="row" style={{ marginTop: 18, gap: 24, alignItems: "flex-start" }}>
        <motion.div {...rise(0.1)} className="card" style={{ padding: 18 }}><StockChart width={1000} height={330} /></motion.div>
        <motion.div {...rise(0.2)} className="card grow">
          <div className="mono small" style={{ letterSpacing: ".1em" }}>CABLE IS THE BOTTLENECK</div>
          <p style={{ fontSize: 26, marginTop: 12, lineHeight: 1.35 }}>So we start with <b className="accent">one site</b>.</p>
          <p className="muted" style={{ fontSize: 20, marginTop: 12 }}>The grid already reused 487 stubs, 444 poles and 374 m of AMKA in 2026. We take only the leftover surplus.</p>
        </motion.div>
      </div>
      <div className="row" style={{ marginTop: 20, gap: 24, flex: 1 }}>
        <motion.div {...rise(0.35)} className="card grow">
          <div className="mono small" style={{ letterSpacing: ".1em" }}>ONE SITE NEEDS <span className="est" style={{ marginLeft: 8 }}>estimates</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginTop: 16 }}>
            {site.map(([n, l]) => <div key={l}><div className="big-num" style={{ fontSize: 44 }}>{n}</div><div className="muted" style={{ fontSize: 18, marginTop: 6 }}>{l}</div></div>)}
          </div>
        </motion.div>
        <motion.div {...rise(0.45)} className="card" style={{ width: 600 }}>
          <div className="mono small" style={{ letterSpacing: ".1em" }}>DOES IT HOLD?</div>
          <p style={{ fontSize: 25, marginTop: 12, lineHeight: 1.35 }}>A 1 kg FPV drone at 30 m/s carries <b className="accent">~450 J</b>. One 2.5 mm strand holds <b className="accent">~800 N</b>.</p>
          <p className="muted" style={{ fontSize: 20, marginTop: 8 }}>Test: a 10 kg sandbag dropped from 4.6 m gives the same 450 J on a panel.</p>
        </motion.div>
      </div>
    </div>
  );
}

// Budget: initial capex and one pilot site. Estimates from public prices (Oct 2026), labour at Latvian rates.
const CAPEX: [string, string, string][] = [
  ["Semi-automatic chain-link machine", "€8–12k", "$4–8k ex-factory + shipping, VAT, set-up for aluminium wire"],
  ["Cable stripping machine + hand tools", "€1.5–3k", "for AMKA cores"],
  ["Strand unwinding and straightening rig", "€0.5–1.5k", "reel stands, straightener, workbench"],
  ["Test rig: panel frame + 10 kg sandbag drop", "€0.5–1k", "450 J impact test"],
  ["Safety gear, earthing tester, tools", "€1–2k", ""],
];
const PILOT: [string, string, string][] = [
  ["Reused stubs, poles, AMKA", "€0", "Sadales tīkls surplus (scrap value forgone ~€1k)"],
  ["Bought hardware", "€2.5–4k", "steel bands, guys + 4 anchors, clamps, lacing wire, gate frame, gravel"],
  ["Earthing set", "€0.4–0.8k", "conductor, clamps, rod, measurement"],
  ["Workshop labour, ~70–100 h", "€1–2k", "sort, strip, unwind, weave ~390 m² at €15–20/h incl. tax"],
  ["Site crew 3 × 4 days", "€1.5–2k", "plus crane truck ~2 days (€39–45/h) and auger"],
  ["Crane, auger, transport", "€1–1.5k", ""],
  ["Engineering and safety check", "€2–4k", "structure, clearance, earthing, permit"],
  ["Contingency 15%", "€1.3–2.1k", ""],
];

function Budget() {
  const table = (rows: [string, string, string][]) => (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 19 }}>
      <tbody>
        {rows.map(([a, b, c]) => (
          <tr key={a} style={{ borderBottom: "1px solid var(--line)" }}>
            <td style={{ padding: "7px 8px 7px 0" }}>{a}{c && <div className="muted" style={{ fontSize: 14 }}>{c}</div>}</td>
            <td className="mono" style={{ padding: "7px 0", textAlign: "right", whiteSpace: "nowrap", verticalAlign: "top" }}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="slide" style={{ paddingTop: 70 }}>
      <div className="eyebrow">Budget · estimates</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 54 }}>€22–35k to prove it on one substation.</motion.h2>
      <div className="row" style={{ marginTop: 20, gap: 24, alignItems: "stretch" }}>
        <motion.div {...rise(0.1)} className="card grow" style={{ borderTop: "4px solid var(--steel)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ fontSize: 30 }}>Initial capex · workshop</h3>
            <span className="big-num" style={{ fontSize: 46, color: "var(--steel)" }}>€12–19k</span>
          </div>
          <div style={{ marginTop: 10 }}>{table(CAPEX)}</div>
          <p className="muted" style={{ fontSize: 16, marginTop: 10 }}>One-off. The same workshop serves every later site.</p>
        </motion.div>
        <motion.div {...rise(0.2)} className="card grow" style={{ borderTop: "4px solid var(--accent)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ fontSize: 30 }}>Pilot site · one kiosk substation</h3>
            <span className="big-num" style={{ fontSize: 46, color: "var(--accent)" }}>€10–16k</span>
          </div>
          <div style={{ marginTop: 10 }}>{table(PILOT)}</div>
        </motion.div>
      </div>
      <motion.div {...rise(0.35)} className="row" style={{ marginTop: 18, gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <span className="mono small" style={{ letterSpacing: ".1em" }}>TO START</span>
        <span className="chip">Climathon prize €1,500</span>
        <span className="chip">Sadales tīkls pilot contract</span>
        <span className="chip">State drone-protection pilot (KEM)</span>
        <span className="chip">LIFE / dual-use grants</span>
        <span className="small" style={{ fontSize: 15 }}>Prices: supplier listings, LV wage and crane-rental data, Oct 2026. To confirm with quotes.</span>
      </motion.div>
    </div>
  );
}

function Clients() {
  const pick = (names: string[]) => names.map((n) => COMPANIES.find((c) => c.name === n)).filter(Boolean) as typeof COMPANIES;
  const cols: { h: string; why: string; names: string[] }[] = [
    { h: "Pilot partner and first user", why: "Owns the kiosk substations and the surplus. Gives material and a site; gets protection and reuse.", names: ["Sadales tīkls"] },
    { h: "Next users in Latvia", why: "Own critical sites that drones and storms threaten: substations, grid batteries, plants, gas and broadcast.", names: ["AST", "Latvenergo · Elektrum Group", "Conexus Baltic Grid", "Gaso", "LVRTC"] },
    { h: "Next in the Baltics", why: "Same equipment, same threat, same kind of surplus.", names: ["ESO", "Litgrid", "Elektrilevi", "Elering"] },
  ];
  return (
    <div className="slide" style={{ paddingTop: 76 }}>
      <div className="eyebrow">Clients · our proposal</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 58 }}>Who uses it, and why they'd pay.</motion.h2>
      <div className="row" style={{ marginTop: 24, gap: 24, alignItems: "stretch" }}>
        {cols.map((c, i) => (
          <motion.div {...rise(0.1 + i * 0.12)} className="card grow" key={c.h} style={{ borderTop: `4px solid ${i === 0 ? "var(--accent)" : "var(--steel)"}`, display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontSize: 34, color: i === 0 ? "var(--accent)" : "var(--fg)" }}>{c.h}</h3>
            <p className="muted" style={{ fontSize: 22, lineHeight: 1.35 }}>{c.why}</p>
            <div style={{ display: "grid", gridTemplateColumns: i === 0 ? "1fr" : "1fr 1fr", gap: 10, marginTop: "auto" }}>
              {pick(c.names).map((co) => <LogoTile key={co.name} c={co} height={i === 0 ? 120 : 76} />)}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 24, gap: 24 }}>
        <motion.div {...rise(0.5)} className="card grow">
          <div className="mono small" style={{ letterSpacing: ".1em", color: "var(--accent)" }}>WHY THEY PAY</div>
          <p style={{ fontSize: 22, lineHeight: 1.4, marginTop: 8 }}>Material from their own surplus, crews that already know the work, a metal net propellers can't cut, and a resilience measure the EU CER Directive asks critical entities to take.</p>
        </motion.div>
        <motion.div {...rise(0.6)} className="card grow" style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}>
          <div className="mono small" style={{ letterSpacing: ".1em", color: "var(--accent)" }}>WHY NOW · 22 SEP 2026</div>
          <p style={{ fontSize: 22, lineHeight: 1.4, marginTop: 8 }}>The Cabinet approved a pilot with energy companies to protect energy infrastructure from drones: shared requirements, joint procurement, Latvian solutions welcome. AST gets <b className="accent">€18.5M</b> in EU funding for perimeter and counter-drone protection.</p>
        </motion.div>
      </div>
      <p className="small" style={{ marginTop: 12, fontSize: 15 }}>The team summary names no client; this is our proposal. No agreements yet. Logos belong to their owners. "Why now": LV portāls, KEM, 2026.</p>
    </div>
  );
}

function Practical() {
  const cols: [string, string, string[]][] = [
    ["Safe", "var(--ok)", ["Net bonded to earth", "Clear of live parts", "Far enough that a blast in the net can't reach equipment"]],
    ["Honest limits", "var(--warn)", ["Stops FPV and small multirotors, not large one-way attack drones", "Wet snow can bridge the mesh and load the roof", "AMKA strands may crack in the weaving machine"]],
    ["Pilot", "var(--accent)", ["One 20/0.4 kV kiosk site", "Weave test samples, then a sandbag test", "An agreed limit on how much surplus we take"]],
  ];
  return (
    <div className="slide">
      <div className="eyebrow">Practical</div>
      <motion.h2 {...rise(0)}>A concept, tested before it goes near live equipment.</motion.h2>
      <div className="row" style={{ marginTop: 56, gap: 30, flex: 1 }}>
        {cols.map(([h, color, items], i) => (
          <motion.div {...rise(0.15 + i * 0.12)} className="card grow" key={h} style={{ borderTop: `4px solid ${color}` }}>
            <h3 style={{ fontSize: 52, color }}>{h}</h3>
            <ul style={{ margin: "36px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 28 }}>
              {items.map((t) => <li key={t} style={{ fontSize: 30, lineHeight: 1.25 }}>{t}</li>)}
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
            Once the pilot works: three hubs, every grid company's surplus as material, each country's surplus protecting its own grid.
          </motion.p>
          <motion.div {...rise(0.35)} className="card" style={{ marginTop: "auto", borderColor: "var(--accent)", background: "var(--accent-soft)" }}>
            <div className="mono" style={{ fontSize: 20, letterSpacing: ".12em", color: "var(--accent)" }}>OUR ASK</div>
            <h3 style={{ fontSize: 46, marginTop: 10 }}>A one-site pilot with Sadales tīkls, and an agreed share of the surplus.</h3>
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
          <h3 style={{ marginTop: 30 }}>Assumptions behind the numbers</h3>
          <ul style={{ fontSize: 20, lineHeight: 1.5, color: "var(--muted)" }}>
            <li>Only the stock figures come from the Sadales tīkls sheet: 880 stubs, 1,500 poles, 1,116 m AMKA (reused in 2026: 487, 444, 374 m).</li>
            <li>One site: 20/0.4 kV kiosk, 10 × 8 m enclosure, 6 masts, ~105 m AMKA ropes, ~1,000 m AMKA for the net, ~390 m² of net, ~20 km of strand (~50 m per m²).</li>
            <li>Impact: 1 kg FPV at 30 m/s ≈ 450 J; one 2.5 mm strand ≈ 800 N; test with a 10 kg sandbag from 4.6 m.</li>
            <li>A hackathon concept, not a design: an engineer and tests must verify it before anything is built near live equipment.</li>
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
  { id: "title", title: "Title", seconds: 7, render: () => <Title />,
    notes: "Hi, we're Matrica. We make drone nets from grid surplus. We call it Tīkls no tīkla: in Latvian, tīkls means both net and grid." },
  { id: "problem", title: "Three problems", seconds: 20, render: () => <Problem />,
    notes: "Three problems meet in one place. Surplus: AMKA cable, wooden poles and concrete stubs pile up. Drones: substations stand in the open. Storms: branches and debris come down on the equipment." },
  { id: "before", title: "Before", seconds: 8, render: () => <Before />,
    notes: "This is a real substation today. Nothing stands between a drone and the transformer." },
  { id: "after", title: "After", seconds: 11, render: () => <After />,
    notes: "And this is the idea on the same substation: masts from reused poles and a woven AMKA net." },
  { id: "product", title: "The product", seconds: 12, render: () => <Product />,
    notes: "Here's the structure. Six masts: old wooden poles banded to concrete stubs. AMKA cable as the top ropes. A wall net woven from AMKA strands, about nine metres high, and a roof net against diving drones. A gate for service vehicles, guy wires at every corner. A ten by eight metre enclosure around a kiosk substation." },
  { id: "weather", title: "Storms", seconds: 10, render: () => <Weather />,
    notes: "The net also takes the storm. Today a falling tree hits the equipment. With guyed masts and a metal net, branches are caught first." },
  { id: "process", title: "Process", seconds: 22, render: () => <Process />,
    notes: "In the workshop: sort the AMKA, keep long pieces for ropes, unwind each core into two-millimetre strands, weave fifty-millimetre mesh. On site: set the stub two metres into the ground and band the pole on top, exactly as crews do every day. Then ropes, net, earthing." },
  { id: "video", title: "Video", seconds: 12, render: () => <Video />,
    notes: "Here's what happens when a drone hits. [Let it play.] It detonates on the net. The masts hold and the substation is untouched." },
  { id: "where", title: "Where", seconds: 8, render: () => <Where />,
    notes: "After the pilot, these are the critical objects in Latvia the idea can grow to, starting in Latgale near the border." },
  { id: "numbers", title: "The numbers", seconds: 18, render: () => <Numbers />,
    notes: "From the Sadales tīkls stock sheet: enough stubs and poles for hundreds of sites, but AMKA for just one net. Cable is the bottleneck, so we start with one site. It holds: a drone brings about 450 joules; one strand holds 800 newtons. We'll prove it with a sandbag test." },
  { id: "budget", title: "Budget", seconds: 10, render: () => <Budget />,
    notes: "To prove it we need twenty-two to thirty-five thousand euros: twelve to nineteen thousand for the workshop, mainly a chain-link machine, and ten to sixteen thousand for the first substation. The material itself is free: it's the grid's surplus." },
  { id: "clients", title: "Clients", seconds: 12, render: () => <Clients />,
    notes: "Who uses it: Sadales tīkls first, as pilot partner and material owner. Then AST, Latvenergo, gas and broadcast operators, and the Baltic grids. And the timing is right: in September the government approved a pilot with energy companies to protect them from drones, open to Latvian solutions, and AST is getting 18.5 million euros in EU funding for exactly this." },
  { id: "practical", title: "Practical", seconds: 10, render: () => <Practical />,
    notes: "It's earthed, clear of live parts, and far enough that a blast can't reach equipment. It stops small drones, not large attack drones, and wet snow is a risk. So: one site, test samples and a sandbag test first." },
  { id: "partners", title: "Partners", seconds: 7, render: () => <Partners />,
    notes: "And these are the delivery partners and funds for scaling up. No agreements yet." },
  { id: "future", title: "Future", seconds: 13, render: () => <Future />,
    notes: "If the pilot works, every grid's surplus can protect its own grid. Our ask today: a one-site pilot with Sadales tīkls. Thank you." },
];

export const APPENDIX: SlideDef = { id: "appendix", title: "Appendix", seconds: 0, notes: "Not presented. Sources, credits, assumptions and the full scoring table.", render: () => <Appendix /> };
