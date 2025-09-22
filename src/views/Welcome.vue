<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import JoinGame from '../components/JoinGame.vue';
import NewGame from '../components/NewGame.vue';

const tab = ref("one");

// responsive state
const isMobile = ref(false);
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 600;
};

onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile);
});
</script>

<template>
  <v-card
    class="welcome-card app-card mx-auto pa-4 pa-sm-6"
    :elevation="0"
  >
        <v-card-title class="text-center py-4">
            <h2 :class="['font-weight-bold', isMobile ? 'text-h6' : 'text-h5']">
                Welcome to buzzer champions
            </h2>
        </v-card-title>
        <v-card-text class="text-center pb-2">
            Create a new game or join an existing one.
        </v-card-text>
        <v-tabs
            fixed-tabs
            v-model="tab"
            :density="isMobile ? 'compact' : 'default'"
            show-arrows
            class="welcome-tabs"
        >
            <v-tab value="one">Create a game</v-tab>
            <v-tab value="two">Join a game</v-tab>
        </v-tabs>

        <v-card-text class="pt-4">
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

<style scoped>
.welcome-card {
  width: 100%;
  max-width: 680px;
  transition: max-width .25s ease;
}

@media (max-width: 960px) {
  .welcome-card { max-width: 640px; }
}
@media (max-width: 599px) {
  .welcome-card { max-width: 100%; }
  .welcome-card :deep(.v-tab) { font-size: .75rem; padding: 0 8px; }
  .welcome-card :deep(h2) { line-height: 1.25; }
}
@media (max-width: 380px) {
  .welcome-card { padding: var(--space-lg) !important; }
}
</style>
