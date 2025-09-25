<template>
    <div class="card">
        <!-- Decorative layers -->
        <div class="card-pattern-grid"></div>
        <div class="card-overlay-dots"></div>
        <div class="bold-pattern">
            <svg viewBox="0 0 100 100">
                <path stroke-dasharray="15 10" stroke-width="10" stroke="#000" fill="none"
                    d="M0,0 L100,0 L100,100 L0,100 Z" />
            </svg>
        </div>

        <!-- Exit button -->
        <button class="exit-btn" aria-label="Exit" @click="handleExit">×</button>

        <!-- Header -->
        <div class="card-title-area">
            <span v-if="admin">{{ admin }}'s Game</span>
            <span v-else>Game Room</span>
            <span class="card-tag">Teams in Lobby: {{ teamCount }}</span>
        </div>

        <!-- Body -->
        <div class="card-body">
            <!-- Loading indicator when no teams yet -->
            <div v-if="teamCount === 0" class="empty-loader">
                <div class="spinner" />
                <p class="waiting-text">Waiting for teams...</p>
            </div>

            <!-- Teams list -->
            <div v-else class="teams-wrapper">
                <div v-for="team in teams"
                    :key="`${team.TEAM_NAME}-${team.BUZZED}-${team.BUZZED_AT}-${team.SCORE || 0}`" class="team-row"
                    :class="{ buzzed: team.BUZZED }">
                    <!-- Updated: pass team prop & listen for kick -->
                    <TeamCardNew :team="team" @kick="handleKick(team.TEAM_NAME)" />
                </div>
            </div>

            <!-- Actions -->
            <div class="card-actions">
                <div class="room-info">
                    <div class="room-id">Room ID: <span>{{ gameState.gameId }}</span></div>
                    <div class="room-note" v-if="status === 'lobby'">Share it with your teams.</div>
                    <div class="room-note" v-else-if="status === 'countdown'">Getting teams ready…</div>
                    <div class="room-note" v-else-if="status === 'game'">Waiting for all teams to buzz…</div>
                    <div class="room-note" v-else-if="status === 'complete'">Round complete!</div>
                </div>


                <!-- Waiting/Start Button or Loader -->
                <div v-if="teams.length && (status === 'game' || status === 'countdown')"
                    class="d-flex flex-column align-center my-4">
                    <v-progress-circular indeterminate color="deep-purple-lighten-2" class="mb-2" />
                    <span v-if="status === 'countdown'" class="text-medium-emphasis">Getting teams ready</span>
                    <span v-if="status === 'game'" class="text-medium-emphasis">Waiting for teams</span>
                </div>
                <button v-else class="card-button"
                    :disabled="teamCount === 0" @click="handleStartGame">
                    {{ status === 'complete' ? 'Next Round' : (teamCount === 0 ? 'Waiting...' : 'Start Game') }}
                </button>
            </div>
        </div>

        <!-- Decorative shapes -->
        <div class="dots-pattern">
            <svg viewBox="0 0 80 40">
                <circle fill="#000" r="3" cy="10" cx="10" />
                <circle fill="#000" r="3" cy="10" cx="30" />
                <circle fill="#000" r="3" cy="10" cx="50" />
                <circle fill="#000" r="3" cy="10" cx="70" />
                <circle fill="#000" r="3" cy="20" cx="20" />
                <circle fill="#000" r="3" cy="20" cx="40" />
                <circle fill="#000" r="3" cy="20" cx="60" />
                <circle fill="#000" r="3" cy="30" cx="10" />
                <circle fill="#000" r="3" cy="30" cx="30" />
                <circle fill="#000" r="3" cy="30" cx="50" />
                <circle fill="#000" r="3" cy="30" cx="70" />
            </svg>
        </div>
        <div class="accent-shape"></div>
        <div class="corner-slice"></div>
        <div class="stamp"><span class="stamp-text">Buzz</span></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import TeamCardNew from './TeamCardNew.vue';
import { setListeners, startGame, gameState, finishGame, kickTeam } from '../../state/store.js';
import { useRouter } from 'vue-router';

const admin = ref('');
const maxTeams = ref(0);
const status = ref('lobby');
const teams = ref([]);
const router = useRouter();

function updateLocalGame(data) {
    admin.value = data.ADMIN || '';
    maxTeams.value = data.MAX_TEAMS || 5;
    status.value = data.STATUS || '';
    const teamsObj = data.TEAMS || {};
    const teamsArray = Object.values(teamsObj);

    const sortedTeams = teamsArray.sort((a, b) => {
        const aBuzzed = a.BUZZED === true && a.BUZZED_AT && a.BUZZED_AT !== 0;
        const bBuzzed = b.BUZZED === true && b.BUZZED_AT && b.BUZZED_AT !== 0;
        if (aBuzzed && bBuzzed) return a.BUZZED_AT - b.BUZZED_AT;
        if (aBuzzed && !bBuzzed) return -1;
        if (!aBuzzed && bBuzzed) return 1;
        return 0;
    });

    // Added: assign BUZZ_ORDER to buzzed teams
    let buzzPos = 1;
    const withOrder = sortedTeams.map(t => {
        const isBuzzed = t.BUZZED === true && t.BUZZED_AT && t.BUZZED_AT !== 0;
        return {
            ...t,
            BUZZ_ORDER: isBuzzed ? buzzPos++ : null
        };
    });

    teams.value = [...withOrder];
}

let removeListener = null;
onMounted(() => {
    removeListener = setListeners(updateLocalGame);
});
onUnmounted(() => {
    if (removeListener) removeListener();
});

const teamCount = computed(() => teams.value.length);

function handleStartGame() {
    if (teamCount.value > 0) startGame();
}

async function handleExit() {
    if (confirm('Exit Game Room?\nYou will leave the admin panel.')) {
        await finishGame();
        router.replace('/');
    }
}

function handleKick(teamName) {
    if (!teamName) return;
    if (confirm(`Remove team "${teamName}" from the game?`)) {
        kickTeam(teamName);
    }
}
</script>

<style>
.card {
    --primary: #ff3e00;
    --primary-hover: #ff6d43;
    --secondary: #4d61ff;
    --secondary-hover: #5e70ff;
    --accent: #00e0b0;
    --text: #050505;
    --bg: #ffffff;
    --shadow-color: #000000;
    --pattern-color: #cfcfcf;
    position: relative;
    width: 600px;
    background: var(--bg);
    border: 0.35em solid var(--text);
    border-radius: 0.6em;
    box-shadow:
        0.7em 0.7em 0 var(--shadow-color),
        inset 0 0 0 0.15em rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    overflow: hidden;
    font-family: ui-sans-serif, system-ui, sans-serif;
    transform-origin: center;
}

/* Exit button */
.exit-btn {
    position: absolute;
    top: 0.4em;
    right: 0.4em;
    background: transparent;
    border: 0.15em solid var(--text);
    width: 2em;
    height: 2em;
    border-radius: 50%;
    font-size: 1.1em;
    font-weight: 700;
    cursor: pointer;
    z-index: 5;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0.25em 0.25em 0 var(--shadow-color);
}

.exit-btn:hover {
    background: var(--accent);
}

.empty-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5em;
    padding: 1.5em 0;
}

.spinner {
    width: 28px;
    height: 28px;
    border: 4px solid rgba(0, 0, 0, .15);
    border-top-color: var(--secondary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.mini-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(0, 0, 0, .2);
    border-top-color: var(--secondary);
    border-radius: 50%;
    animation: spin .7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.teams-wrapper {
    display: flex;
    flex-direction: column;
}

.team-row {
    position: relative;
    margin-bottom: 0.75em;
    padding: 0.25em 0 0.25em 0;
}

.team-row.buzzed {
    filter: hue-rotate(80deg) brightness(1.05);
}

.kick-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #fff;
    border: 1px solid #000;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.kick-btn:hover {
    background: var(--accent);
}

.team-meta {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0 0.75em;
    pointer-events: none;
    font-size: 0.8em;
    font-weight: 600;
    color: #222;
}

.team-name {
    background: rgba(255, 255, 255, .85);
    padding: 0.15em 0.5em;
    border-radius: 4px;
}

.team-status {
    background: #ddd;
    padding: 0.15em 0.5em;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: .05em;
}

.team-status.active {
    background: var(--accent);
}

.progress-wrap {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Modal */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

.modal {
    background: #fff;
    border: 0.3em solid #000;
    border-radius: 0.6em;
    padding: 1.5em;
    width: clamp(280px, 90%, 340px);
    box-shadow: 0.6em 0.6em 0 #000;
}

.modal h3 {
    margin: 0 0 .5em;
    font-size: 1.15em;
}

.modal p {
    margin: 0 0 1.25em;
    font-size: 0.85em;
    line-height: 1.4;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75em;
}

.btn-text {
    background: transparent;
    border: none;
    font-weight: 600;
    cursor: pointer;
}

.btn-danger {
    background: #000000;
    color: #fff;
    border: 0.15em solid #000;
    padding: 0.5em 1.1em;
    font-weight: 700;
    border-radius: 0.4em;
    cursor: pointer;
    box-shadow: 0.25em 0.25em 0 #000;
}

.btn-danger:hover {
    background: var(--secondary-hover);
}

@media (max-width: 680px) {
    .card {
        width: 100%;
    }
}

.card:hover {
    transform: translate(-0.4em, -0.4em) scale(1.02);
    box-shadow: 1em 1em 0 var(--shadow-color);
}

.card:hover .card-pattern-grid,
.card:hover .card-overlay-dots {
    opacity: 1;
}

.card:active {}

.card::before {
    content: "";
    position: absolute;
    top: -1em;
    right: -1em;
    width: 4em;
    height: 4em;
    background: var(--accent);
    transform: rotate(45deg);
    z-index: 1;
}

.card::after {
    content: "★";
    position: absolute;
    top: 0.4em;
    right: 0.4em;
    color: var(--text);
    font-size: 1.2em;
    font-weight: bold;
    z-index: 2;
}

.card-pattern-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to right,
            rgba(0, 0, 0, 0.05) 1px,
            transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 0.5em 0.5em;
    pointer-events: none;
    opacity: 0.5;
    transition: opacity 0.4s ease;
    z-index: 1;
}

.card-overlay-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(var(--pattern-color) 1px, transparent 1px);
    background-size: 1em 1em;
    background-position: -0.5em -0.5em;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
}

.bold-pattern {
    position: absolute;
    top: 0;
    right: 0;
    width: 6em;
    height: 6em;
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
}

.card-title-area {
    position: relative;
    padding: 1em;
    background: var(--color-text-secondary);
    color: var(--bg);
    font-weight: 800;
    font-size: 1.2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.35em solid var(--text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    z-index: 2;
    overflow: hidden;
}

.card-title-area::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(45deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 0.5em,
            transparent 0.5em,
            transparent 1em);
    pointer-events: none;
    opacity: 0.3;
}

.card-tag {
    background: var(--bg);
    color: var(--text);
    font-size: 0.6em;
    font-weight: 800;
    padding: 0.4em 0.8em;
    border: 0.15em solid var(--text);
    border-radius: 0.3em;
    box-shadow: 0.2em 0.2em 0 rgba(0, 0, 0, 0.2);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transform: rotate(3deg);
    transition: all 0.3s ease;
}

.card:hover .card-tag {
    transform: rotate(-2deg) scale(1.1);
    box-shadow: 0.25em 0.25em 0 rgba(0, 0, 0, 0.2);
}

.card-body {
    position: relative;
    padding: 1.5em;
    z-index: 2;
}

.card-description {
    margin-bottom: 1.5em;
    color: var(--text);
    font-size: 0.95em;
    line-height: 1.4;
    font-weight: 500;
}

.feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
    margin-bottom: 1.5em;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 0.6em;
    transition: transform 0.2s ease;
}

.feature-item:hover {
    transform: translateX(0.3em);
}

.feature-icon {
    width: 1.4em;
    height: 1.4em;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary);
    border: 0.12em solid var(--text);
    border-radius: 0.3em;
    box-shadow: 0.2em 0.2em 0 rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.feature-item:hover .feature-icon {
    background: var(--secondary-hover);
    transform: rotate(-5deg);
}

.feature-icon svg {
    width: 0.9em;
    height: 0.9em;
    fill: var(--bg);
}

.feature-text {
    font-size: 0.85em;
    font-weight: 600;
    color: var(--text);
}

.card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5em;
    padding-top: 1.2em;
    border-top: 0.15em dashed rgba(0, 0, 0, 0.15);
    position: relative;
}

.card-actions::before {
    content: "✂";
    position: absolute;
    top: -0.8em;
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
    background: var(--bg);
    padding: 0 0.5em;
    font-size: 1em;
    color: rgba(0, 0, 0, 0.4);
}

.room-info {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    max-width: 60%;
}

.room-id {
    font-size: 1.4em;
    font-weight: 800;
    letter-spacing: 0.05em;
    line-height: 1.1;
}

.room-id span {
    background: var(--accent);
    padding: 0 0.35em;
    border-radius: 0.25em;
    box-shadow: inset 0 -0.25em 0 rgba(0, 0, 0, 0.15);
}

.room-note {
    font-size: 0.65em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.75;
    line-height: 1.2;
}

.price {
    position: relative;
    font-size: 1.8em;
    font-weight: 800;
    color: var(--text);
    background: var(--bg);
}

.price::before {
    content: "";
    position: absolute;
    bottom: 0.15em;
    left: 0;
    width: 100%;
    height: 0.2em;
    background: var(--accent);
    z-index: -1;
    opacity: 0.5;
}

.price-currency {
    font-size: 0.6em;
    font-weight: 700;
    vertical-align: top;
    margin-right: 0.1em;
}

.price-period {
    display: block;
    font-size: 0.4em;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 0.2em;
}

.card-button {
    position: relative;
    background: var(--secondary);
    color: var(--bg);
    font-size: 0.9em;
    font-weight: 700;
    padding: 0.7em 1.2em;
    border: 0.2em solid var(--text);
    border-radius: 0.4em;
    box-shadow: 0.3em 0.3em 0 var(--shadow-color);
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.card-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%);
    transition: left 0.6s ease;
}

.card-button:hover {
    background: var(--secondary-hover);
    transform: translate(-0.1em, -0.1em);
    box-shadow: 0.4em 0.4em 0 var(--shadow-color);
}

.card-button:hover::before {
    left: 100%;
}

.card-button:active {
    transform: translate(0.1em, 0.1em);
    box-shadow: 0.15em 0.15em 0 var(--shadow-color);
}

.dots-pattern {
    position: absolute;
    bottom: 2em;
    left: -2em;
    width: 8em;
    height: 4em;
    opacity: 0.3;
    transform: rotate(-10deg);
    pointer-events: none;
    z-index: 1;
}

.accent-shape {
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    background: var(--secondary);
    border: 0.15em solid var(--text);
    border-radius: 0.3em;
    transform: rotate(45deg);
    bottom: -1.2em;
    right: 2em;
    z-index: 0;
    transition: transform 0.3s ease;
}

.card:hover .accent-shape {
    transform: rotate(55deg) scale(1.1);
}

.stamp {
    position: absolute;
    bottom: 1.5em;
    left: 1.5em;
    width: 4em;
    height: 4em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.15em solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transform: rotate(-15deg);
    opacity: 0.2;
    z-index: 1;
}

.stamp-text {
    font-size: 0.6em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.corner-slice {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1.5em;
    height: 1.5em;
    background: var(--bg);
    border-right: 0.25em solid var(--text);
    border-top: 0.25em solid var(--text);
    border-radius: 0 0.5em 0 0;
    z-index: 1;
}
</style>