import { useNavigate } from "react-router";
import "../styles/rules.css";

export default function Rules() {
  const navigate = useNavigate();

  return (
    <>
      <section id="rules" className="rules-section" aria-labelledby="rules-title">
        <header className="rules-header">
          <h1 id="rules-title" className="rules-title">Instrucciones</h1>
        </header>

        <ul id="players-list" className="rules-grid" aria-label="squad-players">
          { /* Cuadro 1: Controles */}
          <li className="rules-item">
            <article className="rules-card" aria-labelledby="controls-title">
              <header className="rules-card-header">
                <h2 id="controls-title" className="rules-card-title">Controles</h2>
              </header>

              <figure className="rules-stage rules-stage-controls">
                <div className="rules-scene rules-scene-controls" aria-hidden="true">
                  <span className="rules-player rules-player-controls" />
                  <span className="rules-bullet rules-bullet-controls" />
                  <span className="rules-thrust rules-thrust-controls" />
                </div>
                <figcaption className="rules-stage-caption">
                  Demostración animada de maniobras de vuelo y disparo
                </figcaption>
              </figure>

              <div className="rules-columns">
                <div className="rules-column">
                  <h3 className="rules-column-heading">Movimiento</h3>
                  <div className="rules-keys-group" aria-label="Teclas de movimiento">
                    <span className="rules-key rules-key-w">W</span>
                    <div className="rules-keys-row">
                      <span className="rules-key rules-key-a">A</span>
                      <span className="rules-key rules-key-s">S</span>
                      <span className="rules-key rules-key-d">D</span>
                    </div>
                  </div>
                  <p className="rules-column-text">
                    Usa las teclas W, A, S, D o flechas direccionales para desplazar tu nave en cualquier dirección.
                  </p>
                </div>

                <div className="rules-column">
                  <h3 className="rules-column-heading">Disparo</h3>
                  <div className="rules-keys-group" aria-label="Tecla de disparo">
                    <span className="rules-key rules-key-space">Espacio</span>
                  </div>
                  <p className="rules-column-text">
                    Presiona la barra espaciadora para disparar.
                  </p>
                </div>
              </div>
            </article>
          </li>

          { /* Cuadro 2: Defender */}
          <li className="rules-item">
            <article className="rules-card" aria-labelledby="defend-title">
              <header className="rules-card-header">
                <h2 id="defend-title" className="rules-card-title">Defender</h2>
              </header>

              <figure className="rules-stage rules-stage-defend">
                <div className="rules-scene rules-scene-defend" aria-hidden="true">
                  <span className="rules-planet-earth" />
                  <span className="rules-player rules-player-defend" />
                  <span className="rules-bullet rules-bullet-defend" />
                  <span className="rules-enemy-scout rules-scout-lead" />
                  <span className="rules-enemy-fighter rules-fighter-support" />
                  <span className="rules-hit-scout" />
                </div>
                <figcaption className="rules-stage-caption">
                  Defensa frente a oleadas de naves enemigas
                </figcaption>
              </figure>

              <div className="rules-columns">
                <div className="rules-column">
                  <h3 className="rules-column-heading">Protege la Tierra</h3>
                  <div className="rules-status-badge rules-status-badge-info">
                    <span aria-hidden="true">🛡</span> Zona Orbital
                  </div>
                  <p className="rules-column-text">
                    El planeta cuenta con una barra de salud. Evita que las naves enemigas impacten el planeta.
                  </p>
                </div>

                <div className="rules-column">
                  <h3 className="rules-column-heading">Repele la Invasión</h3>
                  <div className="rules-status-badge rules-status-badge-amber">
                    <span aria-hidden="true">⚔</span> Escuadrones
                  </div>
                  <p className="rules-column-text">
                    Intercepta naves enemigas para sumar puntos.
                  </p>
                </div>
              </div>
            </article>
          </li>

          { /* Cuadro 3: Derrotar al Jefe */}
          <li className="rules-item">
            <article className="rules-card" aria-labelledby="boss-title">
              <header className="rules-card-header">
                <h2 id="boss-title" className="rules-card-title">Derrotar al Jefe</h2>
              </header>

              <figure className="rules-stage rules-stage-boss">
                <div className="rules-scene rules-scene-boss" aria-hidden="true">
                  <span className="rules-boss-ship" />
                  <span className="rules-boss-laser" />
                  <span className="rules-player rules-player-boss" />
                  <span className="rules-bullet rules-bullet-boss-1" />
                  <span className="rules-bullet rules-bullet-boss-2" />
                  <span className="rules-boss-impact" />
                </div>
                <figcaption className="rules-stage-caption">
                  Enfrentamiento táctico y esquiva de ataques pesados del jefe
                </figcaption>
              </figure>

              <div className="rules-columns">
                <div className="rules-column">
                  <h3 className="rules-column-heading">Aparición</h3>
                  <div className="rules-status-badge rules-status-badge-danger">
                    <span aria-hidden="true">⚠</span> Nave Nodriza
                  </div>
                  <p className="rules-column-text">
                    Al superar las oleadas previas, emerge la nave nodriza fuertemente armada.
                  </p>
                </div>

                <div className="rules-column">
                  <h3 className="rules-column-heading">Táctica de Ataque</h3>
                  <div className="rules-status-badge rules-status-badge-accent">
                    <span aria-hidden="true">🎯</span> Foco de Disparo
                  </div>
                  <p className="rules-column-text">
                    Esquiva oportunamente su rayo devastador y descarga disparos concentrados en sus puntos críticos.
                  </p>
                </div>
              </div>
            </article>
          </li>

          { /* Cuadro 4: Fin de la Partida */}
          <li className="rules-item">
            <article className="rules-card" aria-labelledby="match-end-title">
              <header className="rules-card-header">
                <h2 id="match-end-title" className="rules-card-title">Fin de la Partida</h2>
              </header>

              <figure className="rules-stage rules-stage-end">
                <div className="rules-scene rules-scene-end" aria-hidden="true">
                  <div className="rules-end-half rules-end-defeat">
                    <span className="rules-end-planet-destroyed" />
                    <span className="rules-end-label rules-label-defeat">Derrota</span>
                  </div>
                  <div className="rules-end-separator" />
                  <div className="rules-end-half rules-end-victory">
                    <span className="rules-end-boss-destroyed" />
                    <span className="rules-end-label rules-label-victory">Victoria</span>
                  </div>
                </div>
                <figcaption className="rules-stage-caption">
                  Condiciones finales de derrota y victoria del escuadrón
                </figcaption>
              </figure>

              <div className="rules-columns">
                <div className="rules-column">
                  <h3 className="rules-column-heading">Condición de Derrota</h3>
                  <div className="rules-status-badge rules-status-badge-defeat">
                    <span aria-hidden="true">✖</span> Misión Fallida
                  </div>
                  <p className="rules-column-text">
                    Ocurre si la vida de la Tierra llega a 0 o todas las naves del escuadrón son derribadas.
                  </p>
                </div>

                <div className="rules-column">
                  <h3 className="rules-column-heading">Condición de Victoria</h3>
                  <div className="rules-status-badge rules-status-badge-victory">
                    <span aria-hidden="true">★</span> Victoria Total
                  </div>
                  <p className="rules-column-text">
                    Se alcanza al derrotar y destruir al jefe supremo invasor, salvando a nuestro planeta.
                  </p>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </section>

      <div id="buttons" className="rules-actions">
        <button
          type="button"
          className="rules-back-button"
          onClick={() => navigate(-1)}
        >
          Regresar
        </button>
      </div>
    </>
  );
}
