import { analyzeTextGemini } from '../googleClient';

jest.mock('expo-constants', () => ({
  expoConfig: { extra: { GOOGLE_API_KEY: 'test-key', GEMINI_MODEL: 'test-model' } },
}));

describe('analyzeTextGemini', () => {
  const realFetch = global.fetch;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    global.fetch = realFetch;
  });

  it('parses emotion and duration from API text', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: '{"emotion":"happy","duration":"short"}' }] } }] }),
    });
    const res = await analyzeTextGemini('hello world');
    expect(res).toEqual({ emotion: 'happy', duration: 'short' });
  });

  it('throws when API key missing', async () => {
    jest.resetModules();
    jest.doMock('expo-constants', () => ({ expoConfig: { extra: {} } }));
    const { analyzeTextGemini: fn } = require('../googleClient');
    await expect(fn('hi')).rejects.toThrow('Missing GOOGLE_API_KEY');
  });
});

