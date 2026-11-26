import { roles } from "../js/game/roles.js";

export default function PlayerCard({
  player,
  isCurrentPlayer,
  onRoleChange,
  onControls,
  leaveModalId,
}) {
  const titleId = `${player.id}-title`;
  const roleSelectId = `${player.id}-role`;
  const displayedRole = roles[player.role];

	return (
    <li>
      <article
        aria-labelledby={titleId}
        className={`player-card${isCurrentPlayer ? " player-card-host" : ""}`}
      >
        <h2 id={titleId} className="player-card_name">
          {player.name}
        </h2>

        <figure className="player-ship-preview">
          <img
            className="player-card-ship"
            src={displayedRole.ship}
  					alt={`Nave del rol ${displayedRole.label}`}
            width="96"
            height="96"
          />
        </figure>

        {isCurrentPlayer ? (
          <>
            <div className="player-card-role">
              <label
                className="player-card-role-label"
                htmlFor={roleSelectId}
              >
                Rol
              </label>

              <select
								id={roleSelectId}
								name={roleSelectId}
								className="player-card-role-select"
								value={player.role}
                onChange={(event) => onRoleChange(event.target.value)}
							>
								{Object.entries(roles).map(([value, role]) => (
									<option key={value} value={value}>
										{role.label}
									</option>
								))}
							</select>
            </div>

            <div className="player-card-actions">
              <button
                type="button"
                className="player-card-button"
                onClick={onControls}
              >
                Controles
              </button>

              <button
                type="button"
                className="player-card-button player-card-button-ready"
              >
                Listo
              </button>

              <button
                type="button"
                className="player-card-button player-card-button-abandon"
                command="show-modal"
                commandfor={leaveModalId}
              >
                Abandonar
              </button>
            </div>
          </>
        ) : (
          <div className="player-card-status">
            <p>{player.ready ? "Listo" : "En preparación"}</p>

            <button
              type="button"
              className="player-card-button player-card-button-expel"
            >
              Expulsar
            </button>
          </div>
        )}
      </article>
    </li>
  );
}