<template>
  <div class="app-card admin-card pa-6 buzzer-card" elevation="0">
    <!-- Exit Icon -->
    <v-btn class="exit-btn" icon size="small" variant="text" aria-label="Exit" @click="showConfirm = true">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <!-- Exit Confirmation Dialog -->
    <v-dialog v-model="showConfirm" width="350">
      <v-card>
        <v-card-title class="text-h6">Exit Game Room?</v-card-title>
        <v-card-text>
          Are you sure you want to exit? You will leave the admin panel.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showConfirm = false">Cancel</v-btn>
          <v-btn color="deep-purple-lighten-2" variant="flat" @click="handleExit">Exit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Game Room Header -->
    <div class="text-center mb-4">
      <h2 class="text-h5 font-weight-bold">{{ admin }}'s Game Room: {{ gameState.gameId }}</h2>
      <p class="text-body-2 text-medium-emphasis">You are the Admin</p>
    </div>

    <!-- Teams in Lobby -->
    <div class="ma-4">
      <v-row class="align-center">
        <v-icon class="mr-2">mdi-account-group</v-icon>
        <span class="font-weight-medium">
          Teams in Lobby ({{ teamCount }})
        </span>
      </v-row>
    </div>

    <!-- Loader if no teams -->
    <v-row v-if="teamCount === 0" class="justify-center mb-4">
      <v-progress-circular indeterminate color="deep-purple-lighten-2" />
    </v-row>

    <!-- Team Card -->
    <div
      v-for="team in teams"
      :key="`${team.TEAM_NAME}-${team.BUZZED}-${team.BUZZED_AT}-${team.SCORE || 0}`"
      class="team-row"
    >
      <TeamCard :team="team" />
      <v-btn
        icon
        size="x-small"
        variant="text"
        class="kick-btn"
        :aria-label="`Kick ${team.TEAM_NAME}`"
        @click="handleKick(team.TEAM_NAME)"
      >
        <v-icon size="18">mdi-logout</v-icon>
      </v-btn>
    </div>

    <!-- Waiting/Start Button or Loader -->
    <div v-if="teams.length && (status === 'game' || status === 'countdown')" class="d-flex flex-column align-center my-4">
      <v-progress-circular indeterminate color="deep-purple-lighten-2" class="mb-2" />
      <span v-if="status === 'countdown'" class="text-medium-emphasis">Getting teams ready</span>
      <span v-if="status === 'game'" class="text-medium-emphasis">Waiting for teams</span>
    </div>
    <v-btn v-else block color="deep-purple-lighten-2" variant="flat" size="large" :disabled="teamCount === 0"
      @click="handleStartGame">
      {{ status === 'complete' ? "Next round" : (teamCount === 0 ? 'Waiting for teams...' : 'Start Game') }}
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import TeamCard from '../components/TeamCard.vue';
import { setListeners, startGame, gameState, finishGame, kickTeam } from '../state/store.js';
import { useRouter } from 'vue-router';

const admin = ref('');
const maxTeams = ref(0);
const status = ref('lobby');
const teams = ref([]);
const router = useRouter();
const showConfirm = ref(false);

function updateLocalGame(data) {
  admin.value = data.ADMIN || '';
  maxTeams.value = data.MAX_TEAMS || 5;
  status.value = data.STATUS || '';
  const teamsObj = data.TEAMS || {};
  const teamsArray = Object.values(teamsObj);

  // Sort teams: buzzed teams first (by BUZZED_AT ascending), then non-buzzed teams
  const sortedTeams = teamsArray.sort((a, b) => {
    const aBuzzed = a.BUZZED === true && a.BUZZED_AT && a.BUZZED_AT !== 0;
    const bBuzzed = b.BUZZED === true && b.BUZZED_AT && b.BUZZED_AT !== 0;

    // If both buzzed, sort by BUZZED_AT (earliest first)
    if (aBuzzed && bBuzzed) {
      return a.BUZZED_AT - b.BUZZED_AT;
    }

    // Buzzed teams come first
    if (aBuzzed && !bBuzzed) return -1;
    if (!aBuzzed && bBuzzed) return 1;

    // Both not buzzed, maintain original order
    return 0;
  });

  // Replace the entire array to trigger reactivity
  teams.value = [...sortedTeams];
}

let removeListener = null;

onMounted(() => {
  removeListener = setListeners(updateLocalGame);
});

onUnmounted(() => {
  if (removeListener) removeListener();
});

const teamCount = computed(() => teams.value.length);

function handleStartGame() {
  if (teamCount.value > 0) {
    startGame();
  }
}

async function handleExit() {
  showConfirm.value = false;
  await finishGame()
  router.replace('/');
}

function handleKick(teamName) {
  if (!teamName) return;
  if (confirm(`Remove team "${teamName}" from the game?`)) {
    // kickTeam should be implemented in store.js to update game state
    kickTeam(teamName);
  }
}
</script>

<style scoped>
.admin-card {
  max-width: 760px;
  width: 100%;
  position: relative;
}

.admin-card :deep(h2) {
  color: var(--color-text-primary);
}

/* Team list container if needed in future */
.teams-scroll {
  max-height: 50vh;
  overflow-y: auto;
  margin-bottom: var(--space-lg);
  padding-right: 4px;
}

/* Exit button positioning */
.exit-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 2;
  color: var(--color-text-primary);
}

.team-row {
  position: relative;
  margin-bottom: 12px;
}

.kick-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  color: var(--color-danger);
  opacity: 0.8;
  transition: opacity 0.15s;
}
.kick-btn:hover {
  opacity: 1;
}

@media (max-width: 599px) {
  .admin-card {
    padding: var(--space-lg) !important;
  }

  .admin-card :deep(h2) {
    font-size: 1.25rem;
  }
}
</style>
