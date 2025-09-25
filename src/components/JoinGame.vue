<template>
    <v-card-text>
        <v-text-field v-model="gameID" label="GAME ID" outlined class="mb-4" :counter="4" :maxlength="4"
            :error-messages="gameIdErrors" @input="onGameIdInput" @blur="validateGameId" :disabled="loading" />
        <v-text-field v-model="teamName" label="Your team name" outlined class="mb-4" :error-messages="teamNameErrors"
            @blur="validateTeamName" @input="validateTeamName" :disabled="loading" />
        <v-alert v-if="error" type="error" class="mb-4" dense>
            {{ error }}
        </v-alert>
    </v-card-text>
    <v-card-actions>
        <v-spacer />
        <FunkyButton :disabled="loading || gameIdErrors.length > 0 || teamNameErrors.length > 0" color="#00796B"
            @click="handleJoin" :text="loading ? 'Joining...' : 'Join game'" />

    </v-card-actions>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { joinAsTeam } from '../state/store.js';
import FunkyButton from './FunkyButton.vue';

const gameID = ref('');
const teamName = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const gameIdErrors = ref([]);
const teamNameErrors = ref([]);

// Normalize and validate Game ID on each input.
function onGameIdInput() {
    let val = gameID.value.toUpperCase().replace(/\s+/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    gameID.value = val;
    validateGameId();
}

// Validation functions.
function validateGameId() {
    gameIdErrors.value = [];
    if (!gameID.value) {
        gameIdErrors.value.push('Game ID is required.');
    } else if (gameID.value.length !== 4) {
        gameIdErrors.value.push('Game ID must be 4 characters.');
    }
}

function validateTeamName() {
    teamNameErrors.value = [];
    if (!teamName.value.trim()) {
        teamNameErrors.value.push('Team name is required.');
    }
}

// Clear server error when user changes inputs.
watch([gameID, teamName], () => {
    if (error.value) error.value = '';
});

async function handleJoin() {
    validateGameId();
    validateTeamName();
    if (gameIdErrors.value.length || teamNameErrors.value.length) return;
    loading.value = true;
    error.value = '';
    try {
        await joinAsTeam(teamName.value.trim(), gameID.value);
        router.push('/game');
    } catch (e) {
        if (e && e.message === "Game not found") {
            error.value = 'Game ID does not exist. Please check and try again.';
        } else {
            error.value = 'Failed to join game. Please check the Game ID and try again.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.join-game-card :deep(.v-card-text) {
    padding-top: var(--space-lg);
}

@media (max-width: 599px) {
    .join-game-card :deep(.v-card-text) {
        padding-top: var(--space-md);
    }
}
</style>