// src/api/chat/routes/01-custom-chat.js
export default {
    routes: [
      {
        method: 'POST',
        // Strapi voegt automatisch de '/api' prefix toe → endpoint = /api/chat/send
        path: '/chat/send',
        // Fully-qualified handler: api::<apiName>.<controllerName>.<actionName>
        handler: 'api::chat.chat.send',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  