import { Accelerometer } from 'expo-sensors';
import { speakText, isSpeaking, stop as stopTTS } from '../audio/tts';

export function startShakeDetection(onShake, {
  threshold = 1.4,
  intervalMs = 200,
  debounceMs = 1000,
} = {}) {
  let prevMag = null;
  let lastShakeTs = 0;
  let subscription = null;

  try { Accelerometer.setUpdateInterval(intervalMs); } catch {}

  subscription = Accelerometer.addListener(({ x = 0, y = 0, z = 0 }) => {
    const mag = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();

    if (prevMag != null) {
      const delta = Math.abs(mag - prevMag);
      if (delta >= threshold && now - lastShakeTs >= debounceMs) {
        lastShakeTs = now;
        try { typeof onShake === 'function' && onShake(); } catch {}
      }
    }

    prevMag = mag;
  });

  return {
    stop() {
      try { subscription && subscription.remove && subscription.remove(); } catch {}
      subscription = null;
    }
  };
}

export async function triggerCreatureReaction({ setEmotion, text = 'ohoho', pitch = 1.8, rate = 1.15 } = {}) {
  try {
    if (await isSpeaking()) {
      try { stopTTS(); } catch {}
    }
  } catch {}

  try { if (typeof setEmotion === 'function') setEmotion('excited'); } catch {}

  speakText({
    text,
    pitch,
    rate,
    language: 'de-DE',
    onDone: () => {
      try { if (typeof setEmotion === 'function') setEmotion('neutral'); } catch {}
    },
    onStopped: () => {
      try { if (typeof setEmotion === 'function') setEmotion('neutral'); } catch {}
    },
  });
}

export default { startShakeDetection, triggerCreatureReaction };
