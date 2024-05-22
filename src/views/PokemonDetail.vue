<template>
  <v-container>
    <v-card v-if="pokemon">
      <v-card-title>{{ pokemon.name }}</v-card-title>
      <v-card-text>
        <img :src="pokemon.sprites.front_default" alt="pokemon image">
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pokemon: null as any | null,
    };
  },
  async created() {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
    this.pokemon = response.data;
  },
});
</script>
