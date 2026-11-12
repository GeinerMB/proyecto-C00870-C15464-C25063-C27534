# Evidencias de validación

Esta carpeta reúne evidencias del maquetado semántico y los estilos de **Galactic Squadrons**. Como el proyecto utiliza React, la validación HTML se realiza sobre el documento renderizado en el navegador para cada página.

## Archivos de evidencia
- **`*.html`:** copias del documento HTML renderizado de cada página, incluyendo `<!DOCTYPE html>`.
- **`*-w3c.json`:** resultados del W3C Nu HTML Checker en formato JSON.
- **`*-css-w3c.json`:** resultados del validador CSS del W3C.
- **`*-stylelint.json`:** resultados de Stylelint.
- **`*-checks.json`:** comprobaciones realizadas en el navegador.
- **`*-palette.json`:** colores de las variables CSS y sus contrastes.

## Resultados disponibles del validador W3C

| Página | HTML revisado | Resultado | Errores | Advertencias |
| --- | --- | --- | --- | --- |
| Juego | [game.html](game.html) | [game-w3c.json](game-w3c.json) | 0 | 0 |
| Marcadores | [scoreboard.html](scoreboard.html) | [scoreboard-w3c.json](scoreboard-w3c.json) | 0 | 0 |
| Quiénes somos | [about-us.html](about-us.html) | [about-us-w3c.json](about-us-w3c.json) | 0 | 0 |
| Home | [home.html](home.html) | [home-w3c.json](home-w3c.json) | 0 | 0 |
| Rules | [rules.html](rules.html) | [rules-w3c.json](rules-w3c.json) | 0 | 0 |
| Lobby | [lobby.html](lobby.html) | [lobby-w3c.json](lobby-w3c.json) | 0 | 0 |


Los 6 reportes contienen un arreglo `messages` vacío. El juego se volvió a
validar el 8 de noviembre de 2026 con la versión `26.11.4`; los otros reportes
conservan la versión `26.10.12`. Ejemplo de respuesta:

```json
{
  "version": "26.10.12",
  "messages": []
}
```

`version` identifica la versión del validador, no la versión del proyecto. El arreglo `messages` vacío indica que no se reportaron errores ni advertencias para los documentos enviados en esas comprobaciones.

Estos resultados corresponden a las copias HTML guardadas. Si cambia el contenido renderizado, se deben regenerar las evidencias.

## Estilos de la pantalla de juego

La pantalla reutiliza los tokens y controles comunes sin modificar variables
existentes. La hoja propia es `src/styles/game.css`; las variables nuevas tienen
el prefijo `--game-`. El escenario y las tarjetas ocupan una única pantalla sin
desplazamiento horizontal ni vertical. No se muestran cabeceras de misión, títulos
de sección ni pies de página en la ruta del juego; las demás páginas conservan
su pie y su desplazamiento habituales.

La vida del planeta aparece debajo de la Tierra. Cada tarjeta muestra el nombre
del jugador, la nave, la puntuación y barras compactas con iconos. Los títulos,
las etiquetas de recursos y los valores permanecen disponibles para lectores
de pantalla. La presentación sigue siendo una vista previa: la lógica de
movimiento, combate y pausa queda pendiente.

| Comprobación | Resultado | Evidencia |
| --- | --- | --- |
| Stylelint, configuración estándar | 0 errores y 0 advertencias en `game.css` | [game-stylelint.json](game-stylelint.json) |
| W3C CSS, perfil `css3svg` | Válido, 0 errores y 21 advertencias sobre variables dinámicas | [game-css-w3c.json](game-css-w3c.json) |
| Diseño responsive | Una sola pantalla sin desplazamiento en diez tamaños; nueve barras visibles | [game-checks.json](game-checks.json) |
| Teclado | Foco visible de 3 px, menú con Enter, enlaces con Tab y navegación a controles | [game-checks.json](game-checks.json) |
| Movimiento reducido | Animación desactivada con `prefers-reduced-motion: reduce` | [game-checks.json](game-checks.json) |
| Paleta y contraste | 12 combinaciones superan 4,5:1 | [game-palette.json](game-palette.json) |

Las comprobaciones del navegador se realizaron con Chrome y Playwright sobre la
versión compilada. Los tamaños revisados son 1920×1080, 1440×900, 1280×720,
1024×768, 768×1024, 640×900, 390×844, 320×568, 844×390 y 568×320. Las tarjetas
usan dos filas en móviles estrechos en vertical y una franja en horizontal.
Se comprobó que la barra de vida queda debajo del planeta, que el aviso no tapa
las naves y que el juego no muestra el pie general, incluso con la ruta `#/game/`.
El contraste mínimo en los pares de texto y fondo evaluados en el navegador es
7,81:1. Los iconos distinguen vida y energía además del color; las barras exponen
su nombre y valor mediante atributos ARIA, sin títulos ni números visibles.

El W3C avisa que no puede comprobar estáticamente las variables CSS. Sus valores
calculados se revisaron en el navegador. Stylelint se ejecutó sobre la hoja del
juego; las hojas de otras páginas no se incluyeron en esa revisión.

Para repetir las comprobaciones de código y generar el reporte JSON de la paleta:

```powershell
npm.cmd run lint:css:game
npm.cmd run palette:game
npm.cmd run build
```

La herramienta `scripts/game-palette.mjs` obtiene los colores de las variables
reales y calcula el contraste mediante luminancia relativa sRGB. No genera imágenes.

Para renovar la validación CSS desde PowerShell:

```powershell
curl.exe --silent --show-error --fail --max-time 30 `
  --form "file=@src/styles/game.css;type=text/css" `
  --form "output=json" --form "profile=css3svg" --form "warning=0" `
  --output design/validation/game-css-w3c.json `
  https://jigsaw.w3.org/css-validator/validator
```

La compilación finaliza correctamente y mantiene una advertencia previa en
`tokens.css`: no existe `assets/enemies/weapons/battlecruiser_missile.png`.
La pantalla del juego no utiliza esa variable y se conserva su definición original.

## ¿Cómo se hizo validación?

1. Ejecutar la aplicación con `npm run dev` y abrir la página que se desea revisar.
2. En las herramientas de desarrollo del navegador, abrir **Elements**, hacer clic derecho sobre `<html>` y seleccionar **Copy → Copy outerHTML**.
3. Guardar el contenido como un archivo `.html` en esta carpeta, agregando `<!DOCTYPE html>` al principio. Esa declaración no se incluye al copiar `outerHTML`.
4. Validar el documento mediante la [entrada directa del W3C HTML Checker](https://validator.w3.org/nu/#textarea) o mediante su API.
5. Corregir los problemas en el archivo `.jsx` correspondiente y repetir el proceso hasta obtener el resultado final. El HTML de evidencia debe regenerarse desde el navegador después de cada corrección.

Para obtener un resultado JSON mediante la API, ejecutar desde la raíz del repositorio, por ejemplo:

```bash
curl --silent --show-error --fail \
  -H "Content-Type: text/html; charset=utf-8" \
  --data-binary @design/validation/name_of_page.html \
  "https://validator.w3.org/nu/?out=json" \
  -o design/validation/name_of_page-w3c.json
```

Para revisar una página, se cambia el nombre del archivo HTML de entrada y del JSON de salida (`name_of_page` en este caso). Después de ejecutar el comando, se revisa el contenido de `messages` en el archivo generado.
