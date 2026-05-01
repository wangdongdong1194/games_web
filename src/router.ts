import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from './views/Home.vue';
import Sudoku from './components/Sudoku.vue';
import Eliminate from './components/EliminateFun.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sudoku',
    name: 'Sudoku',
    component: Sudoku
  },
  {
    path: '/eliminate',
    name: 'Eliminate',
    component: Eliminate
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
