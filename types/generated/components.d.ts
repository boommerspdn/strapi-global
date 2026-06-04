import type { Schema, Struct } from '@strapi/strapi';

export interface ProductSpecRow extends Struct.ComponentSchema {
  collectionName: 'components_product_spec_rows';
  info: {
    displayName: 'Spec Row';
    icon: 'apps';
  };
  attributes: {
    btu: Schema.Attribute.Integer & Schema.Attribute.Required;
    ecoGrade: Schema.Attribute.Enumeration<
      ['5_5stars', '5_4stars', '5_3stars', '5_2stars', '5_1star']
    > &
      Schema.Attribute.Required;
    model: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Integer & Schema.Attribute.Required;
    seer: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

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

export interface SharedFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_cards';
  info: {
    displayName: 'Feature Card';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.spec-row': ProductSpecRow;
      'seo.seo': SeoSeo;
      'shared.feature-card': SharedFeatureCard;
    }
  }
}
