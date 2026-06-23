/**
 * Migracije — primjenjuju generisane Drizzle migracije na lokalnu bazu.
 *
 * `useDbMigrations()` se zove jednom u root layoutu; dok migracije teku
 * prikazuje se splash/loader, a tek po uspjehu se renderuje aplikacija.
 */
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from './client';
import migrations from './migrations/migrations';

export function useDbMigrations() {
  return useMigrations(db, migrations);
}
