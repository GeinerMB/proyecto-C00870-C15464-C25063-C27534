import { createPlayerShip, moveShip } from "./movement.js";

// Inicializa el juego con el elemento canvas y la imagen del jugador.
export function startGame(canvas, playerSpriteUrl) {
  const context = canvas.getContext("2d");
  if (!context) return;
  
  // Permite que el canvas reciba eventos del teclado.
  canvas.focus();
  
  // Crea la nave y carga su imagen desde la URL proporcionada.
  const playerShip = createPlayerShip();
  const sprite = new Image();
  sprite.src = playerSpriteUrl;
  
  // Guarda las teclas actualmente presionadas y define las teclas válidas.
  const pressedKeys = new Set();
  const movementKeys = [
    "KeyW", "KeyA", "KeyS", "KeyD",
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  ];
  
  // Registra una tecla de movimiento mientras no se usen combinaciones especiales.
  function handleKeyDown(event) {
    if (!movementKeys.includes(event.code)) return;
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
  }
  
  let prevTime = null;
  let frameId;
  

  // Ejecuta un fotograma
  function frame(time) {
    const deltaTime = prevTime === null ? 0 : Math.min((time - prevTime) / 1000, 0.5);
    prevTime = time;
  
    // Convierte las teclas presionadas en dirección de movimiento.
    moveShip(playerShip, {
      arriba: pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp"),
      abajo: pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown"),
      izquierda: pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft"),
      derecha: pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight"),
    }, deltaTime);
    
    // Borra el fotograma anterior antes de dibujar el nuevo.
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    if (sprite.complete && sprite.naturalWidth > 0) {
      // Obtiene las dimensiones visibles del canvas.
      const viewWidth = canvas.clientWidth;
      const viewHeight = canvas.clientHeight;
  
      if (viewWidth > 0 && viewHeight > 0) {
        // Qué fracción del recorrido lógico ha completado la nave en cada eje.
        const progressX = playerShip.x / (canvas.width - playerShip.width);
        const progressY = playerShip.y / (canvas.height - playerShip.height);
  
        // Posición equivalente en el tablero visible, dejando espacio para la nave.
        const drawX = progressX * (viewWidth - playerShip.width);
        const drawY = progressY * (viewHeight - playerShip.height);
  
        // Guarda el estado
        context.save();
  
        // Compensa el estiramiento de CSS para dibujar en píxeles visibles.
        context.scale(canvas.width / viewWidth, canvas.height / viewHeight);
  
        // Centra la nave, la gira 90 grados y la dibuja.
        context.translate(
          drawX + playerShip.width / 2,
          drawY + playerShip.height / 2,
        );
        context.rotate(Math.PI / 2);
        context.drawImage(
          sprite,
          -playerShip.width / 2,
          -playerShip.height / 2,
          playerShip.width,
          playerShip.height,
        );
  
        context.restore();
      }
    }
  
    // Programa el siguiente fotograma.
    frameId = requestAnimationFrame(frame);
  }

  // Conecta las acciones del teclado y la pérdida de foco con sus funciones.
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", clearKeys);
  
  // canvas.focus({ preventScroll: true }); // Activa el teclado al entrar a /game
  frameId = requestAnimationFrame(frame);
  
  // Devuelve una función para detener el juego y limpiar los eventos.
  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", clearKeys);
  };
}