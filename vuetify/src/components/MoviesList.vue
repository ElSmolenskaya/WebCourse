<template>
    <v-container>
        <v-row>
            <v-col class="pt-1 bp-0 pl-8 pl-md-3 pl-lg-1" cols="8" sm="6" md="4">
                <v-text-field
                    v-model="term"
                    :loading="loading"
                    @click:append="searchMovies"
                    @keyup.enter="searchMovies"
                    label="Search"
                    append-icon="mdi-magnify"
                />
            </v-col>
        </v-row>

        <v-row>
            <v-col
                class="pa-1"
                v-for="(item,i) in movies"
                :key="i"
                cols="6"
                sm="4"
                md="3"
                lg="2"
            >
                <movieCard
                    :movie-id="item.id"
                    :title="item.title"
                    :genres="item.genres"
                    :posterPath="item.posterPath"
                    :defaultPosterPath="defaultPosterPath"/>
            </v-col>
        </v-row>

        <div class="movies-loading"/>

        <v-row class="ml-2 mr-2 mt-3 justify-center"
               v-show="isServerErrorOccurred || areNotMoviesFound"
        >
            <v-card-title v-text="errorMessage"/>
        </v-row>
    </v-container>
</template>

<script>
import MoviesService from "./moviesServiсe";
import MovieCard from "./MovieCard";

export default {
    name: "MoviesList",

    components: {
        movieCard: MovieCard
    },

    data: () => ({
        movies: [],
        pageNumber: 1,
        maximumPageNumber: 500,
        service: new MoviesService(),
        term: "",
        loaded: false,
        loading: false,
        defaultPosterPath: require("../assets/default_poster.jpeg"),
        areNotMoviesFound: false,
        isServerErrorOccurred: false,
        errorMessage: ""
    }),

    created() {
        this.$store.dispatch("loadGenres");
    },

    mounted() {
        this.setLoadingObserver();
    },

    updated() {
        this.setMoviesObserver();
    },

    methods: {
        loadMovies() {
            if (this.pageNumber > this.maximumPageNumber) {
                return;
            }

            this.isServerErrorOccurred = false;

            this.service.getPopularMovies(this.pageNumber, this.term.trim()).then(response => {
                if (!response) {
                    return;
                }

                console.log(response);

                response.data.results.forEach(movie => {
                    const genresNames = [];

                    movie.genre_ids.forEach(id => {
                        genresNames.push(this.$store.state.genres.find(genre => {
                            return genre.id === id;
                        }).name);
                    });

                    const moviePosterPath = movie.poster_path === null
                        ? this.defaultPosterPath
                        : "https://image.tmdb.org/t/p/w500/" + movie.poster_path;

                    const newMovie = {
                        id: movie.id.toString(),
                        title: movie.title,
                        posterPath: moviePosterPath,
                        genres: genresNames.join(", ")
                    };

                    this.movies.push(newMovie);

                });
            }).catch(e => {
                this.isServerErrorOccurred = true;
                this.errorMessage = "Can't load movies. Server error occurred. " + e;
            });

            this.pageNumber++;
        },

        searchMovies() {
            this.loading = true;
            this.movies = [];
            this.pageNumber = 1;
            this.areNotMoviesFound = false;

            this.loadMovies();

            setTimeout(() => {
                this.loading = false;
                this.loaded = true;

                if (!this.isServerErrorOccurred && this.movies.length === 0) {
                    this.areNotMoviesFound = true;
                    this.errorMessage = "No matches were found for your query";
                }
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
                        entry.target.classList.add("movie-active");
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
