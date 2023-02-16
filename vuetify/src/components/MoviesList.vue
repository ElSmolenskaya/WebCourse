<template>
    <v-container>
        <v-text-field
            v-model="term"
            :loading="loading"
            class="term pb-6"
            density="compact"
            variant="solo"
            label="Search"
            append-icon="mdi-magnify"
            single-line
            hide-details
            @click:append="searchMovies"
            @keyup.enter="searchMovies"
        >
        </v-text-field>

        <movies-component :term="term"/>
    </v-container>
</template>

<script>
import MoviesComponent from "@/components/MoviesComponent";

export default {
    name: 'MoviesList',

    data: () => ({
        term: ""
    }),

    components: {
        MoviesComponent
    }
}
</script>

<style lang="scss">
.term {
    width: 200px;
}
</style>