# Citron CRM

Module Federation **host** for the Citron CRM platform — shell navigation, AI assistant, settings, and lazy-loaded product remotes (Sales, Accounting, and more).

Built by [Inkblot Studio](https://inkblotstudio.eu).

## Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19, Vite 7 |
| Language | TypeScript (strict) |
| UI | `@citron-systems/citron-ui` **1.26.0** (pin with remotes) |
| Tokens | `@citron-systems/citron-ds` ^2.0.0 |
| Federation | `@originjs/vite-plugin-federation` |

## Prerequisites

- Node.js **18+**
- npm

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (`http://localhost:5173`) |
| `npm run dev:full` | Vercel dev (frontend + `/api` routes) |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run type-check` | TypeScript only |
| `npm run preview` | Serve production build locally |

## Module Federation

Remotes are configured in `vite.config.ts`. **Keep `@citron-systems/citron-ui` and React versions aligned** with every remote (`citron-crm-sales-module`, `citron-crm-accounting-module`).

| Remote | Exposed module | Preview port |
|--------|----------------|--------------|
| Sales | `sales/Sales` | 5001 |
| Accounting | `accounting/Accounting` | 5002 |

Production `remoteEntry.js` URLs are set per deployment (e.g. Vercel). Override for local development in `vite.config.ts` when needed.

## Design system

Use semantic tokens only — `var(--inkblot-semantic-*)` from `@citron-systems/citron-ds/css`. Dark theme is applied via `ThemeProvider` (`data-theme` on `<html>`).

## Project layout

```
src/
├── App.tsx           # Shell, sidebar, federation routes
├── main.tsx          # DS fonts + CSS entry
├── pages/            # Home, Settings, NotFound
├── components/       # Shell-specific UI
├── lib/              # Jira API, toast, layout helpers
└── index.css         # Theme overrides + utilities
api/                  # Vercel serverless (Jira proxy)
```

## Deployment

Deploy to Vercel (or any static host for the SPA + serverless API). Build artifacts live in `dist/` — do not commit `dist/` or `*.tsbuildinfo`.

## Related repos

- `citron-ds` — tokens and fonts
- `citron-crm-sales-module` / `citron-crm-accounting-module` — federation remotes
- `citron-identity` — auth portal

## License

MIT — © Inkblot Studio
