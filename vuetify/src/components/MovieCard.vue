<template>
    <v-hover v-slot="{ hover }">
        <v-card
            class="mx-auto overflow-auto"
            :elevation="hover ? 24 : 2"
            :height="cardHeight ? cardHeight : 390"
            max-width="200"
        >
            <router-link :to="'/movie/details/'+movieId">
                <v-img
                    :lazy-src=defaultPosterPath
                    :src=posterPath
                    min-height="260"
                />

                <div class="pl-2 pr-2 pt-1 movie-title" v-text="title"/>
            </router-link>

            <v-card-subtitle class="pl-2 pr-2 pb-1 genres" v-text="genres"/>

            <v-fab-transition>
                <v-btn
                    class="favorite-button"
                    @click="addToFavorite"
                    fab
                    small
                    dark
                    icon
                >
                    <template v-if="isFavorite">
                        <v-icon color="red" title="Remove from favorite list">mdi-heart</v-icon>
                    </template>
                    <template v-else>
                        <v-icon color="white" title="Add to favorite list">mdi-heart</v-icon>
                    </template>
                </v-btn>
            </v-fab-transition>
        </v-card>
    </v-hover>
</template>

<script>
export default {
    name: "MovieCard",
    props: ["movieId", "title", "genres", "posterPath", "defaultPosterPath", "cardHeight"],

    computed: {
        isFavorite() {
            return this.$store.state.favoriteMovies.find(movie => {
                return movie.id === this.movieId;
            });
        }
    },

    methods: {
        addToFavorite() {
            if (this.isFavorite) {
                this.$store.dispatch("deleteFavoriteMovie", this.movieId);
            } else {
                const movie = {
                    id: this.movieId,
                    title: this.title,
                    genres: this.genres,
                    posterPath: this.posterPath
                };

                this.$store.dispatch("addFavoriteMovie", movie);
            }
        }
    }
}
</script>

<style lang="scss">
.movie-title {
    font-size: 17px;
    line-height: 1.2em;
    word-wrap: normal;
}

.genres {
    padding-top: 5px;
    line-height: 1.2em;
}

.favorite-button {
    position: absolute;
    top: 0;
    right: 0;
}
</style>