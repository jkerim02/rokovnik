/**
 * settingsRepo — jedinstveni red korisničkih podešavanja (user_settings).
 * Drži theme_override; wire-uje se na ThemeProvider u root layoutu.
 */
import { eq } from 'drizzle-orm';

import { db } from '../client';
import { userSettings, type UserSetting } from '../schema';
import { nowIso } from './helpers';

const SETTINGS_ID = 'settings';

/** Učitaj (ili kreiraj prazna) podešavanja. */
export async function getSettings(): Promise<UserSetting> {
  const rows = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.id, SETTINGS_ID));
  if (rows[0]) return rows[0];

  const row = { id: SETTINGS_ID, updatedAt: nowIso(), dirty: 1 as const };
  await db.insert(userSettings).values(row);
  const created = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.id, SETTINGS_ID));
  return created[0]!;
}

export async function setThemeOverride(
  override: 'light' | 'dark' | null,
): Promise<void> {
  await getSettings(); // osiguraj da red postoji
  await db
    .update(userSettings)
    .set({ themeOverride: override, updatedAt: nowIso(), dirty: 1 })
    .where(eq(userSettings.id, SETTINGS_ID));
}
