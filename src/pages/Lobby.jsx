export default function Lobby() {
  return (
    <>
      <h1 id="title">Prepara tu escuadrón</h1>

      <section aria-labelledby="squad-players">

        <article aria-labelledby="player-one-title">
          <h2 id="player-one-title">Jugador 1</h2>

          <h3>Rol</h3>

          <select
            id="player-one-role"
            name="player-one-role"
          >
            <option value="cazador">Cazador</option>
            <option value="guardian">Guardián</option>
            <option value="especialista">Especialista</option>
          </select>

          <button type="button">
            Controles
          </button>

          <button type="button">
            Listo
          </button>
        </article>
      </section>
    </>
  );
}