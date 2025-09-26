import { GAMES, ADMIN, MAX_TEAMS, ROUNDS, TEAMS, BUZZED, BUZZED_AT } from "../data/keys";
import { getDatabase } from "firebase/database";
import { app } from "../../firebase-config.js";
import { ref, onValue, off, set, update, serverTimestamp, get, child } from "firebase/database";
import { reactive, watch } from "vue";

// Persisted storage key for session-scoped state (survives reloads, not tab closes)
const STORAGE_KEY = "buzzChamp.gameState.v1";

function loadPersistedState() {
  try {
    if (typeof window === "undefined") return null;

    // Prefer sessionStorage for per-tab persistence across reloads
    let raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    // One-time migration: if older localStorage exists, move it to sessionStorage
    const legacy = localStorage.getItem(STORAGE_KEY);
    if (legacy) {
      sessionStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(STORAGE_KEY);
      return JSON.parse(legacy);
    }
    return null;
  } catch (_) {
    return null;
  }
}

const persisted = loadPersistedState();

// Global reactive state for admin status (rehydrated from localStorage if available)
const gameState = reactive({
  isAdmin: persisted?.isAdmin ?? false,
  gameId: persisted?.gameId ?? null,
  teamName: persisted?.teamName ?? null
});

// Persist to sessionStorage whenever gameState changes
if (typeof window !== "undefined") {
  watch(
    gameState,
    (s) => {
      try {
        const payload = JSON.stringify({
          isAdmin: s.isAdmin,
          gameId: s.gameId,
          teamName: s.teamName
        });
        sessionStorage.setItem(STORAGE_KEY, payload);
      } catch (_) {
        // noop - best-effort persistence
      }
    },
    { deep: true }
  );
}

function getGameId() {
  // Create a random 4 digit hex code
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
}

async function createNewGame(name, max_teams = 5) {
  const id = getGameId();
  const db = getDatabase(app);

  // Write game under specific key instead of generating a push key
  const newGameRef = ref(db, `${GAMES}/${id}`);

  const newGame = {
    id, // matches the explicit key
    ADMIN: name,
    MAX_TEAMS: max_teams,
    TEAMS: {},
    STATUS: "lobby"
  };
  await set(newGameRef, newGame);

  // Set admin status since this user created the game
  gameState.isAdmin = true;
  gameState.gameId = id;
  gameState.teamName = null; // Admin has no team name
}

async function joinAsTeam(teamName, game_id) {
  const db = getDatabase(app);

  // Check if the game exists
  const gameRef = ref(db, `${GAMES}/${game_id}`);
  const gameSnap = await get(gameRef);
  if (!gameSnap.exists()) {
    throw new Error("Game not found");
  }

  // Write game under specific key instead of generating a push key
  const teamRef = ref(db, `${GAMES}/${game_id}/${TEAMS}/${teamName}`);
  // var counter = 1;
  // // Ensure unique team name by appending a number if necessary
  // while (true) {
  //   const teamSnap = await get(teamRef);
  //   if (!teamSnap.exists()) break;
  //   // If the team name is taken, append a counter
  //   teamName = `${teamName} (${counter})`;
  //   counter++;
  // }
  const newTeam = {
    TEAM_NAME: teamName,
    [BUZZED]: false,
    [BUZZED_AT]: 0
  };
  await set(teamRef, newTeam);

  // Set admin status to false since this user joined an existing game
  gameState.isAdmin = false;
  gameState.gameId = game_id;
  gameState.teamName = teamName;
}

async function finishGame() {
  const db = getDatabase(app);
  const gameRef = ref(db, `${GAMES}/${gameState.gameId}`);

  await update(gameRef, {
    STATUS: "terminated"
  });

  clearGameState();
}

async function exitGame() {
  const db = getDatabase(app);
 const teamRef = ref(db, `${GAMES}/${gameState.gameId}/${TEAMS}/${gameState.teamName}`);

  await set(teamRef, null); // Remove the team entry
  clearGameState();
}

function clearGameState() {
  gameState.isAdmin = false;
  gameState.gameId = null;
  gameState.teamName = null;  
}

async function kickTeam(teamName) {
  const db = getDatabase(app);
  const teamRef = ref(db, `${GAMES}/${gameState.gameId}/${TEAMS}/${teamName}`);

  await set(teamRef, null); // Remove the team entry
}


async function buzzBuzzer() {
  const db = getDatabase(app);
  const teamRef = ref(db, `${GAMES}/${gameState.gameId}/${TEAMS}/${gameState.teamName}`);
  await update(teamRef, {
    [BUZZED]: true,
    [BUZZED_AT]: serverTimestamp()
  });
}

async function startGame() {
  const db = getDatabase(app);
  const gameId = gameState.gameId;
  const teamsRef = ref(db, `${GAMES}/${gameId}/${TEAMS}`);
  const teamsSnap = await get(teamsRef);

  // Build a multi-path update to reset all teams' buzz state and set countdown
  const updates = {};
  if (teamsSnap.exists()) {
    const teamsData = teamsSnap.val();
    Object.keys(teamsData).forEach(teamKey => {
      updates[`${GAMES}/${gameId}/${TEAMS}/${teamKey}/${BUZZED}`] = false;
      updates[`${GAMES}/${gameId}/${TEAMS}/${teamKey}/${BUZZED_AT}`] = 0;
    });
  }
  updates[`${GAMES}/${gameId}/STATUS`] = "countdown";
  updates[`${GAMES}/${gameId}/COUNTDOWN_START`] = serverTimestamp();
  updates[`${GAMES}/${gameId}/COUNTDOWN_DURATION`] = 3000;

  await update(ref(db), updates);
}

// Function to transition from countdown to game start
async function finishCountdown() {
  const db = getDatabase(app);
  const gameRef = ref(db, `${GAMES}/${gameState.gameId}`);

  await update(gameRef, {
    STATUS: "game",
    COUNTDOWN_START: null,
    COUNTDOWN_DURATION: null
  });
}

function setListeners(updateLocalGame) {
  const db = getDatabase(app);
  const gameRef = ref(db, `${GAMES}/${gameState.gameId}`);

  onValue(gameRef, async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      updateLocalGame(data);
      if(data.STATUS === "terminated") {
        clearGameState();
      }
      // Check if status is "game" and all teams have BUZZED === true
      if (data.STATUS === "game" && data.TEAMS) {
        const teamsArr = Object.values(data.TEAMS);
        if (
          teamsArr.length > 0 &&
          teamsArr.every(team => team.BUZZED === true)
        ) {
          // Update status to "complete"
          await update(gameRef, { STATUS: "complete" });
        }
      }
    }
  });

  return () => off(gameRef);
}

export { createNewGame, setListeners, joinAsTeam, gameState, startGame, finishCountdown, buzzBuzzer, finishGame, exitGame, kickTeam, clearGameState };
