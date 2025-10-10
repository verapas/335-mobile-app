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
  Happy: 'happy',
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseEndPunctuation(emotion) {
  const e = String(emotion || '').toLowerCase();
  switch (e) {
    case Emotion.Excited:
      return Math.random() < 0.55 ? '!' : (Math.random() < 0.25 ? '!!' : '.');
    case Emotion.Happy:
      return Math.random() < 0.35 ? '!' : '.';
    case Emotion.Angry:
      return Math.random() < 0.5 ? '!' : (Math.random() < 0.25 ? '!!' : '.');
    case Emotion.Sad:
      return Math.random() < 0.6 ? '...' : '.';
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

function maybeInsertSeparator(i, total, emotion) {
  if (i === total - 1) return '';
  const e = String(emotion || '').toLowerCase();
  const r = Math.random();
  // Tune punctuation density by emotion
  if (e === Emotion.Sad || e === Emotion.Calm) {
    // slower, more pauses
    if (r < 0.35) return ',';
    if (r < 0.37) return '...';
    return '';
  }
  if (e === Emotion.Excited || e === Emotion.Angry) {
    // faster, less commas, sometimes exclamation mid-stream
    if (r < 0.08) return '!';
    if (r < 0.12) return '-';
    return '';
  }
  if (e === Emotion.Happy) {
    if (r < 0.15) return ',';
    if (r < 0.18) return '!';
    return '';
  }
  // neutral
  if (r < 0.2) return ',';
  if (r < 0.23) return '?';
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
    const sep = maybeInsertSeparator(i, count, emotion);
    parts.push(w + (sep ? sep : ''));
  }

  const body = parts.join(' ').replace(/\s+([,?])/g, '$1');
  const endPunc = chooseEndPunctuation(emotion);
  const text = `${body}${endPunc}`;
  return text;
}

export default { generateText, Duration, Emotion };
