# proyecto-C00870-C15464-C25063-C27534
Proyecto de desarrollo de un videojuego multijugador en linea.

## Nombre del Juego:
Galactic Squadrons

## Integrantes del equipo:
| Nombre                    | Carnet | Rol                        |
| ------------------------- | ------ | -------------------------- |
| Josué Badilla Paredes     | C00870 | Servidor / Comunicación    |
| Werner Naranjo Navarro    | C15464 | Cliente / Lógica de Juego  |
| Alejandro Solano Barboza  | C27534 | Diseño / QA / Coordinación |
| Geiner Montoya Barrientos | C25063 | Frontend / Maquetado       |

## Descripción:
El juego transcurre de forma individual o cooperativa, entre 2 personas y 
tentativamente un máximo 4. Cada partida va por rondas, donde cada una buscará 
que los jugadores defiendan un planeta de naves enemigas. El objetivo es defender
el planeta y alcanzar la mayor cantidad de puntos posibles. Cada nave enemiga 
dará una cantidad determinada de puntos. Estos puntos se pueden aumentar utilizando
potenciadores, que se explicarán más adelante. Tentativamente, se espera que cada 
ronda contenga al final un jefe para pasar a la siguiente.

## Reglas:
1. Durante una partida, cada jugador puede desplazarse libremente por el escenario utilizando su nave espacial con las teclas de movimiento WASD. El movimiento ocurre en tiempo real y está limitado por la velocidad y características de la empleada nave.
2. Cada jugador posee un contador de puntos que aumenta al destruir enemigos e ir avanzando entre niveles. Al finalizar una partida, ya sea que completen los niveles, los jugadores sean eliminados tras agotar sus puntos de vida o que el planeta que están defendiendo agote sus puntos de vida, los puntajes van a ser clasificados de acuerdo con la cantidad total de puntos obtenidos, registrados en el servidor y mostrarse en una tabla de clasificación global.
3. Al final de cada nivel, los jugadores se deben enfrentar a un jefe. Este cuenta con una mayor cantidad de puntos de vida y genera disparos de vuelta a los jugadores con el fin de eliminarlos. Una vez que el jefe es derrotado, se avanza al siguiente nivel.
4. Los jugadores no pueden atravesar los obstáculos o enemigos presentes en el escenario. Al colisionar con ellos, las naves de los jugadores perderán puntos de vida. Una vez se agoten los puntos de salud de su nave, el jugador será eliminado de la ronda y deberán esperar a que todos sus compañeros sean eliminados o, por el contrario, se pase de nivel.
5. Cada jugador al inicio de la partida elegirá un rol para su nave. Cada rol posee habilidades especiales (mayor velocidad, escudo protector y sanación).
    1. **Rol Furtivo:** su habilidad le otorga una leve mejora en velocidad de movimiento y un número de disparos mayor.
    2. **Rol Tanque:** su habilidad le otorga un escudo de invulnerabilidad, una leve mejora en velocidad de movimiento, pero disminuye su cadencia de fuego.
    3. **Rol Apoyo:** su habilidad le permite generar un botiquín para curarse a sí mismo o a los aliados.
6. Tentativa: Durante la partida aparecen otros power-ups en diferentes ubicaciones del escenario que el jugador puede obtener al entrar en contacto con ellos, provocando que el power-up desaparezca temporalmente del mapa.

## Justificación de los Requisitos:

### Multijugador real:
Durante cada partida, se puede optar por jugar de forma colaborativa, con un 
mínimo de 2 jugadores o tentativamente en máximo de 4. Se implementará un cliente
y un servidor para establecer y mantener la comunicación y coordinación entre
ambos en tiempo real.

### Mérito sobre el azar:
El progreso y condición de victoria dependen mayormente de las deciciones y/o
habilidades de los jugadores. Cada jugador es libre de elegir su estilo de juego
y estrategia empleando los recursos y habilidades que obtenga durante cada
partida.

### Tiempo Real:
El juego cuenta con reglas claras que definene cómo progresar en el juego, además
de un servidor que registra y gestiona el estado global del juego. 

### Condición de fin:
Una partida termina cuando:
- Se completen todos niveles (un total de 5).
- Los jugadores sean eliminados tras agotar sus puntos de vida.
- El planeta que están defendiendo agote sus puntos de vida.

## Diseño:
[Diseño](./design/design.md)

## Tecnología de la interfaz

Se eligió el framework **React** para organizar la interfaz en componentes
reutilizables, separar el contenido de cada página y facilitar el trabajo en equipo. Esta estructura permitirá incorporar los estilos y la interacción en las siguientes entregas. La elección también responde al objetivo del equipo de adquirir experiencia con React.

**Vite** se utiliza para ejecutar la interfaz durante el desarrollo y generar los archivos compilados. **React Router** permite navegar entre las páginas.

## Requisitos de desarrollo

- **Node.js 24.21.0 LTS:** versión de referencia para el equipo.
- **npm:** gestor de paquetes incluido con Node.js.

Verificar las versiones desde la terminal que se utilizará para trabajar:

```bash
node --version
npm --version
```

Para instalar y seleccionar la versión de Node.js con **nvm** en WSL, Linux o
macOS:

```bash
nvm install 24.21.0
nvm use 24.21.0
nvm alias default 24.21.0
```

## Dependencias

Las dependencias se registran en `package.json` y sus versiones exactas en
`package-lock.json`.

| Dependencia | Tipo | Función |
| --- | --- | --- |
| `react` | Aplicación | Define los componentes de la interfaz. |
| `react-dom` | Aplicación | Renderiza los componentes en el navegador. |
| `react-router` | Aplicación | Gestiona la navegación entre páginas. |
| `vite` | Desarrollo | Ejecuta la interfaz localmente y genera la compilación. |
| `@vitejs/plugin-react` | Desarrollo | Integra React con Vite y habilita la actualización de componentes durante el desarrollo. |

No es necesario instalar estos paquetes individualmente: el
comando `npm ci` instala las dependencias del proyecto usando el archivo de
bloqueo.

## Instalación y ejecución local

1. Clonar el repositorio y entrar en su carpeta:

   ```bash
   git clone https://github.com/GeinerMB/proyecto-C00870-C15464-C25063-C27534.git
   cd proyecto-C00870-C15464-C25063-C27534
   ```

2. Instalar las dependencias desde la raíz, donde se encuentra `package.json`:

   ```bash
   npm ci
   ```

3. Ejecutar la interfaz durante el desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir en el navegador la URL indicada por la terminal, normalmente
   `http://localhost:5173/`. Para detener la ejecución, presionar `Ctrl + C`.

Vite proporciona un servidor local de desarrollo para visualizar la interfaz.
La implementación del servidor multijugador corresponde a una entrega posterior.

## Comandos disponibles

| Comando | Función |
| --- | --- |
| `npm ci` | Instala las dependencias según `package-lock.json`. |
| `npm run dev` | Ejecuta la interfaz con actualización automática al guardar cambios. |
| `npm run build` | Genera la versión compilada en `dist/`. |
| `npm run preview` | Permite revisar localmente la compilación generada con `npm run build`. |

Después de obtener cambios que modifiquen las dependencias, ejecutar nuevamente
`npm ci` antes de continuar trabajando. Para revisar la compilación:

```bash
npm run build
npm run preview
```

## Archivos de dependencias y compilación

- `package.json` y `package-lock.json` deben mantenerse en el repositorio.
- `node_modules/` y `dist/` están incluidos en `.gitignore`.
- `node_modules/` se genera localmente en su computadora mediante `npm ci`.