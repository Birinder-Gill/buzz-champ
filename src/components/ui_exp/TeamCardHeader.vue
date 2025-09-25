<template>
    <div class="card team-header-card" outlined>
        <p class="title-line">Game Room: {{ gameState.gameId }}</p>
        <p class="subtitle-line">You are on Team: {{ gameState.teamName }} in {{ admin }}'s game</p>
        <div class="exit-btn-container">
            <v-btn flat aria-label="Exit" @click="showConfirm = true">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
    </div>
    <v-dialog v-model="showConfirm" width="350">
        <v-card class="confirm-card">
            <p class="text-h6">Exit Game Room?</p>
            <v-card-text>
                Are you sure you want to exit? You will leave the admin panel.
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="showConfirm = false">Cancel</v-btn>
                <v-btn color="deep-purple-lighten-2" variant="flat" @click="handleExit">Exit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { exitGame } from '../../state/store.js';

// accept props
const { gameState, admin } = defineProps({
    gameState: { type: Object, required: true },
    admin: { type: String, required: true }
});

const showConfirm = ref(false);
async function handleExit() {
    showConfirm.value = false;
    await exitGame();
}
</script>

<style scoped>
.team-header-card {
    position: relative;
    background: #ffffff;
    border: 2px solid #1d1d1d;
    border-radius: 10px;
    padding: 18px 18px 20px;
    box-shadow:
        0 1px 0 #000,
        0 2px 0 #000,
        0 4px 6px rgba(0,0,0,0.18),
        0 8px 14px -2px rgba(0,0,0,0.15);
    overflow: hidden;
    font-family: "Rubik","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
}

.team-header-card::after {
    content: "";
    position: absolute;
    inset: 6px;
    border: 1px dashed #b9b9b9;
    border-radius: 6px;
    pointer-events: none;
    opacity: 0.65;
}

.title-line {
    margin: 0 0 6px;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: 0.6px;
    color: #111;
    text-transform: uppercase;
}

.subtitle-line {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.4px;
    color: #222;
    line-height: 1.25;
}

.exit-btn-container {
    z-index: 2;
    position: absolute;
    top: 6px;
    right: 6px;
}

.exit-btn-container .v-btn {
    background: #fff;
    border: 1px solid #1d1d1d;
    min-width: 34px;
    height: 34px;
    border-radius: 60px;
    box-shadow: 0 2px 0 #000;
    transition: transform 80ms, box-shadow 140ms;
    color: #111;
}

.exit-btn-container .v-btn:hover {
    transform: translate(-1px,-1px);
    box-shadow: 2px 3px 0 #000;
}

.exit-btn-container .v-btn:active {
    transform: translate(0,0);
    box-shadow: 0 1px 0 #000;
}

.v-dialog .v-card {
    border: 2px solid #1d1d1d;
    border-radius: 10px;
    box-shadow:
        0 1px 0 #000,
        0 3px 8px rgba(0,0,0,0.25);
    font-family: "Rubik","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
}

.v-dialog .text-h6,
.v-dialog .v-card-text {
    color: #111;
}

.v-dialog .text-h6 {
    font-weight: 700;
    letter-spacing: 0.5px;
}

.v-dialog .v-card-text {
    font-size: 0.85rem;
    line-height: 1.3;
}

/* Enhanced confirm dialog card */
.confirm-card {
    position: relative;
    background: linear-gradient(135deg,#ffffff 0%,#fbfbff 55%,#f2efff 100%);
    border: 2px solid #1d1d1d;
    border-radius: 14px;
    padding: 16px 20px 18px;
    box-shadow:
        0 2px 0 #000,
        0 4px 0 #000,
        0 6px 4px rgba(0,0,0,0.25),
        0 12px 18px -4px rgba(0,0,0,0.32),
        0 24px 42px -12px rgba(0,0,0,0.28);
    transform: rotate(-0.6deg);
    overflow: hidden;
    transition:
        transform .5s cubic-bezier(.22,.99,.36,1.21),
        box-shadow .6s cubic-bezier(.22,.99,.36,1.21);
}

.confirm-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid #1d1d1d;
    border-radius: 18px;
    clip-path: polygon(0 7%,3% 0,97% 0,100% 10%,100% 93%,97% 100%,5% 100%,0 90%);
    pointer-events: none;
    mix-blend-mode: multiply;
    opacity: .55;
    filter: drop-shadow(0 2px 0 #000);
    transition: transform .6s ease;
}

.confirm-card::after {
    content: "";
    position: absolute;
    inset: 10px;
    border: 1px dashed #b8b8b8;
    border-radius: 10px;
    pointer-events: none;
    opacity: .7;
    transition: opacity .4s ease;
}

.confirm-card:hover {
    transform: rotate(0.25deg) translateY(-6px) scale(1.012);
    box-shadow:
        0 3px 0 #000,
        0 6px 0 #000,
        0 10px 6px rgba(0,0,0,0.30),
        0 18px 28px -4px rgba(0,0,0,0.40),
        0 36px 60px -14px rgba(0,0,0,0.30);
}

.confirm-card:active {
    transform: rotate(0deg) translateY(-2px) scale(1.004);
    box-shadow:
        0 2px 0 #000,
        0 4px 0 #000,
        0 8px 10px rgba(0,0,0,0.30),
        0 18px 30px -10px rgba(0,0,0,0.34);
}

.confirm-card:hover::before {
    transform: translate(1px,-1px) rotate(.3deg);
}

.confirm-card:hover::after {
    opacity: .9;
}

.confirm-card .text-h6 {
    margin: 0 0 4px;
    font-weight: 800;
    letter-spacing: .6px;
    text-transform: uppercase;
}

.confirm-card .v-card-text {
    font-size: .82rem;
    line-height: 1.25;
    margin-bottom: 4px;
    color: #222;
}

.confirm-card .v-card-actions {
    padding-top: 4px;
    gap: 6px;
}

.confirm-card .v-btn {
    text-transform: none;
    font-weight: 600;
    letter-spacing: .3px;
    border: 1px solid #1d1d1d;
    border-radius: 50px;
    box-shadow: 0 2px 0 #000;
    transition: transform .18s ease, box-shadow .22s ease, background-color .25s;
}

.confirm-card .v-btn:hover {
    transform: translate(-1px,-1px);
    box-shadow: 2px 3px 0 #000;
}

.confirm-card .v-btn:active {
    transform: translate(0,0);
    box-shadow: 0 1px 0 #000;
}

.confirm-card .v-btn[color] {
    /* keep brand color but ensure readable text */
    color: #fff;
}

/* Dial back default generic dialog card styling to avoid conflict */
.v-dialog .v-card:not(.confirm-card) {
    /* ...existing code (unchanged for other cards)... */
}
</style>
