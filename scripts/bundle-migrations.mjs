/**
 * Pretvara generisane Drizzle .sql migracije u jedan TypeScript fajl sa
 * inline string-ovima (src/db/migrations/migrations.generated.ts).
 *
 * Zašto: drizzle-kit generiše migrations.js koji `import`-uje .sql fajlove.
 * Metro/Babel ne parsira .sql kao JS, pa bundling pukne. Inline-ovanjem SQL-a
 * u .ts string eliminišemo .sql import u potpunosti — radi na svim platformama.
 *
 * Pokreni: `npm run db:generate` (poziva ovaj skript automatski).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'src', 'db', 'migrations');
const journalPath = join(migrationsDir, 'meta', '_journal.json');

const journal = JSON.parse(readFileSync(journalPath, 'utf8'));

const migrationEntries = journal.entries.map((entry, i) => {
  const sql = readFileSync(join(migrationsDir, `${entry.tag}.sql`), 'utf8');
  const key = `m${String(i).padStart(4, '0')}`;
  return { key, sql };
});

const fileBody = `// AUTO-GENERISANO — ne uređuj ručno.
// Generiše scripts/bundle-migrations.mjs iz src/db/migrations/*.sql.
import journal from './meta/_journal.json';

${migrationEntries
  .map((m) => `const ${m.key} = ${JSON.stringify(m.sql)};`)
  .join('\n')}

export default {
  journal,
  migrations: {
${migrationEntries.map((m) => `    ${m.key},`).join('\n')}
  },
};
`;

const outPath = join(migrationsDir, 'migrations.generated.ts');
writeFileSync(outPath, fileBody, 'utf8');
console.log(`✓ Wrote ${outPath} (${migrationEntries.length} migration(s))`);
