import fighterShip from "../../assets/player/fighter_ship.svg";
import shieldShip from "../../assets/player/shield_ship.svg";
import medicShip from "../../assets/player/medic_ship.svg";

export const DEFAULT_ROLE = "cazador";

export const roles = {
  cazador: { label: "Cazador", ship: fighterShip },
  guardian: { label: "Guardián", ship: shieldShip },
  especialista: { label: "Especialista", ship: medicShip },
};
