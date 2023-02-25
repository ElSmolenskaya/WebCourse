<template>
    <v-app id="app">
        <v-app-bar class="blue-grey" app shrink-on-scroll short>

            <v-app-bar-nav-icon
                @click.stop="drawer = !drawer"
                class="white--text pt-0"
            />

            <v-navigation-drawer v-model="drawer" absolute bottom temporary>
                <v-list-item-group v-model="group">
                    <v-list-item link>
                        <router-link
                            :to="'/'"
                            class="text-decoration-none"
                        >
                            <v-list-item-title>
                                <v-icon class="pr-4 pb-1" size="25">mdi-home</v-icon>
                                Movies
                            </v-list-item-title>
                        </router-link>
                    </v-list-item>
                    <v-list-item link>
                        <router-link
                            :to="'/favorite/movies'"
                            class="text-decoration-none"
                        >
                            <v-list-item-title>
                                <v-icon class="pr-5 pb-1" size="21">mdi-heart</v-icon>
                                Favorite movies
                            </v-list-item-title>
                        </router-link>
                    </v-list-item>
                </v-list-item-group>
            </v-navigation-drawer>

            <v-toolbar-title class="pb-2">
                <router-link :to="'/'" class="text-decoration-none">
                    <v-btn class="border_clear transparent white--text" elevation="0" :height="32">
                        Movies
                    </v-btn>
                </router-link>
            </v-toolbar-title>

            <v-spacer/>

            <router-link :to="'/favorite/movies'" class="text-decoration-none">
                <v-btn class="border_clear transparent white--text" title="Show favorite movies" icon>
                    <v-icon size="22">mdi-heart</v-icon>
                </v-btn>
            </router-link>
        </v-app-bar>

        <v-main>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",

    data: () => ({
        drawer: false,
        group: null,
    }),

    watch: {
        group() {
            this.drawer = false
        },
    }
}
</script>