import { getWords } from './db';

export const Duration = Object.freeze({
  VeryShort: 'very short',
  Short: 'short',
  Middle: 'middle',
  Long: 'long',
  VeryLong: 'very long',
});

export const Emotion = Object.freeze({
  Excited: 'excited',
  Calm: 'calm',
  Sad: 'sad',
  Angry: 'angry',
  Neutral: 'neutral',
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseEndPunctuation(emotion) {
  const e = String(emotion || '').toLowerCase();
  switch (e) {
    case Emotion.Excited:
      return Math.random() < 0.6 ? '!' : (Math.random() < 0.2 ? '!!' : '.');
    case Emotion.Angry:
      return Math.random() < 0.5 ? '!' : (Math.random() < 0.2 ? '!!' : '.');
    case Emotion.Sad:
      return Math.random() < 0.4 ? '...' : '.';
    case Emotion.Calm:
      return '.';
    case Emotion.Neutral:
    default:
      return Math.random() < 0.15 ? '?' : '.';
  }
}

function wordsRangeForDuration(duration) {
  const d = String(duration || '').toLowerCase();
  switch (d) {
    case Duration.VeryShort:
      return [1, 2];
    case Duration.Short:
      return [2, 4];
    case Duration.Middle:
      return [5, 8];
    case Duration.Long:
      return [9, 14];
    case Duration.VeryLong:
      return [15, 24];
    default:
      return [3, 6];
  }
}

function maybeInsertSeparator(i, total) {
  if (i === total - 1) return ''; // no separator after last word (handled by end punctuation)
  // 20% chance to add a comma, 5% chance to add a question mark mid-sentence (rare), otherwise space
  const r = Math.random();
  if (r < 0.2) return ',';
  if (r < 0.25) return '?';
  return '';
}

export async function generateText({ creatureId, emotion, duration }) {
  if (!creatureId) return '';
  const list = await getWords(creatureId);
  if (!Array.isArray(list) || list.length === 0) return '';

  const [minW, maxW] = wordsRangeForDuration(duration);
  const count = randInt(minW, maxW);

  let parts = [];
  for (let i = 0; i < count; i++) {
    const w = list[randInt(0, list.length - 1)] || '';
    const sep = maybeInsertSeparator(i, count);
    parts.push(w + (sep ? sep : ''));
  }

  // Join with spaces taking into account we already appended separators
  const body = parts.join(' ').replace(/\s+([,?])/g, '$1'); // tidy spaces before punctuation
  const endPunc = chooseEndPunctuation(emotion);
  const text = `${body}${endPunc}`;
  return text;
}

export default { generateText, Duration, Emotion };

