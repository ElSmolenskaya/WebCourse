<template>
    <v-container>
        <template v-if="this.$store.state.favoriteMovies.length===0">
            <v-row class="justify-center pt-8">
                <v-card-title v-text="'There are no any favorite movies'"/>
            </v-row>
        </template>
        <template v-else>
            <v-row class="justify-end">
                <v-dialog
                    v-model="dialog"
                    max-width="290"
                    persistent
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="mr-7 mr-sm-5 mr-md-3 mr-lg-1 mt-3"
                            v-bind="attrs"
                            v-on="on"
                            color="#1F7087"
                            text
                            dark
                        >
                            Delete all
                        </v-btn>

                    </template>
                    <v-card>
                        <v-card-title class="text-h5" v-text="'Delete all'"/>

                        <v-card-text v-text="'Do you really want to delete all movies from favorite list?'"/>

                        <v-card-actions>
                            <v-spacer/>

                            <v-btn
                                @click="dialog = false"
                                color="green darken-1"
                                text
                            >
                                Cancel
                            </v-btn>

                            <v-btn
                                @click="deleteAllFavoriteMovies"
                                color="red"
                                text
                            >
                                Delete
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>

            <v-row class="justify-center">
                <v-card-title class="pt-0 mt-0" v-text="'Favorite movies'"/>
            </v-row>
        </template>

        <v-row>
            <v-col
                class="pa-1"
                v-for="(item,i) in this.$store.state.favoriteMovies"
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
                    :defaultPosterPath="defaultPosterPath"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import MovieCard from "./MovieCard";

export default {
    name: "FavoriteMoviesList",

    data: () => ({
        defaultPosterPath: require("../assets/default_poster.jpeg"),
        dialog: false
    }),

    components: {
        movieCard: MovieCard
    },

    methods: {
        deleteAllFavoriteMovies() {
            this.$store.dispatch("deleteAllFavoriteMovies");
            this.dialog = false;
        }
    }
}
</script>