# Fast On Time Domain API

The `fastontime-*` APIs serve `../accounting-frontend`.

## Endpoints

| Content | Type | REST endpoint |
| --- | --- | --- |
| Layout | Single type | `GET /api/fastontime-layout` |
| Home page | Single type | `GET /api/fastontime-home-page` |
| About page | Single type | `GET /api/fastontime-about-page` |
| Contact page | Single type | `GET /api/fastontime-contact-page` |
| Services | Collection type | `GET /api/fastontime-services`, `GET /api/fastontime-services/:id` |

## Frontend Notes

- `accounting-frontend/lib/data.ts` is the fetch layer.
- Service detail routes use the service `slug` field.
- Layout fetches also collect service names/slugs for navigation.
- Populate media fields such as `logo`, `favicon`, `banner_image`, `promotion_ads`, `section_2_image`, and `header_image`.
- Populate `seo` for metadata.
