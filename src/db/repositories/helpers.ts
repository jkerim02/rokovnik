/**
 * Zajednički helperi za repozitorije.
 *
 * Centralizuju konvencije iz §6: klijentski UUID, ISO timestamp,
 * `dirty` flag i soft-delete. Svaki write prolazi kroz ove helpere
 * da `updated_at`/`dirty` ostanu dosljedni.
 */
import { randomUUID } from 'expo-crypto';

/** Novi klijentski UUIDv4 za primarni ključ. */
export function newId(): string {
  return randomUUID();
}

/** Trenutni trenutak kao ISO 8601 (UTC), isti format kao SQLite default. */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Polja koja se postavljaju pri svakom INSERT-u korisničke tabele.
 * (user_id ima DB default 'local', pa ga ne moramo slati.)
 */
export function insertMeta() {
  const ts = nowIso();
  return {
    id: newId(),
    createdAt: ts,
    updatedAt: ts,
    dirty: 1 as const,
  };
}

/** Polja koja se postavljaju pri svakom UPDATE-u (bump updated_at + dirty). */
export function updateMeta() {
  return {
    updatedAt: nowIso(),
    dirty: 1 as const,
  };
}

/** Polja za soft-delete (nikad hard delete prije potvrđenog sync-a). */
export function softDeleteMeta() {
  const ts = nowIso();
  return {
    deletedAt: ts,
    updatedAt: ts,
    dirty: 1 as const,
  };
}
