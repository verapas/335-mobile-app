// Minimal Google Gemini client for emotion/duration extraction
// Reads API key from Expo config extra (see app.config.js) or arg

import Constants from 'expo-constants';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const extra = Constants?.expoConfig?.extra ?? Constants?.manifestExtra ?? {};
const DEFAULT_MODEL = extra.GEMINI_MODEL || 'gemini-2.5-flash';

function buildPrompt(userText) {
  return (
    'Return only "emotion":"...","duration":"..." (lowercase). ' +
    'emotion ∈excited, calm, sad, angry, neutral, happy from tone; ' +
    'duration ∈very short, short, middle, long, very long from intent (not input length). ' +
    'INPUT: ' + userText
  );
}

function extractJsonFromText(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const emoMatch = text.match(/"?emotion"?\s*[:=]\s*"?([a-z\s]+)"?/i);
    const durMatch = text.match(/"?duration"?\s*[:=]\s*"?([a-z\s]+)"?/i);
    if (!emoMatch || !durMatch) return null;
    return { emotion: emoMatch[1], duration: durMatch[1] };
  }
}

export async function analyzeTextGemini(userText, apiKey = extra.GOOGLE_API_KEY, model = DEFAULT_MODEL) {
  if (!userText) throw new Error('userText required');
  if (!apiKey) throw new Error('Missing GOOGLE_API_KEY');

  const url = `${API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const prompt = buildPrompt(userText);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Gemini request failed: ${res.status} ${t}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.candidates?.[0]?.output_text || '';
  const parsed = extractJsonFromText(text || '');
  if (!parsed) {
    try {
      if (typeof __DEV__ !== 'undefined' ? __DEV__ : true) {
        console.warn('Gemini unexpected response', { data, text });
      }
    } catch {}
    const err = new Error('Unexpected Gemini response');
    err.raw = data;
    err.text = text;
    throw err;
  }

  const emotion = String(parsed.emotion || '').toLowerCase();
  const duration = String(parsed.duration || '').toLowerCase();
  return { emotion, duration };
}

export default { analyzeTextGemini };

