import "./style.css";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadPublicSans } from "@remotion/google-fonts/PublicSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Matrica pitch video: 30 s, 60 fps, 1920x1080. Palette and fonts match the deck (see tailwind.config.js).
const { fontFamily: DISPLAY } = loadArchivo("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
const { fontFamily: BODY } = loadPublicSans("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });

export const PITCH_FPS = 60;
export const PITCH_FRAMES = 1800;

// Scene windows in frames (60 fps): hook 6 s, solution 8 s, market 9 s, ask 7 s
const SCENES = {
  hook: { from: 0, dur: 360 },
  solution: { from: 360, dur: 480 },
  market: { from: 840, dur: 540 },
  ask: { from: 1380, dur: 420 },
} as const;

const EASE = Easing.bezier(0.2, 0.7, 0.2, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { ...CLAMP, easing: EASE });

/* Cross-fade wrapper: every scene fades in over 18 frames and out over 18 frames */
function SceneFade({ dur, children, fadeIn = true }: { dur: number; children: React.ReactNode; fadeIn?: boolean }) {
  const f = useCurrentFrame();
  const o = Math.min(fadeIn ? ease(f, 0, 18) : 1, 1 - ease(f, dur - 18, dur));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
}

/* A word that springs up into place, starting at frame `at` */
function SpringWord({ at, children, className, style }: { at: number; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 16, stiffness: 140, mass: 0.8 } });
  return (
    <div className={className} style={{ ...style, opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.96 + 0.04 * s})` }}>
      {children}
    </div>
  );
}

/* Faint cable-grid texture used behind text */
function Grid({ opacity = 0.25 }: { opacity?: number }) {
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: "linear-gradient(#2a343c 1px, transparent 1px), linear-gradient(90deg, #2a343c 1px, transparent 1px)",
        backgroundSize: "96px 96px",
      }}
    />
  );
}

/* Scene 1: the hook, three problems over three real photos */
function Hook() {
  const f = useCurrentFrame();
  const items = [
    { word: "WASTE.", line: "Cable offcuts and concrete poles have no second life.", img: "before-cable-scrap.jpg", color: "#ff7a1a" },
    { word: "DRONES.", line: "Transformers stand in the open.", img: "transformer-110-20kv.jpg", color: "#ef6b62" },
    { word: "STORMS.", line: "Trees fall on lines. Poles break.", img: "storm-before.jpg", color: "#6fa8d6" },
  ];
  const slot = 100; // frames per problem
  return (
    <SceneFade dur={SCENES.hook.dur} fadeIn={false}>
      <AbsoluteFill className="bg-ink">
        {items.map((it, i) => {
          const start = i * slot;
          const o = Math.min(ease(f, start, start + 14), i === items.length - 1 ? 1 : 1 - ease(f, start + slot, start + slot + 14));
          const zoom = interpolate(f, [start, start + slot + 40], [1.04, 1.14], CLAMP);
          return (
            <AbsoluteFill key={it.word} style={{ opacity: o }}>
              <Img src={staticFile(it.img)} className="h-full w-full object-cover" style={{ transform: `scale(${zoom})`, filter: "brightness(0.5) saturate(0.8)" }} />
            </AbsoluteFill>
          );
        })}
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,18,21,.92) 0%, rgba(14,18,21,.55) 55%, rgba(14,18,21,.2) 100%)" }} />
        <div className="absolute left-[140px] top-[150px]">
          <SpringWord at={6} className="text-signal" style={{ fontFamily: MONO, fontSize: 30, letterSpacing: "0.2em" }}>THE PROBLEM</SpringWord>
          <div className="mt-6 flex flex-col gap-2">
            {items.map((it, i) => (
              <SpringWord key={it.word} at={i * slot + 8} style={{ fontFamily: DISPLAY, fontSize: 168, lineHeight: 0.95, color: it.color, fontWeight: 800 }}>
                {it.word}
              </SpringWord>
            ))}
          </div>
        </div>
        {items.map((it, i) => {
          const start = i * slot + 20;
          const o = Math.min(ease(f, start, start + 14), i === items.length - 1 ? 1 : 1 - ease(f, start + slot - 20, start + slot - 6));
          return (
            <div key={it.line} className="absolute bottom-[130px] left-[140px] text-fg" style={{ fontFamily: BODY, fontSize: 46, opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
              {it.line}
            </div>
          );
        })}
        <div className="absolute bottom-[60px] left-[140px] text-muted" style={{ fontFamily: MONO, fontSize: 18 }}>
          Photos: GeorgHH CC BY-SA 4.0 · Kreuzschnabel CC BY-SA 3.0 · Arlington County CC BY-SA 2.0
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
}

/* Scene 2: the solution, value proposition over the shielded substation */
function Solution() {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, SCENES.solution.dur], [1.0, 1.08], CLAMP);
  const chips = ["Cable offcuts", "+", "Concrete poles", "→", "Grid shield"];
  const points = [
    ["Concrete posts", "Reused poles, 2 m around the transformer"],
    ["Cable net", "Cut to one size, tied at every crossing"],
    ["Crushed-concrete base", "Broken poles get a second life"],
  ];
  return (
    <SceneFade dur={SCENES.solution.dur}>
      <AbsoluteFill className="bg-ink">
        <Img src={staticFile("after-substation-real.jpg")} className="h-full w-full object-cover" style={{ transform: `scale(${zoom})`, transformOrigin: "40% 70%" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,18,21,.94) 0%, rgba(14,18,21,.55) 45%, rgba(14,18,21,.15) 70%, rgba(14,18,21,.85) 100%)" }} />
        <div className="absolute left-[140px] right-[140px] top-[110px]">
          <SpringWord at={10} className="text-signal" style={{ fontFamily: MONO, fontSize: 30, letterSpacing: "0.2em" }}>THE SOLUTION · MATRICA</SpringWord>
          <SpringWord at={22} className="mt-5 text-fg" style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 124, lineHeight: 1 }}>
            Grid waste becomes <span className="text-signal">grid shield</span>.
          </SpringWord>
          <div className="mt-10 flex items-center gap-5">
            {chips.map((c, i) => {
              const sym = c === "+" || c === "→";
              const last = i === chips.length - 1;
              return (
                <SpringWord key={c} at={60 + i * 10}>
                  <span
                    className={sym ? "text-signal" : last ? "rounded-full bg-signal px-7 py-3 text-ink" : "rounded-full border-2 border-signal px-7 py-3 text-fg"}
                    style={{ fontFamily: MONO, fontSize: sym ? 44 : 34, fontWeight: 600 }}
                  >
                    {c}
                  </span>
                </SpringWord>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-[90px] left-[140px] right-[140px] grid grid-cols-3 gap-8">
          {points.map(([h, t], i) => (
            <SpringWord key={h} at={170 + i * 24} className="border-t-4 border-signal bg-panel/90 px-8 py-6">
              <div className="text-fg" style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44 }}>{h}</div>
              <div className="mt-2 text-muted" style={{ fontFamily: BODY, fontSize: 28 }}>{t}</div>
            </SpringWord>
          ))}
        </div>
        <div className="absolute right-[24px] top-[24px] bg-black/60 px-3 py-1 text-fg" style={{ fontFamily: MONO, fontSize: 18 }}>
          AI visualisation (Qwen-Image-Edit) · photo Tiia Monto CC BY-SA 4.0
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
}

/* Count-up number driven by frames */
function CountUp({ at, to, dur = 70, prefix = "", suffix = "", decimals = 0 }: { at: number; to: number; dur?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [0, to], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return <>{prefix}{v.toFixed(decimals)}{suffix}</>;
}

/* Scene 3: the market, kinetic stats (all estimates from the research) */
function Market() {
  const f = useCurrentFrame();
  const stats = [
    { at: 40, big: <CountUp at={40} to={275} prefix="~" />, label: "110 kV transformers in Latvia", color: "#e9edef" },
    { at: 130, big: <><CountUp at={130} to={5.5} decimals={1} prefix="€" />M</>, label: "Latvian market for shield kits", color: "#ff7a1a" },
    { at: 220, big: <>3×</>, label: "the same market across the Baltics", color: "#6fa8d6" },
    { at: 310, big: <>€0</>, label: "material cost: it's the grid's own waste", color: "#6fcf97" },
  ];
  const sweep = ease(f, 0, 60);
  return (
    <SceneFade dur={SCENES.market.dur}>
      <AbsoluteFill className="bg-ink">
        <Grid opacity={0.35} />
        <div className="absolute left-0 top-0 h-[6px] bg-signal" style={{ width: `${sweep * 100}%` }} />
        <div className="absolute left-[140px] top-[110px]">
          <SpringWord at={6} className="text-signal" style={{ fontFamily: MONO, fontSize: 30, letterSpacing: "0.2em" }}>THE MARKET</SpringWord>
          <SpringWord at={16} className="mt-4 text-fg" style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 88 }}>Small objects. Big market.</SpringWord>
        </div>
        <div className="absolute bottom-[150px] left-[140px] right-[140px] grid grid-cols-2 gap-x-16 gap-y-12">
          {stats.map((s) => {
            const { fps } = { fps: PITCH_FPS };
            const pop = spring({ frame: f - s.at, fps, config: { damping: 12, stiffness: 120 } });
            return (
              <div key={s.label} style={{ opacity: Math.min(1, pop * 1.4), transform: `translateX(${(1 - pop) * -60}px)` }}>
                <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 150, lineHeight: 1, color: s.color, letterSpacing: "-0.03em" }}>{s.big}</div>
                <div className="mt-3 text-muted" style={{ fontFamily: BODY, fontSize: 34 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-[70px] left-[140px] rounded border-2 border-[#e3b341] px-3 py-1 text-[#e3b341]" style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.1em", opacity: ease(f, 330, 360) }}>
          ESTIMATES · TO CONFIRM WITH SADALES TĪKLS
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
}

/* Matrica mark: cable grid with an "M" drawn through it */
function Logo({ progress, size = 220 }: { progress: number; size?: number }) {
  const len = 160;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <g stroke="#3e4c56" strokeWidth={1.6} strokeLinecap="round" opacity={Math.min(1, progress * 2)}>
        <path d="M12 8V56M32 8V56M52 8V56M8 12H56M8 32H56M8 52H56" />
      </g>
      <path d="M12 52V12L32 32L52 12V52" fill="none" stroke="#ff7a1a" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - progress)} />
    </svg>
  );
}

/* Scene 4: the ask and outro */
function Ask() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = ease(f, 20, 80);
  const pop = spring({ frame: f - 20, fps, config: { damping: 14 } });
  return (
    <SceneFade dur={SCENES.ask.dur + 18}>
      <AbsoluteFill className="items-center justify-center bg-ink">
        <Grid opacity={interpolate(f, [0, 60], [0, 0.25], CLAMP)} />
        <div style={{ transform: `scale(${0.85 + 0.15 * pop})` }}><Logo progress={draw} /></div>
        <SpringWord at={70} className="mt-6 text-fg" style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 64, letterSpacing: "0.3em" }}>MATRICA</SpringWord>
        <SpringWord at={110} className="mt-14 text-center text-fg" style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 1.05 }}>
          Our ask: a pilot with <span className="text-signal">Sadales tīkls</span><br />on 2–5 transformers.
        </SpringWord>
        <SpringWord at={170} className="mt-12 rounded-full border-2 border-line px-8 py-3 text-muted" style={{ fontFamily: MONO, fontSize: 30 }}>
          karlis321.github.io/hackathon · Climathon 2026 · RTU
        </SpringWord>
      </AbsoluteFill>
    </SceneFade>
  );
}

export const PitchVideo = () => (
  <AbsoluteFill className="bg-ink">
    <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.dur + 18}><Hook /></Sequence>
    <Sequence from={SCENES.solution.from} durationInFrames={SCENES.solution.dur + 18}><Solution /></Sequence>
    <Sequence from={SCENES.market.from} durationInFrames={SCENES.market.dur + 18}><Market /></Sequence>
    <Sequence from={SCENES.ask.from} durationInFrames={SCENES.ask.dur}><Ask /></Sequence>
  </AbsoluteFill>
);
