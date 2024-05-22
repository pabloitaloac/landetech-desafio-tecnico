import { createRouter, createWebHistory } from 'vue-router'
import AllPokemons from '../views/AllPokemons.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AllPokemons
    },
  ]
})

export default router
