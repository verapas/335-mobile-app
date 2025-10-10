BlipBlop – Mobile App (Expo)

Kleine Chat‑Bot App: Nimmt Eingabetext, analysiert Stimmung/Länge via LLM, generiert einen kurzen Satz, spricht ihn per TTS und animiert ein Creature‑Bild (Mund/Emotion). Läuft mit Expo und Expo Go.

Voraussetzungen
- Node.js LTS und npm
- Expo CLI über `npx` (wird automatisch genutzt)
- Expo Go App auf dem Smartphone (Android/iOS)

Setup
1) Dependencies installieren:
   - `npm install`
2) Umgebungsvariablen anlegen:
   - `.env.example` nach `.env` kopieren
   - `GOOGLE_API_KEY` eintragen (Pflicht)
   - Optional: `GEMINI_MODEL` (Standard: `gemini-2.5-flash`, Empfohlen: `Gemini 2.0 Flash-Lite`)
   - Die Variablen werden in `app.config.js` nach `expo.extra` gemappt und in `src/services/api/googleClient.js` verwendet.

Starten (Expo Go)
- Entwicklung starten: `npx expo start`  (bei Verbindungsproblemen: `npx expo start --tunnel`)
- In Expo Go den QR‑Code scannen und Projekt öffnen

Hinweise
- TTS (expo-speech) und Beschleunigungssensor (expo-sensors) funktionieren am zuverlässigsten auf einem echten Gerät.
- Ohne gültigen `GOOGLE_API_KEY` kann die Text‑Analyse nicht erfolgen; die App meldet einen Fehler bzw. nutzt Fallbacks.
