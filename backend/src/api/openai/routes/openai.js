'use strict';

export const routes = [
  {
    method: 'POST',
    path: '/openai/ask',
    handler: 'openai.ask',
    config: {
      auth: false,
    },
  },
];
