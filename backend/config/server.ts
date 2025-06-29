// backend/config/server.ts

// Typing voor de `env` functie uit Strapi
interface EnvFn {
  /** Haalt een string op uit de omgevingsvariabelen */
  (key: string, defaultValue?: string): string;
  /** Haalt een number op uit de omgevingsvariabelen */
  int(key: string, defaultValue?: number): number;
  /** Haalt een array van strings op uit de omgevingsvariabelen */
  array(key: string, defaultValue?: string[]): string[];
}

export default ({ env }: { env: EnvFn }) => ({
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
