const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

// Defines function to create a player ship object with initial position, size, and speed
export function createPlayerShip() {
  return {
    x: 400, // Initial x-coordinate of the ship
    y: 300, // Initial y-coordinate of the ship
    width: 64, // Width of the ship asset
    height: 64, // Height of the ship asset
    speed: 220, // Base speed of the ship
  }
}

// Defines function to move the ship based on input (keyboard events) and delta time
export function moveShip(ship, entry, deltaTime) {
  // Calculate the movement vector based on input:
  // right plus 1, left minus 1
  // down plus 1, up minus 1
  const dx = Number(entry.derecha) - Number(entry.izquierda);
  const dy = Number(entry.abajo) - Number(entry.arriba);

  // Calculate the length of the movement vector
  const magnitude = Math.hypot(dx, dy);

  // If the magnitude is zero, the ship is not moving, so we return early
  if (magnitude === 0) {
    return;
  }

  // Calculate the distance to move based on the ship's speed and the elapsed time (deltaTime)
  const distance = ship.speed * deltaTime;

  // Calculate the next position of the ship based on the normalized movement vector and distance
  const nextX = ship.x + (dx / magnitude) * distance;
  const nextY = ship.y + (dy / magnitude) * distance;

  // Update the ship's position, ensuring it stays within the canvas set boundaries
  ship.x = Math.max(0, Math.min(nextX, CANVAS_WIDTH - ship.width));
  ship.y = Math.max(0, Math.min(nextY, CANVAS_HEIGHT - ship.height));
}