import type { Schema, Struct } from '@strapi/strapi';

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'seo.seo': SeoSeo;
    }
  }
}
