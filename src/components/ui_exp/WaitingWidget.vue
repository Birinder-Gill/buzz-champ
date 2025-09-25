<template>
  <transition name="fade">
    <div v-if="show" class="waiting-root" role="status" aria-live="polite">
      <div class="panel">
        <div class="mascot" aria-hidden="true">
          <div class="bee">
            <div class="wing wing-left" />
            <div class="wing wing-right" />
            <div class="stripe head" />
            <div class="stripe body-1" />
            <div class="stripe body-2" />
            <div class="face">
              <span class="eye eye-left" />
              <span class="eye eye-right" />
              <span class="smile" />
            </div>
          </div>
        </div>

        <h2 class="title">
          {{ message }}
          <span class="dot-pulse">
            <span v-for="d in 3" :key="d" />
          </span>
        </h2>

        <p class="subtitle">Waiting for the game to start</p>

        <div class="tip-box" v-if="activeTip">
          <span class="tip-label">Fun tip:</span>
          <span class="tip-text">{{ activeTip }}</span>
        </div>

        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

// Decorative shapes removed; now provided globally by DecorBackground

interface Props {
  show?: boolean;
  message?: string;
  tips?: string[];
  rotateMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  message: 'Get ready, players',
  tips: () => [
    'Stretch your fingers!',
    'Think happy buzz...ing thoughts.',
    'Sip some water while you wait.'
  ],
  rotateMs: 4200
});

const index = ref(0);
const activeTip = computed(() => props.tips[index.value % props.tips.length]);
let timer: number | undefined;

function start() {
  stop();
  if (!props.tips.length) return;
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % props.tips.length;
  }, props.rotateMs);
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

watch(() => props.show, (v) => {
  if (v) start(); else stop();
});

onMounted(start);
onBeforeUnmount(stop);
</script>

<style scoped>
:root {
  --c-accent: #ffb347;
  --c-accent-dark: #ff9800;
  --c-text: #1f2937;
  --c-tip: #374151;
  --c-panel: #ffffff;
  --c-pink: #f472b6;
}

/* Light background refresh */
.waiting-root {
  position: relative;
  padding: 1.75rem clamp(1.5rem, 3vw, 3rem);
  display: flex;
  justify-content: center;
  text-align: center;
  min-height: 52vh;
  overflow: hidden;
  border-radius: 1.25rem;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(4px) saturate(1.2);
  box-shadow: 0 6px 18px -6px #94a3b81f, 0 2px 4px #94a3b80f;
  font-family: system-ui, 'Nunito', ui-rounded, 'Comic Neue', sans-serif;
}

.waiting-root::before {
  background:
    radial-gradient(circle at 80% 20%, #e2e8f00f, transparent 60%),
    radial-gradient(circle at 15% 75%, #e2e8f00d, transparent 65%);
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: normal;
}

/* Shapes removed (handled globally) */

.title { color: var(--c-text); }
.subtitle { color: #64748b; opacity:.95; }

.dot-pulse span {
  background: var(--c-accent-dark);
  /* ...existing code... */
}

/* Softer tip box */
.tip-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  backdrop-filter: none;
  box-shadow: 0 2px 4px -2px #94a3b826;
  /* ...existing code... */
}
.tip-label { color:#f97316; }
.tip-text { color: var(--c-tip); }

/* Remove dark mode overrides (forced light theme) */
/* (deleted @media prefers-color-scheme: dark block) */

/* ...existing code (animations, bee, etc.) ... */
 
/* Legacy star styles removed */

.panel {
  /* elevate above shapes */
  position: relative;
  z-index: 2;
  max-width: 640px;
}

.title {
  margin: 0.25rem 0 0.25rem;
  font-size: clamp(1.55rem, 4vw, 2.4rem);
  font-weight: 800;
  color: var(--c-text);
  letter-spacing: .5px;
}

.subtitle {
  margin: .25rem 0 1.15rem;
  font-size: clamp(.95rem, 2vw, 1.15rem);
  font-weight: 600;
  color: #5b3b00;
  opacity: .9;
  letter-spacing: .5px;
}

.dot-pulse {
  display: inline-flex;
  gap: .35rem;
  margin-left: .4rem;
}
.dot-pulse span {
  width: .5rem;
  height: .5rem;
  background: var(--c-accent-dark);
  border-radius: 50%;
  animation: pulse 1.4s infinite ease-in-out;
  opacity: .55;
}
.dot-pulse span:nth-child(2){ animation-delay: .25s }
.dot-pulse span:nth-child(3){ animation-delay: .5s }

.tip-box {
  display: inline-flex;
  flex-wrap: wrap;
  gap: .35rem .5rem;
  background: var(--c-panel);
  padding: .65rem .9rem .7rem;
  border-radius: .9rem;
  font-size: .9rem;
  line-height: 1.2;
  max-width: 480px;
  backdrop-filter: blur(6px);
  border: 2px solid #ffffff80;
  box-shadow: 0 2px 6px -2px #1f293714;
}
.tip-label {
  font-weight: 700;
  color: var(--c-accent-dark);
}
.tip-text {
  color: var(--c-tip);
  font-weight: 600;
}

.mascot {
  width: 150px;
  height: 150px;
  margin: 0 auto .25rem;
  position: relative;
  animation: bob 3.8s ease-in-out infinite;
  filter: drop-shadow(0 6px 8px #ad660055);
}

.bee {
  position: relative;
  width: 100%;
  height: 100%;
}

.wing {
  position: absolute;
  top: 18%;
  width: 56px;
  height: 56px;
  background: #ffffffd9;
  border: 3px solid #ffe1f8;
  border-radius: 50% 50% 45% 55% / 55% 45% 55% 45%;
  animation: flap 2.2s ease-in-out infinite;
  transform-origin: bottom center;
  box-shadow: 0 4px 8px -4px #ffb4ea;
}
.wing-left { left: 12px; animation-delay: .15s; }
.wing-right { right: 12px; }

.stripe {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(180deg,#ffea9a,#ffc648);
  border: 3px solid #3f2400;
  border-radius: 50%;
}
.head {
  top: 18%;
  width: 78px;
  height: 72px;
  z-index: 2;
}
.body-1 {
  top: 44%;
  width: 105px;
  height: 82px;
  border-radius: 50% 50% 45% 45%;
  background: repeating-linear-gradient(90deg,#ffcf44 0 22px,#3f2400 22px 40px);
  box-shadow: inset 0 0 0 3px #3f2400;
}
.body-2 {
  top: 78%;
  width: 72px;
  height: 46px;
  border-radius: 45% 45% 50% 50%;
  background: repeating-linear-gradient(90deg,#ffcf44 0 18px,#3f2400 18px 34px);
  box-shadow: inset 0 0 0 3px #3f2400;
}

.face {
  position: absolute;
  top: 34%;
  left: 50%;
  width: 58px;
  height: 40px;
  transform: translateX(-50%);
}
.eye {
  position: absolute;
  top: 14px;
  width: 10px;
  height: 14px;
  background: #2b1600;
  border-radius: 50%;
  animation: blink 5.2s infinite;
}
.eye-left { left: 8px; }
.eye-right { right: 8px; }
.smile {
  position: absolute;
  left: 50%;
  bottom: 6px;
  width: 26px;
  height: 16px;
  border: 3px solid #2b1600;
  border-top: none;
  border-radius: 0 0 50px 50px;
  transform: translateX(-50%);
  background: #ffb347;
  box-shadow: inset 0 4px 4px -4px #6d3d00;
}

@keyframes bob {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

@keyframes flap {
  0%,100% { transform: rotate(12deg) scale(1); opacity:.95; }
  50% { transform: rotate(-18deg) scale(1.05); opacity:.7; }
}

@keyframes blink {
  0%, 4%, 6%, 100% { transform: scaleY(1); }
  5% { transform: scaleY(.1); }
}

@keyframes pulse {
  0%, 80%, 100% { transform: scale(.6); opacity:.35; }
  40% { transform: scale(1); opacity:1; }
}

@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes twinkle {
  0% { transform: scale(.2); opacity:0; }
  10% { opacity:1; transform: scale(1); }
  50% { opacity:.6; }
  90% { opacity:0; transform: scale(.4); }
  100% { opacity:0; }
}

@media (prefers-reduced-motion: reduce) {
  .mascot,
  .wing,
  .tip-box,
  .star-spark,
  .dot-pulse span {
    animation: none !important;
  }
}


</style>
