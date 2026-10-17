import { Link } from "react-router";

export default function Scoreboard() {
  return (
    <section id="scoreboard" aria-labelledby="scoreboard-title">
      <header>
        <h1 id="scoreboard-title">Marcadores</h1>
        <p>Los mejores puntajes de Galactic Squadrons.</p>
      </header>

      <table>
        <caption>Clasificación de ejemplo: cinco mejores puntajes</caption>
        <thead>
          <tr>
            <th scope="col">Posición</th>
            <th scope="col">Jugador</th>
            <th scope="col">Puntos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <th scope="row">AAA</th>
            <td>9000</td>
          </tr>
          <tr>
            <td>2</td>
            <th scope="row">BBB</th>
            <td>8000</td>
          </tr>
          <tr>
            <td>3</td>
            <th scope="row">CCC</th>
            <td>7000</td>
          </tr>
          <tr>
            <td>4</td>
            <th scope="row">DDD</th>
            <td>6000</td>
          </tr>
          <tr>
            <td>5</td>
            <th scope="row">EEE</th>
            <td>5000</td>
          </tr>
        </tbody>
      </table>

      <footer>
        <Link to="/">Volver al inicio</Link>
      </footer>
    </section>
  );
}
