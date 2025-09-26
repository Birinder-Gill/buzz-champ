<template>
    <GameTerminated v-if="status === 'terminated'" />
    <div v-else>
        <TeamCardHeader :gameState="gameState" :admin="admin" />
        <div class="buzzer-stage">
            <WaitingWidget v-if="status === 'lobby'" />
            <CountDown v-if="status === 'countdown' && countdown !== null" :value="countdown" />

            <!-- UPDATED: persistent space + conditional animation -->
            <div class="buzzed-area">
                <!-- NEW pre-buzz message (shown before user buzzes in game state) -->
                <div
                    v-if="status === 'game' && !showBuzzedAnimation"
                    class="pre-buzz-message"
                >
                    <h2 class="pre-buzz-title">Ready when you are</h2>
                    <p class="pre-buzz-sub">Hit the buzzer the moment you know it!</p>
                </div>

                <transition name="buzzed-reveal-fade">
                    <div
                        v-if="showBuzzedAnimation"
                        class="buzzed-reveal"
                        key="buzzed"
                    >
                        <!-- pulse ring removed for minimal style -->
                        <div class="buzzed-core">
                            <v-icon size="88" color="accent" class="icon-pop">mdi-flash</v-icon>
                            <h1 class="buzzed-title">BUZZED!</h1>
                            <p class="buzzed-sub">Your buzz has been locked in</p>
                        </div>
                        <div class="confetti" aria-hidden="true">
                            <span v-for="n in 12" :key="n" class="confetti-piece"></span>
                        </div>
                    </div>
                </transition>
            </div>

            <Buzzer :buzzed="showBuzzedAnimation" :release-token="true" v-if="status === 'game' || status === 'complete'" @buzz="handleBuzzClick" />
        </div>
    </div>
</template>



<style scoped>
.buzzer-card {
    max-width: 640px;
    width: 100%;
}

/* New unified stage container */
.buzzer-stage {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Reserve space so content swaps don't shift page */
    min-height: 320px;
    /* Optional: tweak if components had big internal vertical gaps */
    width: 100%;
}

/* Add absolute positioning for exit button */
.exit-btn-container {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
}

.exit-btn {
    /* Remove margin if any, for tight placement */
    margin: 0;
}

/* Animated BUZZED reveal */
.buzzed-reveal {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 32px 24px 40px;
    border-radius: 28px;
    background: transparent;
    box-shadow: none;
    animation: card-pop 520ms cubic-bezier(.22,1.25,.32,1);
    isolation: isolate;
    min-width: clamp(260px, 60vw, 520px);
}

.buzzed-core {
    position: relative;
    text-align: center;
    z-index: 2;
    padding: 8px 12px;
    backdrop-filter: none;
}

.buzzed-title {
    margin: 4px 0 0;
    font-size: clamp(2.2rem, 5vw, 3.2rem);
    font-weight: 800;
    letter-spacing: 2px;
    background: none;
    color: var(--color-accent);
    filter: none;
}

.buzzed-sub {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    letter-spacing: 0.5px;
    opacity: 0;
    animation: fade-rise 600ms 260ms ease-out forwards;
    filter: none;
}

.icon-pop {
    transform-origin: center;
    animation: icon-pop 600ms 40ms cubic-bezier(.26,1.4,.34,1);
    filter: none;
}

/* Confetti */
.confetti {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;
}

.confetti-piece {
    position: absolute;
    top: 0;
    left: 50%;
    width: 10px;
    height: 14px;
    background: var(--c, var(--color-accent));
    border-radius: 2px;
    opacity: 0;
    transform: translate(-50%, -20%) rotate(0deg);
    animation: confetti-fall 1400ms forwards;
}

.confetti-piece:nth-child(3n)  { --c:#a020f0; }
.confetti-piece:nth-child(4n)  { --c:#ff2d85; }
.confetti-piece:nth-child(5n)  { --c:#6a00ff; }
.confetti-piece:nth-child(7n)  { --c:#b26ee6; }
.confetti-piece:nth-child(9n)  { --c:#8e24aa; }

/* New pre-buzz message styles */
.pre-buzz-message {
    text-align: center;
    animation: fade-in 600ms ease both;
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 520px;
    padding: 8px 12px;
    opacity: .9;
}

.pre-buzz-title {
    margin: 0;
    font-size: clamp(1.9rem, 4.4vw, 2.6rem);
    font-weight: 800;
    letter-spacing: 1px;
    background: none;
    color: var(--color-accent);
    filter: none;
}

.pre-buzz-sub {
    margin: 0;
    font-size: 1.05rem;
    letter-spacing: .6px;
    background: none;
    color: var(--color-text-secondary);
    opacity: .85;
    font-weight: 500;
}

/* Transitions */
.buzzed-reveal-fade-enter-active,
.buzzed-reveal-fade-leave-active {
    transition: opacity .5s ease, transform .5s ease;
}
.buzzed-reveal-fade-enter-from,
.buzzed-reveal-fade-leave-to {
    opacity: 0;
    transform: scale(.9);
}

/* Keyframes */
@keyframes icon-pop {
    0% { transform: scale(0.2) rotate(-20deg); opacity:0; }
    55% { transform: scale(1.15) rotate(6deg); opacity:1; }
    75% { transform: scale(.94) rotate(-3deg); }
    100%{ transform: scale(1) rotate(0deg); }
}

@keyframes title-reveal {
    0% { letter-spacing: -6px; opacity:0; transform: translateY(18px) scale(.9); }
    60% { opacity:1; }
    100% { letter-spacing:2px; opacity:1; transform: translateY(0) scale(1); }
}

@keyframes fade-rise {
    0% { opacity:0; transform: translateY(14px); }
    100% { opacity:1; transform: translateY(0); }
}

@keyframes pulse-fade {
    0% { opacity:.9; transform: scale(.35); }
    50% { opacity:.35; }
    100% { opacity:0; transform: scale(1.85); }
}

@keyframes card-pop {
    0% { transform: scale(.82) translateY(18px); opacity:0; }
    60% { opacity:1; }
    100% { transform: scale(1) translateY(0); opacity:1; }
}

@keyframes confetti-fall {
    0% { opacity:0; transform: translate(-50%, -20%) translateX(var(--tx)) rotate(0deg) scale(.8); }
    10% { opacity:1; }
    70% { opacity:1; }
    100% {
        opacity:0;
        transform:
            translate(-50%, 180px)
            translateX(calc(var(--tx) * 1.4))
            rotate(260deg)
            scale(1);
    }
}

@keyframes fade-in {
    0% { opacity:0; transform: translateY(14px); }
    100% { opacity:.9; transform: translateY(0); }
}

/* Responsive tweak */
@media (max-width: 599px) {
    .buzzed-reveal { padding: 48px 28px 56px; }
}

/* NEW container to preserve layout height even when hidden */
.buzzed-area {
    height: 240px; /* adjust if needed */

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    pointer-events: none;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { setListeners, finishCountdown, buzzBuzzer, gameState, clearGameState } from '../state/store.js';
import GameTerminated from '../components/GameTerminated.vue';
import { useRouter } from 'vue-router';
import CountDown from '../components/ui_exp/CountDown.vue';
import Buzzer from '../components/buzzer/Buzzer.vue';
import WaitingWidget from '../components/ui_exp/WaitingWidget.vue';
import TeamCardHeader from '../components/ui_exp/TeamCardHeader.vue';
const router = useRouter();
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
    if (gameState.teamName && data.TEAMS && data.TEAMS[gameState.teamName] != null) {
        currentTeam.value = data.TEAMS[gameState.teamName];
    } else {
        status.value = "terminated";
        clearGameState();
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

const showBuzzedAnimation = ref(false);

// Trigger animation when BUZZED changes false -> true
watch(
    () => currentTeam.value?.BUZZED,
    (now, prev) => {
        if (now && !prev) {
            showBuzzedAnimation.value = true;
            // Auto-hide after a few seconds (optional)
            setTimeout(() => {
                // Keep visible if still buzzed? choose to fade; remove if persistent desired
                // showBuzzedAnimation.value = false;
            }, 4500);
        }
        if (!now) {
            showBuzzedAnimation.value = false;
        }
    }
);
</script>