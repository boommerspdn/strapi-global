import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'th',
    ],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
