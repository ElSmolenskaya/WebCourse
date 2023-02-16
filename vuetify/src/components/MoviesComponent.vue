<template>
    <v-container>
        <v-row class="movies-list-content">
            <v-col md="2" v-for="item in movies" :key="item.id">
                <movieCard
                    :movie-id="item.id"
                    :title="item.title"
                    :genres="item.genres"
                    :posterPath="item.posterPath"
                    :defaultPosterPath="defaultPosterPath"
                />
            </v-col>

            <template v-if="wereNotMoviesFound">
                <v-card max-width="500">
                    <v-card-subtitle>No matches were found for your query</v-card-subtitle>
                </v-card>
            </template>

            <div class="movies-loading"></div>

        </v-row>
    </v-container>
</template>

<script>
import MoviesService from "./moviesServiсe";
import MovieCard from "./MovieCard";

export default {
    name: "MoviesComponent",
    props: ["movieId", "term"],

    data: () => ({
        service: new MoviesService(),
        movies: [],
        pageNumber: 1,
        genres: [],
        loaded: false,
        loading: false,
        defaultPosterPath: require('../assets/default_poster.jpeg'),
        wereNotMoviesFound: false
    }),

    components: {
        movieCard: MovieCard
    },

    created() {
        this.service.getGenres().then(response => {
            response.data.genres.forEach(genre => {
                const newGenre = {
                    id: genre.id,
                    name: genre.name
                };

                this.genres.push(newGenre);
            });
        }).catch(e => {
            alert(e);
        });
    },

    mounted() {
        this.setLoadingObserver();
    },

    updated() {
        this.setMoviesObserver();
    },

    methods: {
        loadMovies: function () {
            this.service.getMovies(this.movieId, this.pageNumber, this.term.trim()).then(response => {
                if (!response) {
                    return;
                }

                response.data.results.forEach(movie => {
                    let genresNames = [];

                    movie.genre_ids.forEach(id => {
                        genresNames.push(this.genres.find(genre => {
                            return genre.id === id;
                        }).name);
                    });

                    const moviePosterPath = movie.poster_path === null
                        ? this.defaultPosterPath
                        : "https://image.tmdb.org/t/p/w500/" + movie.poster_path;

                    const newMovie = {
                        id: movie.id,
                        title: movie.title,
                        posterPath: moviePosterPath,
                        voteAverage: movie.vote_average,
                        genres: genresNames.join(', ')
                    };

                    this.movies.push(newMovie);
                });

                this.wereNotMoviesFound = this.movies.length === 0;
            }).catch(e => {
                alert(e);
            });

            this.pageNumber++;
        },

        searchMovies() {
            this.loading = true;
            this.movies = [];
            this.pageNumber = 1;

            this.loadMovies();

            setTimeout(() => {
                this.loading = false
                this.loaded = true
            }, 1000);
        },

        setLoadingObserver() {
            const loadingObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadMovies();
                    }
                });
            });

            loadingObserver.observe(document.querySelector(".movies-loading"));
        },

        setMoviesObserver() {
            const moviesObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("movie-active")
                        observer.unobserve(entry.target);
                    }
                })
            });

            document.querySelectorAll(".movie:not(.movie-active)").forEach(movie => {
                moviesObserver.observe(movie);
            });
        }
    }
}

</script>

<style scoped>

</style>