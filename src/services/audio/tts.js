// Expo Speech TTS wrapper (Android-friendly)
// Docs: https://docs.expo.dev/versions/latest/sdk/speech/

import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizePitch(pitch) {
  // Expo Speech: Android typical range ~0.5–2.0 (1.0 = normal)
  if (typeof pitch !== 'number' || Number.isNaN(pitch)) return 1.0;
  const min = 0.5;
  const max = 2.0;
  return clamp(pitch, min, max);
}

function normalizeRate(rate) {
  // Expo Speech: iOS 0.0–1.0, Android accepts wider; normalize conservatively
  if (typeof rate !== 'number' || Number.isNaN(rate)) return 1.0;
  const min = Platform.OS === 'ios' ? 0.0 : 0.1;
  const max = Platform.OS === 'ios' ? 1.0 : 2.0;
  return clamp(rate, min, max);
}

export async function getVoices() {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices || [];
  } catch (e) {
    return [];
  }
}

export async function isSpeaking() {
  try {
    return await Speech.isSpeakingAsync();
  } catch {
    return false;
  }
}

export function stop() {
  try {
    Speech.stop();
  } catch {}
}

export function speakText({
  text,
  language,
  voice,
  pitch = 1.0,
  rate = 1.0,
  onStart,
  onDone,
  onStopped,
  onError,
} = {}) {
  if (!text || typeof text !== 'string') return;
  const opts = {
    language,
    voice,
    pitch: normalizePitch(pitch),
    rate: normalizeRate(rate),
    onStart,
    onDone,
    onStopped,
    onError,
  };
  Speech.speak(text, opts);
}

export default { speakText, stop, getVoices, isSpeaking };
