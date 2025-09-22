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
    /* horizontal centering */
    align-items: center;
    /* vertical centering */
    height: 100vh;
    /* full viewport height */
    width: 100vw;
    /* full viewport width */
    background-color: #f3e8ff;
    /* light pink/purple */
}
</style>
