# Strapi Global Agent Notes

## Project Shape

- Strapi 5.47 backend shared by all workspace frontends.
- Local server port is `1337`.
- Development database is SQLite at `.tmp/data.db` by default.
- Source content APIs live under `src/api`.
- Shared components live under `src/components`.

## Domain API Architecture

Group APIs by owning domain name:

- `fastontime-*` serves `../accounting-frontend`.
- `bprservice-*` serves `../bpr-service`.
- `bssupply-*` serves `../bssupply`.
- `contact` is a shared custom email route.

New content types should follow `src/api/<domain>-<resource>` naming. Keep site-specific fields inside the owning domain. Use shared components only for genuinely reusable structures such as SEO, feature cards, product specs, or spec rows.

## SQLite Dev Database

- Strapi uses `config/database.ts`.
- Default `DATABASE_FILENAME` is `.tmp/data.db`.
- Stop Strapi before direct SQLite edits.
- Back up `.tmp/data.db` before changing it.
- Uploaded media is stored in `public/uploads`, not inside SQLite.
- Restart Strapi and verify the relevant frontend after DB edits.

## Documentation

- Start with `docs/API_ARCHITECTURE.md`.
- Domain details live in `docs/domains/`.
- Keep docs updated when adding, renaming, or deleting content types and fields.

## Verification

- Run `npm run build` after schema/config/admin changes.
- Run `npm run develop` for local manual CMS checks when changing content types or permissions.
