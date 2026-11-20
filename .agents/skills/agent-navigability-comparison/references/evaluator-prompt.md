# Evaluator prompt

Send this to each evaluator subagent, filling in `{SITE_URL}`, `{OUT_DIR}`, and `{SITE_NOTE}`. Paste the tasks from [tasks.md](tasks.md) where marked. Keep everything else identical for both sites.

- Original: `{SITE_URL}` = `https://www.zeiss.com/corporate/en/home.html`, `{OUT_DIR}` = `/tmp/zeiss-check/eval-original/`, and `{SITE_NOTE}` = "the real ZEISS Group homepage".
- Rebuild: `{SITE_URL}` = `http://localhost:5199/`, `{OUT_DIR}` = `/tmp/zeiss-check/eval-clone/`, and `{SITE_NOTE}` = "a ZEISS Group homepage running on a local dev server; it's already running, so don't start or stop it, and don't read or edit its source code: evaluate it only as a visitor would".

---

You are evaluating how easy a website is for an AI agent to navigate and operate. Your site: {SITE_URL} ({SITE_NOTE}).

Drive it with Playwright from Node. Playwright is installed in /tmp/zeiss-check/node_modules. Write your scripts in a new folder {OUT_DIR} (ESM `.mjs` files there resolve `playwright` from the parent folder) and run them with `node`. Use Chromium at a 1440x900 viewport. Don't modify anything outside that folder.

Act like a generic browsing agent: rely on what an agent can actually perceive, meaning the accessibility tree (`locator.ariaSnapshot()`), roles and accessible names (`getByRole`, `getByLabel`), visible text, and the DOM. Before loading the page, install an init script that polyfills `document.modelContext = { registerTool: async (tool) => { window.__tools[tool.name] = tool } }` (with `window.__tools = {}`), so you can see whether the site exposes WebMCP tools. If any tools get registered, ALSO try doing the tasks through them (call `window.__tools[name].execute(input)` via `page.evaluate`, reading each tool's `description` and `inputSchema` to learn how) and report how that compares to driving the UI. Do the UI pass and the tool pass in separate fresh page loads.

Attempt each task and stay on the starting site where possible. Following links to other pages is allowed when needed, but note it.

{TASKS}

For each task, record: success (yes/partial/no), the number of agent actions it took (clicks, fills, key presses, and tool calls), what made it easy or hard (unnamed or duplicate controls, missing roles or states, hidden or lazy content, overlays, timing or animation, iframes, custom widgets with no ARIA, and so on), and any workaround you needed. Also note the size and quality of the accessibility snapshot of each page you visit (roughly how many nodes or characters, and how much of it is noise vs. meaningful controls), and whether control states (expanded/selected/pressed/checked/current page) are exposed.

Finish with a concise report: a table of tasks × (success, actions, main obstacle), separately for the UI pass and the tool pass if tools exist; a short list of the top 5 agent-navigability strengths and weaknesses with concrete examples (quote role/name pairs); whether WebMCP tools exist; and an overall agent-navigability score out of 10. Keep the report factual; don't speculate about other sites.
