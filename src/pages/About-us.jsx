import { useNavigate } from "react-router";
import fighterShip from "../assets/player/fighter_ship.svg"; // O la ruta de imagen que prefieran usar
import "../styles/aboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Josué Badilla Paredes",
      role: "Servidor / Comunicación",
      bio: "Encargado del desarrollo del servidor y de la comunicación entre los jugadores y el juego.",
    },
    {
      name: "Werner Naranjo Navarro",
      role: "Cliente / Lógica de Juego",
      bio: "Encargado del desarrollo del cliente y de implementar la lógica de juego.",
    },
    {
      name: "Alejandro Solano Barboza",
      role: "Diseño / QA / Coordinación",
      bio: "Encargado del diseño, las pruebas de calidad y la coordinación del proyecto.",
    },
    {
      name: "Geiner Montoya Barrientos",
      role: "Frontend / Maquetado",
      bio: "Encargado del desarrollo frontend y del maquetado de la interfaz.",
    },
  ];

  return (
    <section className="about-container" id="about-us" aria-labelledby="about-us-title">
      <header className="about-top-bar">
        <button
          type="button"
          className="about-back-button"
          onClick={() => navigate("/")}
        >
          ◀ Volver
        </button>
        <h1 id="about-us-title" className="about-main-title">Quiénes somos</h1>
      </header>

      <section aria-labelledby="about-team-title">
        <h2 id="about-team-title" className="sr-only">Integrantes del proyecto</h2>
        
        <ul className="team-list">
          {teamMembers.map((member, index) => (
            <li key={index}>
              <article className="team-card" aria-labelledby={`member-${index}-title`}>
                <h3 id={`member-${index}-title`} className="team-card_name">
                  {member.name}
                </h3>

                <figure className="team-ship-preview">
                  <img
                    className="team-card-ship"
                    src={fighterShip}
                    alt={`Avatar de ${member.name}`}
                    width="96"
                    height="96"
                  />
                </figure>

                <div className="team-card-role">
                  <div className="team-card-role-value">{member.role}</div>
                </div>

                <div className="team-card-bio">
                  <span className="team-card-bio-label">Sobre mí</span>
                  <p>{member.bio}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
