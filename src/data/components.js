export const BUDGET = 1900;

export const COMPONENTS = {
  hull: [
    { id: 'scout', name: 'Scout Hull', mass: 16, cost: 180, armor: 58, rescue: 10, description: 'Lightweight frame; fast and economical.' },
    { id: 'explorer', name: 'Explorer Hull', mass: 25, cost: 290, armor: 76, rescue: 16, description: 'Balanced protection and payload capacity.' },
    { id: 'fortress', name: 'Fortress Hull', mass: 42, cost: 440, armor: 96, rescue: 22, description: 'Heavy armor for high-risk operations.' }
  ],
  propulsion: [
    { id: 'chemical', name: 'Chemical Thruster', mass: 16, cost: 180, power: 4, range: 3, fuel: 100, description: 'High thrust, high propellant use.' },
    { id: 'ion', name: 'Ion Drive', mass: 22, cost: 310, power: 12, range: 6, fuel: 88, description: 'Efficient long-duration deep-space travel.' },
    { id: 'plasma', name: 'Plasma Drive', mass: 30, cost: 430, power: 18, range: 7, fuel: 78, description: 'Long reach with demanding power needs.' }
  ],
  power: [
    { id: 'compactSolar', name: 'Compact Solar Array', mass: 10, cost: 140, output: 22, description: 'Compact, but limited far from the Sun.' },
    { id: 'extendedSolar', name: 'Extended Solar Array', mass: 16, cost: 250, output: 38, description: 'More collection area for long missions.' },
    { id: 'radioisotope', name: 'Radioisotope Power Unit', mass: 20, cost: 390, output: 46, description: 'Steady output in the outer solar system.' }
  ],
  antenna: [
    { id: 'shortwave', name: 'Shortwave Antenna', mass: 4, cost: 90, power: 2, storage: 18, description: 'Low mass; limited deep-space throughput.' },
    { id: 'relay', name: 'Relay Antenna', mass: 8, cost: 170, power: 4, storage: 42, description: 'Balanced signal reach and storage.' },
    { id: 'deepSpace', name: 'Deep-Space Array', mass: 15, cost: 290, power: 8, storage: 70, description: 'Strong signal and large data buffer.' }
  ],
  instruments: [
    { id: 'beacon', name: 'Friend Beacon Tracker', mass: 6, cost: 180, power: 4, data: 12, rescue: 28, science: 4, description: 'Detects Miko’s emergency beacon.' },
    { id: 'navCam', name: 'Navigation Camera', mass: 4, cost: 120, power: 2, data: 8, rescue: 8, science: 12, description: 'Maps terrain and improves route selection.' },
    { id: 'spectrometer', name: 'Alien Energy Spectrometer', mass: 8, cost: 230, power: 6, data: 18, rescue: 14, science: 24, description: 'Reads unknown energy signatures.' },
    { id: 'radiation', name: 'Radiation Shield Scanner', mass: 5, cost: 150, power: 3, data: 10, rescue: 4, science: 14, description: 'Finds safer corridors through radiation.' },
    { id: 'drill', name: 'Sample Drill', mass: 9, cost: 190, power: 5, data: 16, rescue: 2, science: 22, description: 'Collects material for composition analysis.' }
  ],
  launch: [
    { id: 'light', name: 'Light Lifter', mass: 0, cost: 180, capacity: 82, range: 4, description: 'Small payload and shorter mission range.' },
    { id: 'heavy', name: 'Heavy Lifter', mass: 0, cost: 310, capacity: 130, range: 6, description: 'Reliable capacity for the Saturn route.' },
    { id: 'star', name: 'Star Lifter', mass: 0, cost: 460, capacity: 175, range: 7, description: 'Maximum payload and range headroom.' }
  ]
};

export const DEFAULT_DESIGN = {
  hull: 'explorer',
  propulsion: 'ion',
  power: 'extendedSolar',
  antenna: 'relay',
  instruments: ['beacon'],
  launch: 'heavy'
};

export function findPart(category, id) {
  return COMPONENTS[category].find((part) => part.id === id);
}

export function evaluateDesign(design) {
  const hull = findPart('hull', design.hull);
  const propulsion = findPart('propulsion', design.propulsion);
  const power = findPart('power', design.power);
  const antenna = findPart('antenna', design.antenna);
  const launch = findPart('launch', design.launch);
  const instruments = design.instruments.map((id) => findPart('instruments', id)).filter(Boolean);

  const parts = [hull, propulsion, power, antenna, launch, ...instruments];
  const mass = parts.reduce((sum, part) => sum + part.mass, 0);
  const cost = parts.reduce((sum, part) => sum + part.cost, 0);
  const powerDemand = propulsion.power + antenna.power + instruments.reduce((sum, item) => sum + item.power, 0);
  const dataLoad = instruments.reduce((sum, item) => sum + item.data, 0);
  const rescue = hull.rescue + instruments.reduce((sum, item) => sum + item.rescue, 0);
  const science = instruments.reduce((sum, item) => sum + item.science, 0);
  const budgetEfficiency = Math.max(0, 1 - cost / BUDGET);
  const massEfficiency = Math.max(0, 1 - mass / Math.max(1, launch.capacity));
  const efficiency = Math.round((budgetEfficiency + massEfficiency) * 50);
  const projectedScore = Math.round(rescue * 1.5 + science + (budgetEfficiency * 50 + massEfficiency * 50) * 0.4);

  const checks = [
    { label: 'Mass capacity', ok: mass <= launch.capacity, detail: `${mass} / ${launch.capacity} t` },
    { label: 'Power balance', ok: powerDemand <= power.output, detail: `${powerDemand} / ${power.output} units` },
    { label: 'Mission budget', ok: cost <= BUDGET, detail: `$${cost.toLocaleString()} / $${BUDGET.toLocaleString()}` },
    { label: 'Data storage', ok: dataLoad <= antenna.storage, detail: `${dataLoad} / ${antenna.storage} GB` },
    { label: 'Deep-space range', ok: propulsion.range >= 6 && launch.range >= 6, detail: `Drive ${propulsion.range} / 6 • Vehicle ${launch.range} / 6` },
    { label: 'Science payload', ok: instruments.length > 0, detail: `${instruments.length} instrument${instruments.length === 1 ? '' : 's'} installed` }
  ];

  return {
    mass, cost, powerDemand, powerOutput: power.output, dataLoad,
    storage: antenna.storage, rescue, science, armor: hull.armor, efficiency, projectedScore,
    fuel: propulsion.fuel, valid: checks.every((check) => check.ok), checks,
    parts: { hull, propulsion, power, antenna, launch, instruments }
  };
}
