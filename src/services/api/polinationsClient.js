const BASE_URL = 'https://text.pollinations.ai';

export async function analyzeText(userText) {
    if (!userText) throw new Error('userText required');

    const prompt = `{Return only {"emotion":"...","duration":"..."} (lowercase). emotion ∈ {excited, calm, sad, angry, neutral} from tone; duration ∈ {very short, short, middle, long, very long} from intent (not input length). INPUT: {{${userText}}}}`;

    const encodedPrompt = encodeURIComponent(prompt)
        .replace(/%3A/g, ':')
        .replace(/%2C/g, ',')
        .replace(/%3B/g, ';');

    const url = `${BASE_URL}/${encodedPrompt}`;

    console.log('URL:', url);
    console.log('Zeige URL Ausschnitt mit Semikolon:', url.substring(url.indexOf('tone'), url.indexOf('tone') + 20));

    const res = await fetch(url);
    console.log('Status:', res.status);

    const text = await res.text();
    console.log('Response:', text);

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return { rawText: text };
    }
}

export default { analyzeText };