import { useNavigate } from "react-router";
import fighterShip from "../../assets/player/fighter_ship.svg"; // O la ruta de imagen que prefieran usar
import "../styles/aboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Josué Badilla Paredes",
      role: "Frontend",
      bio: "XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Werner Naranjo Navarro",
      role: "Frontend/Backend",
      bio: "XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Alejandro Solano Barboza",
      role: "Frontend/Backend",
      bio: "XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX",
    },
    {
      name: "Geiner Montoya Barrientos",
      role: "Backend",
      bio: "XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXX",
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
