# ZEISS homepage on ui-sdk

**Can an AI agent shop more easily on a website built with agent-friendly components?** This repository tests that question on a real site.

It holds a minimal rebuild of the [ZEISS Group homepage](https://www.zeiss.com/corporate/en/home.html) and one buyer journey, made with [ui-sdk](https://github.com/vercel-labs/ui) (`@ui-sdk/react`) and styled with ZEISS brand tokens. ui-sdk is a UI component library. Its components expose their roles, names, and states to the browser's accessibility tree, and it lets a page register tools for agents through WebMCP. The rebuild shows what the site could look like on ui-sdk. Fresh AI agents then did the same tasks on the live zeiss.com and on the rebuild, so the two can be compared.

The buyer journey follows the live site from the homepage to a cart: Nature Observation, its products, the trail-camera comparison, and the ZEISS Hunting & Nature shop's listing, product page, cart drawer, and cart page.

> [!NOTE]
> **About ZEISS content.** This is an independent, non-commercial research project. It is not affiliated with, endorsed by, or sponsored by Carl Zeiss AG or its licensees.
>
> - It recreates only a small fraction of the publicly available ZEISS website: the homepage and one buyer journey. The aim is to benchmark how easily AI agents can navigate a website, not to copy or replace the site.
>
> - ZEISS, the ZEISS logo, product names, texts, and images belong to Carl Zeiss AG and their respective owners. The rebuild loads images from zeiss.com at runtime and does not redistribute them. The screenshots and video in `docs/` show the sites only to document the comparison.
>
> - We believe this limited use for research, benchmarking, and commentary constitutes fair use. If you represent ZEISS and would like anything changed or removed, please open an issue, and we will act on it promptly.

## Agent navigability comparison

[![Two agents doing the buyer journey side by side, with live counters for actions, workarounds, failed actions, tabs, and page text read](docs/video/agent-journey-still.png)](docs/video/agent-journey-side-by-side.mp4)

[Watch the side-by-side video](docs/video/agent-journey-side-by-side.mp4) (~2 minutes, 1920×1080).

In the video, two agents do the trail-camera buyer journey at the same time: zeiss.com on the left and the ui-sdk rebuild on the right. Each agent sees only its own site and knows nothing about how either was built. These are the counts from that recorded run:

| Metric | zeiss.com | Rebuild |
| --- | --- | --- |
| Correct cart (€299.98) | ✅ | ✅ |
| Actions (clicks, typing, keys, and waits) | 36 | 14 |
| Workarounds (flagged by the agent) | 14 | 1 |
| Failed actions | 7 | 0 |
| Tabs / sites | 3 / 2 | 1 / 1 |
| Page text read | ~154k tokens | ~35k tokens |

How to read the table:

- **Workarounds** are actions the agent itself marked as not the obvious next step, such as retrying a failed click or typing a URL instead of following a link.
- **Page text read** estimates how much of the pages the agent had to take in, as accessibility-snapshot characters ÷ 4.
- Both agents reached the right cart. The difference is in how much effort it took.

> [!IMPORTANT]
> **Not all of this gap is due to ui-sdk.** The rebuild is a small mock: it has less content than zeiss.com, keeps the whole journey in one tab on one site, and has no real shop backend. The live site opens new tabs and moves to a shop on another domain, run by a ZEISS licensee, with its own cookie banner. So, row by row:
>
> - **Page text read** and **tabs / sites** reflect the rebuild being smaller and on one site, not ui-sdk.
> - **Actions** and **workarounds** are partly the same effect: the agents' instructions count handling an unexpected tab or banner as a workaround, and zeiss.com has both.
> - **Failed actions** and the remaining workarounds come closest to what ui-sdk changes. On zeiss.com, these came from buttons that share a name, a menu link that behaves differently depending on when it's clicked, and a panel that ignores Escape.
>
> These numbers also come from a single recorded run per site, and the rebuild was built knowing which tasks would be tested.

Both agents were given the exact same instructions and task. You can view the [prompt used for the video](.agents/skills/agent-navigability-comparison/references/video-agent-prompt.md).

The [agent navigability report](docs/agent-navigability.md) has the full comparison. It also covers a separate, written evaluation of the same journey and of eight homepage tasks. Its counts differ from the video's because it was a separate run with different agents (the report explains why).

The report separates what holds up from what doesn't. The genuine gains come from ui-sdk's components themselves: unique, descriptive names, visible state (expanded, pressed, checked, result counts), and controls that behaved consistently in these runs. These would apply to a site of any size. The gains in page size and tab handling come mostly from the rebuild being a small mock.

## What's in this repository

| Path | Contents |
| --- | --- |
| `src/` | The rebuild: homepage, Nature Observation pages, shop, and cart |
| `docs/agent-navigability.md` | The comparison report |
| `docs/video/`, `docs/images/` | The side-by-side video and the screenshots used in the report |
| `.agents/skills/agent-navigability-comparison/` | The method: the agent prompts, tasks, and scripts used to run and record the comparison |

To run the rebuild or repeat the comparison, see [Reproducing](docs/agent-navigability.md#reproducing) in the report.
