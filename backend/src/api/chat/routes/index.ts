// backend/src/api/chat/routes/chat.js
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/chat/send',
      handler: 'chat.send',
      config: { auth: false },
    },
  ],
};
