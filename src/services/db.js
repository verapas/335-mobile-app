// Expo SQLite database service (modern async API)
// Creates tables and exposes simple helpers
import * as SQLite from 'expo-sqlite';

let dbPromise = null;
async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('app.db');
  return dbPromise;
}

async function ensureWordsColumn(db) {
  const cols = await db.getAllAsync(`PRAGMA table_info(creatures);`);
  const has = cols?.some?.((c) => c?.name === 'words_json');
  if (!has) {
    await db.runAsync(`ALTER TABLE creatures ADD COLUMN words_json TEXT;`);
  }
}

async function ensureProsodyColumn(db) {
  const cols = await db.getAllAsync(`PRAGMA table_info(creatures);`);
  const has = cols?.some?.((c) => c?.name === 'prosody_json');
  if (!has) {
    await db.runAsync(`ALTER TABLE creatures ADD COLUMN prosody_json TEXT;`);
  }
}

async function ensureTtsLanguageColumn(db) {
  const cols = await db.getAllAsync(`PRAGMA table_info(creatures);`);
  const has = cols?.some?.((c) => c?.name === 'tts_language');
  if (!has) {
    await db.runAsync(`ALTER TABLE creatures ADD COLUMN tts_language TEXT;`);
  }
}

export async function initializeDatabase() {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    // Create tables if they don't exist; keep existing data intact
    await db.runAsync(`CREATE TABLE IF NOT EXISTS creatures (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      prosody_pitch INTEGER,
      prosody_rate INTEGER,
      tts_language TEXT
    );`);
    await ensureWordsColumn(db);
    await ensureProsodyColumn(db);
    await ensureTtsLanguageColumn(db);
    await db.runAsync(`CREATE TABLE IF NOT EXISTS animations (
      id INTEGER PRIMARY KEY NOT NULL,
      creature_id INTEGER UNIQUE,
      neutral_mouth_closed TEXT,
      neutral_mouth_open TEXT,
      sad_mouth_open TEXT,
      sad_mouth_closed TEXT,
      excited_mouth_open TEXT,
      excited_mouth_closed TEXT,
      happy_mouth_open TEXT,
      happy_mouth_closed TEXT,
      calm_mouth_open TEXT,
      calm_mouth_closed TEXT,
      angry_mouth_open TEXT,
      angry_mouth_closed TEXT,
      FOREIGN KEY (creature_id) REFERENCES creatures(id) ON DELETE CASCADE
    );`);
    await db.runAsync(`CREATE TABLE IF NOT EXISTS selected_creature (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      creature_id INTEGER,
      FOREIGN KEY (creature_id) REFERENCES creatures(id) ON DELETE SET NULL
    );`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS speech_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      emotion TEXT
    );`);
  });
}

export async function insertCreature({ id, name, prosody_pitch, prosody_rate, tts_language }) {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO creatures (id, name, prosody_pitch, prosody_rate, tts_language)
     VALUES (?, ?, ?, ?, ?);`,
    [id ?? null, name, prosody_pitch ?? null, prosody_rate ?? null, tts_language ?? null]
  );
}

export async function insertAnimations(creatureId, images) {
  const cols = [
    'neutral_mouth_closed',
    'neutral_mouth_open',
    'sad_mouth_open',
    'sad_mouth_closed',
    'excited_mouth_open',
    'excited_mouth_closed',
    'happy_mouth_open',
    'happy_mouth_closed',
    'calm_mouth_open',
    'calm_mouth_closed',
    'angry_mouth_open',
    'angry_mouth_closed',
  ];
  const values = cols.map((k) => images?.[k] ?? null);

  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO animations (
      creature_id, ${cols.join(', ')}
    ) VALUES (
      ?, ${cols.map(() => '?').join(', ')}
    );`,
    [creatureId, ...values]
  );
}

export async function getCreatures() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM creatures ORDER BY id;');
}

export async function getCreatureWithAnimations(id) {
  const db = await getDb();
  const creature = await db.getFirstAsync('SELECT * FROM creatures WHERE id = ?;', [id]);
  if (!creature) return null;
  const animations = await db.getFirstAsync('SELECT * FROM animations WHERE creature_id = ?;', [id]);
  return { creature, animations };
}

export async function setSelectedCreatureId(creatureId) {
  const db = await getDb();
  await db.runAsync(`INSERT OR REPLACE INTO selected_creature (id, creature_id) VALUES (1, ?);`, [creatureId ?? null]);
}

export async function getSelectedCreatureId() {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT creature_id FROM selected_creature WHERE id = 1;');
  return row?.creature_id ?? null;
}

export async function setCreatureWords(creatureId, wordsArray) {
  const db = await getDb();
  const json = JSON.stringify(Array.isArray(wordsArray) ? wordsArray : []);
  await ensureWordsColumn(db);
  await db.runAsync('UPDATE creatures SET words_json = ? WHERE id = ?;', [json, creatureId]);
}

export async function getWords(creatureId) {
  const db = await getDb();
  await ensureWordsColumn(db);
  const row = await db.getFirstAsync('SELECT words_json FROM creatures WHERE id = ?;', [creatureId]);
  return row?.words_json ? JSON.parse(row.words_json) : [];
}

export async function setCurrentEmotion(emotion) {
  const db = await getDb();
  await db.runAsync(`INSERT OR REPLACE INTO speech_state (id, emotion) VALUES (1, ?);`, [emotion ?? null]);
}

export async function getCurrentEmotion() {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT emotion FROM speech_state WHERE id = 1;');
  return row?.emotion ?? null;
}

export async function setCreatureProsody(creatureId, prosodyMap) {
  const db = await getDb();
  const json = JSON.stringify(prosodyMap || {});
  await ensureProsodyColumn(db);
  await db.runAsync('UPDATE creatures SET prosody_json = ? WHERE id = ?;', [json, creatureId]);
}

export async function getCreatureProsody(creatureId) {
  const db = await getDb();
  await ensureProsodyColumn(db);
  const row = await db.getFirstAsync('SELECT prosody_json FROM creatures WHERE id = ?;', [creatureId]);
  return row?.prosody_json ? JSON.parse(row.prosody_json) : {};
}
