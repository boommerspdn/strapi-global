# Strapi API Architecture

`strapi-global` is the shared Strapi 5 backend for the workspace. Content APIs are grouped by domain name so each frontend has a clear ownership boundary.

## Local Backend

- Strapi URL: `http://localhost:1337`
- Admin URL: `http://localhost:1337/admin`
- REST API root: `http://localhost:1337/api`
- Config: `config/server.ts`, `config/database.ts`, `config/plugins.ts`

## Development Database

Development uses SQLite by default:

```ts
filename: path.join(__dirname, "..", "..", env("DATABASE_FILENAME", ".tmp/data.db"))
```

That resolves to:

```text
strapi-global/.tmp/data.db
```

Direct DB edits are allowed for local dev in this workspace. Before editing `.tmp/data.db`, stop Strapi and make a backup, for example:

```bash
Copy-Item .tmp/data.db ".tmp/data.db.bak-$(Get-Date -Format yyyyMMddHHmmss)"
```

After editing, restart Strapi and verify the affected frontend route. Uploaded media is not stored in SQLite; it lives under `public/uploads`.

## Domain Groups

| Domain prefix | Frontend repo | Purpose |
| --- | --- | --- |
| `fastontime-*` | `accounting-frontend` | Fast On Time marketing/accounting website content |
| `bprservice-*` | `bpr-service` | BPR Service site, AC brands, products, specs, works gallery |
| `bssupply-*` | `bssupply` | BS Supply catalog, categories, products, site settings |
| `contact` | shared | Custom email sending endpoint |

New domain-owned content types should keep this naming shape:

```text
src/api/<domain>-<resource>/
```

Examples:

- `src/api/fastontime-service`
- `src/api/bprservice-product`
- `src/api/bssupply-category`

## Fast On Time APIs

Consumed by `accounting-frontend`.

| Content | Type | Endpoint |
| --- | --- | --- |
| Layout | Single type | `GET /api/fastontime-layout` |
| Home page | Single type | `GET /api/fastontime-home-page` |
| About page | Single type | `GET /api/fastontime-about-page` |
| Contact page | Single type | `GET /api/fastontime-contact-page` |
| Services | Collection type | `GET /api/fastontime-services`, `GET /api/fastontime-services/:id` |

Key fields:

- `fastontime-layout`: `name`, `address`, `phone`, `email`, `facebook_link`, `line_link`, `copyright`, `logo`, `favicon`
- `fastontime-home-page`: banner, promotion, section copy/media, `seo`
- `fastontime-about-page`: body/reason/header content, `seo`
- `fastontime-contact-page`: `email_to_receive`, `company_name`, `google_map_embed_src`, `seo`
- `fastontime-service`: `name`, `slug`, summary/detail copy, `seo`

## BPR Service APIs

Consumed by `bpr-service`.

| Content | Type | Endpoint |
| --- | --- | --- |
| Layout | Single type | `GET /api/bprservice-layout` |
| Home page | Single type | `GET /api/bprservice-home-page` |
| Contact page | Single type | `GET /api/bprservice-contact-page` |
| Works page | Single type | `GET /api/bprservice-works-page` |
| Brands | Collection type | `GET /api/bprservice-brands`, `GET /api/bprservice-brands/:id` |
| Products | Collection type | `GET /api/bprservice-products`, `GET /api/bprservice-products/:id` |

Field-level notes live in `docs/domains/bprservice.md`.

## BS Supply APIs

Consumed by `bssupply`.

| Content | Type | Endpoint |
| --- | --- | --- |
| Site settings | Single type | `GET /api/bssupply-site-setting` |
| Home page | Single type | `GET /api/bssupply-home-page` |
| Categories | Collection type | `GET /api/bssupply-categories`, `GET /api/bssupply-categories/:id` |
| Products | Collection type | `GET /api/bssupply-products`, `GET /api/bssupply-products/:id` |

Key fields:

- `bssupply-site-setting`: store identity, logo/favicon, contact details, hours, `seo`
- `bssupply-home-page`: hero copy/image, search placeholder, featured products, `seo`
- `bssupply-category`: `name`, `description`, `image`, `sortOrder`, products relation
- `bssupply-product`: product copy, images, category relation, condition, brand/model, price, tags, specs, featured flag

## Shared Contact Route

Custom route:

```text
POST /api/contact
```

Handler: `src/api/contact/controllers/contact.ts`

Request body:

```json
{
  "to": "recipient@example.com",
  "subject": "Message subject",
  "html": "<p>Message body</p>"
}
```

The route uses the Strapi email plugin with Nodemailer settings from `config/plugins.ts` and SMTP environment variables.

## Query Conventions

- Use `populate=*` or targeted `populate[...]` parameters when media, relations, components, or SEO are needed.
- Use `documentId` for Strapi 5 entity lookups in frontend routes.
- Keep API tokens in environment variables. Public frontend variables are visible to browsers, so prefer server-only tokens when the app can fetch on the server.
- Keep each domain's frontend types in that frontend repo, and keep canonical content schemas in this Strapi repo.
