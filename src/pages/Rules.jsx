import { Link, useNavigate } from "react-router";
import rulesPageImagePlaceholder from "../../assets/rules_page_image_placeholder.png";

export default function Rules() {
  const navigate = useNavigate();

  return (
    <>
      <section id="rules" aria-labelledby="rules">
        <header>
          <h1 id="rules-title">Instrucciones</h1>
        </header>

        <ul id="players-list" aria-label="squad-players">
          <li>
            <article aria-labelledby="controls-title">
              <h2 id="controls-title">Controles</h2>

              <figure>
                <img
                  src={rulesPageImagePlaceholder}
                  alt="Instrucciones"
                />
              </figure>

            </article>
          </li>
          <li>
            <article aria-labelledby="defend-title">
              <h2 id="defend-title">Defender</h2>

              <figure>
                <img
                  src={rulesPageImagePlaceholder}
                  alt="Defender"
                />
              </figure>

            </article>
          </li>
          <li>
            <article aria-labelledby="boss-title">
              <h2 id="boss-title">Derrotar al Jefe</h2>
              <figure>
                <img
                  src={rulesPageImagePlaceholder}
                  alt="Derrotar al jefe"
                />
              </figure>

            </article>
          </li>
          <li>
            <article aria-labelledby="match-end-title">
              <h2 id="match-end-title">Fin de la Partida</h2>

              <figure>
                <img
                  src={rulesPageImagePlaceholder}
                  alt="Fin de la Partida"
                />
              </figure>

            </article>
          </li>
        </ul>

      </section>
      <section id="buttons" aria-labelledby="rules-buttons">
        <button type="button" onClick={() => navigate(-1)}>
          Regresar
        </button>          
      </section>      
    </>
  );
}
