import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { HIT_POINT, ProductCage } from "./productCage";

// 10 s, 60 fps: the Matrica cage (same drawing as the deck's product slide). A drone flies in, hits the side net
// about 2 m from the transformer and detonates; the net, posts and transformer hold, smoke drifts away.
export const CAGE_FPS = 60;
export const CAGE_FRAMES = 600;

const HIT = 240;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// the drawing (viewBox 1080x760) is fitted whole into 1920x1080 ("meet"): scale 1080/760, centred horizontally
const K = 1080 / 760;
const OX = (1920 - 1080 * K) / 2;
const toFrame = ([x, y]: [number, number]): [number, number] => [x * K + OX, y * K];

function Drone({ spin }: { spin: number }) {
  const arms: [number, number][] = [[-30, -14], [30, -14], [-30, 14], [30, 14]];
  return (
    <svg viewBox="-55 -35 110 70" width={120} height={76} style={{ overflow: "visible" }}>
      {arms.map(([x, y], i) => (
        <g key={i}>
          <line x1={0} y1={0} x2={x} y2={y} stroke="#111" strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={x} cy={y - 2} rx={17} ry={4} fill="rgba(40,40,40,.35)" transform={`rotate(${(spin + i * 37) % 10 - 5} ${x} ${y - 2})`} />
        </g>
      ))}
      <rect x={-12} y={-8} width={24} height={16} rx={5} fill="#1b1e21" />
      <circle cx={-9} cy={0} r={1.8} fill="#ff3b30" opacity={spin % 30 < 15 ? 1 : 0.2} />
    </svg>
  );
}

export const CageImpact = () => {
  const f = useCurrentFrame();
  const [tx, ty] = toFrame(HIT_POINT());

  // slow camera push-in towards the impact side, then a short shake on impact
  const push = interpolate(f, [0, CAGE_FRAMES], [1, 1.12], CLAMP);
  const k = f - HIT;
  const shake = k >= 0 && k < 24 ? (1 - k / 24) * 12 : 0;
  const sx = shake * (random(`sx${f}`) - 0.5), sy = shake * (random(`sy${f}`) - 0.5);

  // flight from the top right, curving down into the net
  const t = interpolate(f, [30, HIT], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const dx = interpolate(t, [0, 1], [2100, tx]);
  const dy = interpolate(t, [0, 1], [180, ty]) + Math.sin(f / 10) * 8 * (1 - t);
  const ds = interpolate(t, [0, 1], [0.7, 1]);

  // the net bulges where it is hit: a dark ring that spreads and fades
  const bulge = k >= 0 ? interpolate(k, [0, 30], [0, 1], CLAMP) : 0;
  const flash = k >= 0 ? Math.max(0, 1 - k / 16) : 0;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(#cfe0ea 0px, #eef3ef ${250 * K}px, #8fb36a ${250 * K}px)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${push})`, transformOrigin: `${tx}px ${ty}px` }}>
        <ProductCage width={1920} height={1080} callouts={false} showDrone={false} preserve="xMidYMid meet" />

        {/* drone in flight */}
        {f < HIT && (
          <div style={{ position: "absolute", left: dx, top: dy, transform: `translate(-50%, -50%) scale(${ds}) rotate(-12deg)`, filter: "drop-shadow(0 5px 4px rgba(0,0,0,.3))" }}>
            <Drone spin={f * 7} />
          </div>
        )}

        {/* wreck caught in the net after impact */}
        {k >= 0 && (
          <div style={{ position: "absolute", left: tx, top: ty + interpolate(k, [0, 40], [0, 26], CLAMP), transform: `translate(-50%, -50%) rotate(${interpolate(k, [0, 40], [-12, 28], CLAMP)}deg) scale(0.9)`, opacity: 0.85 }}>
            <Drone spin={0} />
          </div>
        )}

        {/* net bulge */}
        {k >= 0 && k < 30 && (
          <div style={{ position: "absolute", left: tx - 120 * bulge, top: ty - 90 * bulge, width: 240 * bulge, height: 180 * bulge, borderRadius: "50%", border: `${4 * (1 - bulge)}px solid rgba(20,20,20,${0.6 * (1 - bulge)})` }} />
        )}

        {/* smoke */}
        {k >= 0 && (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <defs><filter id="sb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter></defs>
            <g filter="url(#sb)">
              {Array.from({ length: 80 }).map((_, i) => {
                const start = Math.floor(random(`st${i}`) * 40);
                const life = k - start;
                if (life < 0) return null;
                const p = Math.min(1, life / (240 + random(`lf${i}`) * 120));
                const px = tx + (random(`px${i}`) - 0.5) * 80 + p * (60 + random(`dx${i}`) * 260) + Math.sin(life / 20 + i) * 10;
                const py = ty + (random(`py${i}`) - 0.5) * 40 - p * (220 + random(`dy${i}`) * 200);
                const r = 16 + p * (60 + random(`r${i}`) * 60);
                const o = interpolate(p, [0, 0.05, 1], [0, 0.5, 0], CLAMP) * (0.5 + random(`o${i}`) * 0.5);
                const g = 90 + Math.floor(random(`g${i}`) * 80);
                return <circle key={i} cx={px} cy={py} r={r} fill={`rgb(${g},${g},${g + 4})`} opacity={o} />;
              })}
            </g>
          </svg>
        )}

        {/* sparks */}
        {k >= 0 && k < 60 && Array.from({ length: 36 }).map((_, i) => {
          const a = (0.15 + random(`a${i}`) * 0.7) * Math.PI * (random(`sgn${i}`) > 0.5 ? 1 : -1) + Math.PI * 0.05;
          const v = 5 + random(`v${i}`) * 12;
          const px = tx + Math.cos(a) * v * k;
          const py = ty + Math.sin(a) * v * k * 0.6 + 0.09 * k * k;
          const o = Math.max(0, 1 - k / (26 + random(`so${i}`) * 34));
          return <div key={i} style={{ position: "absolute", left: px, top: py, width: 4, height: 4, borderRadius: "50%", background: "#ffd27a", opacity: o, boxShadow: "0 0 8px 2px rgba(255,170,60,.8)" }} />;
        })}

        {/* fireball */}
        {flash > 0 && (
          <div style={{ position: "absolute", left: tx - 230, top: ty - 230, width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,235,${flash}) 0%, rgba(255,214,120,${flash}) 14%, rgba(255,140,40,${flash * 0.85}) 30%, rgba(220,70,20,${flash * 0.45}) 48%, rgba(200,60,20,0) 66%)` }} />
        )}
      </AbsoluteFill>

      {/* captions: what happens, in plain words */}
      {[
        { from: 20, to: 230, text: "A drone approaches the substation" },
        { from: 250, to: 420, text: "It hits the woven AMKA net" },
        { from: 430, to: 600, text: "Net and masts hold. Substation untouched." },
      ].map((c) => {
        const o = Math.min(interpolate(f, [c.from, c.from + 15], [0, 1], CLAMP), interpolate(f, [c.to - 12, c.to], [1, 0], CLAMP));
        return <div key={c.text} style={{ position: "absolute", left: 80, top: 60, opacity: o, fontFamily: "Archivo, Arial, sans-serif", fontWeight: 800, fontSize: 54, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,.6)" }}>{c.text}</div>;
      })}
      <div style={{ position: "absolute", right: 18, bottom: 14, fontFamily: "Consolas, monospace", fontSize: 16, color: "rgba(0,0,0,.55)" }}>Matrica · visualisation</div>
    </AbsoluteFill>
  );
};
