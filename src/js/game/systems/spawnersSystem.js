import { createEnemy } from "../entities/enemies";

// Convierte las configuraciones de generación en objetos activos.
export function createSpawners(definitions) {
  return definitions.map((definition) => ({
    ...definition, // Copia todas las propiedades configuradas del generador.
    elapsed: 0, // Lleva el tiempo transcurrido desde que apareció el último enemigo.
    spawned: 0, // Lleva la cantidad de enemigos creados por este generador.
  }));
}

// Actualiza los generadores y crea enemigos según sus intervalos.
export function updateSpawners(spawners, enemies, deltaTime) {
  for (const spawner of spawners) {
    // Detiene este generador si ya creó todos sus enemigos.
    if (spawner.spawned >= spawner.maxEnemies) continue;

    spawner.elapsed += deltaTime;

    // Espera hasta que haya pasado el intervalo configurado.
    if (spawner.elapsed < spawner.interval) continue;

    // Crea un enemigo en la posición definida y lo agrega a la lista.
    enemies.push(createEnemy(spawner.type, spawner.x, spawner.y));
    spawner.spawned += 1;
    spawner.elapsed = 0; // Reinicia el temporizador para el siguiente enemigo.
  }
}