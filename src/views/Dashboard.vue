<template>
  <AdminCard v-if="gameState.isAdmin" />
  <BuzzerCard v-else />


</template>

<script setup>
import AdminCard from './AdminCard.vue';
import { gameState } from '../state/store.js';
import BuzzerCard from './BuzzerCard.vue';

// Now gameState.isAdmin is accessible in this component
// You can use it in the template or in computed properties
</script>

<style scoped></style>
