// backend/config/admin.ts

// Typing voor de `env` functie uit Strapi
interface EnvFn {
  /** Haalt een string op uit de omgevingsvariabelen */
  (key: string, defaultValue?: string): string;
  /** Haalt een boolean op uit de omgevingsvariabelen */
  bool(key: string, defaultValue?: boolean): boolean;
}

// Admin-configuratie voor Strapi
export default ({
  env,
}: {
  env: EnvFn;
}) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
