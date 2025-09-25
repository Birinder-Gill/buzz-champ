<template>
   
        <v-card-text>
            <v-text-field
                v-model="input1"
                label="State your name"
                class="mb-4"
                :maxlength="50"
                :error-messages="nameErrors"
                @input="validateName"
                :disabled="submitting"
            />
            <!-- Max Teams Dropdown
            <v-select
                v-model="maxTeams"
                :items="maxTeamOptions"
                label="Max Teams"
                variant="outlined"
                density="compact"
                class="mb-4 max-teams-select"
                :disabled="submitting"
            /> -->
            
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <FunkyButton :disabled="submitting || nameErrors.length > 0"  @click="handleCreateGame" :text="submitting ? 'Creating...' : 'Create new game'" />
      
        </v-card-actions>
    
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createNewGame } from '../state/store.js'
import FunkyButton from './FunkyButton.vue'

const input1 = ref('')
const nameErrors = ref([])
const submitting = ref(false)
const maxTeams = ref(5) // Default value is 5
const maxTeamOptions = [5, 7, 10, 15, 20]
const router = useRouter()

function validateName() {
    nameErrors.value = []
    const value = input1.value.trim()
    if (!value) {
        nameErrors.value.push('Name is required.')
    } else if (value.length > 50) {
        nameErrors.value.push('Name must be at most 50 characters.')
    }
}

watch(input1, () => {
    validateName()
})

async function handleCreateGame() {
    validateName()
    if (nameErrors.value.length) return
    submitting.value = true
    try {
        await createNewGame(input1.value.trim(), maxTeams.value)
        router.push('/game')
    } catch (e) {
        nameErrors.value = ['Could not create game. Please try again.']
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.new-game-card :deep(.v-card-text) { padding-top: var(--space-lg); }
.max-teams-select :deep(input) { font-size: 0.9rem; }
@media (max-width: 599px) {
    .new-game-card :deep(.v-card-text) { padding-top: var(--space-md); }
}
</style>