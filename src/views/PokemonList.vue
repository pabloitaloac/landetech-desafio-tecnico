<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="6" class="d-flex">
        <v-text-field
          v-model="search"
          label="Buscar Pokemon por ID ou nome"
          outlined
          dense
          class="mb-4"
          @keyup.enter="handleSearch"
        ></v-text-field>
        <v-btn color="primary" class="ml-2 mb-4" @click="handleSearch">
          Buscar
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="recentPokemons.length > 0 && !search" class="mb-10">
      <v-col cols="12">
        <h2>Pokemons recentes</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="red" @click="clearRecent" icon>
          <v-icon>mdi-delete</v-icon>
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
            <p :class="['pokemon-id-background', typeColorClass(pokemon.types[0]?.type?.name)]">{{ formatId(pokemon.id) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>Pokémons</h2>
      </v-col>
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
              <p :class="['pokemon-id-background', typeColorClass(pokemon.types[0]?.type?.name)]">{{ formatId(pokemon.id) }}</p>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn v-if="visiblePokemons.length < pokemons.length && !search" @click="loadMore" color="primary">
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
import { defineComponent, watch } from 'vue';
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
      snackbarMessage: '',
      searchResults: [] as any[]
    };
  },
  computed: {
    filteredPokemons() {
      if (this.searchResults.length) {
        return this.searchResults;
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
        this.resetSearchResults();
        return;
      }

      const searchLower = this.search.toLowerCase();
      let apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
      this.searchResults = [];
      
      if (!isNaN(Number(searchLower))) {
        // Search by ID
        apiUrl += `${Number(searchLower)}`;
        try {
          const response = await axios.get(apiUrl);
          this.searchResults.push({
            id: response.data.id,
            name: response.data.name,
            image: response.data.sprites.front_default,
            types: response.data.types,
            loading: false
          });
        } catch (error) {
          this.snackbarMessage = 'No Pokémon found.';
          this.snackbar = true;
          this.resetSearchResults();
        }
      } else {
        // Search by Name
        apiUrl += `${searchLower}`;
        try {
          const response = await axios.get(apiUrl);
          this.searchResults.push({
            id: response.data.id,
            name: response.data.name,
            image: response.data.sprites.front_default,
            types: response.data.types,
            loading: false
          });
        } catch (error) {
          this.snackbarMessage = 'No Pokémon found.';
          this.snackbar = true;
          this.resetSearchResults();
        }
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
    typeColorClass(type) {
      const colorClasses = {
        grass: 'type-grass',
        fire: 'type-fire',
        water: 'type-water',
        bug: 'type-bug',
        normal: 'type-normal',
        poison: 'type-poison',
        electric: 'type-electric',
        ground: 'type-ground',
        fairy: 'type-fairy',
        fighting: 'type-fighting',
        psychic: 'type-psychic',
        rock: 'type-rock',
        ghost: 'type-ghost',
        ice: 'type-ice',
        dragon: 'type-dragon',
        dark: 'type-dark',
        steel: 'type-steel',
        flying: 'type-flying',
      };
      return colorClasses[type] || 'type-normal';
    },
    formatId(id) {
      return id.toString().padStart(3, '0');
    },
    resetSearchResults() {
      this.searchResults = [];
      this.visiblePokemons = this.pokemons.slice(0, this.visibleCount);
    }
  },
  watch: {
    search(newSearch) {
      if (!newSearch) {
        this.resetSearchResults();
      }
    }
  }
});
</script>

<style scoped>
.pokemon-card {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  
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
  font-size: 12pt;
  font-weight: bold;

}

.pokemon-types {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pokemon-id-background {
  position: absolute;
  bottom: -30px;
  right: 0;
  font-size: 70pt;
  opacity: 0.2;
  color: #000;
}


.type-grass {
  color: #78C850;
}
.type-fire {
  color: #F08030;
}
.type-water {
  color: #6890F0;
}
.type-bug {
  color: #A8B820;
}
.type-normal {
  color: #A8A878;
}
.type-poison {
  color: #A040A0;
}
.type-electric {
  color: #F8D030;
}
.type-ground {
  color: #E0C068;
}
.type-fairy {
  color: #EE99AC;
}
.type-fighting {
  color: #C03028;
}
.type-psychic {
  color: #F85888;
}
.type-rock {
  color: #B8A038;
}
.type-ghost {
  color: #705898;
}
.type-ice {
  color: #98D8D8;
}
.type-dragon {
  color: #7038F8;
}
.type-dark {
  color: #705848;
}
.type-steel {
  color: #B8B8D0;
}
.type-flying {
  color: #A890F0;
}
</style>
