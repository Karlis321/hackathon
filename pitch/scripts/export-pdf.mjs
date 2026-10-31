// Screenshots every slide at 1920x1080 (static mode) and saves PNGs; make-pdf.py then joins them into one PDF.
// Usage: npm run build && npx vite preview --port 4173 (in another terminal), then: node scripts/export-pdf.mjs [url]
import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:4173/";
const SLIDES = 10; // 9 presented + appendix
const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

mkdirSync("pdf-pages", { recursive: true });
const browser = await chromium.launch({ executablePath: exe ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (let i = 1; i <= SLIDES; i++) {
  await page.goto(`${base}?static&slide=${i}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `pdf-pages/slide-${String(i).padStart(2, "0")}.png` });
  console.log("slide", i);
}
await browser.close();
