import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ShowSVM from '@/views/model/ShowSVM.vue'
import ShowFaceLandmark from '@/views/model/ShowFaceLandmark.vue'
import TrainSVM from '@/views/model/TrainSVM.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/model/show_svm',
    name:'show_svm',
    component: ShowSVM
  },
  {
    path: '/model/show_face_landmark',
    name: 'show_face_landmark',
    component: ShowFaceLandmark
  },
  {
    path: '/model/train_svm',
    name: 'train_svm',
    component: TrainSVM
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
