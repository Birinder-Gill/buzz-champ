<script setup lang="ts">
import { ref } from 'vue';
import RoundBuzzer from '../buzzer/RoundBuzzer.vue';
import NewGame from '../NewGame.vue';
import JoinGame from '../JoinGame.vue';
const activeTab = ref<'create' | 'join'>('create');
</script>

<template>
 
<div class="krad">
  <div class="krad-pattern-grid"></div>
  <div class="krad-overlay-dots"></div>

  <div class="bold-pattern">
    <svg viewBox="0 0 100 100">
      <path
        stroke-dasharray="15 10"
        stroke-width="10"
        stroke="#000"
        fill="none"
        d="M0,0 L100,0 L100,100 L0,100 Z"
      ></path>
    </svg>
  </div>

  <div class="krad-title-area">
    <span>Welcome to Buzzer Champions</span>
  </div>

  <div class="krad-body">
    <div class="krad-description">
      Create a new game or join an existing one.
    </div>

    <div class="buzzer-row">
      <RoundBuzzer
        :variant="activeTab === 'create' ? 'secondary':'primary'"
        @click="activeTab = 'create'"
        label="Create game"
      />
      <RoundBuzzer
        :variant="activeTab === 'join' ? 'secondary':'primary'"
        @click="activeTab = 'join'"
        label="Join game"
      />
    </div>

    <div class="tab-panels">
      <div v-if="activeTab === 'create'" class="tab-panel">
        <p class="panel-text">
          Set up a new game. After creation, share the game code so others can join and buzz in.
        </p>
        <NewGame/>
      </div>
      <div v-else class="tab-panel">
        <p class="panel-text">
          Enter a game code to join an existing session and start buzzing.
        </p>
        <JoinGame/>
      </div>
    </div>


  </div>

  <div class="dots-pattern">
    <svg viewBox="0 0 80 40">
      <circle fill="#000" r="3" cy="10" cx="10"></circle>
      <circle fill="#000" r="3" cy="10" cx="30"></circle>
      <circle fill="#000" r="3" cy="10" cx="50"></circle>
      <circle fill="#000" r="3" cy="10" cx="70"></circle>
      <circle fill="#000" r="3" cy="20" cx="20"></circle>
      <circle fill="#000" r="3" cy="20" cx="40"></circle>
      <circle fill="#000" r="3" cy="20" cx="60"></circle>
      <circle fill="#000" r="3" cy="30" cx="10"></circle>
      <circle fill="#000" r="3" cy="30" cx="30"></circle>
      <circle fill="#000" r="3" cy="30" cx="50"></circle>
      <circle fill="#000" r="3" cy="30" cx="70"></circle>
    </svg>
  </div>

  <div class="accent-shape"></div>
  <div class="corner-slice"></div>

  <div class="stamp">
    <span class="stamp-text">Billi</span>
  </div>
</div>

</template>

<style scoped>
/* From Uiverse.io by seoulchik */ 
.krad {
  --primary: #ff3e00;
  --primary-hover: #ff6d43;
  --secondary: #4d61ff;
  --secondary-hover: #5e70ff;
  --accent: #00e0b0;
  --text: #050505;
  --bg: #ffffff;
  --shadow-color: #000000;
  --pattern-color: #cfcfcf;
  /* Replaced striped background with dotted grid */
  background:
    radial-gradient(circle at 1px 1px, rgba(0,0,0,0.11) 1px, transparent 0) 0 0 / 14px 14px,
    radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0) 7px 7px / 14px 14px;
  position: relative;
  width: 600px;
  /* background: var(--bg); */
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

.krad:hover {
  transform: translate(-0.4em, -0.4em) scale(1.02);
  box-shadow: 1em 1em 0 var(--shadow-color);
}

.krad:hover .krad-pattern-grid,
.krad:hover .krad-overlay-dots {
  opacity: 1;
}

/* Removed click animation */
/*
.krad:active {
  transform: translate(0.1em, 0.1em) scale(0.98);
  box-shadow: 0.5em 0.5em 0 var(--shadow-color);
}
*/

.krad::before {
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

.krad::after {
  content: "★";
  position: absolute;
  top: 0.4em;
  right: 0.4em;
  color: var(--text);
  font-size: 1.2em;
  font-weight: bold;
  z-index: 2;
}

.krad-pattern-grid {
  position: absolute;
  inset: 0;
 
    
  background-size: 0.5em 0.5em;
  pointer-events: none;
  opacity: 0.35;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.krad-overlay-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--pattern-color) 1px, transparent 1px);
  background-size: 1em 1em;
  background-position: -0.5em -0.5em;
  pointer-events: none;
  opacity: 0.22;
  transition: opacity 0.4s ease;
  z-index: 3;
  mix-blend-mode: multiply;
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

.krad-title-area {
  position: relative;
  padding: 1.4em;
  background: #00796B;
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

.krad-title-area::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 0.5em,
    transparent 0.5em,
    transparent 1em
  );
  pointer-events: none;
  opacity: 0.3;
}

.krad-tag {
  background: var(--bg);
  color: var(--text);
  font-size: 0.6em;
  font-weight: 800;
  padding: 0.4em 0.8em;
  border: 0.15em solid var(--text);
  border-radius: 0.3em;
  box-shadow: 0.2em 0.2em 0 var(--shadow-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transform: rotate(3deg);
  transition: all 0.3s ease;
}

.krad:hover .krad-tag {
  transform: rotate(-2deg) scale(1.1);
  box-shadow: 0.25em 0.25em 0 var(--shadow-color);
}

.krad-body {
  position: relative;
  padding: 1.5em;
  z-index: 2;
}

.krad-description {
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

.krad-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5em;
  padding-top: 1.2em;
  border-top: 0.15em dashed rgba(0, 0, 0, 0.15);
  position: relative;
}

.krad-actions::before {
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

.krad-button {
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

.krad-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  transition: left 0.6s ease;
}

.krad-button:hover {
  background: var(--secondary-hover);
  transform: translate(-0.1em, -0.1em);
  box-shadow: 0.4em 0.4em 0 var(--shadow-color);
}

.krad-button:hover::before {
  left: 100%;
}

.krad-button:active {
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

.krad:hover .accent-shape {
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

.buzzer-row {
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin: 1rem 0 0.75rem;
}

.buzzer-tab {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .55rem .75rem;
  border: 0.18em solid var(--text);
  border-radius: 0.75rem;
  background: var(--bg);
  box-shadow: 0.35em 0.35em 0 var(--shadow-color);
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, background .25s;
  min-width: 110px;
}

.buzzer-tab:hover {
  transform: translate(-0.15em, -0.15em);
  box-shadow: 0.5em 0.5em 0 var(--shadow-color);
}

.buzzer-tab:active {
  transform: translate(0.05em, 0.05em);
  box-shadow: 0.25em 0.25em 0 var(--shadow-color);
}

.buzzer-tab.active {
  background: var(--accent);
  outline: 0.22em solid var(--text);
}

.tab-panels {
  position: relative;

  border: 0.18em dashed rgba(0,0,0,0.25);
  padding: 1rem 1.1rem 1.15rem;
  border-radius: 0.6rem;
  margin-bottom: 1.2rem;
}

.tab-panel {
  animation: fadeSlide .28s ease;
}

.panel-text {
  font-size: .85rem;
  line-height: 1.3;
  font-weight: 500;
  margin: 0;
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>