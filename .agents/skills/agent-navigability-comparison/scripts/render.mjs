// Builds the side-by-side clip from two agentcam runs.
// Usage: node render.mjs <runA> <runB> <outDir>
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [runA, runB, outDir] = process.argv.slice(2).map((p) => path.resolve(p));
const work = path.join(outDir, "work");
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

const SIDES = [
  { key: "original", dir: runA, label: "zeiss.com", sub: "Live website", accent: "#c9d1db" },
  { key: "rebuild", dir: runB, label: "ui-sdk rebuild", sub: "Same pages, built with ui-sdk", accent: "#3d9bff" },
];
const STEPS = ["Home", "Nature", "Products", "Trail cams", "Shop", "Product", "Cart"];
const FPS = 30;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const ffmpeg = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);
const duration = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());

function stepOf(url) {
  const u = new URL(url);
  const p = u.pathname.toLowerCase();
  if (u.hostname.startsWith("shop.") || p.startsWith("/shop") || p.startsWith("/checkout")) {
    if (p.includes("checkout/cart")) return 6;
    if (p.includes("secacam")) return 5;
    return 4;
  }
  if (p.includes("trail-camera")) return 3;
  if (p.includes("nature") && p.includes("products")) return 2;
  if (p.includes("nature")) return 1;
  return 0;
}
const mmss = (ms) => `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;

function beatsFor(side) {
  const entries = fs.readFileSync(path.join(side.dir, "log.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  const meta = JSON.parse(fs.readFileSync(path.join(side.dir, "meta.json"), "utf8"));
  const videos = Object.fromEntries(meta.tabs.map((t) => [t.id, { ...t, length: duration(t.video) }]));
  const m = { actions: 0, failed: 0, workarounds: 0, tabs: 1, domains: new Set(), tokens: 0, step: 0 };
  const beats = [];
  let reads = null;
  const snap = (changed) => ({ ...m, domains: m.domains.size, changed });
  const clip = (tab, from, seconds) => {
    const v = videos[tab];
    const start = Math.max(0, Math.min((from - v.createdAt) / 1000, v.length - 0.2));
    return { video: v.video, start, seconds };
  };
  const flushReads = () => {
    if (!reads) return;
    beats.push({ ...clip(reads.tab, reads.t, 0.6), kind: "read",
      caption: `Reading the page${reads.n > 1 ? ` ×${reads.n}` : ""}`,
      detail: `+${Math.round(reads.tokens / 1000)}k tokens of page text`, metrics: snap(["tokens"]), time: reads.t });
    reads = null;
  };
  for (const e of entries) {
    if (e.url) m.domains.add(new URL(e.url).hostname);
    if (e.kind === "event") {
      if (e.event === "tab-opened") m.tabs += 1;
      continue;
    }
    if (e.kind === "read") {
      m.tokens += Math.round((e.read ?? 0) / 4);
      reads ??= { tab: e.tab, t: e.tStart, n: 0, tokens: 0 };
      reads.n += 1;
      reads.tokens += Math.round((e.read ?? 0) / 4);
      continue;
    }
    flushReads();
    if (e.kind === "done") {
      m.step = Math.max(m.step, stepOf(e.url));
      beats.push({ ...clip(e.tab, e.t, 3), kind: "done", caption: "Task complete", detail: e.result, metrics: snap([]), time: e.t });
      continue;
    }
    const changed = ["actions"];
    m.actions += 1;
    if (!e.ok) { m.failed += 1; changed.push("failed"); }
    if (e.workaround) { m.workarounds += 1; changed.push("workarounds"); }
    if (e.events?.length) changed.push("tabs");
    if (e.url) m.step = Math.max(m.step, stepOf(e.url));
    const tab = e.action === "tab" ? e.activeAfter : e.tab;
    const from = e.action === "tab" ? e.tEnd - 300 : e.tStart - 200;
    const seconds = Math.min(3, Math.max(1.4, (e.tEnd - from) / 1000 + 0.4));
    beats.push({ ...clip(tab, from, seconds), kind: "act", caption: e.why || e.action,
      detail: e.ok ? (e.events?.length ? e.events.join(" · ") : "") : `Failed: ${/Timeout .*exceeded/.test(e.error) ? "the click didn't go through (control covered or not clickable)" : e.error}`,
      ok: e.ok, workaround: e.workaround, metrics: snap(changed), time: e.tEnd, n: m.actions });
  }
  flushReads();
  return { beats, meta, final: snap([]) };
}

const css = `
*{box-sizing:border-box;margin:0}
body{width:960px;height:1080px;background:#0e131a;color:#e8edf3;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;overflow:hidden}
.head{position:absolute;left:20px;right:20px;top:22px;height:80px;display:flex;align-items:flex-end;justify-content:space-between}
.head h2{font-size:40px;font-weight:700;letter-spacing:-.5px}
.head p{font-size:18px;color:#8a96a6;margin-top:4px}
.clock{text-align:right;font-size:15px;color:#8a96a6}.clock b{display:block;font-size:30px;color:#e8edf3;font-variant-numeric:tabular-nums}
.frame{position:absolute;left:16px;top:114px;width:928px;height:583px;border:4px solid var(--accent);border-radius:6px}
.steps{position:absolute;left:20px;right:20px;top:716px;display:flex;gap:6px}
.steps div{flex:1;text-align:center;font-size:14px;color:#5d6876;padding-top:14px;position:relative}
.steps div:before{content:"";position:absolute;top:0;left:0;right:0;height:6px;border-radius:3px;background:#263040}
.steps .on{color:#cfd8e3}.steps .on:before{background:var(--accent)}
.steps .cur{color:#fff;font-weight:700}
.cap{position:absolute;left:20px;right:20px;top:770px;height:92px;background:#18202b;border-radius:8px;padding:14px 18px;border-left:6px solid var(--accent)}
.cap.fail{border-left-color:#ff4d5e;background:#2a171b}.cap.work{border-left-color:#ffb020}.cap.read{border-left-color:#5d6876}.cap.done{border-left-color:#2fd27a;background:#13261d}
.cap .t{font-size:27px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cap .d{font-size:17px;color:#9aa6b5;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tag{display:inline-block;font-size:14px;font-weight:700;padding:3px 8px;border-radius:4px;margin-right:10px;vertical-align:5px;background:#263040;color:#cfd8e3}
.tag.w{background:#ffb020;color:#1a1200}.tag.f{background:#ff4d5e;color:#fff}.tag.ok{background:#2fd27a;color:#05200f}
.tiles{position:absolute;left:20px;right:20px;top:878px;display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.tile{background:#18202b;border-radius:8px;padding:14px 12px;height:180px;border:2px solid transparent}
.tile.hit{border-color:var(--accent);background:#1d2836}
.tile.bad.hit{border-color:#ffb020}
.tile b{display:block;font-size:56px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.1}
.tile span{font-size:15px;color:#9aa6b5;line-height:1.3;display:block;margin-top:6px}
`;

function panel(side, beat) {
  const m = beat.metrics;
  const tile = (key, value, label, bad) =>
    `<div class="tile ${bad ? "bad" : ""} ${m.changed.includes(key) ? "hit" : ""}"><b>${value}</b><span>${label}</span></div>`;
  const cls = beat.kind === "done" ? "done" : beat.kind === "read" ? "read" : !beat.ok ? "fail" : beat.workaround ? "work" : "";
  const tag = beat.kind === "done" ? `<span class="tag ok">✓ DONE</span>`
    : beat.kind === "read" ? `<span class="tag">READ</span>`
    : !beat.ok ? `<span class="tag f">✗ FAILED</span>`
    : beat.workaround ? `<span class="tag w">WORKAROUND</span>`
    : `<span class="tag">#${beat.n}</span>`;
  return `<html><head><style>${css}</style></head><body style="--accent:${side.accent}">
  <div class="head"><div><h2>${esc(side.label)}</h2><p>${esc(side.sub)}</p></div>
  </div>
  <div class="frame"></div>
  <div class="steps">${STEPS.map((s, i) => `<div class="${i <= m.step ? "on" : ""} ${i === m.step ? "cur" : ""}">${s}</div>`).join("")}</div>
  <div class="cap ${cls}"><div class="t">${tag}${esc(beat.caption)}</div><div class="d">${esc(beat.detail) || "&nbsp;"}</div></div>
  <div class="tiles">
   ${tile("actions", m.actions, "Actions<br>clicks, typing, waits")}
   ${tile("workarounds", m.workarounds, "Workarounds<br>detours &amp; guesses", true)}
   ${tile("failed", m.failed, "Failed actions<br>then retried", true)}
   ${tile("tabs", `${m.tabs}<small style="font-size:30px;color:#9aa6b5"> / ${m.domains}</small>`, "Tabs / sites<br>to keep track of")}
   ${tile("tokens", `${Math.round(m.tokens / 1000)}k`, "Page text read<br>tokens")}
  </div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
const sideFiles = [];
const results = [];
for (const side of SIDES) {
  const { beats, meta, final } = beatsFor(side);
  results.push({ side, meta, final, beats: beats.length });
  const list = [];
  for (const [i, beat] of beats.entries()) {
    const png = path.join(work, `${side.key}-${i}.png`);
    await page.setContent(panel(side, beat));
    await page.screenshot({ path: png });
    const mp4 = path.join(work, `${side.key}-${i}.mp4`);
    const d = beat.seconds.toFixed(2);
    ffmpeg(["-loop", "1", "-framerate", String(FPS), "-t", d, "-i", png,
      "-ss", beat.start.toFixed(2), "-t", d, "-i", beat.video,
      "-filter_complex", `[1:v]fps=${FPS},scale=920:575,tpad=stop_mode=clone:stop_duration=${d}[v];[0:v][v]overlay=20:118:shortest=1,format=yuv420p[o]`,
      "-map", "[o]", "-t", d, "-r", String(FPS), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", mp4]);
    list.push(`file '${mp4}'`);
  }
  const listFile = path.join(work, `${side.key}.txt`);
  fs.writeFileSync(listFile, list.join("\n"));
  const out = path.join(work, `${side.key}.mp4`);
  ffmpeg(["-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", out]);
  sideFiles.push(out);
}

// Title and end cards.
const card = async (html, name, seconds) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.setContent(`<html><head><style>*{box-sizing:border-box;margin:0}body{width:1920px;height:1080px;background:#0e131a;color:#e8edf3;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;padding:110px 140px}
  h1{font-size:68px;letter-spacing:-1px;line-height:1.1}h1 em{font-style:normal;color:#3d9bff}.k{font-size:24px;color:#8a96a6;text-transform:uppercase;letter-spacing:3px;margin-bottom:24px}
  p{font-size:30px;color:#b9c3cf;line-height:1.45;margin-top:28px;max-width:1500px}ul{margin-top:36px;font-size:26px;color:#b9c3cf;line-height:1.7;padding-left:30px}
  table{margin-top:44px;border-collapse:collapse;font-size:34px;width:1640px}td,th{padding:16px 22px;border-bottom:1px solid #263040;text-align:left}th{color:#8a96a6;font-size:24px;font-weight:600;text-transform:uppercase;letter-spacing:2px}
  td.n{font-variant-numeric:tabular-nums;font-weight:700;text-align:right}th.n{text-align:right}.b{color:#3d9bff}.foot{position:absolute;bottom:70px;left:140px;right:140px;font-size:22px;color:#6c7888;line-height:1.5}</style></head><body>${html}</body></html>`);
  const png = path.join(work, `${name}.png`);
  await page.screenshot({ path: png });
  const mp4 = path.join(work, `${name}.mp4`);
  ffmpeg(["-loop", "1", "-framerate", String(FPS), "-t", String(seconds), "-i", png, "-vf", "format=yuv420p", "-r", String(FPS), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", mp4]);
  return { png, mp4 };
};

const [a, b] = results;
const title = await card(`<div class="k">Agent navigability · ZEISS buyer journey</div>
  <h1>Same task, two websites:<br>an AI agent buys a ZEISS trail camera on <em>zeiss.com</em> and on a <em>ui-sdk</em> rebuild</h1>
  <p>Two separate agents got the same instruction: from the ZEISS homepage, find trail cameras, go to the online shop, filter to 100° wide-angle, add 2 of the cheapest to the cart, and read the cart totals.</p>
  <ul><li><b>Red box</b>: the element the agent is about to use</li><li><b>Actions, workarounds, failed actions</b>: how much effort each step took</li><li><b>Tabs / sites</b> and <b>page text read</b>: how much the agent had to keep track of and read</li><li>Thinking pauses are cut; each action plays at real speed</li></ul>`, "title", 9);

const row = (label, ka, kb, fmt = (x) => x) =>
  `<tr><td>${label}</td><td class="n">${fmt(ka)}</td><td class="n b">${fmt(kb)}</td></tr>`;
const end = await card(`<div class="k">Result</div><h1>${[a, b].every((r) => String(r.meta.result).includes("299.98")) ? "Both agents reached the correct cart. Here's what it took." : "Here's what each agent achieved, and what it took."}</h1>
  <table><tr><th></th><th class="n">zeiss.com</th><th class="n">ui-sdk rebuild</th></tr>
  ${row("Actions", a.final.actions, b.final.actions)}
  ${row("Workarounds", a.final.workarounds, b.final.workarounds)}
  ${row("Failed actions", a.final.failed, b.final.failed)}
  ${row("Tabs / sites", `${a.final.tabs} / ${a.final.domains}`, `${b.final.tabs} / ${b.final.domains}`)}
  ${row("Page text read", `${Math.round(a.final.tokens / 1000)}k tokens`, `${Math.round(b.final.tokens / 1000)}k tokens`)}
  </table>
  <div class="foot">zeiss.com: ${esc(a.meta.result)}<br>Rebuild: ${esc(b.meta.result)}<br>The rebuild has less content than the live site and stays on one domain, so part of the gap comes from that rather than from ui-sdk.</div>`, "end", 10);

await browser.close();

// Side by side: hold the shorter side's last frame.
const [da, db] = sideFiles.map(duration);
const longest = Math.max(da, db);
const stacked = path.join(work, "stacked.mp4");
ffmpeg(["-i", sideFiles[0], "-i", sideFiles[1], "-filter_complex",
  `[0:v]tpad=stop_mode=clone:stop_duration=${(longest - da + 0.1).toFixed(2)}[l];[1:v]tpad=stop_mode=clone:stop_duration=${(longest - db + 0.1).toFixed(2)}[r];[l][r]hstack=inputs=2,format=yuv420p[o]`,
  "-map", "[o]", "-t", longest.toFixed(2), "-r", String(FPS), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", stacked]);

const listFile = path.join(work, "all.txt");
fs.writeFileSync(listFile, [title.mp4, stacked, end.mp4].map((f) => `file '${f}'`).join("\n"));
const final = path.join(outDir, "agent-journey-side-by-side.mp4");
ffmpeg(["-f", "concat", "-safe", "0", "-i", listFile, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-movflags", "+faststart", "-pix_fmt", "yuv420p", final]);
fs.copyFileSync(end.png, path.join(outDir, "agent-journey-result.png"));
// A mid-journey still for the report.
ffmpeg(["-ss", (9 + longest * 0.55).toFixed(2), "-i", final, "-frames:v", "1", path.join(outDir, "agent-journey-still.png")]);
console.log(JSON.stringify({ final, seconds: duration(final), sides: [da, db], results: results.map((r) => ({ side: r.side.key, beats: r.beats, ...r.final })) }, null, 1));
