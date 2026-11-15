export const LEVELS = [
  {
    id: 'earth-orbit', planetId: 'earthOrbit', name: 'Earth Orbit', region: 'LOW EARTH ORBIT', kicker: 'MISSION 01 / DEPARTURE WINDOW',
    objective: 'Leave Earth orbit while keeping enough propellant for the long rescue route.',
    intro: 'Mission Control has confirmed Miko’s beacon is moving beyond Saturn. Your first burn sets the risk profile for everything that follows.',
    clue: 'A lunar gravity assist can change a spacecraft’s trajectory without the same propellant cost as a large corrective burn.',
    choices: [
      { id: 'lunar-assist', title: 'Lunar gravity assist', tag: 'EFFICIENT ROUTE', body: 'Use the Moon’s gravity to bend the trajectory and conserve propellant.', effects: { fuel: -4, power: -4, data: 2, risk: 2, science: 6, time: 1 }, feedback: 'Trajectory refined. The assist saved propellant and produced useful navigation data.' },
      { id: 'direct-burn', title: 'Direct departure burn', tag: 'FAST / HIGH THRUST', body: 'Commit to a high-thrust departure and minimize time near orbital debris.', effects: { fuel: -17, power: -5, risk: 4, time: -1, rescue: 2 }, feedback: 'The ship cleared the debris corridor quickly, but the maneuver consumed extra fuel.' },
      { id: 'debris-weave', title: 'Thread the debris corridor', tag: 'TACTICAL NAVIGATION', body: 'Take a slower path through tracked orbital debris using the navigation systems.', effects: { fuel: -7, power: -2, data: 5, risk: -3, science: 3, time: 1 }, feedback: 'The route was longer, but the debris scan reduced uncertainty.' }
    ]
  },
  {
    id: 'moon', planetId: 'moon', name: 'The Moon', region: 'LUNAR TRANSIT', kicker: 'MISSION 02 / THERMAL MANAGEMENT',
    objective: 'Protect the spacecraft from rapid temperature changes and maintain the communications link.',
    intro: 'The spacecraft passes the lunar far side. The relay signal weakens just as the thermal-control system begins cycling.',
    clue: 'The Moon has almost no atmosphere, so exposed equipment experiences extreme thermal conditions and little atmospheric shielding.',
    choices: [
      { id: 'thermal-shield', title: 'Deploy thermal shielding', tag: 'PROTECT SYSTEMS', body: 'Spend power to stabilize equipment temperature before the next burn.', effects: { power: -12, armor: 5, risk: -5, time: 1 }, feedback: 'Thermal stress dropped. The power draw was significant, but the hull is safer.' },
      { id: 'relay-hop', title: 'Use a relay hop', tag: 'COMMS FIRST', body: 'Route telemetry through the relay antenna and delay the departure slightly.', effects: { power: -6, data: 8, risk: -4, science: 4, time: 1 }, feedback: 'The link is stable again. More telemetry is available to the science team.' },
      { id: 'cold-coast', title: 'Coast through the shadow', tag: 'SAVE PROPELLANT', body: 'Reduce active systems and drift through the cold region.', effects: { fuel: -2, power: -4, armor: -9, risk: 7, time: 2 }, feedback: 'Propellant was conserved, but the temperature swing stressed the outer hull.' }
    ]
  },
  {
    id: 'mars', planetId: 'mars', name: 'Mars', region: 'MARS TRANSFER', kicker: 'MISSION 03 / DUST AND DATA',
    objective: 'Navigate a dust event while preserving power and science data.',
    intro: 'A broad dust plume is crossing the planned corridor. The solar arrays are producing less than expected and the beacon signal is intermittent.',
    clue: 'Mars is farther from the Sun than Earth, and dust can reduce the output of solar-powered equipment on the surface.',
    choices: [
      { id: 'storm-bypass', title: 'Bypass the dust plume', tag: 'SAFER / LONGER', body: 'Take the wide route and keep the instruments shielded.', effects: { fuel: -9, power: -4, risk: -5, time: 2, science: 3 }, feedback: 'The bypass avoided the worst of the dust, at the cost of time and propellant.' },
      { id: 'sensor-burst', title: 'Run a sensor burst', tag: 'SCIENCE / POWER', body: 'Collect a high-resolution scan while the data window is open.', effects: { power: -15, data: 17, risk: 3, science: 18, time: 1 }, feedback: 'The scan captured valuable atmospheric data, but the buffer is filling.' },
      { id: 'low-power', title: 'Enter low-power mode', tag: 'PRESERVE ENERGY', body: 'Pause nonessential instruments and wait for the dust to pass.', effects: { power: 4, fuel: -3, time: 2, risk: 4, science: 1 }, feedback: 'The power reserve recovered slightly. Waiting increased mission time.' }
    ]
  },
  {
    id: 'asteroid-belt', planetId: 'asteroidBelt', name: 'Asteroid Belt', region: 'MAIN BELT CROSSING', kicker: 'MISSION 04 / DEBRIS NAVIGATION',
    objective: 'Cross a debris-rich region without sacrificing the armor needed for the final approach.',
    intro: 'The route crosses the main asteroid belt. Your radar has found a narrow corridor, but fragments are moving across the flight path.',
    clue: 'The asteroid belt is vast; spacecraft missions still plan trajectories carefully and account for small-particle impact risk.',
    choices: [
      { id: 'shielded-crossing', title: 'Shielded crossing', tag: 'ARMOR FIRST', body: 'Angle the reinforced hull toward the debris stream and keep speed steady.', effects: { fuel: -7, power: -8, armor: -2, risk: -2, time: 1, science: 4 }, feedback: 'The shield absorbed minor impacts. The ship is through the densest part of the field.' },
      { id: 'micro-corrections', title: 'Micro-correction sequence', tag: 'PRECISION CONTROL', body: 'Use repeated small thruster pulses to avoid the largest fragments.', effects: { fuel: -13, power: -3, risk: -8, time: 2, science: 2 }, feedback: 'The manual corrections avoided the large fragments, with extra propellant cost.' },
      { id: 'data-map', title: 'Map the debris field', tag: 'SCIENCE / TIME', body: 'Pause for a scan and calculate a route through the low-density pockets.', effects: { fuel: -5, power: -12, data: 10, risk: 1, time: 2, science: 13 }, feedback: 'The map will help future traffic planning, though the scan consumed power and time.' }
    ]
  },
  {
    id: 'saturn', planetId: 'saturn', name: 'Saturn', region: 'SATURNIAN SYSTEM', kicker: 'MISSION 05 / OUTER-PLANET OPERATIONS',
    objective: 'Keep the spacecraft powered and communications-ready near Saturn’s rings.',
    intro: 'Saturn fills the forward viewport. Solar input is weak at this distance, and the ring plane creates a complicated navigation environment.',
    clue: 'Sunlight is much weaker at Saturn than at Earth, so deep-space spacecraft often need robust power systems and careful energy budgets.',
    choices: [
      { id: 'ring-plane', title: 'Skirt the ring plane', tag: 'LOWER DEBRIS RISK', body: 'Use a higher, longer arc to stay clear of the densest visible ring material.', effects: { fuel: -9, power: -5, risk: -7, time: 2, science: 5 }, feedback: 'The longer route kept the vehicle clear of the ring plane and protected the hull.' },
      { id: 'power-reserve', title: 'Reserve instrument power', tag: 'ENERGY MANAGEMENT', body: 'Suspend low-priority scans and route energy to guidance and communications.', effects: { power: 7, data: 2, risk: -2, science: -2, time: 1 }, feedback: 'Guidance and communications now have a healthier reserve.' },
      { id: 'deep-scan', title: 'Run a ring-system scan', tag: 'HIGH SCIENCE VALUE', body: 'Use the instruments to map ring particles and identify the safest approach.', effects: { power: -16, data: 15, risk: 2, time: 1, science: 17 }, feedback: 'The ring scan is complete. The findings are valuable, but energy is tight.' }
    ]
  },
  {
    id: 'alien-base', planetId: 'alienBase', name: 'Alien Base', region: 'UNKNOWN SPACE / FINAL OBJECTIVE', kicker: 'MISSION 06 / RESCUE OPERATION',
    objective: 'Locate Miko, disable the base defenses, and complete the rescue.',
    intro: 'The beacon resolves into a signal inside an artificial structure beyond Saturn. Vortex’s defense field is active. This is the final operation.',
    clue: 'Your instruments, power reserve, and communications plan now work together: a detected beacon is only useful when the team can coordinate a safe extraction.',
    choices: [
      { id: 'beacon-pulse', title: 'Synchronize the rescue beacon', tag: 'PRECISION EXTRACTION', body: 'Use the tracker and relay to synchronize with Miko’s signal, then open a short extraction window.', effects: { fuel: -10, power: -15, data: 8, risk: 5, armor: -2, rescue: 36, science: 5 }, feedback: 'The beacon locks on. Miko is aboard and the extraction corridor is stable.' },
      { id: 'decoy-burst', title: 'Launch a decoy burst', tag: 'DISTRACTION TACTIC', body: 'Draw the defense grid away from the docking bay and use the extra seconds to extract Miko.', effects: { fuel: -18, power: -7, risk: -12, armor: -5, rescue: 30, science: 2 }, feedback: 'The decoy pulled the defense grid off target. Miko is aboard; the hull took a glancing hit.' },
      { id: 'shield-cut', title: 'Cut through the shield edge', tag: 'HIGH RISK / DIRECT', body: 'Commit to a direct breach using the remaining armor and drive reserves.', effects: { fuel: -22, power: -10, risk: 14, armor: -14, rescue: 42, science: 1 }, feedback: 'The direct approach worked. Miko is aboard, but the ship absorbed heavy damage.' }
    ]
  }
];
