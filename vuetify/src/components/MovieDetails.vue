<template>
    <v-container>
        <template v-if="isServerErrorOccurred">
            <v-row class="ml-2 mr-2 mt-3 mb-10 justify-center">
                <v-card-title v-text="errorMessage"/>
            </v-row>
        </template>
        <template v-else>
            <v-row class="mt-4 pb-6 justify-center" v-cloak>
                <v-card width="320" height="480">
                    <v-img
                        class="d-flex align-end"
                        :lazy-src="defaultPosterPath"
                        :src="posterPath"
                        max-height="480"
                    >
                        <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                                <v-progress-circular color="grey-lighten-4" indeterminate/>
                            </div>
                        </template>
                    </v-img>
                </v-card>

                <v-card width="500">
                    <v-row class="text-right">
                        <v-col>
                            <v-btn
                                @click="addToFavorite"
                                size="small"
                                icon
                            >
                                <template v-if="isFavorite">
                                    <v-icon color="red" title="Remove from favorite list">mdi-heart</v-icon>
                                </template>
                                <template v-else>
                                    <v-icon color="grey" title="Add to favorite list">mdi-heart</v-icon>
                                </template>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <div class="movie-title pl-3 pr-3 pt-0 text-h5 font-weight-bold" v-text="title"/>

                    <v-card-subtitle class="pt-1 text-h7 font-weight-bold" v-text="genres"/>

                    <v-row class="ml-2">
                        <v-rating
                            :value="voteAverage"
                            size="x-small"
                            length="10"
                            color="amber"
                            density="compact"
                            half-increments
                            readonly
                        />
                        <p class="ms-4 text-grey" v-text="voteAverage+'('+votesCount+')'"/>
                    </v-row>

                    <v-card-text v-text="overview"/>

                    <v-spacer/>

                    <v-card-actions class="justify-end">
                        <router-link :to="'/'" class="text-decoration-none">
                            <v-btn
                                class="mr-2"
                                color="#1F7087"
                                title="Show popular movies"
                                outlined
                                rounded
                            >
                                Movies
                            </v-btn>
                        </router-link>

                        <router-link :to="'/favorite/movies'" class="text-decoration-none">
                            <v-btn
                                class="mr-2"
                                color="#1F7087"
                                title="Show favorite movies"
                                outlined
                                rounded
                            >
                                Favorite
                            </v-btn>
                        </router-link>
                    </v-card-actions>
                </v-card>
            </v-row>
        </template>

        <v-sheet
            class="mx-auto pb-6"
            :elevation="isRecommendedMoviesSheetVisible ? 8 : 0"
            rounded
        >
            <v-row v-show="isRecommendedMoviesSheetVisible">
                <v-card-text
                    class="ma-0 text-h5 text-center font-weight-bold"
                    v-text="'Recommended movies'"
                />
            </v-row>

            <v-row class="justify-center">
                <v-slide-group show-arrows multiple>
                    <v-slide-item
                        v-for="(item,i) in recommendedMovies"
                        :key="i"
                        class="ml-3 mr-3 mt-2 mb-2"
                    >
                        <movieCard
                            :movie-id="item.id"
                            :title="item.title"
                            :genres="item.genres"
                            :posterPath="item.posterPath"
                            :defaultPosterPath="defaultPosterPath"
                            :card-height="400"
                        />
                    </v-slide-item>
                </v-slide-group>
            </v-row>

            <div class="movies-loading"/>
        </v-sheet>
    </v-container>
</template>

<script>
import MoviesService from "./moviesServiсe";
import MovieCard from "./MovieCard";

export default {
    name: "MovieDetails",
    props: ["id"],

    components: {
        movieCard: MovieCard
    },

    data: () => ({
        title: "",
        overview: "",
        posterPath: "",
        defaultPosterPath: require("../assets/default_poster.jpeg"),
        voteAverage: 0,
        votesCount: 0,
        genres: "",
        releaseDate: "",
        recommendedMovies: [],
        recommendedMoviesPageNumber: 1,
        service: new MoviesService(),
        isServerErrorOccurred: false,
        errorMessage: ""
    }),

    computed: {
        isRecommendedMoviesSheetVisible() {
            return this.recommendedMovies.length > 0;
        },

        isFavorite() {
            return this.$store.state.favoriteMovies.find(movie => {
                return movie.id === this.id;
            });
        }
    },

    watch: {
        $route() {
            this.recommendedMoviesPageNumber = 1;
            this.recommendedMovies = [];
            this.loadMovie();
            this.setLoadingObserver();
        }
    },

    created() {
        this.loadMovie();
    },

    mounted() {
        this.setLoadingObserver();
    },

    updated() {
        this.setMoviesObserver();
    },

    methods: {
        addToFavorite() {
            if (this.isFavorite) {
                this.$store.dispatch("deleteFavoriteMovie", this.id);
            } else {
                const movie = {
                    id: this.id,
                    title: this.title,
                    genres: this.genres,
                    posterPath: this.posterPath
                };

                this.$store.dispatch("addFavoriteMovie", movie);
            }
        },

        loadMovie() {
            this.isServerErrorOccurred = false;

            this.service.getMovie(this.id).then(response => {
                if (!response) {
                    return;
                }

                this.title = response.data.title;
                this.overview = response.data.overview;
                this.voteAverage = response.data.vote_average;
                this.votesCount = response.data.vote_count;
                this.releaseDate = response.data.release_date;
                this.genres = response.data.genres.map(genre => genre.name).join(", ");
                this.posterPath = response.data.poster_path === null
                    ? this.defaultPosterPath
                    : "https://image.tmdb.org/t/p/w500/" + response.data.poster_path;
            }).catch(e => {
                this.isServerErrorOccurred = true;
                this.errorMessage = "Can't load movie details. Server error occurred. " + e;
            });
        },

        loadRecommendedMovies() {
            this.service.getRecommendedMovies(this.id, this.recommendedMoviesPageNumber).then(response => {
                if (!response) {
                    return;
                }

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
                        genres: genresNames.join(", "),
                    };

                    this.recommendedMovies.push(newMovie);
                });
            }).catch(e => {
                this.errorMessage = e;
            });

            this.recommendedMoviesPageNumber++;
        },

        setLoadingObserver() {
            const loadingObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadRecommendedMovies();
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

<style lang="scss">
[v-cloak] {
    display: none;
}

.movie-title {
    word-wrap: normal;
}
</style>