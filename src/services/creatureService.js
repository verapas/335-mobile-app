import images from '../assets/registry/creatureImages';
import { getCreatureWithAnimations, getWords as dbGetWords, setCreatureWords as dbSetCreatureWords, getSelectedCreatureId as dbGetSelected, setSelectedCreatureId as dbSetSelected, getCreatureProsody as dbGetProsody } from './db';

// Returns { id, name, imageKey, image } for given creature id
// image is the require(...) source for neutral_mouth_closed
export async function getCreatureNameAndNeutralClosed(id) {
  const data = await getCreatureWithAnimations(id);
  if (!data) return null;
  const { creature, animations } = data;
  const imageKey = animations?.neutral_mouth_closed || null;
  const image = imageKey && images[imageKey] ? images[imageKey] : null;
  return { id: creature.id, name: creature.name, imageKey, image };
}

export async function getWords(creatureId) {
  return dbGetWords(creatureId);
}

export async function setWords(creatureId, wordsArray) {
  return dbSetCreatureWords(creatureId, wordsArray);
}

export async function getSelectedCreatureId() {
  return dbGetSelected();
}

export async function setSelectedCreatureId(id) {
  return dbSetSelected(id);
}

export async function getProsody(creatureId) {
  return dbGetProsody(creatureId);
}

export async function getEffectiveProsody(creatureId, emotion) {
  const data = await getCreatureWithAnimations(creatureId);
  if (!data) return { pitch: 1.0, rate: 1.0 };
  const basePitch = typeof data.creature?.prosody_pitch === 'number' ? data.creature.prosody_pitch : 1.0;
  const baseRate = typeof data.creature?.prosody_rate === 'number' ? data.creature.prosody_rate : 1.0;
  const prosody = await dbGetProsody(creatureId);
  const key = String(emotion || '').toLowerCase();
  const delta = prosody?.[key] || prosody?.neutral || { pitch: 0, rate: 0 };
  return {
    pitch: basePitch + (typeof delta.pitch === 'number' ? delta.pitch : 0),
    rate: baseRate + (typeof delta.rate === 'number' ? delta.rate : 0),
  };
}

export default { getCreatureNameAndNeutralClosed, getWords, setWords, getSelectedCreatureId, setSelectedCreatureId, getProsody, getEffectiveProsody };
