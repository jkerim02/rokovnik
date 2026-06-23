/**
 * SQLite klijent (expo-sqlite + Drizzle).
 *
 * Lokalna baza je izvor istine za UI (Pravilo broj jedan). Otvara se
 * sinhrono pri startu; migracije se primjenjuju kroz useMigrations hook
 * (vidi src/db/migrate.ts) ili ručno migrate() pozivom.
 */
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

export const DATABASE_NAME = 'usputnik.db';

/** Raw expo-sqlite handle (potreban za migracije i PRAGMA). */
export const expoDb = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});

// Strane ključeve treba eksplicitno uključiti u SQLite.
expoDb.execSync('PRAGMA foreign_keys = ON;');

/** Drizzle instanca sa tipiziranom šemom. */
export const db = drizzle(expoDb, { schema });

export type DB = typeof db;
export { schema };
