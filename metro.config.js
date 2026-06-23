// Metro konfiguracija (Expo).
// Dodaje `.sql` u sourceExts kako bi Drizzle migracije (drizzle-orm/expo-sqlite)
// mogle importovati generisane .sql fajlove kao string.
// https://orm.drizzle.team/docs/connect-expo-sqlite
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql');

module.exports = config;
