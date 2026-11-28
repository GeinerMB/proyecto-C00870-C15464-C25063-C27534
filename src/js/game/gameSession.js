export function createGameSession(player = {}) {
  const id = player.id ?? "player-1";

  return {
    levelId: 1,
    localPlayerId: id,
    players: [{
      id,
      name: player.name ?? "Jugador 1",
      role: player.role ?? "cazador",
      score: 0,
    }],
  };
}

export function getLobbySession(state) {
  if (!["level-complete", "defeat", "victory"].includes(state.phase)) return null;

  const retry = state.phase === "defeat";
  const finished = state.phase === "victory";

  return {
    levelId: finished ? 1 : state.levelId + (retry ? 0 : 1),
    localPlayerId: state.localPlayerId,
    outcome: state.phase,
    players: Array.from(state.players.values(), (player) => ({
      id: player.id,
      name: player.name,
      role: player.role,
      // A retry starts from the checkpoint, so failed attempts cannot farm points.
      score: finished ? 0 : retry
        ? state.session.players.find(({ id }) => id === player.id)?.score ?? 0
        : player.score,
    })),
  };
}
