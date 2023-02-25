import Vue from "vue"
import Vuex from "vuex"
import MoviesService from "../components/moviesServiсe";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        genres: [],
        favoriteMovies: [],
        service: new MoviesService(),
    },

    getters: {},

    mutations: {
        loadGenres(state) {
            state.service.getGenres().then(response => {
                response.data.genres.forEach(genre => {
                    const newGenre = {
                        id: genre.id,
                        name: genre.name
                    };

                    state.genres.push(newGenre);
                });
            }).catch(e => {
                alert(e);
            });
        },

        addFavoriteMovie(state, movie) {
            state.favoriteMovies.push(movie);
        },

        deleteFavoriteMovie(state, movieId) {
            const index = state.favoriteMovies.indexOf(state.favoriteMovies.find(favoriteMovie => {
                return favoriteMovie.id === movieId;
            }));

            if (index >= 0) {
                state.favoriteMovies.splice(index, 1);
            }
        },

        deleteAllFavoriteMovies(state) {
            state.favoriteMovies = [];
        }
    },

    actions: {
        loadGenres(context) {
            context.commit("loadGenres");
        },

        addFavoriteMovie(context, movie) {
            context.commit("addFavoriteMovie", movie)
        },

        deleteFavoriteMovie(context, movieId) {
            context.commit("deleteFavoriteMovie", movieId)
        },

        deleteAllFavoriteMovies(context) {
            context.commit("deleteAllFavoriteMovies")
        }
    },

    modules: {}
})