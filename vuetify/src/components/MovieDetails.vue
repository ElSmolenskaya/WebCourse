<template>
    <v-row class="mt-4 ml-4">
        <v-card width="320" height="480">
            <v-img
                height="480"
                :lazy-src=defaultPosterPath
                :src="posterPath"
                class="d-flex align-end"
            >
                <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular
                            color="grey-lighten-4"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </template>
            </v-img>
        </v-card>

        <template v-if="isMovieDetailsCardVisible">
            <v-card max-width="500" >
                <v-card-title v-text="title" class="text-h5 font-weight-bold"></v-card-title>
                <v-card-subtitle class="text-h7 font-weight-bold" v-text="genres"></v-card-subtitle>

                <v-row class="ml-2">
                    <v-rating
                        :value="voteAverage"
                        length="10"
                        color="amber"
                        density="compact"
                        half-increments
                        readonly
                        size="x-small"
                    >
                    </v-rating>
                    <p class="text-grey ms-4">{{ voteAverage }}({{ votesCount }})</p>
                </v-row>

                <v-card-text class="text--primary">
                    <p class="font-weight-light">{{ overview }}</p>
                </v-card-text>
            </v-card>
        </template>
        <template v-else></template>
    </v-row>
</template>

<script>
import MoviesService from "./moviesServiсe";

export default {
    name: "MovieDetails",
    props: ['id'],
    data: () => ({
        service: new MoviesService(),
        title: "",
        overview: "",
        posterPath: "",
        defaultPosterPath: require('../assets/default_poster.jpeg'),
        voteAverage: 0,
        votesCount: 0,
        genres: "",
        releaseDate: "",
        isMovieDetailsCardVisible: false
    }),

    methods: {
        getMovie() {
            this.service.getMovie(this.id).then(response => {
                if (!response) {
                    return;
                }

                this.title = response.data.title;
                this.overview = response.data.overview;
                this.voteAverage = response.data.vote_average;
                this.votesCount = response.data.vote_count;
                this.releaseDate = response.data.release_date;
                this.genres = response.data.genres.map(genre => genre.name).join(', ');
                this.posterPath = response.data.poster_path === null
                    ? this.defaultPosterPath
                    : "https://image.tmdb.org/t/p/w500/" + response.data.poster_path;

                console.log(this.genres);

            }).catch(e => {
                alert(e);
            });
        }
    },

    created() {
        console.log(this.id);
        this.getMovie();
    },

    updated() {
        this.isMovieDetailsCardVisible = true;
    }
}
</script>

<style>

</style>