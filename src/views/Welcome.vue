<template>
  <!-- added card wrapper and headings -->
  <div class="buzzer-card">
    <h1 class="card-title">Welcome to Buzzer Champions</h1>
    <p class="subtitle">Create a new game or join an existing one.</p>
    <!-- existing tabs root replaced (was outer .tabs) -->
    <div class="tabs" :class="shadowClass">
      <input type="radio" name="tabs" id="tabone" checked="checked" @change="selectTab('create')">
      <label for="tabone">CREATE A GAME</label>
      <div class="tab">
        <NewGame />
      </div>

      <input type="radio" name="tabs" id="tabtwo" @change="selectTab('join')">
      <label for="tabtwo">JOIN A GAME</label>
      <div class="tab">
        <JoinGame />
      </div>
    </div>
  </div>
</template>

<script setup>
// ...existing code imports...
import { ref, computed } from 'vue';
import NewGame from '../components/NewGame.vue';
import JoinGame from '../components/JoinGame.vue';

const selectedTab = ref('create');
const direction = ref('slide-left'); // default animation name
const order = ['create', 'join'];
let previous = 'create';

function selectTab(tab) {
  if (selectedTab.value === tab) return;
  const newIndex = order.indexOf(tab);
  const oldIndex = order.indexOf(selectedTab.value);
  direction.value = newIndex > oldIndex ? 'slide-left' : 'slide-right';
  previous = selectedTab.value;
  selectedTab.value = tab;
}
const shadowClass = computed(() => selectedTab.value === 'join' ? 'shadow-right' : 'shadow-left');
</script>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
}

.tabs label {
  order: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  margin-right: 0;
  /* removed to allow perfect 50% split */
  cursor: pointer;
  background-color: #ff2d85;
  color: #ffffff;
  font-weight: bold;
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  /* stronger elevation for all */
  flex: 1 0 50%;
  /* each label takes half width */
}

.tabs .tab {
  order: 9;
  flex-grow: 1;
  width: 100%;
  height: auto;
  /* was 100%, now content-based */
  display: none;
  padding: 1rem;
  background: #fff;
  padding: 20px;
  box-shadow: -10px 10px 0px 0px black;
}

.tabs input[type="radio"] {
  display: none;
}

.tabs input[type="radio"]:checked+label {
  /* pressed look instead of raised */
  background: #000;
  color: #fff;
  border: 1px solid #000;
  box-shadow: none;
  transform: none;
}

.tabs input[type="radio"]:checked+label+.tab {
  display: block;
  margin-top: 0;
  /* remove negative overlap */
  border: 1px solid #f8cadd;
  border-top: none;
  border-radius: 0 4px 4px 4px;
}

@media (max-width: 600px) {
  .tabs {
    max-width: 100%;
  }

  .tabs label {
    /* stacked layout adjustments */
    transform: none !important;
    margin-right: 0;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    flex: 1 0 50%;
  }

  .tabs input[type="radio"]:checked+label+.tab {
    margin-top: 0;
    border-radius: 0 4px 4px 4px;
  }
}

body {
  background: pink;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 10vh;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 300;
  line-height: 1.5;
  max-width: 60rem;
  margin: 0 auto;
  font-size: 110%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-title {
  font-size: 2rem;
  margin: 0 0 .35rem;
  background: linear-gradient(90deg, #ff1f7d, #ff5ba3 55%, #ff9ecf);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 800;
}

.subtitle {
  margin: 0 0 1.75rem;
  font-size: 0.95rem;
  letter-spacing: .5px;
  color: #4a4d55;
  font-weight: 600;
  text-transform: uppercase;
}

.buzzer-card .tabs label {
  background-color: #272a30;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.buzzer-card .tabs input[type="radio"]:checked+label {
  background: #ff2d85;
  color: #fff;
  border: 1px solid #ff2d85;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.35);
}

.buzzer-card .tab {
  background: #ffffff;
  border-radius: 0 4px 4px 4px;
}

/* Update directional shadow to apply only to inner tab panel */
.tabs.shadow-left .tab {
  box-shadow: -10px 10px 0 0 #000;
}

.tabs.shadow-right .tab {
  box-shadow: 10px 10px 0 0 #000;
}

/* Extend side shadow to top using a pseudo-element */
.tabs.shadow-left,
.tabs.shadow-right {
  position: relative;
}

.tabs.shadow-left:before,
.tabs.shadow-right:before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 10px;
  background: #000;
  z-index: 0;
}

.tabs.shadow-left:before {
  left: 0;
}

.tabs.shadow-right:before {
  right: 0;
}

/* Ensure labels & tab content sit above pseudo-element */
.tabs label,
.tabs .tab {
  position: relative;
  z-index: 1;
}

/* Remove pink pressed style spill (override earlier global rule) */
.tabs input[type="radio"]:checked+label {
  /* override original pressed look */
  background: #000;
  box-shadow: none;
  transform: none;
  border: 1px solid #000;
  border-bottom: none;
}

/* Keep active tab flush with content panel */
.tabs input[type="radio"]:checked+label+.tab {
  /* ...existing code... */
}

/* Optional subtle hover for unselected */
.buzzer-card .tabs label:not(:has(+ .tab)):hover,
.buzzer-card .tabs input[type="radio"]:not(:checked)+label:hover {
  filter: brightness(1.05);
  cursor: pointer;
}

/* Mobile keeps logic (no change needed) */
/* ...existing code... */
@media (max-width: 600px) {
  .buzzer-card {
    padding: 1.75rem 1.25rem 2rem;
    box-shadow: -12px 12px 0 0 #000;
  }

  .card-title {
    font-size: 1.55rem;
  }

  .subtitle {
    font-size: 0.82rem;
  }
}
</style>
