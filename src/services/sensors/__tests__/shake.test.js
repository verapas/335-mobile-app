import { startShakeDetection } from '../shake';

jest.mock('expo-sensors', () => {
  let listener = null;
  return {
    Accelerometer: {
      setUpdateInterval: jest.fn(),
      addListener: jest.fn((cb) => {
        listener = cb;
        return { remove: jest.fn() };
      }),
      __emit: (data) => listener && listener(data),
    },
  };
});

describe('startShakeDetection', () => {
  const { Accelerometer } = require('expo-sensors');
  const realNow = Date.now;
  let now = 0;
  beforeEach(() => {
    now = 0;
    global.Date.now = () => now;
    jest.clearAllMocks();
  });
  afterEach(() => {
    global.Date.now = realNow;
  });

  it('triggers onShake when delta over threshold and respects debounce', () => {
    const onShake = jest.fn();
    startShakeDetection(onShake, { threshold: 0.5, debounceMs: 1000 });

    // Set initial time sufficiently large so first eligible shake passes debounce window
    now = 2000;
    // First reading sets prevMag only at t=2000
    Accelerometer.__emit({ x: 0, y: 0, z: 0 });
    expect(onShake).not.toHaveBeenCalled();

    // Big jump triggers
    now += 10;
    Accelerometer.__emit({ x: 2, y: 0, z: 0 });
    expect(onShake).toHaveBeenCalledTimes(1);

    // Within debounce, ignore
    now += 100;
    Accelerometer.__emit({ x: 0, y: 2, z: 0 });
    expect(onShake).toHaveBeenCalledTimes(1);

    // After debounce, allow again.
    // First emit a low magnitude to reset prevMag, then a high jump to trigger.
    now += 1200;
    Accelerometer.__emit({ x: 0, y: 0, z: 0 }); // reset baseline
    now += 1;
    Accelerometer.__emit({ x: 2, y: 0, z: 0 }); // big delta
    expect(onShake).toHaveBeenCalledTimes(2);
  });
});
