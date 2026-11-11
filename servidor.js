import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PUERTO = 3000;
const DIRECTORIO_ACTUAL = path.dirname(fileURLToPath(import.meta.url));
const DIRECTORIO_PUBLICO = path.join(DIRECTORIO_ACTUAL, "dist");
const RUTA_BASE = "/proyecto-C00870-C15464-C25063-C27534/";

// Registra cada petición y permite que continúe hacia su ruta.
app.use((peticion, respuesta, siguiente) => {
  console.log(peticion.method, peticion.url);
  siguiente();
});

// Permite comprobar que el servidor está funcionando.
app.get("/api/estado", (peticion, respuesta) => {
  respuesta.json({
    nombre: "Galactic Squadrons",
    estado: "activo",
  });
});

// Envía al usuario a la dirección base de la aplicación.
app.get("/", (peticion, respuesta) => {
  respuesta.redirect(RUTA_BASE);
});

// Entrega el HTML, JavaScript, CSS e imágenes compilados por Vite.
app.use(RUTA_BASE, express.static(DIRECTORIO_PUBLICO));

// Responde cuando ninguna ruta anterior coincide.
app.use((peticion, respuesta) => {
  respuesta.status(404).json({
    error: "Ruta no encontrada",
  });
});

app.listen(PUERTO, () => {
  console.log(`Servidor en http://localhost:${PUERTO}`);
});