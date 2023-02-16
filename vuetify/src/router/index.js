import Vue from 'vue'
import VueRouter from 'vue-router'
//import MoviesList from '../views/MoviesList.vue'
import MoviesList from '../components/MoviesList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MoviesList',
    component: MoviesList
  },
  {
    path: '/movie/details/:id',
    name: 'MovieDetails',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../components/MovieDetails.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
