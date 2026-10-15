# Evidencias de validación HTML

Esta carpeta reúne evidencias del maquetado semántico de **Galactic Squadrons**. Como el proyecto utiliza React, la validación se realiza sobre el HTML renderizado en el navegador para cada página.

## Archivos de evidencia
- **`*.html`:** copias del documento HTML renderizado de cada página, incluyendo `<!DOCTYPE html>`.
- **`*-w3c.json`:** resultados del W3C Nu HTML Checker en formato JSON.

## Resultados disponibles del validador W3C

| Página | HTML revisado | Resultado | Errores | Advertencias |
| --- | --- | --- | --- | --- |
| Juego | [game.html](game.html) | [game-w3c.json](game-w3c.json) | 0 | 0 |
| Marcadores | [scoreboard.html](scoreboard.html) | [scoreboard-w3c.json](scoreboard-w3c.json) | 0 | 0 |
| Quiénes somos | [about-us.html](about-us.html) | [about-us-w3c.json](about-us-w3c.json) | 0 | 0 |
| Home | [home.html](home.html) | [home-w3c.json](home-w3c.json) | 0 | 0 |
| Rules | [rules.html](rules.html) | [rules-w3c.json](rules-w3c.json) | 0 | 0 |
| Lobby | [lobby.html](lobby.html) | [lobby-w3c.json](lobby-w3c.json) | 0 | 0 |


Los 6 reportes contienen la siguiente respuesta:

```json
{
  "version": "26.10.12",
  "messages": []
}
```

`version` identifica la versión del validador, no la versión del proyecto. El arreglo `messages` vacío indica que no se reportaron errores ni advertencias para los documentos enviados en esas comprobaciones.

Estos resultados corresponden a las copias HTML guardadas. Si cambia el contenido renderizado, se deben regenerar las evidencias.

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