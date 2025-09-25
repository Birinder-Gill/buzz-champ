import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Dashboard from '../views/Dashboard.vue'
import NotFound from '../views/NotFound.vue'
import { gameState } from '../state/store.js'
import NewWelcome from '../components/ui_exp/NewWelcome.vue'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: NewWelcome
  },
  {
    path: '/game',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect the game route
router.beforeEach((to, from, next) => {
  // If user is trying to access the game dashboard without a valid game session
  if (to.name === 'Dashboard' && !gameState.gameId) {
    // Redirect to welcome page
    next({ name: 'Welcome' })
  } else {
    // Continue with normal navigation
    next()
  }
})

export default router