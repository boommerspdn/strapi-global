# BPRService API

Use this file for BPRService frontend work only. It covers shared layout content, homepage content, contact page content, works page images, SEO metadata, air conditioner brands, product series, and product specs.

## Endpoints

| Content | Type | UID | REST endpoint |
| --- | --- | --- | --- |
| Layout | Single type | `api::bprservice-layout.bprservice-layout` | `GET /api/bprservice-layout` |
| Home page | Single type | `api::bprservice-home-page.bprservice-home-page` | `GET /api/bprservice-home-page` |
| Contact page | Single type | `api::bprservice-contact-page.bprservice-contact-page` | `GET /api/bprservice-contact-page` |
| Works page | Single type | `api::bprservice-works-page.bprservice-works-page` | `GET /api/bprservice-works-page` |
| Brands | Collection type | `api::bprservice-brand.bprservice-brand` | `GET /api/bprservice-brands`, `GET /api/bprservice-brands/:id` |
| Products | Collection type | `api::bprservice-product.bprservice-product` | `GET /api/bprservice-products`, `GET /api/bprservice-products/:id` |

Request population for media, relation, and component fields when the frontend needs nested data, for example `?populate=*`. Page SEO metadata is stored in the non-repeatable `seo.seo` component and must be populated when the frontend needs meta tags.

## Layout

Source schema: `src/api/bprservice-layout/content-types/bprservice-layout/schema.json`

Use this endpoint for shared business identity and contact details reused by the homepage, contact page, header, or footer.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `logo` | media | Yes | Single image |
| `lineId` | string | Yes | LINE contact ID |
| `phoneNumber` | string | Yes | Phone contact |
| `address` | text | Yes | Business address |
| `googleMapEmbedSrc` | text | Yes | Google Maps embed `src` value |

## Home Page

Source schema: `src/api/bprservice-home-page/content-types/bprservice-home-page/schema.json`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `heroTitle` | string | Yes | Hero headline |
| `heroSubtitle` | string | Yes | Hero supporting text |
| `heroImage` | media | Yes | Single image |
| `features` | component array | No | Repeatable `shared.feature-card` |
| `seo` | component | No | `seo.seo` metadata |

`features` items contain:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `icon` | media | No | Single image |
| `title` | string | Yes | Feature title |
| `description` | text | Yes | Feature body |

## Contact Page

Source schema: `src/api/bprservice-contact-page/content-types/bprservice-contact-page/schema.json`

This endpoint stores contact-page copy only. Use `GET /api/bprservice-layout?populate=*` for the actual address, phone number, LINE ID, logo, and map embed source.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `subtitle` | string | Yes | Short supporting headline |
| `description` | text | Yes | Contact page body copy |
| `mapTitle` | string | Yes | Heading shown above or near the map |
| `seo` | component | No | `seo.seo` metadata |

## Works Page

Source schema: `src/api/bprservice-works-page/content-types/bprservice-works-page/schema.json`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `images` | media array | Yes | Repeatable images |
| `seo` | component | No | `seo.seo` metadata |

## SEO Metadata

Source component: `src/components/seo/seo.json`

BPRService page endpoints use the shared `seo.seo` component for frontend meta tags. The contact page already includes this field, and the home and works pages also expose it.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | Page meta title |
| `description` | text | Yes | Page meta description |

## Brands

Source schema: `src/api/bprservice-brand/content-types/bprservice-brand/schema.json`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | Brand name |
| `logo` | media | Yes | Single image |
| `wallUnit` | boolean | No | Defaults to `false` |
| `floorUnit` | boolean | No | Defaults to `false` |
| `ceilingCassette` | boolean | No | Defaults to `false` |
| `hangingUnit` | boolean | No | Defaults to `false` |
| `products` | relation | No | One brand has many BPRService products |

Use the boolean fields as brand-level product category flags.

## Products

Source schema: `src/api/bprservice-product/content-types/bprservice-product/schema.json`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | Product series name |
| `image` | media | Yes | Single image |
| `unitType` | enum | Yes | Product unit category |
| `brand` | relation | No | Many products belong to one BPRService brand |
| `specs` | component array | No | Repeatable `product.spec-row` |

Allowed `unitType` values:

| Value | Meaning |
| --- | --- |
| `wall_unit` | Wall unit |
| `floor_unit` | Floor unit |
| `ceiling_cassette` | Ceiling cassette |
| `hanging_unit` | Hanging unit |

`specs` items contain:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `model` | string | Yes | Model name/code |
| `btu` | integer | Yes | Cooling capacity |
| `seer` | decimal | Yes | Efficiency value |
| `ecoGrade` | enum | Yes | Energy grade |
| `price` | integer | Yes | Price value |

Allowed `ecoGrade` values:

| Value |
| --- |
| `5_5stars` |
| `5_4stars` |
| `5_3stars` |
| `5_2stars` |
| `5_1star` |
| `5_0star` |
