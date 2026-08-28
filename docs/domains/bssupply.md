# BS Supply Domain API

The `bssupply-*` APIs serve `../bssupply`.

## Endpoints

| Content | Type | REST endpoint |
| --- | --- | --- |
| Site settings | Single type | `GET /api/bssupply-site-setting` |
| Home page | Single type | `GET /api/bssupply-home-page` |
| Categories | Collection type | `GET /api/bssupply-categories`, `GET /api/bssupply-categories/:id` |
| Products | Collection type | `GET /api/bssupply-products`, `GET /api/bssupply-products/:id` |

## Frontend Notes

- `bssupply/lib/strapi/client.ts` is the fetch and normalization layer.
- Product and category pages use `documentId` lookups.
- Product filters use search text, category `documentId`, condition, sort, and pagination.
- The frontend has fallback home/site-setting content so public pages can render honest empty states if Strapi is unavailable.
- Populate media, category relations, product specs, featured products, favicon/logo, and SEO data.
