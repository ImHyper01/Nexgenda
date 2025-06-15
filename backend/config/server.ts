export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  // je bestaande app.keys
  app: {
    keys: env.array('APP_KEYS'),
  },

  // nieuw: stel hier de admin-JWT-secret in
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'eenVeiligeDefaultAlsEnvMist'),
    },
  },
});
