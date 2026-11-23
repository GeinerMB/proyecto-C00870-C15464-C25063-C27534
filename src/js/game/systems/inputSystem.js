// Define las teclas válidas
const movementKeys = new Set([
  "KeyW", "KeyA", "KeyS", "KeyD",
  "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight",
]);

export function createInput(canvas) {
  // Guarda las teclas actualmente presionadas
  const pressedKeys = new Set();
  let pendingShots = 0;

  // Registra una tecla de movimiento mientras no se usen combinaciones especiales.
  function handleKeyDown(event) {
    if (event.code === "Space") {
      if (event.target !== canvas || event.altKey || event.ctrlKey || event.metaKey) return;

      event.preventDefault();
      if (!event.repeat) pendingShots++;
      return;
    }
    
    if (!movementKeys.has(event.code)) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    event.preventDefault();
    pressedKeys.add(event.code);
  }

  // Elimina la tecla cuando el usuario la suelta.
  function handleKeyUp(event) {
    pressedKeys.delete(event.code);
  }

  // Limpia todas las teclas al perder el foco de la ventana.
  function clearKeys() {
    pressedKeys.clear();
    pendingShots = 0;
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", clearKeys);

  function readMovement() {
    return {
      arriba: pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp"),
      abajo: pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown"),
      izquierda: pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft"),
      derecha: pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight"),
    };
  }

  function consumeShots() {
    const shots = pendingShots;
    pendingShots = 0;
    return shots;
  }

  function dispose() {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", clearKeys);
  }

  return { readMovement, consumeShots, dispose };
}
