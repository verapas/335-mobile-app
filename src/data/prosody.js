// Per-emotion prosody DELTAS per creature (relative to base prosody)
// Adds a tiny randomness each boot to keep voices lively.

function j(min = -0.05, max = 0.05) { return min + Math.random() * (max - min); }

const prosody = [
  {
    creature_id: 1,
    prosody: {
      neutral: { pitch: 0.0 + j(), rate: 0.0 + j() },
      happy: { pitch: 0.20 + j(), rate: 0.30 + j() },
      sad: { pitch: -0.20 + j(), rate: -0.30 + j() },
      excited: { pitch: 0.30 + j(), rate: 0.40 + j() },
      calm: { pitch: -0.10 + j(), rate: -0.10 + j() },
      angry: { pitch: -0.10 + j(), rate: 0.35 + j() },
    },
  },
  {
    creature_id: 2,
    prosody: {
      neutral: { pitch: 0.05 + j(), rate: 0.05 + j() },
      happy: { pitch: 0.25 + j(), rate: 0.30 + j() },
      sad: { pitch: -0.15 + j(), rate: -0.20 + j() },
      excited: { pitch: 0.35 + j(), rate: 0.25 + j() },
      calm: { pitch: -0.05 + j(), rate: -0.05 + j() },
      angry: { pitch: 0.00 + j(), rate: 0.20 + j() },
    },
  },
];

export default prosody;
