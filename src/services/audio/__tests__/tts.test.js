import { speakText } from '../tts';

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
  stop: jest.fn(),
}));

describe('tts speakText', () => {
  it('clamps pitch and rate and calls expo-speech', () => {
    const Speech = require('expo-speech');
    speakText({ text: 'hi', pitch: 10, rate: -1, language: 'de-DE' });
    expect(Speech.speak).toHaveBeenCalled();
    const opts = Speech.speak.mock.calls[0][1];
    expect(opts.pitch).toBeLessThanOrEqual(2.0);
    expect(opts.rate).toBeGreaterThanOrEqual(0.0);
    expect(opts.rate).toBeLessThanOrEqual(2.0);
  });

  it('does nothing when text is empty', () => {
    const Speech = require('expo-speech');
    Speech.speak.mockClear();
    speakText({ text: '' });
    expect(Speech.speak).not.toHaveBeenCalled();
  });
});
