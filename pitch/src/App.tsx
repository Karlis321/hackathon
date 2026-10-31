import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { APPENDIX, SLIDES, STATIC } from "./deck";

const ALL = [...SLIDES, APPENDIX];
const TOTAL = SLIDES.reduce((s, x) => s + x.seconds, 0); // 180
const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("matrica-pitch") : null;
const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

function initialIndex() {
  const m = /slide=(\d+)/.exec(location.search);
  return m ? Math.min(ALL.length - 1, Math.max(0, +m[1] - 1)) : 0;
}

/* Scales the 1920x1080 stage to fit any window */
function useScale(ref: React.RefObject<HTMLDivElement>, w = 1920, h = 1080) {
  const [s, setS] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    const fit = () => { const r = el?.getBoundingClientRect() ?? { width: innerWidth, height: innerHeight }; setS(Math.min(r.width / w, r.height / h)); };
    fit();
    const ro = new ResizeObserver(fit); if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [ref, w, h]);
  return s;
}

function Stage({ index, still = false }: { index: number; still?: boolean }) {
  const slide = ALL[index];
  const presented = index < SLIDES.length;
  return (
    <div className="stage">
      <div className="texture" />
      <AnimatePresence mode="wait">
        <motion.div key={slide.id + (still ? "-s" : "")} initial={still || STATIC ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ position: "absolute", inset: 0 }}>
          {slide.render()}
        </motion.div>
      </AnimatePresence>
      {presented && index > 0 && (
        <div className="footer">
          <img src={asset("brand/matrica-logo.svg")} alt="" />
          <span>Climathon 2026 · Sadales tīkls challenge · {index + 1}/{SLIDES.length}</span>
        </div>
      )}
      {presented && <div className="progress" style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }} />}
    </div>
  );
}

function Presenter() {
  const [index, setIndex] = useState(initialIndex());
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const curRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const sCur = useScale(curRef);
  const sNext = useScale(nextRef);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (!channel) return;
    const on = (e: MessageEvent) => { if (e.data?.type === "goto") { setIndex(e.data.index); setStart((s) => s ?? Date.now()); } };
    channel.addEventListener("message", on);
    channel.postMessage({ type: "hello" });
    return () => channel.removeEventListener("message", on);
  }, []);
  const go = useCallback((i: number) => { const n = Math.max(0, Math.min(ALL.length - 1, i)); setIndex(n); setStart((s) => s ?? Date.now()); channel?.postMessage({ type: "goto", index: n, from: "presenter" }); }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(index + 1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(index - 1); }
      if (e.key.toLowerCase() === "t") setStart(Date.now());
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [index, go]);
  const elapsed = start ? (now - start) / 1000 : 0;
  const left = TOTAL - elapsed;
  const target = SLIDES.slice(0, Math.min(index + 1, SLIDES.length)).reduce((s, x) => s + x.seconds, 0);
  const mmss = (s: number) => `${s < 0 ? "-" : ""}${Math.floor(Math.abs(s) / 60)}:${String(Math.floor(Math.abs(s) % 60)).padStart(2, "0")}`;
  const slide = ALL[index];
  return (
    <div className="presenter">
      <div style={{ gridColumn: "1 / 3", display: "flex", alignItems: "center", gap: 32 }}>
        <div className={`clock ${left < 0 ? "over" : ""}`}>{mmss(left)}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 22, color: "var(--muted)" }}>
          elapsed {mmss(elapsed)} · this slide should end by {mmss(target)} {start && elapsed > target ? <span style={{ color: "var(--risk)" }}>· behind</span> : null}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span className="kbd">←/→</span><span className="kbd">T</span><span style={{ color: "var(--muted)" }}>restart timer</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>NOW · {index + 1}. {slide.title} {slide.seconds ? `· ${slide.seconds}s` : ""}</div>
        <div ref={curRef} className="preview" style={{ aspectRatio: "16 / 9" }}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${sCur})`, transformOrigin: "top left", width: 1920, height: 1080, pointerEvents: "none" }}><Stage index={index} still /></div>
        </div>
        <div className="notes">{slide.notes}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontFamily: "var(--mono)", color: "var(--muted)" }}>NEXT · {index + 2 <= ALL.length ? ALL[index + 1].title : "end"}</div>
        <div ref={nextRef} className="preview" style={{ aspectRatio: "16 / 9" }}>
          {index + 1 < ALL.length && <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${sNext})`, transformOrigin: "top left", width: 1920, height: 1080, pointerEvents: "none" }}><Stage index={index + 1} still /></div>}
        </div>
        <ol style={{ fontFamily: "var(--mono)", fontSize: 18, color: "var(--muted)", lineHeight: 1.7 }}>
          {SLIDES.map((s, i) => <li key={s.id} style={{ color: i === index ? "var(--fg)" : undefined }}>{s.title} · {s.seconds}s</li>)}
        </ol>
      </div>
    </div>
  );
}

function Deck() {
  const [index, setIndex] = useState(initialIndex());
  const vp = useRef<HTMLDivElement>(null);
  const s = useScale(vp);
  const go = useCallback((i: number, broadcast = true) => {
    const n = Math.max(0, Math.min(ALL.length - 1, i));
    setIndex(n);
    if (broadcast) channel?.postMessage({ type: "goto", index: n });
  }, []);
  useEffect(() => {
    if (!channel) return;
    const on = (e: MessageEvent) => {
      if (e.data?.type === "goto" && e.data.from === "presenter") go(e.data.index, false);
      if (e.data?.type === "hello") channel.postMessage({ type: "goto", index });
    };
    channel.addEventListener("message", on);
    return () => channel.removeEventListener("message", on);
  }, [go, index]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowright", "pagedown", " ", "enter"].includes(key)) { e.preventDefault(); go(index + 1); }
      else if (["arrowleft", "pageup", "backspace"].includes(key)) { e.preventDefault(); go(index - 1); }
      else if (key === "home") go(0);
      else if (key === "end") go(SLIDES.length - 1);
      else if (key === "a") go(ALL.length - 1);
      else if (key === "f") { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
      else if (key === "s") window.open(`${location.pathname}?presenter&slide=${index + 1}`, "matrica-presenter", "width=1400,height=900");
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [index, go]);
  return (
    <div className="viewport" ref={vp}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 1920, height: 1080, transform: `translate(-50%, -50%) scale(${s})` }}><Stage index={index} /></div>
    </div>
  );
}

export default function App() {
  return new URLSearchParams(location.search).has("presenter") ? <Presenter /> : <Deck />;
}
