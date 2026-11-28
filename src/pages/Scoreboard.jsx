import { useNavigate } from "react-router";
import { getHighScores } from "../js/game/highScores.js";
import "../styles/scoreboard.css";

export default function Scoreboard() {
  const navigate = useNavigate();

  const scores = getHighScores();

  return (
    <section id="scoreboard" aria-labelledby="scoreboard-title">
      <header className="scoreboard-top-bar">
        <button
          type="button"
          className="scoreboard-back-button"
          onClick={() => navigate("/")}
        >
          ◀ Volver
        </button>
        <h1 id="scoreboard-title" className="scoreboard-main-title">Marcadores</h1>
      </header>

      <section className="scoreboard-content">
        <p>Los 5 mejores resultados guardados en este navegador.</p>
        <table className="scoreboard-table">
          <caption className="sr-only">Tabla de mejores puntuaciones</caption>
          <thead>
            <tr>
              <th colSpan="3" scope="col">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((item, index) => (
              <tr key={`${item.attemptId}-${item.playerId}`}>
                <td className="score-rank">{index + 1}.</td>
                <th scope="row" className="score-name">{item.name}</th>
                <td className="score-points">{item.points}</td>
              </tr>
            ))}
            {scores.length === 0 && (
              <tr><td colSpan="3">Todavía no hay puntajes. Completa una partida para registrar tu resultado.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
