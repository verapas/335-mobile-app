import images from '../assets/registry/creatureImages';
import { getCreatureWithAnimations, getWords as dbGetWords, setCreatureWords as dbSetCreatureWords, getSelectedCreatureId as dbGetSelected, setSelectedCreatureId as dbSetSelected } from './db';

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

export default { getCreatureNameAndNeutralClosed, getWords, setWords, getSelectedCreatureId, setSelectedCreatureId };
