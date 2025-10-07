import React, { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeDatabase, insertCreature, insertAnimations, setCreatureWords, setCreatureProsody } from './src/services/db';
import creatures from './src/data/creatures';
import animations from './src/data/animations';
import words from './src/data/words';
import prosody from './src/data/prosody';

export default function App() {
  useEffect(() => {
    (async () => {
      try {
        await initializeDatabase();
        // Auto-seed creatures/animations from data files (idempotent)
        if (Array.isArray(creatures) && creatures.length) {
          for (const c of creatures) {
            await insertCreature(c);
          }
        }
        if (Array.isArray(animations) && animations.length) {
          for (const a of animations) {
            if (a.creature_id) await insertAnimations(a.creature_id, a);
          }
        }
        if (Array.isArray(words) && words.length) {
          for (const entry of words) {
            if (entry?.creature_id && Array.isArray(entry.words)) {
              await setCreatureWords(entry.creature_id, entry.words);
            }
          }
        }
        if (Array.isArray(prosody) && prosody.length) {
          for (const p of prosody) {
            if (p?.creature_id && p?.prosody) {
              await setCreatureProsody(p.creature_id, p.prosody);
            }
          }
        }
      } catch (e) {
        console.error('DB init/seed error:', e);
      }
    })();
  }, []);
  return <RootNavigator />;
}

 
