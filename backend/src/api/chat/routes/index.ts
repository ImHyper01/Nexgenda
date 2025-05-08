// src/api/chat/routes/index.ts
export default {
  routes: [
    {
      method: 'POST',
      // Strapi voegt vanzelf de /api prefix toe → wordt /api/chat/send
      path: '/chat/send',
      // v5 fully-qualified handler
      handler: 'api::chat.chat.send',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
