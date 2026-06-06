import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::bprservice-brand.bprservice-brand', () => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      sort: ctx.query.sort ?? ['sortOrder:asc', 'name:asc'],
    };

    return super.find(ctx);
  },
}));
