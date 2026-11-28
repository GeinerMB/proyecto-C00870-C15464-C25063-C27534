// Define las teclas válidas para mover al jugador
const movementKeys = new Set([
  "KeyW", "KeyA", "KeyS", "KeyD",
  "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight",
]);

// Crea el controlador de entrada asociado al canvas del juego.
export function createInput(canvas) {
  // Guarda las teclas actualmente presionadas
  const pressedKeys = new Set();
  // Guarda la cantidad de disparos pendientes de procesar.
  let pendingShots = 0;
  // Registra la solicitud para activar la habilidad del rol.
  let abilityRequested = false;
  let enabled = true;

  // Registra una tecla de movimiento mientras no se usen combinaciones especiales.
  function handleKeyDown(event) {
    if (!enabled || event.target !== canvas) return;
    // Comprueba si la tecla presionada corresponde al disparo.
    if (event.code === "KeyE") {
      if (event.target !== canvas || event.altKey || event.ctrlKey || event.metaKey) return;

      event.preventDefault();
      if (!event.repeat) abilityRequested = true;
      return;
    }
    if (event.code === "Space") {
      // Solo permite disparar cuando el evento proviene del canvas
      if (event.target !== canvas || event.altKey || event.ctrlKey || event.metaKey) return;

      event.preventDefault();

    // Solo registra un disparo por pulsación. Ignora los eventos repetidos.
      if (!event.repeat) pendingShots++;
      return;
    }
    
    // Ignora las teclas que no sirven para mover al jugador.
    if (!movementKeys.has(event.code)) return;
    // Ignora combinaciones realizadas con Alt, Ctrl o Meta.
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    // Evita la acción predeterminada de la tecla y la registra como presionada.
    event.preventDefault();
    pressedKeys.add(event.code);
  }

  // Activa la habilidad.
  function consumeAbility() {
    const requested = abilityRequested;
    abilityRequested = false;
    return requested;
  }

  // Elimina la tecla cuando el usuario la suelta.
  function handleKeyUp(event) {
    pressedKeys.delete(event.code);
  }

  // Limpia todas las teclas al perder el foco de la ventana.
  function clearKeys() {
    pressedKeys.clear();
    pendingShots = 0;
    abilityRequested = false;
  }

  function setEnabled(value) {
    enabled = value;
    clearKeys();
  }

  // Registra los eventos de teclado y pérdida de foco en la ventana.
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", clearKeys);
  canvas.addEventListener("blur", clearKeys);

  // Construye el estado actual del movimiento.
  function readMovement() {
    return {
      arriba: pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp"),
      abajo: pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown"),
      izquierda: pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft"),
      derecha: pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight"),
    };
  }

  // Obtiene y consume los disparos pendientes.
  function consumeShots() {
    const shots = pendingShots;
    pendingShots = 0;
    return shots;
  }

  // Elimina los eventos registrados por este controlador.
  function dispose() {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", clearKeys);
    canvas.removeEventListener("blur", clearKeys);
  }

  // Expone las funciones necesarias para consultar movimiento,
  // procesar disparos, habilidades y limpiar los eventos al destruir el sistema.
  return { readMovement, consumeShots, consumeAbility, setEnabled, dispose };
}
