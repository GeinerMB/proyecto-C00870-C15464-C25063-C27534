export const HUNTER_ABILITY = {
  duration: 4,
  cooldown: 8,
  speedMultiplier: 1.15,
  bulletDamage: 2,
};

export const GUARDIAN_ABILITY = {
  duration: 4,
  cooldown: 8,
};

const abilitiesByRole = {
  cazador: HUNTER_ABILITY,
  guardian: GUARDIAN_ABILITY,
};

export function activateAbility(ship) {
  const config = abilitiesByRole[ship.role];
  if (!config || ship.hp <= 0 || ship.ability.readyIn > 0) return;

  ship.ability.remaining = config.duration;
  ship.ability.readyIn = config.duration + config.cooldown;
}

export function updateAbility(ship, dt) {
  ship.ability.remaining = Math.max(0, ship.ability.remaining - dt);
  ship.ability.readyIn = Math.max(0, ship.ability.readyIn - dt);
}

export function isHunterActive(ship) {
  return ship.role === "cazador" && ship.ability.remaining > 0;
}

export function isGuardianActive(ship) {
  return ship.role === "guardian" && ship.ability.remaining > 0;
}