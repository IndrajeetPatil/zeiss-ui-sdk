# Video agent prompt

Give each recorded agent this prompt, with `PORT` replaced by its recorder's port (7801 for the original, 7802 for the rebuild). Everything else stays identical.

---

You are a browsing agent completing a shopping task on a website. Your session is being video-recorded, and every action you take is logged and timed.

## The browser

A browser is already open on the site's start page. You control it ONLY by sending JSON to an HTTP endpoint with curl:

    curl -s localhost:PORT -d '{"action":"snapshot"}'

Use only this browser. Do not use WebFetch, web search, your own Playwright scripts, or any other way to view the site, and do not read files on disk other than screenshots this browser gives you.

Every response contains `ok`, `url`, `title`, `tabs` (open tabs; one is `active`), and `events` (for example, a new tab that opened). Failed actions return `ok: false` and an `error`.

Actions:

- `{"action":"snapshot"}` returns the accessibility tree of the active tab, with element refs like `[ref=f1e12]`. This is your main way to see the page.
- `{"action":"screenshot"}` saves a PNG and returns its path; view it with your Read tool. Use only when the snapshot is not enough.
- `{"action":"click","ref":"f1e12","why":"..."}` clicks an element. Instead of `ref`, you may target with `"role":"button","name":"Accept"` (optional `"exact":true`, `"nth":1`) or `"text":"..."`. These targeting options apply to all element actions.
- `{"action":"hover", ...target, "why":"..."}`
- `{"action":"fill", ...target, "value":"2", "why":"..."}` fills a text or number field.
- `{"action":"select", ...target, "value":"Option label", "why":"..."}` for native select elements.
- `{"action":"check", ...target, "checked":true, "why":"..."}` for checkboxes, radios, and switches.
- `{"action":"press","key":"Escape", optional target, "why":"..."}`
- `{"action":"type","value":"text","why":"..."}` types into the focused element.
- `{"action":"scroll","dy":600,"why":"..."}`
- `{"action":"goto","url":"...","why":"..."}`, `{"action":"back","why":"..."}`
- `{"action":"tab","index":1,"why":"..."}` switches to another open tab.
- `{"action":"wait","ms":1000,"why":"..."}`
- `{"action":"done","result":"...","why":"..."}` ends the session. Call it exactly once, at the very end. After it, the browser is gone.

Rules for the log:

- Give every action except snapshot and screenshot a `why`: a short caption (at most 60 characters) in plain words a viewer can follow, for example "Open the Products menu" or "Set quantity to 2".
- Add `"workaround": true` when the action is not the obvious next step toward the goal. Examples: retrying something that failed, guessing between controls you can't tell apart, a detour because a control didn't behave as expected, typing a URL instead of navigating, or handling an unexpected tab, overlay, or banner. Dismissing the cookie banner on first arrival at the site is expected; don't flag that one.
- Act as a careful real agent would. Don't pad or skip actions to look good.

## The task

Starting from the ZEISS Group homepage, find ZEISS's trail cameras for nature observation and go to the official ZEISS online shop that sells them. In the shop, filter the trail cameras to those with a **100° wide-angle field of view**, and pick the **cheapest** one. Open its product page, set the quantity to **2**, and add it to the cart. Open the full shopping cart page, then report the product name, product number, quantity, unit price, shipping cost, and grand total. Do not click "Go to checkout" and do not enter any personal or payment data.

When you are on the full cart page and have read the values, call `done` with a one-line result such as "ZEISS X, SC-…, qty 2, €… each, shipping €…, total €…".

## Your final reply

Reply with:

1. The six reported values.
2. A numbered list of the steps of your journey (homepage → … → cart), each with the number of actions it took and any obstacle.
3. Every obstacle or workaround, naming the control by role and name where you can.
4. A navigability score out of 10 for an agent, with one sentence of reasoning.
