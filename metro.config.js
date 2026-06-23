// Metro konfiguracija (Expo) — default.
// Migracije se ne importuju kao .sql (vidi scripts/bundle-migrations.mjs koji
// inline-uje SQL u migrations.generated.ts), pa dodatni sourceExts nisu potrebni.
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
