import { Link, useNavigate } from "react-router";
import "../styles/scoreboard.css";

export default function Scoreboard() {
  const navigate = useNavigate();

  const scores = [
    { rank: "1.", name: "AAA", points: "9000" },
    { rank: "2.", name: "BBB", points: "8000" },
    { rank: "3.", name: "CCC", points: "7000" },
    { rank: "4.", name: "DDD", points: "6000" },
    { rank: "5.", name: "EEE", points: "5000" },
  ];

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
        <table className="scoreboard-table">
          <caption className="sr-only">Tabla de mejores puntuaciones</caption>
          <thead>
            <tr>
              <th colSpan="3" scope="col">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((item, index) => (
              <tr key={index}>
                <td className="score-rank">{item.rank}</td>
                <th scope="row" className="score-name">{item.name}</th>
                <td className="score-points">{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}