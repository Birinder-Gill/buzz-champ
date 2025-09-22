import { GAMES, ADMIN, MAX_TEAMS, ROUNDS, TEAMS, BUZZED, BUZZED_AT } from "../data/keys";
import { getDatabase } from "firebase/database";
import { app } from "../../firebase-config.js";
import { ref, onValue, off, set, update, serverTimestamp, get } from "firebase/database";
import { reactive } from "vue";

// Global reactive state for admin status
const gameState = reactive({
  isAdmin: false,
  gameId: null,
  teamName: null
});

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

  // Write game under specific key instead of generating a push key
  const gameRef = ref(db, `${GAMES}/${game_id}/${TEAMS}/${teamName}`);

  const newTeam = {
    TEAM_NAME: teamName,
    [BUZZED]: false,
    [BUZZED_AT]: 0
  };
  await set(gameRef, newTeam);

  // Set admin status to false since this user joined an existing game
  gameState.isAdmin = false;
  gameState.gameId = game_id;
  gameState.teamName = teamName;
}

function buzzBuzzer() {
  const db = getDatabase(app);
  const teamRef = ref(db, `${GAMES}/${gameState.gameId}/${TEAMS}/${gameState.teamName}`);
  update(teamRef, {
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

export { createNewGame, setListeners, joinAsTeam, gameState, startGame, finishCountdown, buzzBuzzer }
