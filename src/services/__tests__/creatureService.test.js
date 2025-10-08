import { getEffectiveProsody, getTtsLanguage } from '../creatureService';

jest.mock('../db', () => ({
  getCreatureWithAnimations: jest.fn(),
  getCreatureProsody: jest.fn(),
}));

const db = require('../db');

describe('creatureService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('combines base prosody with emotion delta', async () => {
    db.getCreatureWithAnimations.mockResolvedValue({
      creature: { id: 1, name: 'Test', prosody_pitch: 1.1, prosody_rate: 0.9 },
      animations: {},
    });
    db.getCreatureProsody.mockResolvedValue({
      happy: { pitch: 0.3, rate: 0.2 },
      neutral: { pitch: 0, rate: 0 },
    });

    const { pitch, rate } = await getEffectiveProsody(1, 'happy');
    expect(pitch).toBeCloseTo(1.4);
    expect(rate).toBeCloseTo(1.1);
  });

  it('falls back to neutral delta and defaults when unknown emotion', async () => {
    db.getCreatureWithAnimations.mockResolvedValue({
      creature: { id: 2, name: 'X', prosody_pitch: 1.0, prosody_rate: 1.0 },
      animations: {},
    });
    db.getCreatureProsody.mockResolvedValue({ neutral: { pitch: -0.1, rate: -0.2 } });

    const { pitch, rate } = await getEffectiveProsody(2, 'unknown');
    expect(pitch).toBeCloseTo(0.9);
    expect(rate).toBeCloseTo(0.8);
  });

  it('getTtsLanguage returns creature language or default', async () => {
    db.getCreatureWithAnimations.mockResolvedValueOnce({ creature: { tts_language: 'en-US' }, animations: {} });
    expect(await getTtsLanguage(1)).toBe('en-US');

    db.getCreatureWithAnimations.mockResolvedValueOnce({ creature: { }, animations: {} });
    expect(await getTtsLanguage(1)).toBe('de-DE');
  });
});

