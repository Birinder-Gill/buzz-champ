<script setup>
// No imports needed - Vue Router will handle routing
</script>

<template>
  <v-app>
    <v-main>
     <v-container fluid>
       <router-view />
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
