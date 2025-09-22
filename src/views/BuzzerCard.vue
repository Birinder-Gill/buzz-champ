<template>
  <v-container class="fill-height d-flex justify-center align-center" fluid>
    <v-card
      class="pa-6 text-center"
      elevation="4"
      max-width="600"
    >
      <!-- Game Room Header -->
      <div class="mb-6">
        <h2 class="text-h5 font-weight-bold">Game Room: {{ gameState.gameId }}</h2>
        <p class="text-body-2 text-medium-emphasis">You are on Team: {{ gameState.teamName }}</p>
      </div>

      <!-- Big BUZZ -->
      <div class="mb-4">
          <div v-if="status === 'lobby'" class="mb-4">
            <p class="text-body-1 text-medium-emphasis">Waiting for admin to start the game...</p>
        </div>
        <!-- Show countdown when game is in countdown status -->
        <div v-else-if="status === 'countdown' && countdown !== null" class="mb-4">
          <h1 class="text-h1 font-weight-bold text-orange">{{ countdown }}</h1>
          <p class="text-body-1 text-medium-emphasis">Game starting in...</p>
        </div>
        <!-- Show normal BUZZ when not in countdown -->
        <div v-else-if="status === 'game'">
          <h1 class="text-h1 font-weight-bold" style="color: #a020f0;">BUZZ!</h1>
          <p class="text-body-1 text-medium-emphasis">Press the button!</p>
        </div>
      </div>

      <!-- Buzz Button -->
      <v-btn
      v-if="status === 'game'"
        block
        color="deep-purple-accent-2"
        variant="flat"
        size="x-large"
        :disabled="status === 'countdown'"
        @click="handleBuzzClick"
      >
        BUZZ
      </v-btn>
    </v-card>
  </v-container>
</template>



<style scoped>
.v-container {
  background: #fafafa; /* Light neutral background */
}
</style>


<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { setListeners, finishCountdown, buzzBuzzer, gameState } from '../state/store.js';

const admin = ref('');
const maxTeams = ref(0);
const status = ref('lobby');
const teams = ref([]);
const countdown = ref(null);
const countdownStartTime = ref(null);
const countdownDuration = ref(3000); // 3 seconds default

// Timer management
let countdownTimer = null;

function updateLocalGame(data) {
  admin.value = data.ADMIN || '';
  maxTeams.value = data.MAX_TEAMS || 5;
  status.value = data.STATUS || '';
  const teamsObj = data.TEAMS || {};
  const teamsArray = Object.values(teamsObj);
  
  // Sort teams: buzzed teams first (by BUZZED_AT ascending), then non-buzzed teams
  teams.value = teamsArray.sort((a, b) => {
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
  
  // Handle countdown data
  if (data.COUNTDOWN_START) {
    countdownStartTime.value = data.COUNTDOWN_START;
  }
  if (data.COUNTDOWN_DURATION) {
    countdownDuration.value = data.COUNTDOWN_DURATION;
  }
}

function startCountdownTimer(serverStartTime, duration) {
  // Clear any existing timer
  if (countdownTimer) {
    cancelAnimationFrame(countdownTimer);
    countdownTimer = null;
  }

  const updateCountdown = () => {
    const now = Date.now();
    const elapsed = now - serverStartTime;
    const remaining = duration - elapsed;

    if (remaining <= 0) {
      countdown.value = 0;
      // Automatically transition to game start
      finishCountdown();
      return; // Stop the timer
    }

    // Convert to seconds and round up
    countdown.value = Math.ceil(remaining / 1000);

    // Schedule next update
    countdownTimer = requestAnimationFrame(updateCountdown);
  };

  updateCountdown();
}

function stopCountdownTimer() {
  if (countdownTimer) {
    cancelAnimationFrame(countdownTimer);
    countdownTimer = null;
  }
  countdown.value = null;
}



// Watch for status changes to handle countdown
watch([status, countdownStartTime], ([newStatus, newStartTime]) => {
  if (newStatus === "countdown" && newStartTime) {
    startCountdownTimer(newStartTime, countdownDuration.value);
  } else {
    stopCountdownTimer();
  }
}, { immediate: true });

let removeListener = null;

onMounted(() => {
  removeListener = setListeners(updateLocalGame);
});

onUnmounted(() => {
  if (removeListener) removeListener();
  stopCountdownTimer(); // Clean up timer on component unmount
});

const teamCount = computed(() => teams.value.length);

function handleBuzzClick() {
  if (gameState.teamName && gameState.gameId) {
    buzzBuzzer();
  }
}
</script>