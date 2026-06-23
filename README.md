# Usputnik

Lični, **offline-first** alat za čitanje stranih knjiga: biblioteka, bilješke,
rječnik, vokabular, kvizovi i praćenje vremena čitanja. Sve glavne funkcije rade
bez interneta.

> Arhitektura aplikacije je u lokalnom (netracked) dokumentu
> `usputnik-arhitektura.md`.

## Faza 1 (v1.0) — gotovo

Potpuno offline MVP, bez naloga/sync-a/Supabase-a:

- **Biblioteka** — CRUD knjiga (naslov, autor, status, naslovnica…), detalj knjige
- **Bilješke** — po stranici, sa kategorijom (Citat / Misao / Pitanje / Razmišljanje)
- **Rječnik** — pretraga + ručno dodavanje odrednica
- **Vokabular** — liste (decks) + pojmovi
- **Učenje** — kviz iz vokabulara (riječ → značenje) i citata (citat → knjiga)
- **Praćenje čitanja** — wall-clock tajmer (preživljava pozadinu) + ručni unos,
  plutajući indikator, statistika (ukupno, niz dana, po knjizi)
- **Teme** — sistem/light/dark, crna-bijela-zelena paleta

## Tehnologije

Expo (SDK 56) · Expo Router · TypeScript · expo-sqlite + Drizzle ORM · Zustand ·
date-fns

## Pokretanje

```bash
npm install
npm start          # Expo dev server (skeniraj QR ili pokreni na emulatoru)
npm run android    # direktno na Android
npm run ios        # direktno na iOS (macOS)
```

## Baza / migracije

Šema je u `src/db/schema.ts`. Nakon izmjene šeme:

```bash
npm run db:generate   # generiše SQL migraciju + inline TS bundle
```

## Struktura

```
src/
  app/            # ekrani (Expo Router) — (tabs), book/, deck/, dict/, quiz/, stats, settings
  components/ui/  # Screen, Text, Card, Button, Field, EmptyState
  db/             # schema, client, migrate, repositories/
  features/       # books, notes, vocab, quiz, reading, stats
  state/          # timerStore (Zustand + AsyncStorage)
  theme/          # tokens + ThemeProvider
  utils/          # imageResize
```

## Sljedeće faze

- **Faza 2** — Supabase sloj (auth, sync engine, Storage za naslovnice)
- **Faza 3** — pravi rječnici (EN-BS + bosanski + filozofski) kroz import skriptu, FTS
- **Faza 4** — notifikacije, export, heatmap, multi-device polish
