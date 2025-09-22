<template>
          
    <v-card class="app-card buzzer-card pa-6" elevation="0">
         <v-card-text>
               <!-- Game Room Header -->
            <div class="mb-6">
                <h2 class="text-h5 font-weight-bold">Game Room: {{ gameState.gameId }}</h2>
                <p class="text-body-2 text-medium-emphasis">You are on Team: {{ gameState.teamName }}</p>
            </div>


            <!-- Big BUZZ -->
            <div v-if="!(currentTeam?.BUZZED)" class="mb-4">
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
                    <h1 class="text-h1 font-weight-bold buzz-heading">BUZZ!</h1>
                    <p class="text-body-1 text-medium-emphasis">Press the button!</p>
                </div>
            </div>
            <!-- Buzz Button -->
            <div v-if="currentTeam?.BUZZED" class="text-center mb-4">
                <v-icon size="80" color="success" class="mb-2">mdi-check-circle</v-icon>
                <h1 class="text-h3 font-weight-bold text-success mb-2">BUZZED!</h1>
                <p class="text-body-1 text-medium-emphasis">You pressed the buzzer</p>
            </div>
            <v-btn v-else-if="status === 'game'" block color="deep-purple-accent-2" variant="flat" size="x-large"
                :disabled="status === 'countdown'" @click="handleBuzzClick">
                BUZZ
            </v-btn>
         </v-card-text>
        </v-card>
</template>



<style scoped>
.buzzer-card { max-width: 640px; width: 100%; }
@media (max-width: 599px) {
    .buzzer-card { padding: var(--space-lg) !important; }
    .buzzer-card :deep(.text-h1) { font-size: 2.4rem; }
}
</style>


<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { setListeners, finishCountdown, buzzBuzzer, gameState } from '../state/store.js';

const admin = ref('');
const maxTeams = ref(0);
const status = ref('lobby');
const currentTeam = ref(null); // holds only this client's team object
const countdown = ref(null);
const countdownStartTime = ref(null);
const countdownDuration = ref(3000); // 3 seconds default

// Timer management
let countdownTimer = null;

function updateLocalGame(data) {
    admin.value = data.ADMIN || '';
    maxTeams.value = data.MAX_TEAMS || 5;
    status.value = data.STATUS || '';
    // NEW: extract only this team's object
    if (gameState.teamName && data.TEAMS) {
        currentTeam.value = data.TEAMS[gameState.teamName] || null;
    } else {
        currentTeam.value = null;
    }

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

function handleKeyDown(event) {
    if (event.code === 'Space' && status.value === 'game') {
        event.preventDefault(); // Prevent page scroll
        handleBuzzClick();
    }
}

onMounted(() => {
    removeListener = setListeners(updateLocalGame);
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    if (removeListener) removeListener();
    stopCountdownTimer(); // Clean up timer on component unmount
    window.removeEventListener('keydown', handleKeyDown);
});

function handleBuzzClick() {
    if (gameState.teamName && gameState.gameId) {
        buzzBuzzer();
    }
}
</script>