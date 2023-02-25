import Vue from "vue"
import VueRouter from "vue-router"
import MoviesList from "../components/MoviesList.vue"

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        name: "MoviesList",
        component: MoviesList
    },
    {
        path: "/movie/details/:id",
        name: "MovieDetails",
        props: true,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../components/MovieDetails.vue")
    },
    {
        path: "/favorite/movies",
        name: "FavoriteMoviesList",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../components/FavoriteMoviesList.vue")
    }
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
})

export default router