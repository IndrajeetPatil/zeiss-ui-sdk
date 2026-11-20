---
name: agent-navigability-comparison
description: Compares how easily an AI agent can navigate the live zeiss.com and this repository's ui-sdk rebuild, by having two isolated subagents run identical tasks on each site, then updates docs/agent-navigability.md. Use when asked to (re)run, extend, or report on the agent-navigability comparison, or after changing pages or tasks that the comparison covers.
---

# Agent-navigability comparison

The comparison asks one question: for the **same tasks**, how much easier is it for a generic browsing agent to operate the ui-sdk rebuild than the live ZEISS website? The result lives in `docs/agent-navigability.md`.

## Ground rules

- **Isolate the evaluators.** Run each site's evaluation in its own fresh subagent, launched in parallel. Never give an evaluator implementation details: no mention of ui-sdk, component names, the source code, or what the other site does. They judge only what a visitor's agent can perceive.

- **Identical prompts.** Both evaluators get the same task list and the same instructions; only the URL and the output folder differ. Start from [references/evaluator-prompt.md](references/evaluator-prompt.md) and the task list in [references/tasks.md](references/tasks.md).

- **Apples to apples.** Tasks must be doable on both sites. When the rebuild doesn't implement a page the original needs, add it first (see [Extending the rebuild](#extending-the-rebuild)) rather than dropping or rewording the task for one site.

- **The evaluator never edits the rebuild.** Fixes found by the evaluation are separate, follow-up work.

## Steps

1. **Start the rebuild.** From the repository root, run `pnpm install` and then `pnpm dev --port 5199 --strictPort` in the background. Check that `http://localhost:5199/` responds.

2. **Prepare Playwright** in a scratch folder outside the repository, for example `/tmp/zeiss-check`:

   ```sh
   mkdir -p /tmp/zeiss-check && cd /tmp/zeiss-check && pnpm add playwright@latest
   ```

   Use `playwright@latest`. Older versions look for browser builds that may not be installed and fail with "Executable doesn't exist". Evaluators write their scripts in subfolders such as `/tmp/zeiss-check/eval-original/` and `/tmp/zeiss-check/eval-clone/`, where ESM `.mjs` files resolve `playwright` from the parent folder.

3. **Launch both evaluators in parallel** as background subagents, one per site, with the prompt from `references/evaluator-prompt.md`:
   - Original: `https://www.zeiss.com/corporate/en/home.html`
   - Rebuild: `http://localhost:5199/` (tell this one not to start, stop, read, or edit the app)

4. **Wait for both reports**, then update `docs/agent-navigability.md`. Follow [Writing the report](#writing-the-report).

5. **Refresh screenshots** in `docs/images/` if the pages changed: capture each at 1440×900 with Playwright, after dismissing the cookie banner on the rebuild.

## WebMCP polyfill

The rebuild registers `snapshot`, `act`, and `query` through `document.modelContext.registerTool`. Headless Chromium has no WebMCP, so evaluators install this init script before navigation:

```js
await page.addInitScript(() => {
  window.__tools = {};
  document.modelContext = {
    registerTool: async (tool) => {
      window.__tools[tool.name] = tool;
    },
  };
});
```

`registerTool` **must return a Promise**: ui-sdk calls `.catch()` on the result. A synchronous stub registers only the first tool. Evaluators call a tool with `page.evaluate(([n, a]) => window.__tools[n].execute(a), [name, input])`.

## Writing the report

`docs/agent-navigability.md` describes the current state; it's not a changelog. Rewrite sections in place, and don't add dated "re-run" sections or keep superseded numbers.

Keep this structure:

- the side-by-side screenshots and a **Verdict** table (score, tasks done, actions, workarounds, and WebMCP), followed by a short paragraph and the caveat about the rebuild's smaller surface;
- **Method**, listing the tasks exactly as given to the evaluators;
- a **task-by-task table** for both sites (✅ / 🟡 / ❌, actions, and the main obstacle);
- **What differs**: accessibility tree, control states, names, and custom widgets;
- **WebMCP tools** (rebuild only), with its own task table;
- **Improvements the rebuild could make**, and **Reproducing**.

Quote role and name pairs the evaluators reported, such as `button "Reject All"`. Recount totals from the tables rather than copying an evaluator's summary number. The evaluators' sums can be off.

## Extending the rebuild

When a task needs pages the rebuild lacks:

- Map the original first with a subagent: URLs, headings, real content (products, prices, and specs), every control, image URLs that load, and screenshots. Have it save the result as a spec.
- Build the pages with ui-sdk components, following the `ui-sdk` skill. Use the client-side router in `src/router.tsx` (`Link`, `navigate`, and `useLocation`) so each page has its own URL, as on the original.
- Keep names unique and match the visible text, since evaluators find controls by role and name.
- Load ZEISS images from zeiss.com at runtime; don't commit ZEISS assets.

## Gotchas

- **The cookie banner** opens on every fresh load of both sites. Every task run starts by dismissing it.
- **The hero carousel autoplays** on the rebuild, so a screenshot can catch it mid-slide. Pause it, or wait before capturing.
- **The live site changes.** News, events, and stories rotate, so record what the evaluator actually saw, not what the previous report said.
- **A local hook blocks `git commit` on `main`,** and it also trips on any shell command containing the word "commit", such as `gh api` fields like `squash_merge_commit_title`. Work on a branch, and put such API calls in a script file.
