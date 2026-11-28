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

export const SPECIALIST_ABILITY = {
  duration: 0,
  cooldown: 8,
  dropHealFraction: 1 / 5,
  pickupHealFraction: 1 / 2, // Fácil: 1, media: 1/2, difícil: 1/4.
};

const abilitiesByRole = {
  cazador: HUNTER_ABILITY,
  guardian: GUARDIAN_ABILITY,
  especialista: SPECIALIST_ABILITY,
};

export function activateAbility(ship) {
  const config = abilitiesByRole[ship.role];
  if (!config || ship.hp <= 0 || ship.ability.readyIn > 0) return;

  ship.ability.remaining = config.duration;
  ship.ability.readyIn = config.duration + config.cooldown;

  // Se indica que se aceptó el push de E.
  // Esto evita especialmente crear botiquines durante la recarga
  return true;
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

export function getAbilityPercent(ship) {
  const config = abilitiesByRole[ship.role];
  if (!config) return null;

  const { remaining, readyIn } = ship.ability;

  if (remaining > 0) {
    return Math.min(100, Math.ceil(100 * remaining / config.duration));
  }

  if (readyIn <= 0) return 100;

  const rechargeProgress = 1 - readyIn / config.cooldown;
  return Math.max(0, Math.min(99, Math.floor(100 * rechargeProgress)));
}