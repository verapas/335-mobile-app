import { generateText, Emotion, Duration } from '../textGenerator';

jest.mock('../db', () => ({
  getWords: jest.fn().mockResolvedValue(['bli', 'blo', 'blu', 'bla'])
}));

describe('generateText', () => {
  const realRandom = Math.random;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    Math.random = realRandom;
  });

  it('returns empty string if no creatureId', async () => {
    const out = await generateText({ creatureId: null, emotion: Emotion.Neutral, duration: Duration.Short });
    expect(out).toBe('');
  });

  it('generates with min word count for very short when Math.random=0', async () => {
    Math.random = () => 0; // force min in randInt and punctuation choices
    const out = await generateText({ creatureId: 1, emotion: Emotion.Neutral, duration: Duration.VeryShort });
    // VeryShort => range [1,2], with random=0 it picks min=1
    // Should end with either '.' or '?'; with random=0 choose '?' threshold 0.15 => '?' selected
    expect(out).toMatch(/^(bli|blo|blu|bla)[\.?\!\-\,\?]+$/);
    expect(out.endsWith('?') || out.endsWith('.')).toBe(true);
  });

  it('produces punctuation appropriate for excited emotion', async () => {
    // Sequence to make count deterministic and choose '!'
    // First call for count -> use 0 to pick min of [2,4] (Short -> 2)
    // Next randoms for mid separators -> small values to avoid commas
    let calls = 0;
    Math.random = () => {
      calls += 1;
      if (calls === 1) return 0; // count
      if (calls <= 5) return 0.09; // mid-stream punctuation low
      return 0.1; // ending punctuation -> '!' for excited (p<0.55)
    };
    const out = await generateText({ creatureId: 1, emotion: Emotion.Excited, duration: Duration.Short });
    expect(out.endsWith('!') || out.endsWith('!!') || out.endsWith('.')).toBe(true);
  });
});

