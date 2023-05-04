import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginRegisterView from '@/views/LoginRegisterView.vue'
import AdminView from '@/views/AdminView.vue'
import ModelView from '@/views/ModelView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login_register',
    component: LoginRegisterView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
    path: '/model',
    name: 'model',
    component: ModelView,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
