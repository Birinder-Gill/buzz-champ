<template>
    <v-card>
        <v-card-text>
            <v-text-field
                v-model="gameID"
                label="GAME ID"
                outlined
                class="mb-4"
            />
            <v-text-field
                v-model="teamName"
                label="Your team name"
                outlined
                class="mb-4"
            />
            <v-alert
                v-if="error"
                type="error"
                class="mb-4"
                dense
            >
                {{ error }}
            </v-alert>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                color="primary"
                @click="handleJoin"
                :loading="loading"
                :disabled="loading"
            >
                Join game
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { joinAsTeam } from '../state/store.js';

const gameID = ref('');
const teamName = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

async function handleJoin() {
    if (!gameID.value || !teamName.value) return;
    loading.value = true;
    error.value = '';
    try {
        await joinAsTeam(teamName.value, gameID.value);
        router.push('/game');
    } catch (e) {
        error.value = 'Failed to join game. Please check the Game ID and try again.';
    } finally {
        loading.value = false;
    }
}
</script>