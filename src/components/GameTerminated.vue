<template>
  <v-card class="app-card terminated-card pa-6" elevation="0">
    <div class="text-center mb-6">
      <v-icon size="90" color="deep-purple-lighten-2" class="mb-4">mdi-alert-circle-outline</v-icon>
      <h1 class="text-h5 font-weight-bold mb-2">Game Terminated</h1>
      <p class="text-body-1 text-medium-emphasis">
        This game session has ended. You can return to the homepage to join or create another game.
      </p>
    </div>
    <v-btn
      block
      color="deep-purple-lighten-2"
      variant="flat"
      size="large"
      @click="goHome"
      aria-label="Return to homepage"
    >
      Return Home
    </v-btn>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function goHome() {
  router.push('/');
}
</script>

<style scoped>
.terminated-card {
  max-width: 640px;
  width: 100%;
}
@media (max-width: 599px) {
  .terminated-card { padding: var(--space-lg) !important; }
  .terminated-card :deep(h1) { font-size: 1.35rem; }
}
</style>
