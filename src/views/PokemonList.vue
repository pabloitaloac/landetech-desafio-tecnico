<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="6" class="d-flex">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search Pokémon by ID or Name"
          outlined
          dense
          class="mb-4"
          @keyup.enter="handleSearch"
        ></v-text-field>
        <v-btn color="primary" class="ml-2 mb-4" @click="handleSearch">
          Search
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="recentPokemons.length > 0">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="red" @click="clearRecent">
          Clear Recent
        </v-btn>
      </v-col>
      <v-col
        v-for="pokemon in recentPokemons"
        :key="pokemon.id"
        cols="12" sm="6" md="4"
        class="d-flex justify-center"
      >
        <v-card 
          class="pokemon-card"
          :href="`/pokemon/${pokemon.id}`"
          style="text-decoration: none; color: inherit;"
        >
          <v-img
            :src="pokemon.image"
            aspect-ratio="1"
            class="pokemon-image"
          ></v-img>
          <v-card-text class="pokemon-info" style="flex: 1; position: relative;">
            <p class="pokemon-name">{{ pokemon.name }}</p>
            <div class="pokemon-types">
              <v-chip
                v-for="type in pokemon.types"
                :key="type.type.name"
                :color="typeColor(type.type.name)"
                dark
                class="ma-1"
              >
                {{ type.type.name }}
              </v-chip>
            </div>
            <p class="pokemon-id-background">{{ formatId(pokemon.id) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="pokemon in filteredPokemons"
        :key="pokemon.id"
        cols="12" sm="6" md="4"
        class="d-flex justify-center"
      >
        <v-hover v-slot:default="{ isHovering, props }">
          <v-card 
            class="pokemon-card"
            v-bind="props"
            :href="`/pokemon/${pokemon.id}`"
            style="text-decoration: none; color: inherit;"
          >
            <v-img
              :src="pokemon.image"
              aspect-ratio="1"
              class="pokemon-image"
              v-if="!pokemon.loading"
            ></v-img>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              class="ma-2"
              size="100"
            ></v-progress-circular>
            <v-card-text class="pokemon-info" style="flex: 1; position: relative;">
              <p class="pokemon-name">{{ pokemon.name }}</p>
              <div class="pokemon-types">
                <v-chip
                  v-for="type in pokemon.types"
                  :key="type.type.name"
                  :color="typeColor(type.type.name)"
                  dark
                  class="ma-1"
                >
                  {{ type.type.name }}
                </v-chip>
              </div>
              <p class="pokemon-id-background">{{ formatId(pokemon.id) }}</p>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn v-if="visiblePokemons.length < pokemons.length" @click="loadMore" color="primary">
          Ver Mais
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      pokemons: [] as any[],
      visiblePokemons: [] as any[],
      recentPokemons: [] as any[],
      search: '',
      visibleCount: 10,
      snackbar: false,
      snackbarMessage: ''
    };
  },
  computed: {
    filteredPokemons() {
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        return this.visiblePokemons.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(searchLower) ||
            pokemon.id.toString() === searchLower
        );
      }
      return this.visiblePokemons;
    },
  },
  async created() {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const results = response.data.results.map((pokemon: any, index: number) => ({
      ...pokemon,
      id: index + 1,
      loading: true,
      image: '',
      types: []
    }));
    this.pokemons = results;
    this.loadMore();
    this.loadRecentPokemons();
  },
  methods: {
    async loadMore() {
      const nextPokemons = this.pokemons.slice(this.visiblePokemons.length, this.visiblePokemons.length + this.visibleCount);
      this.visiblePokemons = [...this.visiblePokemons, ...nextPokemons];

      for (const pokemon of nextPokemons) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
        pokemon.image = response.data.sprites.front_default;
        pokemon.types = response.data.types;
        pokemon.loading = false;
      }
    },
    async handleSearch() {
      if (!this.search) {
        this.snackbarMessage = 'Please enter a Pokémon ID or Name.';
        this.snackbar = true;
        return;
      }
      
      const searchLower = this.search.toLowerCase();
      let apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
      
      if (!isNaN(Number(searchLower))) {
        // Search by ID
        apiUrl += `${Number(searchLower)}`;
      } else {
        // Search by Name
        apiUrl += `${searchLower}`;
      }
      
      try {
        const response = await axios.get(apiUrl);
        this.addRecentPokemon(response.data);
        this.$router.push(`/pokemon/${response.data.id}`);
      } catch (error) {
        this.snackbarMessage = 'No Pokémon found.';
        this.snackbar = true;
      }
    },
    addRecentPokemon(pokemon) {
      const recent = this.recentPokemons.filter(p => p.id !== pokemon.id);
      recent.unshift({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default,
        types: pokemon.types
      });
      this.recentPokemons = recent.slice(0, 3);
      localStorage.setItem('recentPokemons', JSON.stringify(this.recentPokemons));
    },
    loadRecentPokemons() {
      const recent = localStorage.getItem('recentPokemons');
      if (recent) {
        this.recentPokemons = JSON.parse(recent);
      }
    },
    clearRecent() {
      this.recentPokemons = [];
      localStorage.removeItem('recentPokemons');
    },
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
      return id.toString().padStart(3, '0');
    }
  }
});
</script>

<style scoped>
.pokemon-card {
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: row;
  position: relative;
}

.pokemon-image {
  width: 50%;
  padding: 50px;
}

.pokemon-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  font-size: 14px;
  font-weight: bold;
  position: relative;
}

.pokemon-name {
  margin-bottom: 8px;
}

.pokemon-types {
  display: flex;
  flex-direction: column;
}

.pokemon-id-background {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 70pt;
  opacity: 0.1;
}
</style>
