# ZEISS homepage on ui-sdk

A minimal rebuild of the [ZEISS Group homepage](https://www.zeiss.com/corporate/en/home.html) with [ui-sdk](https://github.com/vercel-labs/ui) (`@ui-sdk/react`), styled with ZEISS brand tokens. It exists to show what the site could look like on ui-sdk, and how that changes the way AI agents navigate it.

![The rebuilt homepage](docs/images/clone-top.png)

## What it shows

Each section uses a different ui-sdk behaviour:

| Section | Component |
| --- | --- |
| Cookie banner | Dialog, Collapsible, Switch |
| Header | Navigation Menu, Command search in a Dialog (⌘K) |
| Hero | Carousel with autoplay, indicators, and a play toggle |
| Divisions | Tabs |
| Focus topics | Toggle Group filter |
| Newsroom | Pagination |
| Events | Accordion, Hover Card |
| Contact | Drawer with Field, Input, Select, Textarea, Checkbox, and Toast |
| Footer | Select, Tooltip |

The page registers ui-sdk's `snapshot`, `act`, and `query` tools through WebMCP, so a browser agent can operate it directly.

Photography is loaded at runtime from zeiss.com; no ZEISS assets are stored in this repository.

## Agent navigability

[docs/agent-navigability.md](docs/agent-navigability.md) compares how well an AI agent can navigate this rebuild and the live zeiss.com.

## Development

Requires [Vite+](https://viteplus.dev) and pnpm.

```sh
pnpm install
pnpm dev
pnpm build
```
