import {createRouter, createWebHistory} from 'vue-router';
import Game from '../components/Game.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';

const routes = [
    {path: '/', name: 'Game',component: Game},
    {path: '/register', name: 'Register', component: Register},
    {path: '/login', name: 'Login',component: Login},

]



const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router