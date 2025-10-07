// Per-emotion prosody DELTAS per creature (relative to base prosody on creature)
// Structure per entry: { creature_id: number, prosody: { [emotion: string]: { pitch: number, rate: number } } }
// Where pitch/rate here are adjustments added to the creature's base prosody_pitch/prosody_rate.

const prosody = [
  {
    creature_id: 1,
    prosody: {
      neutral: { pitch: 0.0, rate: 0.0 },
      happy: { pitch: 0.2, rate: 0.3 },
      sad: { pitch: -0.2, rate: -0.3 },
      excited: { pitch: 0.3, rate: 0.4 },
      calm: { pitch: -0.1, rate: -0.1 },
      angry: { pitch: -0.1, rate: 0.35 },
    },
  },
];

export default prosody;
