<template>
  <v-card 
    class="pa-4 mb-3" 
    :color="team.BUZZED ? 'amber-lighten-4' : 'deep-purple-lighten-5'"
    elevation="2"
    :class="{ 'buzzer-active': team.BUZZED }"
  >
    <v-row align="center" no-gutters>
      <v-col cols="auto">
        <v-avatar color="deep-purple-lighten-2" size="40">
          <v-icon color="white">mdi-account-group</v-icon>
        </v-avatar>
      </v-col>
      
      <v-col class="ml-3">
        <div class="text-h6 font-weight-medium">
          {{ team.TEAM_NAME || 'Unknown Team' }}
        </div>
      </v-col>
      
      <v-col cols="auto">
        <v-icon 
          v-if="team.BUZZED" 
          color="amber-darken-2" 
          size="32"
          class="buzzer-icon"
        >
          mdi-bell-ring
        </v-icon>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
defineProps({
  team: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.buzzer-active {
  border: 2px solid #ffc107;
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.4);
}

.buzzer-icon {
  animation: ring 0.5s ease-in-out infinite alternate;
}

@keyframes ring {
  0% { transform: rotate(-10deg); }
  100% { transform: rotate(10deg); }
}
</style>