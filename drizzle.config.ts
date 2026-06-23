import type { Config } from 'drizzle-kit';

/**
 * drizzle-kit konfiguracija — generiše SQL migracije iz src/db/schema.ts.
 * Dijalekt: SQLite (expo-sqlite na uređaju).
 * Migracije se na uređaju primjenjuju kroz drizzle-orm/expo-sqlite migrator.
 */
export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
