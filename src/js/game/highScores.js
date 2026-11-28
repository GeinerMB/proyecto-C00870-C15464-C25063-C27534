const STORAGE_KEY = "galactic-squadrons.high-scores.v1";
const MAX_SCORES = 5;
let fallback = { scores: [], recordedAttempts: [] };
let storageFailed = false;

function isScore(entry) {
  return entry && typeof entry.attemptId === "string"
    && typeof entry.playerId === "string"
    && typeof entry.name === "string" && entry.name.trim().length > 0
    && Number.isSafeInteger(entry.points) && entry.points >= 0;
}

function readScores() {
  if (storageFailed) return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { scores: [], recordedAttempts: [] };
    const stored = JSON.parse(raw);
    if (!stored || !Array.isArray(stored.scores) || !Array.isArray(stored.recordedAttempts)) {
      return { scores: [], recordedAttempts: [] };
    }

    return {
      scores: stored.scores.filter(isScore).sort((a, b) => b.points - a.points).slice(0, MAX_SCORES),
      recordedAttempts: stored.recordedAttempts.filter((id) => typeof id === "string"),
    };
  } catch (error) {
    if (error instanceof SyntaxError) return { scores: [], recordedAttempts: [] };
    storageFailed = true;
    return fallback;
  }
}

export function getHighScores() {
  return readScores().scores;
}

export function saveHighScores(attemptId, phase, players) {
  if (!["victory", "defeat"].includes(phase)) return true;

  const stored = readScores();
  if (stored.recordedAttempts.includes(attemptId)) return !storageFailed;

  const results = players.map((player) => ({
    attemptId,
    playerId: player.id,
    name: player.name,
    points: player.score,
  })).filter(isScore);

  const next = {
    scores: [...stored.scores, ...results].sort((a, b) => b.points - a.points).slice(0, MAX_SCORES),
    // Remember attempts even when their scores fall outside the top five.
    recordedAttempts: [...stored.recordedAttempts, attemptId],
  };
  fallback = next;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch {
    storageFailed = true;
    return false;
  }
}
