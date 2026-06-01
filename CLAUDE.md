# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with hot-reload (port 1337)
npm run build      # Build admin panel for production
npm run start      # Start production server (requires build first)
npm run console    # Open Strapi interactive REPL
npm run upgrade    # Upgrade Strapi to latest version
```

No test runner is configured. TypeScript is compiled by Strapi's build pipeline — there is no separate `tsc` step needed for development.

## Architecture

**Strapi v5.47.0** — TypeScript, SQLite (dev), Node 20–24.

### Key entry points

- `src/index.ts` — Global `register()` and `bootstrap()` hooks. Use `register` to extend Strapi before initialization, `bootstrap` to run logic at startup (seeding, scheduling, etc.).
- `config/` — All runtime configuration files. Each exports a function receiving `{ env }` for reading environment variables with type coercion (`env.int`, `env.bool`).
- `src/api/` — Content type modules live here. Each content type gets its own subdirectory with `content-types/`, `controllers/`, `routes/`, and `services/`.
- `src/extensions/` — Override built-in plugin behavior (e.g. users-permissions).
- `src/admin/app.tsx` — Admin panel customization. Currently sets locale to Thai (`th`).

### Database

Defaults to SQLite at `.tmp/data.db`. Switch to MySQL or PostgreSQL by setting `DATABASE_CLIENT` and the corresponding `DATABASE_*` env vars (all options pre-configured in `config/database.ts`).

### Plugins installed

- `@strapi/plugin-users-permissions` — JWT auth, roles, user registration
- `@strapi/plugin-cloud` — Strapi Cloud deployment support

Add plugins in `config/plugins.ts` (currently empty — no custom plugins configured).

### MCP Integration

Strapi v5 includes a native MCP server. To connect Claude Code:
1. Start the dev server: `npm run dev`
2. Create an API token in Strapi admin → Settings → API Tokens
3. Add the MCP server to Claude Code via `/mcp add` pointing to `http://localhost:1337`

### Generated types

`types/generated/` contains auto-generated TypeScript definitions for content types and components. Regenerated automatically on `npm run dev` or `npm run build` — do not edit manually.
