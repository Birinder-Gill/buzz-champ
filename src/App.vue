<script setup>
import BuzzerTimer from './components/buzzer/BuzzerTimer.vue';
import Buzzer from './components/buzzer/Buzzer.vue';
import RoundBuzzer from './components/buzzer/RoundBuzzer.vue';
import Card from './components/ui_exp/Card.vue';
import CountDown from './components/ui_exp/CountDown.vue';
import DecorBackground from './components/ui_exp/DecorBackground.vue';
import NewWelcome from './components/ui_exp/NewWelcome.vue';
// No imports needed - Vue Router will handle routing
</script>

<template>
  <v-app>
    <v-main>
     <DecorBackground />
     <v-container fluid>
      <!-- <NewWelcome/> -->
       <router-view />
        <!-- <card/> -->
       <!-- <Buzzer/> -->
       <!-- <RoundBuzzer/>
       <RoundBuzzer variant="secondary"/> -->
       <!-- <BuzzerTimer /> -->
        <!-- <CountDown /> -->
     </v-container>
    </v-main>
  </v-app>
</template>

<style>
.v-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* allow natural vertical flow */
  min-height: 100vh;
  width: 100%;
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-2xl);
  background: var(--color-bg-app);
}

@media (max-width: 599px) {
  .v-container {
    padding-top: var(--space-xl);
    padding-bottom: var(--space-xl);
  }
}
</style>
