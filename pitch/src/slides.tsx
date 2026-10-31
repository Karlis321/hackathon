import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BalticMap, BeforeAfter, LatticeConcept, LogoTile } from "./components";
import { COMPANIES, CREDITS, EU_FUNDS, OBJECTS, SOURCES, TEAM, type Company } from "./data";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
// ?static renders every slide in its final state (for checks and the PDF export)
export const STATIC = typeof location !== "undefined" && new URLSearchParams(location.search).has("static");
const rise = (d = 0) => STATIC ? { initial: false as const } : ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const } });

function Takes({ size = 26 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: size }}>
      <span className="mono muted" style={{ fontSize: size * 0.7, letterSpacing: ".12em" }}>WE TAKE</span>
      <span className="chip" style={{ fontSize: size * 0.8, borderColor: "var(--accent)" }}>Cable offcuts</span>
      <span className="mono accent">+</span>
      <span className="chip" style={{ fontSize: size * 0.8, borderColor: "var(--accent)" }}>Concrete poles</span>
      <span className="mono accent">→</span>
      <span className="chip" style={{ fontSize: size * 0.8, background: "var(--accent)", color: "#11161a", borderColor: "var(--accent)", fontWeight: 600 }}>Drone shield</span>
    </div>
  );
}

export interface SlideDef { id: string; title: string; seconds: number; notes: string; render: () => ReactNode }

function Title() {
  return (
    <div className="slide" style={{ justifyContent: "center" }}>
      <div style={{ position: "absolute", right: 60, top: 80, opacity: 0.9 }}><LatticeConcept size={760} /></div>
      <motion.img {...rise(0)} src={asset("brand/matrica-logo.svg")} alt="Matrica" style={{ width: 520, marginBottom: 56 }} />
      <motion.h1 {...rise(0.15)} style={{ maxWidth: 1050 }}>Grid waste becomes <span className="accent">grid shield</span>.</motion.h1>
      <motion.p {...rise(0.3)} className="lead" style={{ marginTop: 36, maxWidth: 980 }}>
        We take the cables and concrete poles grid companies throw away, and build drone screens around small, critical grid equipment.
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
  return (
    <div className="slide">
      <div className="eyebrow">The problem</div>
      <motion.h2 {...rise(0)}>Two problems, one place.</motion.h2>
      <div className="row" style={{ marginTop: 44, height: 700 }}>
        <motion.div {...rise(0.15)} className="grow" style={{ position: "relative", border: "1px solid var(--line)", overflow: "hidden" }}>
          <img src={asset("img/before-cable-scrap.jpg")} alt="Pile of scrapped cable" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 36px 30px", background: "linear-gradient(transparent, rgba(8,10,12,.92))" }}>
            <div className="tag" style={{ color: "var(--accent)" }}>Waste</div>
            <h3 style={{ marginTop: 14, fontSize: 44 }}>Offcuts too short to reuse. Concrete poles that crumble when removed.</h3>
            <p className="small" style={{ marginTop: 10 }}>Sadales tīkls challenge brief: no reuse today for broken concrete poles.</p>
          </div>
          <span className="credit" style={{ right: 8, top: 8 }}>Photo: GeorgHH, CC BY-SA 4.0</span>
        </motion.div>
        <motion.div {...rise(0.3)} className="grow" style={{ position: "relative", border: "1px solid var(--line)", overflow: "hidden" }}>
          <img src={asset("img/transformer-110-20kv.jpg")} alt="110/20 kV transformer in an open substation" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", display: "block" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 36px 30px", background: "linear-gradient(transparent, rgba(8,10,12,.92))" }}>
            <div className="tag" style={{ color: "var(--risk)" }}>Threat</div>
            <h3 style={{ marginTop: 14, fontSize: 44 }}>Drones target transformers. Small sites have no protection.</h3>
            <p className="small" style={{ marginTop: 10 }}>Ukraine shields substations in three layers. Lithuania adds €48M+ to harden one substation.</p>
          </div>
          <span className="credit" style={{ right: 8, top: 8 }}>Photo: Kreuzschnabel, CC BY-SA 3.0</span>
        </motion.div>
      </div>
    </div>
  );
}

function Solution() {
  return (
    <div className="slide">
      <div className="eyebrow">The solution</div>
      <motion.h2 {...rise(0)}>A cable lattice on concrete posts.</motion.h2>
      <motion.div {...rise(0.08)} style={{ marginTop: 22 }}><Takes size={24} /></motion.div>
      <div className="row" style={{ marginTop: 28, alignItems: "flex-start" }}>
        <motion.div {...rise(0.15)}>
          <BeforeAfter before={asset("img/before-substation.jpg")} after={asset("img/after-substation-shield.jpg")} w={980} h={580} />
          <p className="small" style={{ marginTop: 12, maxWidth: 980 }}>
            Drag the handle. Same real substation: before, and after with our shield (concept visualisation): concrete posts, a cable grid and a crushed-concrete wall.
            Photo: Tiia Monto, CC BY-SA 4.0; shield drawn by Matrica.
          </p>
        </motion.div>
        <div className="grow" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            ["Cable offcuts", "Whole, insulation on, laid straight in a 10 cm grid and tied at every crossing."],
            ["Concrete poles", "Intact ones become posts 2 m out. Broken ones are crushed into a low wall."],
            ["Overhead AMKA cable", "Used whole as the top and bottom rope."],
          ].map(([h, t], i) => (
            <motion.div {...rise(0.3 + i * 0.12)} className="card" key={h}>
              <h3 style={{ fontSize: 32 }}><span className="accent mono" style={{ fontSize: 22, marginRight: 12 }}>→</span>{h}</h3>
              <p className="muted" style={{ fontSize: 24, marginTop: 8, lineHeight: 1.4 }}>{t}</p>
            </motion.div>
          ))}
          <motion.p {...rise(0.7)} style={{ fontSize: 26, lineHeight: 1.4 }}>No stripping. No bending. <span className="accent">Any length, any size.</span></motion.p>
          <motion.p {...rise(0.8)} style={{ fontSize: 24, lineHeight: 1.4, color: "var(--steel)" }}>Built for Baltic weather: wind, ice, snow, rain and sun.</motion.p>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    ["Collect", "Crews throw offcuts in one bin. No new work."],
    ["Check", "Reject only metal that melted or crumbles."],
    ["Sort", "Thin → grid. Thick → low slats. AMKA → rope."],
    ["Set posts", "Concrete posts 2 m out, crushed-concrete wall."],
    ["Build", "Straight cables, 10 cm grid, tied at crossings."],
    ["Earth & inspect", "Outside the 110 kV zone. Yearly check."],
  ];
  const [videoOk, setVideoOk] = useState(true);
  return (
    <div className="slide">
      <div className="eyebrow">How it works</div>
      <motion.h2 {...rise(0)}>From bin to shield in six steps.</motion.h2>
      <div className="row" style={{ marginTop: 40 }}>
        <motion.div {...rise(0.15)} style={{ width: 1000, height: 562, border: "1px solid var(--line)", background: "#0b1013", position: "relative" }}>
          {videoOk ? (
            <video src={asset("video/how-it-works.mp4")} autoPlay muted loop playsInline title="Click to pause or play"
              onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }} onError={() => setVideoOk(false)} />
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%" }}><LatticeConcept size={560} /></div>
          )}
        </motion.div>
        <ol className="grow" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {steps.map(([h, t], i) => (
            <motion.li {...rise(0.25 + i * 0.08)} key={h} style={{ display: "flex", gap: 20, alignItems: "baseline", borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
              <span className="mono accent" style={{ fontSize: 26, width: 30 }}>{i + 1}</span>
              <span><b style={{ fontFamily: "var(--display)", fontSize: 30 }}>{h}</b><br /><span className="muted" style={{ fontSize: 22 }}>{t}</span></span>
            </motion.li>
          ))}
        </ol>
      </div>
      <motion.p {...rise(0.8)} style={{ marginTop: 22, fontSize: 26 }}>One kit per transformer · 3-person crew · about 4 days <span className="est" style={{ marginLeft: 12 }}>estimate</span></motion.p>
    </div>
  );
}

function Where() {
  const [pick, setPick] = useState<Company | null>(null);
  const top = [...OBJECTS].map((o) => ({ o, t: o[2] + o[3] + o[4] + o[5] + o[6] + o[7] })).sort((a, b) => b.t - a.t).slice(0, 3);
  return (
    <div className="slide" style={{ paddingBottom: 90 }}>
      <div className="eyebrow">Where</div>
      <motion.h2 {...rise(0)} style={{ fontSize: 64 }}>Small, critical objects across the Baltics.</motion.h2>
      <div className="row" style={{ marginTop: 26, gap: 30 }}>
        <motion.div {...rise(0.15)} style={{ border: "1px solid var(--line)" }}>
          <BalticMap width={1240} height={720} mode="logos" onPick={setPick} />
        </motion.div>
        <div className="grow" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="small mono" style={{ letterSpacing: ".1em" }}>TOP TARGETS · SCORED /60</div>
          {top.map(({ o, t }, i) => (
            <motion.div {...rise(0.3 + i * 0.1)} className="card" key={o[0]} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <b style={{ fontSize: 24, fontFamily: "var(--display)" }}>{o[0]}</b>
                <span className="mono accent" style={{ fontSize: 26 }}>{t}</span>
              </div>
              <div className="small" style={{ marginTop: 4 }}>{o[1]}</div>
            </motion.div>
          ))}
          <div className="card" style={{ padding: "16px 20px", minHeight: 120 }}>
            {pick ? (<><b style={{ fontSize: 22 }}>{pick.name}</b><p className="small" style={{ marginTop: 6 }}>{pick.what}</p></>) :
              (<p className="small">Hover a logo to see what the company would supply or buy. Red rings: Latgale pilot region.</p>)}
          </div>
          <p className="small" style={{ fontSize: 15 }}>Target suppliers and customers. No agreements yet. Logos belong to their owners. Positions approximate.</p>
        </div>
      </div>
    </div>
  );
}

function Economics() {
  const [price, setPrice] = useState(20);
  const [units, setUnits] = useState(275);
  const cost = 12;
  const revenue = price * units;
  const margin = (price - cost) * units;
  const service = revenue * 0.1;
  const fmt = (k: number) => (k >= 1000 ? `€${(k / 1000).toFixed(1)}M` : `€${Math.round(k)}k`);
  return (
    <div className="slide">
      <div className="eyebrow">Economics</div>
      <motion.h2 {...rise(0)}>One kit. Clear numbers. <span className="est" style={{ fontSize: 22, verticalAlign: "middle" }}>estimates</span></motion.h2>
      <div className="row" style={{ marginTop: 50, gap: 30 }}>
        {[
          ["€10–14k", "our cost per transformer kit"],
          ["€18–25k", "price per kit"],
          ["~10%", "yearly inspection contract"],
          ["~€0", "material cost: it's their waste"],
        ].map(([n, l], i) => (
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
          <div><div className="big-num">{fmt(revenue)}</div><div className="muted" style={{ fontSize: 22 }}>kit revenue</div></div>
          <div><div className="big-num" style={{ color: "var(--ok)" }}>{fmt(margin)}</div><div className="muted" style={{ fontSize: 22 }}>gross margin</div></div>
          <div><div className="big-num" style={{ fontSize: 64 }}>{fmt(service)}</div><div className="muted" style={{ fontSize: 22 }}>service per year</div></div>
          <div><div className="big-num" style={{ fontSize: 64, color: "var(--steel)" }}>↓</div><div className="muted" style={{ fontSize: 22 }}>disposal cost for the grid company</div></div>
        </div>
      </motion.div>
    </div>
  );
}

function Practical() {
  const cols: [string, string, string[]][] = [
    ["Safe", "var(--ok)", ["Earthed lattice", "Outside the 110 kV clearance zone", "Built under the site's work permit"]],
    ["Weatherproof", "var(--steel)", ["Open 10 cm grid: low wind load, snow falls through", "Concrete posts carry ice on the cables", "Outdoor cable sheaths: UV- and rain-proof, no rust", "Checked after every storm"]],
    ["Honest limits", "var(--warn)", ["Stops FPV and small drones, debris", "Does not stop Shahed-class drones or missiles", "Version 1 covers the sides"]],
    ["Pilot", "var(--accent)", ["2–5 transformers in Latgale", "With Sadales tīkls", "Measure cost, time, tonnes reused and winter performance"]],
  ];
  return (
    <div className="slide">
      <div className="eyebrow">Practical</div>
      <motion.h2 {...rise(0)}>Safe, weatherproof, built with what crews know.</motion.h2>
      <div className="row" style={{ marginTop: 56, gap: 30, flex: 1 }}>
        {cols.map(([h, color, items], i) => (
          <motion.div {...rise(0.15 + i * 0.12)} className="card grow" key={h} style={{ borderTop: `4px solid ${color}` }}>
            <h3 style={{ fontSize: 46, color }}>{h}</h3>
            <ul style={{ margin: "34px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 26 }}>
              {items.map((t) => <li key={t} style={{ fontSize: 30, lineHeight: 1.28 }}>{t}</li>)}
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
        <motion.div {...rise(0.2)} style={{ border: "1px solid var(--line)" }}>
          <BalticMap width={880} height={830} mode="hubs" />
        </motion.div>
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
            <li>Kit for one 110/20 kV transformer: ~14 concrete posts, ~180 m² of cable lattice, ~120 m AMKA rope, ~10 m³ crushed-concrete wall.</li>
            <li>Cost €10–14k: baskets and earthing €2–3k, cable preparation €2–3k, installation 3 people × 4 days €4–5k, engineering and transport €2–3k.</li>
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
  { id: "title", title: "Title", seconds: 10, render: () => <Title />,
    notes: "Hi, we're Matrica. We take the cables and concrete poles that Sadales tīkls throws away, and turn them into drone protection for the grid itself." },
  { id: "problem", title: "Problem", seconds: 25, render: () => <Problem />,
    notes: "Two problems meet here. First, waste: cable offcuts too short to reuse, and concrete poles that crumble when they come down, with no second life today. Second, threat: drones now target transformers. Ukraine protects substations in layers, and Lithuania is spending over 48 million euros to harden a single substation. Latvia's small sites have nothing." },
  { id: "solution", title: "Solution", seconds: 30, render: () => <Solution />,
    notes: "Our answer: we take their cables and concrete poles and build a shield. We use whole cables, keep the insulation on, and lay them straight in a ten-centimetre grid, tied at every crossing. Intact concrete poles become the posts, two metres out from the transformer. Crushed concrete fills a low wall. A drone hits the screen, not the transformer. [Drag the slider] Here is a real substation, before and after." },
  { id: "how", title: "How it works", seconds: 25, render: () => <HowItWorks />,
    notes: "For Sadales tīkls crews, nothing changes: they throw offcuts in one bin. We collect, check the metal, sort by thickness, set the posts and build the lattice. No stripping, no weaving, any length. One kit per transformer, installed by three people in about four days." },
  { id: "where", title: "Where", seconds: 20, render: () => <Where />,
    notes: "We start with small, critical objects: 110/20 kV transformers, the grid batteries in Rēzekne and Tume, and gas regulating stations. Our pilot region is Latgale, next to the border. The same companies across the Baltics supply the material and need the protection." },
  { id: "economics", title: "Economics", seconds: 30, render: () => <Economics />,
    notes: "Our numbers are estimates we'll confirm with Sadales tīkls. A kit costs us ten to fourteen thousand euros and sells for eighteen to twenty-five, plus a yearly inspection contract. Latvia alone has around 250 to 300 transformers: five to six million euros. The Baltics are about three times that. And Sadales tīkls pays less to get rid of its waste." },
  { id: "practical", title: "Practical", seconds: 15, render: () => <Practical />,
    notes: "It's safe: the lattice is earthed and stays outside the high-voltage zone. And it's weatherproof: the open grid lets wind and snow through, concrete posts carry the ice, and outdoor cable sheaths don't rust. It stops FPV drones and debris, not missiles. We propose a pilot in Latgale." },
  { id: "partners", title: "Partners", seconds: 15, render: () => <Partners />,
    notes: "These are the companies we'll work with: grid operators as suppliers and buyers, contractors to install, recyclers for what's left. European programmes like LIFE, Horizon Europe and the EIC fund the scale-up. No agreements yet; that's our next step." },
  { id: "future", title: "Future", seconds: 10, render: () => <Future />,
    notes: "Our vision: a Baltic take-back network, three hubs, every grid's waste protecting its own grid. Our ask today: a pilot with Sadales tīkls on two to five transformers. Thank you." },
];

export const APPENDIX: SlideDef = { id: "appendix", title: "Appendix", seconds: 0, notes: "Not presented. Sources, credits, assumptions and the full scoring table.", render: () => <Appendix /> };
