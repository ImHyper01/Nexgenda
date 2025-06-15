// backend/src/api/chat/controllers/chat.ts
export default {
  async send(ctx: any) {
    const { question, agenda } = ctx.request.body;
    const answer = await strapi
      .service('api::chat.chat')
      .askSoul(question, agenda);
    ctx.body = { answer };
  },
};
