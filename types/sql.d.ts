// Drizzle Expo migracije importuju .sql fajlove kao string (preko Metro sourceExts).
declare module '*.sql' {
  const content: string;
  export default content;
}
