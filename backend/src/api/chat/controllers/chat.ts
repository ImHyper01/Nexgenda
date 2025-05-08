// src/api/chat/controllers/chat.ts
export default {
  async send(ctx: any) {
    const { question } = ctx.request.body;
    const answer = await strapi
      .service('api::chat.chat')
      .askSoul(question);
    ctx.body = { answer };
  },
};
