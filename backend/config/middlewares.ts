// backend/config/middlewares.ts

export default [
  {
    name: 'strapi::errors',
    config: {},
  },
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
      },
      crossOriginOpenerPolicy: {
        policy: 'same-origin',
      },
      crossOriginResourcePolicy: {
        policy: 'same-origin',
      },
      crossOriginEmbedderPolicy: {
        policy: 'require-corp',
      },
      frameguard: {
        action: 'deny',
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000'], // jouw front-end origin
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      headers: ['Content-Type','Authorization','Accept'],
      credentials: true, // *zeer* belangrijk: laat cookies toe
    },
  },
  {
    name: 'strapi::poweredBy',
    config: {},
  },
  {
    name: 'strapi::logger',
    config: { level: 'debug' },
  },
  {
    name: 'strapi::query',
    config: {},
  },
  {
    name: 'strapi::body',
    config: {},
  },
  {
    name: 'strapi::favicon',
    config: {},
  },
  {
    name: 'strapi::public',
    config: {},
  },
];
