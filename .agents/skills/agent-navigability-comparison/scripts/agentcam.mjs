// Agent camera: a recorded browser that an agent drives over HTTP.
// Usage: node agentcam.mjs <startUrl> <outDir> <port>
import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const [, , startUrl, outDir, port = "7801"] = process.argv;
fs.mkdirSync(path.join(outDir, "video"), { recursive: true });
const T0 = Date.now();
const now = () => Date.now() - T0;
const logFile = path.join(outDir, "log.jsonl");
fs.writeFileSync(logFile, "");
const log = (entry) => fs.appendFileSync(logFile, JSON.stringify({ t: now(), ...entry }) + "\n");

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: path.join(outDir, "video"), size: { width: 1280, height: 800 } },
  locale: "en-US",
});

const tabs = [];
let active = 0;
let pendingEvents = [];
context.on("page", (page) => {
  const id = tabs.length;
  tabs.push({ id, page, createdAt: now(), closed: false });
  page.on("close", () => (tabs[id].closed = true));
  if (id > 0) {
    pendingEvents.push(`New tab ${id} opened`);
    log({ kind: "event", event: "tab-opened", tab: id, url: page.url() });
  }
});
const first = await context.newPage();
await first.goto(startUrl, { waitUntil: "domcontentloaded" });
await first.waitForTimeout(1500);
log({ kind: "event", event: "start", tab: 0, url: first.url() });

const page = () => tabs[active].page;
const state = async () => ({
  activeTab: active,
  url: page().url(),
  title: await page().title().catch(() => ""),
  tabs: tabs
    .filter((t) => !t.closed)
    .map((t) => ({ index: t.id, url: t.page.url(), active: t.id === active })),
  events: pendingEvents.splice(0),
});

function target(cmd) {
  const p = page();
  if (cmd.ref) return p.locator(`aria-ref=${cmd.ref}`);
  if (cmd.role) return p.getByRole(cmd.role, { name: cmd.name, exact: cmd.exact ?? false }).nth(cmd.nth ?? 0);
  if (cmd.text) return p.getByText(cmd.text, { exact: cmd.exact ?? false }).nth(cmd.nth ?? 0);
  throw new Error("Give ref, role+name, or text");
}

async function highlight(loc) {
  await loc.scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => {});
  const box = await loc.boundingBox({ timeout: 4000 }).catch(() => null);
  if (!box) return;
  await page().evaluate((b) => {
    const d = document.createElement("div");
    d.id = "__agentcam";
    Object.assign(d.style, {
      position: "fixed", left: `${b.x - 5}px`, top: `${b.y - 5}px`,
      width: `${b.width + 10}px`, height: `${b.height + 10}px`,
      border: "4px solid #ff2d55", borderRadius: "6px",
      boxShadow: "0 0 0 6px rgba(255,45,85,.25)", zIndex: 2147483647, pointerEvents: "none",
    });
    document.documentElement.appendChild(d);
  }, box);
  await page().waitForTimeout(700);
}
const unhighlight = () =>
  Promise.all(tabs.filter((t) => !t.closed).map((t) =>
    t.page.evaluate(() => document.getElementById("__agentcam")?.remove()).catch(() => {})));

async function settle() {
  await page().waitForLoadState("domcontentloaded", { timeout: 8000 }).catch(() => {});
  await page().waitForTimeout(900);
}

const actions = {
  async snapshot() {
    const text = await page().ariaSnapshot({ mode: "ai" });
    return { read: text.length, text };
  },
  async screenshot() {
    const file = path.join(outDir, `view-${now()}.png`);
    await page().screenshot({ path: file });
    return { read: 1500 * 4, file };
  },
  async click(cmd) {
    const loc = target(cmd);
    await highlight(loc);
    await loc.click({ timeout: 8000, button: cmd.button ?? "left" });
    await settle();
  },
  async hover(cmd) {
    const loc = target(cmd);
    await highlight(loc);
    await loc.hover({ timeout: 8000 });
    await settle();
  },
  async fill(cmd) {
    const loc = target(cmd);
    await highlight(loc);
    await loc.fill(String(cmd.value), { timeout: 8000 });
    await settle();
  },
  async select(cmd) {
    const loc = target(cmd);
    await highlight(loc);
    await loc.selectOption(cmd.value, { timeout: 8000 });
    await settle();
  },
  async check(cmd) {
    const loc = target(cmd);
    await highlight(loc);
    await loc.setChecked(cmd.checked ?? true, { timeout: 8000 });
    await settle();
  },
  async press(cmd) {
    if (cmd.ref || cmd.role || cmd.text) {
      const loc = target(cmd);
      await highlight(loc);
      await loc.press(cmd.key, { timeout: 8000 });
    } else await page().keyboard.press(cmd.key);
    await settle();
  },
  async type(cmd) {
    await page().keyboard.type(String(cmd.value), { delay: 40 });
    await settle();
  },
  async scroll(cmd) {
    await page().mouse.wheel(0, cmd.dy ?? 600);
    await settle();
  },
  async goto(cmd) {
    await page().goto(cmd.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle();
  },
  async back() {
    await page().goBack({ waitUntil: "domcontentloaded" });
    await settle();
  },
  async tab(cmd) {
    const t = tabs[cmd.index];
    if (!t || t.closed) throw new Error(`No open tab ${cmd.index}`);
    active = t.id;
    await t.page.bringToFront();
    await t.page.waitForLoadState("domcontentloaded").catch(() => {});
    await t.page.waitForTimeout(600);
  },
  async wait(cmd) {
    await page().waitForTimeout(Math.min(cmd.ms ?? 1000, 10000));
  },
};

let finished = false;
async function finish(result) {
  finished = true;
  await unhighlight();
  await page().waitForTimeout(1500);
  const meta = { startUrl, result, end: now(), tabs: [] };
  const videos = tabs.map((t) => ({ id: t.id, createdAt: t.createdAt, video: t.page.video() }));
  await context.close();
  for (const v of videos) meta.tabs.push({ id: v.id, createdAt: v.createdAt, video: await v.video.path() });
  await browser.close();
  fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(meta, null, 2));
}

const server = http.createServer(async (req, res) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  let cmd;
  try { cmd = JSON.parse(body || "{}"); } catch { res.end(JSON.stringify({ ok: false, error: "Body must be JSON" })); return; }
  const send = (obj) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(obj, null, 1)); };
  if (finished) return send({ ok: false, error: "Session already finished" });
  if (cmd.action === "done") {
    log({ kind: "done", tab: active, url: page().url(), result: cmd.result ?? "", why: cmd.why ?? "" });
    await finish(cmd.result);
    send({ ok: true });
    server.close();
    return;
  }
  const fn = actions[cmd.action];
  if (!fn) return send({ ok: false, error: `Unknown action ${cmd.action}` });
  const tab = active;
  const tStart = now();
  try {
    const out = (await fn(cmd)) ?? {};
    const tEnd = now();
    await unhighlight();
    const s = await state();
    log({ kind: out.read !== undefined ? "read" : "act", action: cmd.action, tab, tStart, tEnd, ok: true,
      why: cmd.why ?? "", workaround: !!cmd.workaround, read: out.read, url: s.url, activeAfter: s.activeTab,
      events: s.events, target: cmd.ref ? undefined : (cmd.name ?? cmd.text ?? cmd.key ?? cmd.url) });
    send({ ok: true, ...s, ...(out.text ? { snapshot: out.text } : {}), ...(out.file ? { file: out.file } : {}) });
  } catch (error) {
    await unhighlight();
    const s = await state();
    const message = String(error.message).split("\n")[0];
    log({ kind: "act", action: cmd.action, tab, tStart, tEnd: now(), ok: false, why: cmd.why ?? "",
      workaround: !!cmd.workaround, error: message, url: s.url, activeAfter: s.activeTab, events: s.events });
    send({ ok: false, error: message, ...s });
  }
});
server.listen(Number(port), () => console.log(`agentcam ready on ${port}`));
