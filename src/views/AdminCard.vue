<template>
  <v-container class="fill-height d-flex justify-center align-center" fluid>
    <v-card
      class="pa-6"
      elevation="4"
      max-width="600"
      style="background-color: #faf5ff;"
    >
      <!-- Game Room Header -->
      <div class="text-center mb-4">
        <h2 class="text-h5 font-weight-bold">Game Room: {{ gameState.gameId }}</h2>
        <p class="text-body-2 text-medium-emphasis">You are the Admin</p>
      </div>

      <!-- Teams in Lobby -->
      <div class="mb-4">
        <v-row class="align-center">
          <v-icon class="mr-2">mdi-account-group</v-icon>
          <span class="font-weight-medium">
            Teams in Lobby ({{ teamCount }}/{{ maxTeams }})
          </span>
        </v-row>
      </div>

      <!-- Loader if no teams -->
      <v-row v-if="teamCount === 0" class="justify-center mb-4">
        <v-progress-circular indeterminate color="deep-purple-lighten-2" />
      </v-row>

      <!-- Team Card -->
      <TeamCard 
        v-for="team in teams" 
        :key="`${team.TEAM_NAME}-${team.BUZZED}-${team.BUZZED_AT}-${team.SCORE || 0}`" 
        :team="team" 
      />

      <!-- Waiting/Start Button or Loader -->
      <div v-if="status === 'game' || status === 'countdown'" class="d-flex flex-column align-center my-4">
        <v-progress-circular indeterminate color="deep-purple-lighten-2" class="mb-2" />
        <span v-if="status === 'countdown'" class="text-medium-emphasis">Getting teams ready</span>
        <span v-if="status === 'game'" class="text-medium-emphasis">Waiting for teams</span>
      </div>
      <v-btn
        v-else
        block
        color="deep-purple-lighten-2"
        variant="flat"
        size="large"
        :disabled="teamCount === 0"
        @click="handleStartGame"
      >
        {{status === 'complete'? "Next round": (teamCount === 0 ? 'Waiting for teams...' : 'Start Game') }}
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import TeamCard from '../components/TeamCard.vue';
import { setListeners, startGame, gameState } from '../state/store.js';

const admin = ref('');
const maxTeams = ref(0);
const status = ref('lobby');
const teams = ref([]);

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
</script>

<style scoped>
/* Optional: soft background like in screenshot */
.v-container {
  background: #f3e8ff;
}
</style>
