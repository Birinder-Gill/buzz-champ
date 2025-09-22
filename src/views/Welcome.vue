<script setup>
import { ref } from 'vue';
import JoinGame from '../components/JoinGame.vue';
import NewGame from '../components/NewGame.vue';

const tab = ref("one");

</script>

<template>
        <v-card width="100%" max-width="600" elevation="4">
            <v-card-title class="text-center py-4">
                <h2 class="text-h5 font-weight-bold">Welcome to buzzer champions</h2>
            </v-card-title>
            <v-card-text class="text-center pb-2">
                Create a new game or join an existing one.
            </v-card-text>
            <v-tabs fixed-tabs v-model="tab">
                <v-tab value="one">Create a game</v-tab>
                <v-tab value="two">Join a game</v-tab>
            </v-tabs>

            <v-card-text>
                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="one">
                        <NewGame />
                    </v-tabs-window-item>

                    <v-tabs-window-item value="two">
                        <JoinGame />
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card-text>
        </v-card>
</template>

<style scoped>

.v-card {
    background-color: #faf5ff;
    /* slightly lighter pink/purple */
}

</style>
