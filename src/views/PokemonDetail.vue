<template>
  <v-container>
    <v-btn @click="$router.go(-1)" class="fixed-btn">
      <v-icon left>mdi-chevron-left</v-icon>
    </v-btn>
    <v-row v-if="pokemon">
      <v-col cols="12" md="5">
        <v-img :src="pokemon.sprites.other['official-artwork'].front_default" :alt="`Image of ${pokemon.name}`" width="100%"></v-img>
      </v-col>
      <v-col cols="12" md="7" class="pt-16">
        <span :style="{ color: typeColor(pokemon.types[0]?.type?.name), fontSize: '24px' }">{{ formatId(pokemon.id) }}</span>
        <h1 class="pokemon-name mb-6" :style="{ color: typeColor(pokemon.types[0]?.type?.name), fontSize: '36px' }">{{ pokemon.name }}</h1>
        <div class="pb-12">
          <v-chip
            v-for="type in pokemon.types"
            :key="type.type.name"
            :color="typeColor(type.type.name)"
            dark
            class="ma-1"
            style="font-size: 18px"
          >
            {{ type.type.name }}
          </v-chip>
        </div>
        <v-row class="pb-8">
          <v-col cols="12" sm="6">
            <h4 class="pb-4 color-primary" style="font-size: 24px;">ABILITIES</h4>
            <p v-for="ability in pokemon.abilities" :key="ability.ability.name" class="info-text" style="font-size: 18px;">
              {{ ability.ability.name }}
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <h4 class="pb-4 color-primary" style="font-size: 24px;">LOCATION AREA</h4>
            <p v-for="location in locations" :key="location" class="info-text" style="font-size: 18px;">
              {{ location }}
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h4 class="color-primary" style="font-size: 24px;">STATS</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" sm="6" md="4" v-for="stat in pokemon.stats" :key="stat.stat.name" class="info-text" style="font-size: 18px;">
            <p>{{ stat.stat.name }}<br>{{ stat.base_stat }}</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" class="ma-2" size="100"></v-progress-circular>
      </v-col>
    </v-row>
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
      locations: [] as string[],
    };
  },
  async created() {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
      this.pokemon = response.data;
      const locationResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.id}/encounters`);
      this.locations = locationResponse.data.map((location: any) => location.location_area.name);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      this.pokemon = null;
    }
  },
  methods: {
    typeColor(type) {
      const colors = {
        grass: '#78C850',
        fire: '#F08030',
        water: '#6890F0',
        bug: '#A8B820',
        normal: '#A8A878',
        poison: '#A040A0',
        electric: '#F8D030',
        ground: '#E0C068',
        fairy: '#EE99AC',
        fighting: '#C03028',
        psychic: '#F85888',
        rock: '#B8A038',
        ghost: '#705898',
        ice: '#98D8D8',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        flying: '#A890F0',
      };
      return colors[type] || '#A8A878';
    },
    formatId(id) {
      return `#${id.toString().padStart(3, '0')}`;
    }
  }
});
</script>

<style scoped>
.fixed-btn {
  background-color: #3f51b5;
  color: black;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.pokemon-name {
  font-size: 36px;
  font-weight: bold;
}

.color-primary {
  color: #3f51b5;
}

.v-btn__content {
  display: flex;
  align-items: center;
}

.v-icon {
  margin-right: 8px;
}

.info-text {
  text-transform: capitalize;
  font-size: 18px;
}

.v-application {
  background-color: black;
  color: white;
}

.v-container {
  padding: 20px;
}
</style>
