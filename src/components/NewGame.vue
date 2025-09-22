<template>
    <v-card  style="background-color: #faf5ff;">
        <v-card-text>
            <v-text-field
                v-model="input1"
                label="State your name"
                outlined
                class="mb-4"
                :maxlength="50"
                :error-messages="nameErrors"
                @input="validateName"
                :disabled="submitting"
            />
            
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                color="deep-purple-lighten-2"
                variant="flat"
                @click="handleCreateGame"
                :disabled="submitting || nameErrors.length > 0"
            >{{ submitting ? 'Creating...' : 'Create new game' }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createNewGame } from '../state/store.js'

const input1 = ref('')
const nameErrors = ref([])
const submitting = ref(false)
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
        await createNewGame(input1.value.trim())
        router.push('/game')
    } catch (e) {
        nameErrors.value = ['Could not create game. Please try again.']
    } finally {
        submitting.value = false
    }
}
</script>