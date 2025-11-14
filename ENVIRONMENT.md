# Umgebungsvariablen

Erstelle lokal eine Datei `.env.local` im Projektwurzelverzeichnis mit folgenden Schlüsseln:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Hinweise:
- `.env.local` ist durch die Standard-.gitignore von Next.js bereits ausgeschlossen und wird nicht committet.
- Trage hier deine Supabase Projekt-URL und den anon-public Key ein (kein Service-Role-Key).
- Produktionswert (Beispiel): `NEXT_PUBLIC_SITE_URL=https://aim.flx-software.de`


