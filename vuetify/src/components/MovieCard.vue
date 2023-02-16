<template>
    <v-card
        width="200"
        height="380"
    >
        <v-img
            height="260"
            :lazy-src=defaultPosterPath
            :src=posterPath
            cover
        >
            <v-row justify="space-between" class="text-right">
                <v-col>
                    <v-btn size="small" color="surface-variant" variant="text" icon>
                        <v-icon color="white">mdi-heart</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-img>

        <v-card-title class="movie-title pt-1 mt-1 text">
            <router-link :to="'Movie/Details/'+movieId" v-text="title"></router-link>
        </v-card-title>

        <v-card-subtitle class="genres" v-text="genres"></v-card-subtitle>

    </v-card>
</template>

<script>
export default {
    name: "MovieCard",
    props: ["movieId", "title", "genres", "posterPath", "defaultPosterPath"]
}
</script>

<style lang="scss">
.movie-title {
    font-size: 15px;
    line-height: 1.2em;
}

.genres {
    padding-top: 10px;
    line-height: 1.2em;
}
</style>