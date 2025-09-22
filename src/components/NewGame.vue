<template>
    <v-card>
        <v-card-text>
            <v-text-field
                v-model="input1"
                label="State your name"
                outlined
                class="mb-4"
            />
            
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="handleCreateGame">Create new game</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createNewGame } from '../state/store.js'

const input1 = ref('')
const router = useRouter()

async function handleCreateGame() {
    await createNewGame(input1.value)
    router.push('/game')
}
</script>