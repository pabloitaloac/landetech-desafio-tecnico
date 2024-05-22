<template>
  <v-app>
    <v-main class="global-background">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.global-background {
  background-color: black;
  color: white;
  font-family: 'Press Start 2P', sans-serif;
}

body {
  background-color: black;
  color: white;
  font-family: 'Press Start 2P', sans-serif;
}

.v-application {
  background-color: black;
  color: white;
  font-family: 'Press Start 2P', sans-serif;
}

.v-container {
  font-family: 'Press Start 2P', sans-serif;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #000; 
}

::-webkit-scrollbar-thumb {
  background-color: #03a9f4; 
  border-radius: 10px;
  border: 3px solid #000; 
}

html {
  scrollbar-width: thin;
  scrollbar-color: #03a9f4 #000;
}
</style>
