export const RANKS = [
  { min: 0, title: 'Cadet' },
  { min: 180, title: 'Pilot' },
  { min: 280, title: 'Mission Specialist' },
  { min: 380, title: 'Commander' },
  { min: 480, title: 'Cosmic Legend' }
];

export function calculateMissionScore({ rescue, science, armor, time, risk, squadSize, rescued }) {
  if (!rescued) return { finalScore: 0, rescueScore: 0, scienceScore: 0, survivalScore: 0, efficiencyScore: 0, collaborationBonus: 0 };
  const rescueScore = rescue * 2;
  const scienceScore = science;
  const survivalScore = armor * 12;
  const efficiencyScore = Math.max(0, 100 - time * 4 - risk * 0.5);
  const collaborationBonus = Math.min(30, Math.max(0, squadSize - 1) * 10);
  return {
    finalScore: Math.round(rescueScore + scienceScore + survivalScore + efficiencyScore + collaborationBonus),
    rescueScore, scienceScore, survivalScore,
    efficiencyScore: Math.round(efficiencyScore), collaborationBonus
  };
}

export function getRank(score) {
  return [...RANKS].reverse().find((rank) => score >= rank.min) || RANKS[0];
}
