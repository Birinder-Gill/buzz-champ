<script setup>
import { ref } from 'vue';
import JoinGame from '../components/JoinGame.vue';
import NewGame from '../components/NewGame.vue';

const tab = ref("one");

</script>

<template>
    <v-card width="600">
        <v-card-title>
            Welcome to buzzer champions
        </v-card-title>
        <v-card-text>
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
