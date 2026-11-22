import { createPlayerShip, moveShip } from "./entities/player.js";
import { updateEnemies } from "./entities/enemies.js";
import { createInput } from "./systems/inputSystem.js";
import { createRenderer } from "./systems/renderSystem.js";
import { createSpawners, updateSpawners } from "./systems/spawnersSystem.js";
import { levels } from "./levels.js";

export function startGame(canvas, playerSpriteUrl, levelId = 1) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.focus();

  const playerShip = createPlayerShip();
  const enemies = [];
  const spawners = createSpawners(levels[levelId].spawners);
  const render = createRenderer(context, playerSpriteUrl);
  const input = createInput();

  let previousTime = null;
  let frameId;

  function frame(time) {
    const deltaTime = previousTime === null
      ? 0
      : Math.min((time - previousTime) / 1000, 0.5);
    previousTime = time;

    moveShip(playerShip, input.readMovement(), deltaTime);
    updateEnemies(enemies, deltaTime);
    render(playerShip, enemies);
    updateSpawners(spawners, enemies, deltaTime);

    frameId = requestAnimationFrame(frame);
  }

  frameId = requestAnimationFrame(frame);

  return function stopGame() {
    cancelAnimationFrame(frameId);
    input.dispose();
  };
}

// import { createPlayerShip, moveShip } from "./entities/player.js";
// import { createSpawners, updateSpawners } from "./systems/spawnersSystem.js";
// import { enemyTypes, createEnemy, updateEnemy, isEnemyOnCourse, drawEnemy } from "./entities/enemies.js";

// import { levels } from "./levels.js"
// const PLAYER_SPRITE_SCALE = 0.75;

// // Inicializa el juego con el elemento canvas y la imagen del jugador.
// export function startGame(canvas, playerSpriteUrl, levelId = 1) {
//   const context = canvas.getContext("2d");
//   if (!context) return;
  
//   // Permite que el canvas reciba eventos del teclado.
//   canvas.focus();
  
//   // Crea la nave y carga su imagen desde la URL proporcionada.
//   const playerShip = createPlayerShip();
//   const sprite = new Image();
//   sprite.src = playerSpriteUrl;
  
//   // Guarda las teclas actualmente presionadas y define las teclas válidas.
//   const pressedKeys = new Set();
//   const movementKeys = [
//     "KeyW", "KeyA", "KeyS", "KeyD",
//     "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
//   ];
  
//   // Registra una tecla de movimiento mientras no se usen combinaciones especiales.
//   function handleKeyDown(event) {
//     if (!movementKeys.includes(event.code)) return;
//     if (event.altKey || event.ctrlKey || event.metaKey) return;
  
//     event.preventDefault();
//     pressedKeys.add(event.code);
//   }
  
//   // Elimina la tecla cuando el usuario la suelta.
//   function handleKeyUp(event) {
//     pressedKeys.delete(event.code);
//   }
  
//   // Limpia todas las teclas al perder el foco de la ventana.
//   function clearKeys() {
//     pressedKeys.clear();
//   }
  
//   let prevTime = null;
//   let frameId;

//   const scoutImage = new Image();
//   scoutImage.src = enemyTypes.scout.spriteUrl;

//   // const enemies = [createEnemy("scout", canvas.width, 70)];
//   const enemies = [];
//   const spawners = createSpawners(levels[levelId].spawners);

//   // Ejecuta un fotograma
//   function frame(time) {
//     const deltaTime = prevTime === null ? 0 : Math.min((time - prevTime) / 1000, 0.5);
//     prevTime = time;
  
//     // Convierte las teclas presionadas en dirección de movimiento.
//     moveShip(playerShip, {
//       arriba: pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp"),
//       abajo: pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown"),
//       izquierda: pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft"),
//       derecha: pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight"),
//     }, deltaTime);
    
//     // Borra el fotograma anterior antes de dibujar el nuevo.
//     context.clearRect(0, 0, canvas.width, canvas.height);
  
    

//     for (let i = enemies.length - 1; i >= 0; i--) {
//       const enemy = enemies[i];
//       updateEnemy(enemy, deltaTime);

//       if (isEnemyOnCourse(enemy)) {
//         drawEnemy(context, enemy, scoutImage);
//       } else {
//         enemies.splice(i, 1);
//       }
//     }

//     updateSpawners(spawners, enemies, deltaTime);

//     if (sprite.complete && sprite.naturalWidth > 0) {
//       // Obtiene las dimensiones visibles del canvas.
//       const viewWidth = canvas.clientWidth;
//       const viewHeight = canvas.clientHeight;
  
//       if (viewWidth > 0 && viewHeight > 0) {
//         const shipScale = Math.min(
//           1,
//           viewWidth / canvas.width,
//           viewHeight / canvas.height,
//         ) * PLAYER_SPRITE_SCALE;

//         const drawWidth = playerShip.width * shipScale;
//         const drawHeight = playerShip.height * shipScale;

//         // Posición del jugador dentro de su recorrido lógico.
//         const progressX = playerShip.x / (canvas.width - playerShip.width);
//         const progressY = playerShip.y / (canvas.height - playerShip.height);

//         // Usa el tamaño visible para que la nave siga llegando a los bordes.
//         const drawX = progressX * (viewWidth - drawWidth);
//         const drawY = progressY * (viewHeight - drawHeight);

//         context.save();
//         context.scale(canvas.width / viewWidth, canvas.height / viewHeight);
//         context.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
//         context.rotate(Math.PI / 2);
//         context.drawImage(sprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
//         context.restore();
//       }
//     }
  
//     // Programa el siguiente fotograma.
//     frameId = requestAnimationFrame(frame);
//   }

//   // Conecta las acciones del teclado y la pérdida de foco con sus funciones.
//   window.addEventListener("keydown", handleKeyDown);
//   window.addEventListener("keyup", handleKeyUp);
//   window.addEventListener("blur", clearKeys);
  
//   // canvas.focus({ preventScroll: true }); // Activa el teclado al entrar a /game
//   frameId = requestAnimationFrame(frame);
  
//   // Devuelve una función para detener el juego y limpiar los eventos.
//   return () => {
//     cancelAnimationFrame(frameId);
//     window.removeEventListener("keydown", handleKeyDown);
//     window.removeEventListener("keyup", handleKeyUp);
//     window.removeEventListener("blur", clearKeys);
//   };
// }