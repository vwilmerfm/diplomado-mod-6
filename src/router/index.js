import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Libros from '../views/Libros.vue'
import Categorias from '../views/Categorias.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/libros',
        name: 'Libros',
        component: Libros
    },
    {
        path: '/categorias',
        name: 'Categorias',
        component: Categorias
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router